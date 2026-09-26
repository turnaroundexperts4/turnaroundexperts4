import { and, desc, eq, inArray, lte, or } from "drizzle-orm";
import { db } from "@/db";
import { appointmentNotificationJobs, appointments } from "@/db/schema";
import { cancelGoogleMeeting, ensureGoogleMeeting } from "@/lib/google-calendar";
import { sendAppointmentEmail } from "@/lib/appointment-email";
import { getAppointmentByRef } from "@/lib/data";
import { firebaseAdminConfigured } from "@/lib/firebase-admin";
import {
  firebaseClaimNextAppointmentNotification,
  firebaseFinishAppointmentNotification,
  firebasePersistAppointmentMeeting,
} from "@/lib/firebase-content";

type NotificationType =
  | "booking_received"
  | "approved"
  | "rejected"
  | "reschedule_proposed"
  | "rescheduled_confirmed"
  | "cancelled";

type Job = {
  id: string;
  appointmentId: number;
  appointmentReference: string;
  eventType: NotificationType;
  version: number;
  previousDate: string | null;
  previousTime: string | null;
  attempts: number;
};

const MAX_ATTEMPTS = 8;
const MAX_RETRY_MS = 6 * 60 * 60 * 1000;

function safeErrorCode(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (/^missing_|^invalid_/.test(message)) return message.slice(0, 120);
  const http = message.match(/^(google_[a-z_]+|resend)_http_(\d{3})$/);
  if (http) return `${http[1]}_http_${http[2]}`;
  if (message === "google_refresh_token_expired") return message;
  return "provider_request_failed";
}

function statusMatchesJob(type: NotificationType, status: string) {
  switch (type) {
    case "booking_received":
      return status === "pending";
    case "approved":
    case "rescheduled_confirmed":
      return status === "approved";
    case "rejected":
      return status === "rejected";
    case "reschedule_proposed":
      return status === "rescheduled";
    case "cancelled":
      return status === "cancelled";
  }
}

async function claimPostgresJob(): Promise<Job | null> {
  return db.transaction(async (transaction) => {
    const now = new Date();
    const [job] = await transaction
      .select()
      .from(appointmentNotificationJobs)
      .where(
        or(
          and(
            eq(appointmentNotificationJobs.status, "pending"),
            lte(appointmentNotificationJobs.nextAttemptAt, now),
          ),
          and(
            eq(appointmentNotificationJobs.status, "processing"),
            lte(appointmentNotificationJobs.leaseUntil, now),
          ),
        ),
      )
      .orderBy(appointmentNotificationJobs.nextAttemptAt)
      .limit(1)
      .for("update", { skipLocked: true });
    if (!job) return null;
    const [claimed] = await transaction
      .update(appointmentNotificationJobs)
      .set({
        status: "processing",
        attempts: job.attempts + 1,
        leaseUntil: new Date(now.getTime() + 60_000),
        updatedAt: now,
      })
      .where(eq(appointmentNotificationJobs.id, job.id))
      .returning();
    return claimed
      ? {
          id: claimed.id,
          appointmentId: claimed.appointmentId,
          appointmentReference: claimed.appointmentReference,
          eventType: claimed.eventType as NotificationType,
          version: claimed.version,
          previousDate: claimed.previousDate,
          previousTime: claimed.previousTime,
          attempts: claimed.attempts,
        }
      : null;
  });
}

async function claimJob(): Promise<Job | null> {
  if (!firebaseAdminConfigured) return claimPostgresJob();
  const job = await firebaseClaimNextAppointmentNotification();
  if (!job) return null;
  return {
    id: String(job.id),
    appointmentId: Number(job.appointmentId),
    appointmentReference: String(job.appointmentReference),
    eventType: String(job.eventType) as NotificationType,
    version: Number(job.version),
    previousDate: typeof job.previousDate === "string" ? job.previousDate : null,
    previousTime: typeof job.previousTime === "string" ? job.previousTime : null,
    attempts: Number(job.attempts),
  };
}

async function finishJob(
  job: Job,
  input: {
    status: "sent" | "failed" | "pending" | "superseded";
    errorCode?: string | null;
    providerMessageId?: string | null;
    meetingStatus?: string;
    nextAttemptAt?: Date;
  },
) {
  if (firebaseAdminConfigured) {
    await firebaseFinishAppointmentNotification({
      jobId: job.id,
      appointmentId: job.appointmentId,
      version: job.version,
      ...input,
    });
    return;
  }
  await db.transaction(async (transaction) => {
    const now = new Date();
    await transaction
      .update(appointmentNotificationJobs)
      .set({
        status: input.status,
        lastErrorCode: input.errorCode ?? null,
        providerMessageId: input.providerMessageId ?? null,
        nextAttemptAt: input.nextAttemptAt ?? now,
        leaseUntil: null,
        updatedAt: now,
      })
      .where(
        and(
          eq(appointmentNotificationJobs.id, job.id),
          eq(appointmentNotificationJobs.status, "processing"),
        ),
      );
    const update = {
      notificationStatus:
        input.status === "superseded" ? "queued" : input.status,
      lastNotificationError: input.errorCode ?? null,
      updatedAt: now,
      ...(input.meetingStatus ? { meetingStatus: input.meetingStatus } : {}),
    };
    await transaction
      .update(appointments)
      .set(update)
      .where(
        and(
          eq(appointments.id, job.appointmentId),
          eq(appointments.notificationVersion, job.version),
        ),
      );
  });
}

