import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { getAuth } from "firebase-admin/auth";
import { FirestoreRestClient } from "@/lib/firebase-firestore-rest";
import { normalizeFirebasePrivateKey } from "@/lib/firebase-service-account";

const projectId = process.env.FIREBASE_PROJECT_ID || "tae-lucky-509808";
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
const privateKey = normalizeFirebasePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

export const firebaseAdminConfigured = Boolean(
  clientEmail && privateKey && projectId,
);

let initializationError: Error | null = null;
let app = getApps()[0] ?? null;

if (!app && firebaseAdminConfigured && !isBuildPhase) {
  try {
    app = initializeApp({
      credential: cert({
        projectId,
        clientEmail: clientEmail!,
        privateKey: privateKey!,
      }),
      databaseURL:
        process.env.FIREBASE_DATABASE_URL ??
        `https://${projectId}-default-rtdb.firebaseio.com`,
    });
  } catch (error) {
    initializationError =
      error instanceof Error
        ? error
        : new Error("Firebase Admin initialization failed.");
    console.error("Firebase Admin initialization failed:", initializationError);
  }
}

export { initializationError as firebaseAdminInitializationError };

export const firestore =
  firebaseAdminConfigured && !isBuildPhase
    ? new FirestoreRestClient(projectId, getFirestoreAccessToken)
    : null;
export const realtimeDatabase = app ? getDatabase(app) : null;
export const firebaseAuth = app ? getAuth(app) : null;

let cachedFirestoreAccessToken: string | null = null;
let firestoreAccessTokenExpiresAt = 0;

async function getFirestoreAccessToken() {
  if (!clientEmail || !privateKey) {
    throw new Error(
      "Firebase Firestore REST access requires Firebase service-account credentials.",
    );
  }

  const now = Math.floor(Date.now() / 1000);
  if (cachedFirestoreAccessToken && firestoreAccessTokenExpiresAt > now + 60) {
    return cachedFirestoreAccessToken;
  }

  const pem = privateKey.match(
    /^-----BEGIN PRIVATE KEY-----([\s\S]+)-----END PRIVATE KEY-----$/,
  )?.[1];
  if (!pem) {
    throw new Error(
      "FIREBASE_PRIVATE_KEY must be the private_key value from your Firebase service-account JSON, the complete service-account JSON, or a PKCS#8 PEM private key.",
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
        scope: "https://www.googleapis.com/auth/datastore",
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
  });
  const result = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  };
  if (!response.ok || !result.access_token) {
    throw new Error(
      `Firebase Firestore access-token request failed: ${result.error_description ?? result.error ?? `HTTP ${response.status}`}`,
    );
  }
  cachedFirestoreAccessToken = result.access_token;
  firestoreAccessTokenExpiresAt = now + (result.expires_in ?? 3600);
  return cachedFirestoreAccessToken;
}

export function requireFirebaseAdmin() {
  if (!firebaseAuth || !realtimeDatabase) {
    throw new Error(
      initializationError?.message ??
        "Firebase Admin is not configured. Set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.",
    );
  }
  return { firebaseAuth, realtimeDatabase };
}

export function requireFirebaseFirestore() {
  if (!firestore) {
    throw new Error(
      "Firebase Firestore is not configured. Set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.",
    );
  }
  return firestore;
}
