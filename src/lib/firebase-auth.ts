import { firebaseAdminConfigured, firebaseAuth, firestore } from "@/lib/firebase-admin";

type FirebaseSignIn = {
  localId: string;
  email?: string;
  displayName?: string;
  idToken: string;
};

export type FirebaseAuthResult =
  | { status: "authenticated"; uid: string; email: string; name: string }
  | { status: "invalid_credentials" }
  | { status: "service_unavailable"; reason: string };
export type FirebaseIdTokenResult =
  | {
      status: "authenticated";
      uid: string;
      email?: string;
      emailVerified: boolean;
      name?: string;
    }
  | { status: "unauthenticated" }
  | { status: "service_unavailable"; reason: string };

function isUnavailableError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /network|fetch|timeout|timed out| unavailable|econn|enotfound|reset/i.test(
    message,
  );
}

export async function verifyFirebaseIdToken(token: string) {
  if (!firebaseAdminConfigured || !firebaseAuth) {
    return {
      status: "service_unavailable",
      reason: "Firebase Admin is not configured.",
    } satisfies FirebaseIdTokenResult;
  }
  try {
    const decoded = await firebaseAuth.verifyIdToken(token);
    return {
      status: "authenticated",
      uid: decoded.uid,
      email: decoded.email,
      emailVerified: decoded.email_verified === true,
      name: decoded.name,
    } satisfies FirebaseIdTokenResult;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (isUnavailableError(error)) {
      return {
        status: "service_unavailable",
        reason: message,
      } satisfies FirebaseIdTokenResult;
    }
    return { status: "unauthenticated" } satisfies FirebaseIdTokenResult;
  }
}

export async function verifyFirebasePassword(email: string, password: string) {
  if (!firebaseAdminConfigured || !firebaseAuth) {
    return {
      status: "service_unavailable",
      reason: "Firebase Admin is not configured.",
    } satisfies FirebaseAuthResult;
  }

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    return {
      status: "service_unavailable",
      reason: "NEXT_PUBLIC_FIREBASE_API_KEY is not configured.",
    } satisfies FirebaseAuthResult;
  }

  let response: Response;
  try {
    response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      },
    );
  } catch (error) {
    console.error("Firebase password sign-in request failed:", error);
    return {
      status: "service_unavailable",
      reason: error instanceof Error ? error.message : "Firebase request failed.",
    } satisfies FirebaseAuthResult;
  }
  if (!response.ok) {
    let message = "";
    try {
      const errorBody = (await response.json()) as {
        error?: { message?: string };
      };
      message = errorBody.error?.message ?? "";
    } catch {
      message = "";
    }
    if (
      response.status >= 500 ||
      /network|unavailable|internal|timeout/i.test(message)
    ) {
      return {
        status: "service_unavailable",
        reason: message || `Firebase returned HTTP ${response.status}.`,
      } satisfies FirebaseAuthResult;
    }
    return { status: "invalid_credentials" } satisfies FirebaseAuthResult;
  }

  const result = (await response.json()) as FirebaseSignIn;
  let user;
  let adminDoc;
  try {
    user = await firebaseAuth.getUser(result.localId);
    adminDoc = await firestore
      ?.collection("adminUsers")
      .doc(result.localId)
      .get();
  } catch (error) {
    if (isUnavailableError(error)) {
      return {
        status: "service_unavailable",
        reason: error instanceof Error ? error.message : "Firebase lookup failed.",
      } satisfies FirebaseAuthResult;
    }
    return { status: "invalid_credentials" } satisfies FirebaseAuthResult;
  }
  const isAdmin = user.customClaims?.admin === true || adminDoc?.exists === true;
  if (!isAdmin) return { status: "invalid_credentials" };

  return {
    status: "authenticated",
    uid: result.localId,
    email: user.email ?? email,
    name: user.displayName ?? user.email ?? email,
  } satisfies FirebaseAuthResult;
}
