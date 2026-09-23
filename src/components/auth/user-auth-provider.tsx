"use client";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
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
        setAuthError("");
        await signInWithPopup(clientAuth, new GoogleAuthProvider());
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
