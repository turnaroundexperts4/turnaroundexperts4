import { getGoogleAccessToken } from "@/lib/google-access-token";

const DATABASE_SCOPE = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/firebase.database",
].join(" ");
const REQUEST_TIMEOUT_MS = 60_000;

function getDatabaseUrl(path: string, silentWrite = false) {
  if (!/^[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/.test(path)) {
    throw new Error("Invalid Firebase Realtime Database path.");
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || "tae-lucky-509808";
  const databaseUrl = (
    process.env.FIREBASE_DATABASE_URL ??
    `https://${projectId}-default-rtdb.firebaseio.com`
  ).replace(/\/$/, "");
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  const query = silentWrite ? "?print=silent" : "";
  return `${databaseUrl}/${encodedPath}.json${query}`;
}

async function requestDatabase(path: string, init: RequestInit = {}) {
  const url = getDatabaseUrl(path, init.method === "PUT");
  const accessToken = await getGoogleAccessToken(DATABASE_SCOPE);
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(
      `Firebase Realtime Database request failed (HTTP ${response.status}).`,
    );
  }

  if (init.method === "PUT") return undefined;
  return response.json() as Promise<unknown>;
}

export async function setRealtimeDatabaseValue(
  path: string,
  value: Record<string, unknown>,
): Promise<void> {
  await requestDatabase(path, {
    method: "PUT",
    body: JSON.stringify(value),
  });
}

export async function getRealtimeDatabaseValue(
  path: string,
): Promise<unknown> {
  return requestDatabase(path);
}
