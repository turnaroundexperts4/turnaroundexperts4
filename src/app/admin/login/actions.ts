"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { verifyAdminPassword } from "@/lib/data";
import { verifyFirebasePassword } from "@/lib/firebase-auth";
import { checkRequestRateLimit } from "@/lib/request-rate-limit";

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginState = {
  error?: string;
};

type AdminIdentity = {
  adminUid?: string;
  adminId?: number;
  email: string;
  name: string;
};

export async function resolveAdminLogin(
  firebaseResult: Awaited<ReturnType<typeof verifyFirebasePassword>>,
  verifyLegacyPassword: () => Promise<{
    id: number;
    email: string;
    name: string;
  } | null>,
): Promise<AdminIdentity | null> {
  if (firebaseResult.status === "invalid_credentials") return null;
  if (firebaseResult.status === "authenticated") {
    return {
      adminUid: firebaseResult.uid,
      email: firebaseResult.email ?? "unknown",
      name: firebaseResult.name ?? "Administrator",
    };
  }
  const legacy = await verifyLegacyPassword();
  return legacy
    ? { adminId: legacy.id, email: legacy.email, name: legacy.name }
    : null;
}

export async function loginAction(
  _prev: LoginState | null,
  formData: FormData,
): Promise<LoginState> {
  const parsed = Schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Please enter a valid email and password." };
  }
  const requestHeaders = await headers();
  const clientKey =
    requestHeaders.get("cf-connecting-ip") ??
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const rateLimit = checkRequestRateLimit(`admin-login:${clientKey}`, {
    limit: 10,
    windowMs: 15 * 60_000,
  });
  if (!rateLimit.allowed) {
    return { error: "Too many login attempts. Please try again later." };
  }
  const firebaseResult = await verifyFirebasePassword(
    parsed.data.email,
    parsed.data.password,
  );
  const identity = await resolveAdminLogin(firebaseResult, () =>
    verifyAdminPassword(parsed.data.email, parsed.data.password),
  );
  if (!identity) return { error: "Invalid email or password." };
  const session = await getSession();
  session.adminUid = identity.adminUid;
  session.adminId = identity.adminId;
  session.email = identity.email;
  session.name = identity.name;
  await session.save();
  redirect("/admin/dashboard");
}

export async function logoutAction() {
  const session = await getSession();
  session.destroy();
  redirect("/admin/login");
}
