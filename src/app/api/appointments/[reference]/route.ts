import { NextResponse } from "next/server";
import { getAppointmentByRef } from "@/lib/data";
import { checkRequestRateLimit } from "@/lib/request-rate-limit";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ reference: string }> },
) {
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
  if (!apt) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    reference: apt.reference,
    customerName: apt.customerName,
    requestedDate: apt.requestedDate,
    requestedTime: apt.requestedTime,
    serviceTitle: apt.serviceTitle,
    serviceId: apt.serviceId,
    status: apt.status,
    proposedDate: apt.proposedDate,
    proposedTime: apt.proposedTime,
    adminNote: apt.adminNote,
  });
}
