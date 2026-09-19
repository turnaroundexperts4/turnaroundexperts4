import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type AdminSession = {
  adminId?: number;
  adminUid?: string;
  email?: string;
  name?: string;
};

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret || sessionSecret.length < 32) {
  throw new Error("SESSION_SECRET must be set and at least 32 characters long.");
}

export const sessionOptions: SessionOptions = {
  password: sessionSecret,
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
