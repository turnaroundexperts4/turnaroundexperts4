import "server-only";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getDatabase } from "firebase-admin/database";
import { getAuth } from "firebase-admin/auth";

const projectId = process.env.FIREBASE_PROJECT_ID || "tae-bef9c";
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

export const firebaseAdminConfigured = Boolean(
  clientEmail && privateKey && projectId,
);

const app =
  getApps()[0] ??
  (firebaseAdminConfigured
    ? initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        databaseURL:
          process.env.FIREBASE_DATABASE_URL ??
          `https://${projectId}-default-rtdb.firebaseio.com`,
      })
    : null);

export const firestore = app ? getFirestore(app) : null;
export const realtimeDatabase = app ? getDatabase(app) : null;
export const firebaseAuth = app ? getAuth(app) : null;

export function requireFirebaseAdmin() {
  if (!firestore || !firebaseAuth) {
    throw new Error(
      "Firebase Admin is not configured. Set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.",
    );
  }
  return { firestore, firebaseAuth };
}
