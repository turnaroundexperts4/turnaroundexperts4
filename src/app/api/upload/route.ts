import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { requireFirebaseAdmin } from "@/lib/firebase-admin";
import { nanoid } from "nanoid";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);
const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(req: Request) {
  const session = await getSession();
  if (!session.adminId && !session.adminUid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const folder = String(form.get("folder") ?? "general").replace(
    /[^a-z0-9_-]/gi,
    "",
  );

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Use JPG, PNG, WEBP, GIF or SVG." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File too large (max 6MB)." },
      { status: 400 },
    );
  }

  const name = `${Date.now()}-${nanoid(8)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
  const path = `uploads/${folder}/${name}`;
  const { realtimeDatabase } = requireFirebaseAdmin();
  await realtimeDatabase.ref(path).set({
    name,
    contentType: file.type,
    size: file.size,
    dataUrl,
    createdAt: Date.now(),
  });
  return NextResponse.json({
    url: `/api/media?path=${encodeURIComponent(path)}`,
    name,
    path,
  });
}
