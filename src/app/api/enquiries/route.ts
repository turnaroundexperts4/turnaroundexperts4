import { NextResponse } from "next/server";
import { z } from "zod";
import { createEnquiry } from "@/lib/data";
import { verifyFirebaseIdToken } from "@/lib/firebase-auth";

export const dynamic = "force-dynamic";

const Schema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional().or(z.literal("")),
  company: z.string().max(200).optional().or(z.literal("")),
  service: z.string().max(200).optional().or(z.literal("")),
  message: z.string().min(5).max(4000),
});

export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const user = token ? await verifyFirebaseIdToken(token) : null;
  if (!user) return NextResponse.json({ error: "Please sign in before sending an enquiry." }, { status: 401 });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.issues },
      { status: 400 },
    );
  }
  const id = await createEnquiry({ ...parsed.data, uid: user.uid });
  if (!id) {
    return NextResponse.json(
      { error: "Unable to save enquiry right now." },
      { status: 503 },
    );
  }
  return NextResponse.json({ id, ok: true }, { status: 201 });
}
