import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getDatabase } from "firebase-admin/database";
import { getAuth } from "firebase-admin/auth";

const projectId = process.env.FIREBASE_PROJECT_ID || "tae-lucky-509808";
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ?.trim()
  .replace(/^(['"])|(['"])$/g, "")
  .replace(/\\n/g, "\n");
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

export const firestore = app ? getFirestore(app) : null;
export const realtimeDatabase = app ? getDatabase(app) : null;
export const firebaseAuth = app ? getAuth(app) : null;

export function requireFirebaseAdmin() {
  if (!firestore || !firebaseAuth || !realtimeDatabase) {
    throw new Error(
      initializationError?.message ??
        "Firebase Admin is not configured. Set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.",
    );
  }
  return { firestore, firebaseAuth, realtimeDatabase };
}
