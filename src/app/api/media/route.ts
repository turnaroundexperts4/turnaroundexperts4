import { NextResponse } from "next/server";
import { requireFirebaseAdmin } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get("path") ?? "";
  if (!/^uploads\/[a-z0-9_-]+\/[a-zA-Z0-9_-]+$/.test(path)) {
    return NextResponse.json({ error: "Invalid media path" }, { status: 400 });
  }

  const { realtimeDatabase } = requireFirebaseAdmin();
  const snapshot = await realtimeDatabase.ref(path).get();
  if (!snapshot.exists()) {
    return NextResponse.json({ error: "Media not found" }, { status: 404 });
  }
  const media = snapshot.val() as {
    dataUrl?: string;
    contentType?: string;
  };
  if (!media.dataUrl || !media.contentType) {
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
