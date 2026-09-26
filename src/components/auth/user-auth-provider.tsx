"use client";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  getRedirectResult,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  sendEmailVerification,
  signOut,
  type User,
} from "firebase/auth";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { clientAuth } from "@/lib/firebase-client";

type UserAuthContextValue = {
  user: User | null;
  emailVerified: boolean;
  loading: boolean;
  authError: string;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  signOutUser: () => Promise<void>;
};

const UserAuthContext = createContext<UserAuthContextValue | null>(null);

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(clientAuth, (nextUser) => {
      setUser(nextUser);
      setEmailVerified(nextUser?.emailVerified === true);
      setLoading(false);
    });
    const timeout = window.setTimeout(() => setLoading(false), 5000);
    void Promise.race([
      getRedirectResult(clientAuth),
      new Promise<null>((resolve) => window.setTimeout(() => resolve(null), 5000)),
    ])
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
          setEmailVerified(result.user.emailVerified);
          setLoading(false);
        }
      })
      .catch((error: unknown) => {
        console.error("Firebase Google redirect sign-in failed:", error);
        if (getFirebaseErrorCode(error) !== "auth/cancelled-popup-request") {
          setAuthError(getGoogleAuthError(error));
        }
      }
      );
    return () => {
      window.clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  const value = useMemo<UserAuthContextValue>(
    () => ({
      user,
      emailVerified,
      loading,
      authError,
      signIn: async (email, password) => {
        await signInWithEmailAndPassword(clientAuth, email, password);
      },
      signUp: async (email, password) => {
        await createUserWithEmailAndPassword(clientAuth, email, password);
      },
      signInWithGoogle: async () => {
        setAuthError("");
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        try {
          await signInWithPopup(clientAuth, provider);
        } catch (error: unknown) {
          const code = getFirebaseErrorCode(error);
          if (
            code === "auth/internal-error" ||
            code === "auth/popup-blocked" ||
            code === "auth/popup-closed-by-user"
          ) {
            await signInWithRedirect(clientAuth, provider);
            return;
          }
          throw error;
        }
      },
      sendVerificationEmail: async () => {
        if (!clientAuth.currentUser) {
          throw new Error("Sign in before requesting email verification.");
        }
        await sendEmailVerification(clientAuth.currentUser);
        await clientAuth.currentUser.reload();
        setUser(clientAuth.currentUser);
        setEmailVerified(clientAuth.currentUser.emailVerified);
      },
      signOutUser: async () => {
        await signOut(clientAuth);
      },
    }),
    [authError, emailVerified, loading, user],
  );

  return <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>;
}

function getFirebaseErrorCode(error: unknown): string {
  return typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
    ? error.code
    : "";
}

function getGoogleAuthError(error: unknown): string {
  const code = getFirebaseErrorCode(error);
  if (code === "auth/invalid-credential") {
    return "Google sign-in is not configured correctly in Firebase. Enable the Google provider and save its support email.";
  }
  if (code === "auth/unauthorized-domain") {
    return "This website domain is not authorized in Firebase Authentication.";
  }
  if (code === "auth/popup-blocked") {
    return "Google sign-in was blocked by the browser. Allow popups for this site and try again.";
  }
  return code ? `Google sign-in failed (${code}).` : "Google sign-in was not completed.";
}

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error("useUserAuth must be used inside UserAuthProvider.");
  }
  return context;
}
