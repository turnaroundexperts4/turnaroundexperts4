"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  retryLatestAppointmentNotification,
  updateAppointmentStatus,
} from "@/lib/data";
import { requireAdmin } from "@/lib/auth";

const DateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const TimeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const Approve = z.object({ id: z.coerce.number().int().positive() });
const Reject = z.object({
  id: z.coerce.number().int().positive(),
  note: z.string().min(2).max(1000),
  proposedDate: z.union([DateSchema, z.literal("")]).optional(),
  proposedTime: z.union([TimeSchema, z.literal("")]).optional(),
});
const Reschedule = z.object({
  id: z.coerce.number().int().positive(),
  proposedDate: DateSchema,
  proposedTime: TimeSchema,
  note: z.string().min(2).max(1000),
});
const Complete = z.object({
  id: z.coerce.number().int().positive(),
  note: z.string().max(1000).optional().or(z.literal("")),
});
const Cancel = z.object({
  id: z.coerce.number().int().positive(),
  reason: z.string().max(1000).optional().or(z.literal("")),
});

export type ActionResult = { ok: boolean; error?: string };

async function performAdminAction(
  action: string,
  operation: () => Promise<void | boolean>,
): Promise<ActionResult> {
  if (!(await requireAdmin())) {
    return { ok: false, error: "Your admin session has expired. Sign in again." };
  }
  try {
    const result = await operation();
    if (result === false) {
      return {
        ok: false,
        error: "No failed notification is available to retry for this appointment.",
      };
    }
    revalidatePath("/admin/appointments");
    revalidatePath("/admin/dashboard");
    return { ok: true };
  } catch (error) {
    const errorCode =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof error.code === "string"
        ? error.code
        : error instanceof Error
          ? error.name
          : "unknown";
    console.error("Admin appointment action failed", { action, errorCode });
    return {
      ok: false,
      error:
        error instanceof Error &&
        error.name === "AppointmentConflictError"
          ? "That time has already been taken. Please choose another time."
          : "The appointment could not be updated. Please retry.",
    };
  }
}

export async function approveAppointment(formData: FormData): Promise<ActionResult> {
  const parsed = Approve.safeParse({ id: formData.get("id") });
  if (!parsed.success) return { ok: false, error: "Invalid appointment." };
  return performAdminAction("approve", async () => {
    await updateAppointmentStatus(parsed.data.id, {
      status: "approved",
      notificationType: "approved",
      historyEntry: {
        at: new Date().toISOString(),
        action: "approved",
        note: "Approved by admin.",
      },
    });
  });
}

export async function rejectAppointment(formData: FormData): Promise<ActionResult> {
  const parsed = Reject.safeParse({
    id: formData.get("id"),
    note: formData.get("note"),
    proposedDate: formData.get("proposedDate") ?? "",
    proposedTime: formData.get("proposedTime") ?? "",
  });
  if (!parsed.success) return { ok: false, error: "Provide a valid rejection reason." };
  const hasDate = Boolean(parsed.data.proposedDate);
  const hasTime = Boolean(parsed.data.proposedTime);
  if (hasDate !== hasTime) {
    return { ok: false, error: "Provide both proposed date and proposed time." };
  }
  return performAdminAction("reject", async () => {
    const newStatus = hasDate ? "rescheduled" : "rejected";
    await updateAppointmentStatus(parsed.data.id, {
      status: newStatus,
      notificationType: hasDate ? "reschedule_proposed" : "rejected",
      adminNote: parsed.data.note,
      proposedDate: parsed.data.proposedDate || null,
      proposedTime: parsed.data.proposedTime || null,
      historyEntry: {
        at: new Date().toISOString(),
        action: newStatus,
        note: parsed.data.note,
      },
    });
  });
}

export async function rescheduleAppointment(formData: FormData): Promise<ActionResult> {
  const parsed = Reschedule.safeParse({
    id: formData.get("id"),
    proposedDate: formData.get("proposedDate"),
    proposedTime: formData.get("proposedTime"),
    note: formData.get("note"),
  });
  if (!parsed.success) {
    return { ok: false, error: "Provide a valid date, time and reason." };
  }
  return performAdminAction("reschedule", async () => {
    await updateAppointmentStatus(parsed.data.id, {
      status: "rescheduled",
      notificationType: "reschedule_proposed",
      proposedDate: parsed.data.proposedDate,
      proposedTime: parsed.data.proposedTime,
      adminNote: parsed.data.note,
      historyEntry: {
        at: new Date().toISOString(),
        action: "reschedule_proposed",
        note: parsed.data.note,
      },
    });
  });
}

export async function completeAppointment(formData: FormData): Promise<ActionResult> {
  const parsed = Complete.safeParse({
    id: formData.get("id"),
    note: formData.get("note") ?? "",
  });
  if (!parsed.success) return { ok: false, error: "Invalid appointment." };
  return performAdminAction("complete", async () => {
    await updateAppointmentStatus(parsed.data.id, {
      status: "completed",
      internalNote: parsed.data.note || null,
      historyEntry: {
        at: new Date().toISOString(),
        action: "completed",
      },
    });
  });
}

export async function cancelAppointment(formData: FormData): Promise<ActionResult> {
  const parsed = Cancel.safeParse({
    id: formData.get("id"),
    reason: formData.get("reason") ?? "",
  });
  if (!parsed.success) return { ok: false, error: "Invalid appointment or reason." };
  return performAdminAction("cancel", async () => {
    await updateAppointmentStatus(parsed.data.id, {
      status: "cancelled",
      notificationType: "cancelled",
      cancellationReason: parsed.data.reason || null,
      historyEntry: {
        at: new Date().toISOString(),
        action: "cancelled",
        note: parsed.data.reason || undefined,
      },
    });
  });
}

export async function retryAppointmentNotification(
  formData: FormData,
): Promise<ActionResult> {
  const parsed = Approve.safeParse({ id: formData.get("id") });
  if (!parsed.success) return { ok: false, error: "Invalid appointment." };
  return performAdminAction("retry_notification", () =>
    retryLatestAppointmentNotification(parsed.data.id),
  );
}
