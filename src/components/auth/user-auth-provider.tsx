"use client";

import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithRedirect,
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
  loading: boolean;
  authError: string;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
};

const UserAuthContext = createContext<UserAuthContextValue | null>(null);

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(clientAuth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
    void getRedirectResult(clientAuth)
      .then((result) => {
        if (result?.user) setUser(result.user);
      })
      .catch((error) => {
        console.error("Google redirect sign-in failed:", error);
        const code =
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          typeof error.code === "string"
            ? error.code
            : "";
        setAuthError(code ? `Google sign-in failed (${code}).` : "Google sign-in was not completed.");
      });
    return unsubscribe;
  }, []);

  const value = useMemo<UserAuthContextValue>(
    () => ({
      user,
      loading,
      authError,
      signIn: async (email, password) => {
        await signInWithEmailAndPassword(clientAuth, email, password);
      },
      signUp: async (email, password) => {
        await createUserWithEmailAndPassword(clientAuth, email, password);
      },
      signInWithGoogle: async () => {
        await signInWithRedirect(clientAuth, new GoogleAuthProvider());
      },
      signOutUser: async () => {
        await signOut(clientAuth);
      },
    }),
    [authError, loading, user],
  );

  return <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>;
}

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error("useUserAuth must be used inside UserAuthProvider.");
  }
  return context;
}
