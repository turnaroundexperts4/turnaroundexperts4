"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAppointmentByRef, updateAppointmentStatus } from "@/lib/data";

const Approve = z.object({
  id: z.coerce.number().int().positive(),
});

const Reject = z.object({
  id: z.coerce.number().int().positive(),
  note: z.string().min(2).max(1000),
  proposedDate: z.string().optional().or(z.literal("")),
  proposedTime: z.string().optional().or(z.literal("")),
});

const Reschedule = z.object({
  id: z.coerce.number().int().positive(),
  proposedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  proposedTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  note: z.string().min(2).max(1000),
});

const Complete = z.object({
  id: z.coerce.number().int().positive(),
  note: z.string().optional().or(z.literal("")),
});

export type ActionResult = { ok: boolean; error?: string };

export async function approveAppointment(formData: FormData): Promise<ActionResult> {
  const parsed = Approve.safeParse({ id: formData.get("id") });
  if (!parsed.success) return { ok: false, error: "Invalid input" };
  await updateAppointmentStatus(parsed.data.id, {
    status: "approved",
    historyEntry: {
      at: new Date().toISOString(),
      action: "approved",
      note: "Approved by admin.",
    },
  });
  revalidatePath("/admin/appointments");
  revalidatePath("/admin/dashboard");
  return { ok: true };
}

export async function rejectAppointment(formData: FormData): Promise<ActionResult> {
  const parsed = Reject.safeParse({
    id: formData.get("id"),
    note: formData.get("note"),
    proposedDate: formData.get("proposedDate") ?? "",
    proposedTime: formData.get("proposedTime") ?? "",
  });
  if (!parsed.success) return { ok: false, error: "Provide a rejection reason." };
  const ref = await getAppointmentByRef("");
  void ref;
  const proposedDate = parsed.data.proposedDate || null;
  const proposedTime = parsed.data.proposedTime || null;
  const newStatus = proposedDate && proposedTime ? "rescheduled" : "rejected";
  await updateAppointmentStatus(parsed.data.id, {
    status: newStatus,
    adminNote: parsed.data.note,
    proposedDate,
    proposedTime,
    historyEntry: {
      at: new Date().toISOString(),
      action: newStatus,
      note: parsed.data.note,
    },
  });
  revalidatePath("/admin/appointments");
  revalidatePath("/admin/dashboard");
  return { ok: true };
}

export async function rescheduleAppointment(formData: FormData): Promise<ActionResult> {
  const parsed = Reschedule.safeParse({
    id: formData.get("id"),
    proposedDate: formData.get("proposedDate"),
    proposedTime: formData.get("proposedTime"),
    note: formData.get("note"),
  });
  if (!parsed.success)
    return { ok: false, error: "Provide date, time and a reason." };
  await updateAppointmentStatus(parsed.data.id, {
    status: "rescheduled",
    proposedDate: parsed.data.proposedDate,
    proposedTime: parsed.data.proposedTime,
    adminNote: parsed.data.note,
    historyEntry: {
      at: new Date().toISOString(),
      action: "rescheduled",
      note: parsed.data.note,
    },
  });
  revalidatePath("/admin/appointments");
  revalidatePath("/admin/dashboard");
  return { ok: true };
}

export async function completeAppointment(formData: FormData): Promise<ActionResult> {
  const parsed = Complete.safeParse({
    id: formData.get("id"),
    note: formData.get("note") ?? "",
  });
  if (!parsed.success) return { ok: false, error: "Invalid input" };
  await updateAppointmentStatus(parsed.data.id, {
    status: "completed",
    adminNote: parsed.data.note || null,
    historyEntry: {
      at: new Date().toISOString(),
      action: "completed",
      note: parsed.data.note || undefined,
    },
  });
  revalidatePath("/admin/appointments");
  revalidatePath("/admin/dashboard");
  return { ok: true };
}

export async function cancelAppointment(formData: FormData): Promise<ActionResult> {
  const parsed = Approve.safeParse({ id: formData.get("id") });
  if (!parsed.success) return { ok: false, error: "Invalid input" };
  await updateAppointmentStatus(parsed.data.id, {
    status: "cancelled",
    historyEntry: {
      at: new Date().toISOString(),
      action: "cancelled",
    },
  });
  revalidatePath("/admin/appointments");
  revalidatePath("/admin/dashboard");
  return { ok: true };
}
