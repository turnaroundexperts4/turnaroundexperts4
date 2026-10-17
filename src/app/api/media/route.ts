import { NextResponse } from "next/server";
import { getRealtimeDatabaseValue } from "@/lib/firebase-realtime-database-rest";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get("path") ?? "";
  if (!/^uploads\/[a-z0-9_-]+\/[a-zA-Z0-9_-]+$/.test(path)) {
    return NextResponse.json({ error: "Invalid media path" }, { status: 400 });
  }

  const value = await getRealtimeDatabaseValue(path);
  if (value === null) {
    return NextResponse.json({ error: "Media not found" }, { status: 404 });
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return NextResponse.json({ error: "Invalid media record" }, { status: 500 });
  }
  const media = value as Record<string, unknown>;
  if (
    typeof media.dataUrl !== "string" ||
    typeof media.contentType !== "string"
  ) {
    return NextResponse.json({ error: "Invalid media record" }, { status: 500 });
  }

  const comma = media.dataUrl.indexOf(",");
  const bytes = Buffer.from(comma >= 0 ? media.dataUrl.slice(comma + 1) : media.dataUrl, "base64");
  return new NextResponse(bytes, {
    headers: {
      "content-type": media.contentType,
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
