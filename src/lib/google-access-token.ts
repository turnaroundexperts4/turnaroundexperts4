import { normalizeFirebasePrivateKey } from "@/lib/firebase-credentials";

const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
const privateKey = normalizeFirebasePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
const TOKEN_TIMEOUT_MS = 10_000;

type CachedToken = {
  accessToken: string;
  expiresAt: number;
};

const cachedTokens = new Map<string, CachedToken>();

export async function getGoogleAccessToken(scope: string): Promise<string> {
  if (!clientEmail || !privateKey) {
    throw new Error(
      "Firebase access requires FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.",
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const cached = cachedTokens.get(scope);
  if (cached && cached.expiresAt > now + 60) return cached.accessToken;

  const pem = privateKey.match(
    /^-----BEGIN PRIVATE KEY-----([\s\S]+)-----END PRIVATE KEY-----$/,
  )?.[1];
  if (!pem) {
    throw new Error(
      "FIREBASE_PRIVATE_KEY must be a PKCS#8 PEM private key.",
    );
  }

  const keyBytes = Uint8Array.from(
    atob(pem.replace(/\s/g, "")),
    (character) => character.charCodeAt(0),
  );
  const signingKey = await crypto.subtle.importKey(
    "pkcs8",
    keyBytes,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const encodeSegment = (value: string | Uint8Array) => {
    const bytes =
      typeof value === "string" ? new TextEncoder().encode(value) : value;
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  };
  const unsignedToken = [
    encodeSegment(JSON.stringify({ alg: "RS256", typ: "JWT" })),
    encodeSegment(
      JSON.stringify({
        iss: clientEmail,
        scope,
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 3600,
      }),
    ),
  ].join(".");
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    signingKey,
    new TextEncoder().encode(unsignedToken),
  );
  const assertion = `${unsignedToken}.${encodeSegment(new Uint8Array(signature))}`;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    signal: AbortSignal.timeout(TOKEN_TIMEOUT_MS),
  });
  const result = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  };
  if (!response.ok || !result.access_token) {
    throw new Error(
      `Firebase access-token request failed: ${result.error_description ?? result.error ?? `HTTP ${response.status}`}`,
    );
  }

  const accessToken = result.access_token;
  cachedTokens.set(scope, {
    accessToken,
    expiresAt: now + (result.expires_in ?? 3600),
  });
  return accessToken;
}
