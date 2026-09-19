import { firebaseAdminConfigured, firestore } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!firebaseAdminConfigured || !firestore) {
      return Response.json(
        { ok: false, service: "firebase", error: "Firebase Admin is not configured." },
        { status: 503 },
      );
    }
    await firestore.collection("siteSettings").limit(1).get();
    return Response.json({ ok: true, service: "firebase" });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        service: "firebase",
        error: error instanceof Error ? error.message : "Health check failed.",
      },
      { status: 503 },
    );
  }
}
