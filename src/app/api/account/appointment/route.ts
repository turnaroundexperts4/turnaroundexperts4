import { NextResponse } from "next/server";
import {
  acceptAppointmentReschedule,
  getAppointmentByRef,
  getLatestAppointmentByUid,
} from "@/lib/data";
import { verifyFirebaseIdToken } from "@/lib/firebase-auth";

export const dynamic = "force-dynamic";

function publicAppointment(appointment: Awaited<ReturnType<typeof getAppointmentByRef>>) {
  if (!appointment) return null;
  return {
    reference: appointment.reference,
    requestedDate: appointment.requestedDate,
    requestedTime: appointment.requestedTime,
    status: appointment.status,
    adminNote: appointment.status === "rescheduled" ? appointment.adminNote : null,
    proposedDate: appointment.proposedDate,
    proposedTime: appointment.proposedTime,
    googleMeetLink: appointment.googleMeetLink,
    meetingStatus: appointment.meetingStatus,
    cancellationReason: appointment.cancellationReason,
  };
}

export async function GET(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const user = await verifyFirebaseIdToken(token);
  if (user.status !== "authenticated") {
    return NextResponse.json(
      { error: user.status === "service_unavailable" ? "Authentication service is unavailable." : "Invalid authentication." },
      { status: user.status === "service_unavailable" ? 503 : 401 },
    );
  }
  const appointment = await getLatestAppointmentByUid(user.uid);
  return NextResponse.json({ appointment: publicAppointment(appointment) });
}

export async function POST(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }
  const user = await verifyFirebaseIdToken(token);
  if (user.status !== "authenticated") {
    return NextResponse.json(
      { error: user.status === "service_unavailable" ? "Authentication service is unavailable." : "Invalid authentication." },
      { status: user.status === "service_unavailable" ? 503 : 401 },
    );
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "JSON body required." }, { status: 415 });
  }
  const body = (await request.json().catch(() => null)) as
    | { reference?: unknown }
    | null;
  if (
    !body ||
    typeof body.reference !== "string" ||
    !/^TAE-[A-Z0-9]{4}-[A-Z0-9]{6}$/.test(body.reference)
  ) {
    return NextResponse.json({ error: "Invalid appointment reference." }, { status: 400 });
  }
  const existing = await getAppointmentByRef(body.reference);
  if (!existing || existing.uid !== user.uid) {
    return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
  }
  if (
    existing.status !== "rescheduled" ||
    !existing.proposedDate ||
    !existing.proposedTime
  ) {
    return NextResponse.json(
      { error: "There is no pending reschedule proposal to accept." },
      { status: 409 },
    );
  }
  try {
    const appointment = await acceptAppointmentReschedule(body.reference, user.uid);
    if (!appointment) {
      return NextResponse.json(
        { error: "The appointment could not be updated. Refresh and try again." },
        { status: 409 },
      );
    }
    return NextResponse.json({
      appointment: publicAppointment(appointment),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AppointmentConflictError") {
      return NextResponse.json(
        { error: "That proposed time has just been taken. Contact the TAE team." },
        { status: 409 },
      );
    }
    console.error("Customer reschedule acceptance failed", {
      errorCode: error instanceof Error ? error.name : "unknown",
    });
    return NextResponse.json(
      { error: "We could not accept this reschedule. Please try again." },
      { status: 500 },
    );
  }
}
