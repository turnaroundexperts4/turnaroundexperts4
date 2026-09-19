import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type AdminSession = {
  adminId?: number;
  adminUid?: string;
  email?: string;
  name?: string;
};

export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_SECRET ||
    "tae-development-only-secret-please-change-in-production-32chars+",
  cookieName: "tae_admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<AdminSession>(cookieStore, sessionOptions);
}

export async function requireAdmin(): Promise<AdminSession | null> {
  const session = await getSession();
  if (!session.adminId && !session.adminUid) return null;
  return session;
}
