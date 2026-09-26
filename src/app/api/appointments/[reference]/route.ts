import { NextResponse } from "next/server";
import { getAppointmentByRef } from "@/lib/data";
import { checkRequestRateLimit } from "@/lib/request-rate-limit";
import { verifyFirebaseIdToken } from "@/lib/firebase-auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ reference: string }> },
) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }
  const user = await verifyFirebaseIdToken(token);
  if (user.status !== "authenticated") {
    return NextResponse.json(
      {
        error:
          user.status === "service_unavailable"
            ? "Authentication service is unavailable."
            : "Invalid authentication.",
      },
      { status: user.status === "service_unavailable" ? 503 : 401 },
    );
  }
  const { reference } = await params;
  const normalizedReference = reference.trim().toUpperCase();
  const clientKey =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const rateLimit = checkRequestRateLimit(`appointment-lookup:${clientKey}`, {
    limit: 20,
    windowMs: 60_000,
  });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  if (!/^TAE-[A-Z0-9]{4}-[A-Z0-9]{6}$/.test(normalizedReference)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const apt = await getAppointmentByRef(normalizedReference);
  if (!apt || apt.uid !== user.uid) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    reference: apt.reference,
    customerName: apt.customerName,
    requestedDate: apt.requestedDate,
    requestedTime: apt.requestedTime,
    serviceTitle: apt.serviceTitle,
    serviceId: apt.serviceId,
    status: apt.status,
    googleMeetLink: apt.googleMeetLink,
    meetingStatus: apt.meetingStatus,
    proposedDate: apt.proposedDate,
    proposedTime: apt.proposedTime,
    adminNote: apt.status === "rescheduled" ? apt.adminNote : null,
    cancellationReason: apt.cancellationReason,
  });
}
