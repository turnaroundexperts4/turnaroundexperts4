import { NextResponse } from "next/server";
import { getAppointmentByUid } from "@/lib/data";
import { verifyFirebaseIdToken } from "@/lib/firebase-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const user = await verifyFirebaseIdToken(token);
  if (!user) return NextResponse.json({ error: "Invalid authentication." }, { status: 401 });
  return NextResponse.json({ appointment: await getAppointmentByUid(user.uid) });
}
