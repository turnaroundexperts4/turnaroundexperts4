import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getSession } from "@/lib/auth";
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
const MAX_BYTES = 6 * 1024 * 1024; // 6MB

export async function POST(req: Request) {
  const session = await getSession();
  if (!session.adminId) {
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

  const ext =
    file.type === "image/svg+xml"
      ? "svg"
      : file.type.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
  const name = `${Date.now()}-${nanoid(8)}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, name), buffer);
  const url = `/uploads/${folder}/${name}`;
  return NextResponse.json({ url, name });
}
