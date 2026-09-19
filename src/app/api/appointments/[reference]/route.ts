import { NextResponse } from "next/server";
import { getAppointmentByRef } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ reference: string }> },
) {
  const { reference } = await params;
  const apt = await getAppointmentByRef(reference);
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