async function persistMeeting(job: Job, eventId: string, meetLink: string) {
  if (firebaseAdminConfigured) {
    return firebasePersistAppointmentMeeting({
      appointmentId: job.appointmentId,
      version: job.version,
      googleEventId: eventId,
      googleMeetLink: meetLink,
    });
  }
  const [updated] = await db
    .update(appointments)
    .set({
      googleEventId: eventId,
      googleMeetLink: meetLink,
      meetingStatus: "ready",
      lastNotificationError: null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(appointments.id, job.appointmentId),
        eq(appointments.notificationVersion, job.version),
        inArray(appointments.status, ["approved", "rescheduled"]),
      ),
    )
    .returning({ id: appointments.id });
  return Boolean(updated);
}

async function processJob(job: Job) {
  const appointment = await getAppointmentByRef(job.appointmentReference);
  if (
    !appointment ||
    appointment.notificationVersion !== job.version ||
    !statusMatchesJob(job.eventType, appointment.status)
  ) {
    await finishJob(job, { status: "superseded" });
    return;
  }

  let meetingStatus = appointment.meetingStatus;
  let googleMeetLink = appointment.googleMeetLink;
  let googleEventId = appointment.googleEventId;
  let meetingOperationInProgress = false;
  try {
    if (job.eventType === "approved" || job.eventType === "rescheduled_confirmed") {
      meetingOperationInProgress = true;
      const meeting = await ensureGoogleMeeting({
        reference: appointment.reference,
        customerName: appointment.customerName,
        email: appointment.email,
        requestedDate: appointment.requestedDate,
        requestedTime: appointment.requestedTime,
        durationMinutes: appointment.durationMinutes,
      });
      googleEventId = meeting.googleEventId;
      googleMeetLink = meeting.googleMeetLink;
      const persisted = await persistMeeting(
        job,
        meeting.googleEventId,
        meeting.googleMeetLink,
      );
      if (!persisted) {
        await finishJob(job, { status: "superseded" });
        return;
      }
      meetingStatus = "ready";
      meetingOperationInProgress = false;
    } else if (job.eventType === "cancelled" && googleEventId) {
      meetingOperationInProgress = true;
      await cancelGoogleMeeting(googleEventId);
      meetingStatus = "cancelled";
      meetingOperationInProgress = false;
    }

    const providerMessageId = await sendAppointmentEmail(
      {
        eventType: job.eventType,
        reference: appointment.reference,
        customerName: appointment.customerName,
        email: appointment.email,
        serviceTitle: appointment.serviceTitle,
        requestedDate: appointment.requestedDate,
        requestedTime: appointment.requestedTime,
        durationMinutes: appointment.durationMinutes,
        status: appointment.status,
        googleMeetLink,
        cancellationReason: appointment.cancellationReason,
        previousDate: job.previousDate,
        previousTime: job.previousTime,
        proposedDate: appointment.proposedDate,
        proposedTime: appointment.proposedTime,
      },
      job.id,
    );
    await finishJob(job, {
      status: "sent",
      providerMessageId,
      meetingStatus,
    });
  } catch (error) {
    const errorCode = safeErrorCode(error);
    const permanent =
      errorCode.startsWith("missing_") ||
      errorCode.startsWith("invalid_") ||
      errorCode === "google_refresh_token_expired";
    const retry =
      !permanent && job.attempts < MAX_ATTEMPTS
        ? new Date(
            Date.now() +
              Math.min(60_000 * 2 ** Math.max(job.attempts - 1, 0), MAX_RETRY_MS),
          )
        : undefined;
    console.error("Appointment notification job failed", {
      jobId: job.id,
      eventType: job.eventType,
      errorCode,
    });
    await finishJob(job, {
      status: retry ? "pending" : "failed",
      errorCode,
      ...(job.eventType === "approved" ||
      job.eventType === "rescheduled_confirmed" ||
      (job.eventType === "cancelled" && Boolean(googleEventId))
        ? {
            ...(meetingOperationInProgress
              ? { meetingStatus: "failed" }
              : {}),
          }
        : {}),
      nextAttemptAt: retry,
    });
  }
}

export async function processAppointmentOutboxBatch(limit = 25) {
  let processed = 0;
  for (; processed < limit; processed += 1) {
    const job = await claimJob();
    if (!job) break;
    await processJob(job);
  }
  return processed;
}
