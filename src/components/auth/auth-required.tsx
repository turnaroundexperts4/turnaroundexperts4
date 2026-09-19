"use client";

import { UserAuthCard } from "./user-auth-card";
import { useUserAuth } from "./user-auth-provider";
import type { ReactNode } from "react";

export function AuthRequired({ children }: { children: ReactNode }) {
  const { user, loading } = useUserAuth();
  if (loading) return <div className="rounded-2xl bg-white p-8 text-ink-600">Checking your account…</div>;
  return user ? <>{children}</> : <UserAuthCard />;
}
