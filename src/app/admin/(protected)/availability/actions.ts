"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import {
  addBlockedDate,
  removeBlockedDate,
  upsertAvailabilityRule,
} from "@/lib/data";

async function guard() {
  if (!(await requireAdmin())) throw new Error("Unauthorized");
}

const DAYS = [0, 1, 2, 3, 4, 5, 6];

export async function saveAvailability(formData: FormData) {
  await guard();
  for (const day of DAYS) {
    const enabled =
      formData.get(`enabled_${day}`) === "on" ||
      formData.get(`enabled_${day}`) === "true";
    const startTime = String(formData.get(`start_${day}`) ?? "10:00");
    const endTime = String(formData.get(`end_${day}`) ?? "17:00");
    const slotMinutes = Number(formData.get(`slot_${day}`) ?? 60);
    await upsertAvailabilityRule({
      dayOfWeek: day,
      enabled,
      startTime,
      endTime,
      slotMinutes: Number.isFinite(slotMinutes) ? slotMinutes : 60,
    });
  }
  revalidatePath("/admin/availability");
  revalidatePath("/book-appointment");
  return { ok: true };
}

export async function blockDate(formData: FormData) {
  await guard();
  const date = String(formData.get("date") ?? "");
  const reason = String(formData.get("reason") ?? "").trim() || undefined;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { ok: false, error: "Invalid date" };
  await addBlockedDate(date, reason);
  revalidatePath("/admin/availability");
  revalidatePath("/book-appointment");
  return { ok: true };
}

export async function unblockDate(formData: FormData) {
  await guard();
  const id = Number(formData.get("id"));
  if (!id) return { ok: false };
  await removeBlockedDate(id);
  revalidatePath("/admin/availability");
  revalidatePath("/book-appointment");
  return { ok: true };
}
