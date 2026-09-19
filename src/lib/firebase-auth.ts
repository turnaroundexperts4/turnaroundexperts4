import "server-only";

import { firebaseAdminConfigured, firebaseAuth, firestore } from "@/lib/firebase-admin";

type FirebaseSignIn = {
  localId: string;
  email?: string;
  displayName?: string;
  idToken: string;
};

export async function verifyFirebasePassword(email: string, password: string) {
  if (!firebaseAdminConfigured || !firebaseAuth) return null;

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_FIREBASE_API_KEY is required for Firebase login.");
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
      cache: "no-store",
    },
  );
  if (!response.ok) return null;

  const result = (await response.json()) as FirebaseSignIn;
  const user = await firebaseAuth.getUser(result.localId);
  const adminDoc = await firestore
    ?.collection("adminUsers")
    .doc(result.localId)
    .get();
  const isAdmin = user.customClaims?.admin === true || adminDoc?.exists === true;
  if (!isAdmin) return null;

  return {
    uid: result.localId,
    email: user.email ?? email,
    name: user.displayName ?? user.email ?? email,
  };
}
