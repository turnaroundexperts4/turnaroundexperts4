"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import {
  createAppointment,
  getBookedTimesForDate,
  getServiceById,
  getSetting,
  getAppointmentByUid,
  listAvailabilityRules,
  listBlockedDates,
} from "@/lib/data";
import { generateReference, todayISODate } from "@/lib/utils";
import { verifyFirebaseIdToken } from "@/lib/firebase-auth";
import { checkRequestRateLimit } from "@/lib/request-rate-limit";

const TimeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
const DateRegex = /^\d{4}-\d{2}-\d{2}$/;

const FormSchema = z.object({
  customerName: z.string().min(2, "Please enter your full name").max(200),
  email: z.string().email("Please enter a valid email").max(200),
  phone: z
    .string()
    .min(7, "Please enter a valid phone number")
    .max(40),
  company: z.string().max(200).optional().or(z.literal("")),
  serviceId: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : undefined)),
  message: z.string().max(2000).optional().or(z.literal("")),
  requestedDate: z.string().regex(DateRegex, "Invalid date"),
  requestedTime: z.string().regex(TimeRegex, "Invalid time"),
});

export type BookingState = {
  ok: boolean;
  reference?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitAppointment(
  _prev: BookingState | null,
  formData: FormData,
): Promise<BookingState> {
  // Parse
  const parsed = FormSchema.safeParse({
    customerName: formData.get("customerName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    company: formData.get("company") ?? "",
    serviceId: formData.get("serviceId") ?? "",
    message: formData.get("message") ?? "",
    requestedDate: formData.get("requestedDate"),
    requestedTime: formData.get("requestedTime"),
  });
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString() ?? "form";
      errors[key] = issue.message;
    }
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: errors };
  }
  const data = parsed.data;
  const requestHeaders = await headers();
  const clientKey =
    requestHeaders.get("cf-connecting-ip") ??
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const rateLimit = checkRequestRateLimit(`booking:${clientKey}`, {
    limit: 5,
    windowMs: 10 * 60_000,
  });
  if (!rateLimit.allowed) {
    return {
      ok: false,
      error: "Too many booking requests. Please try again later.",
    };
  }
  const idToken = String(formData.get("idToken") ?? "");
  const user = await verifyFirebaseIdToken(idToken);
  if (!user || user.status !== "authenticated") {
    return { ok: false, error: "Please sign in before requesting an appointment." };
  }
  if (!user.email || !user.emailVerified) {
    return {
      ok: false,
      error: "Verify your account email before requesting an appointment.",
    };
  }
  if (data.email.trim().toLowerCase() !== user.email.trim().toLowerCase()) {
    return {
      ok: false,
      error: "Use the verified email address for your signed-in account.",
    };
  }

  // Server-side validation: date is not in past + within allowed lead window
  const today = todayISODate();
  if (!isValidISODate(data.requestedDate) || data.requestedDate < today) {
    return { ok: false, error: "Selected date is in the past." };
  }
  try {
    const existing = await getAppointmentByUid(user.uid);
    if (existing) {
      return { ok: false, error: "You already have an active appointment. Please wait for its status to change." };
    }
    const bookingCfg = await getSetting<{ minLeadDays: number; maxLeadDays: number }>(
      "booking",
      { minLeadDays: 1, maxLeadDays: 60 },
    );
    const min = addDays(today, bookingCfg.minLeadDays);
    const max = addDays(today, bookingCfg.maxLeadDays);
    if (data.requestedDate < min) {
      return {
        ok: false,
        error: `Please select a date at least ${bookingCfg.minLeadDays} day(s) from today.`,
      };
    }
    if (data.requestedDate > max) {
      return {
        ok: false,
        error: `Please select a date within ${bookingCfg.maxLeadDays} days from today.`,
      };
    }

    const [rules, blockedDates] = await Promise.all([
      listAvailabilityRules(),
      listBlockedDates(),
    ]);
    const [year, month, day] = data.requestedDate.split("-").map(Number);
    const dayOfWeek = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
    const rule = rules.find((candidate) => candidate.dayOfWeek === dayOfWeek);
    const blocked = blockedDates.some((candidate) => candidate.date === data.requestedDate);
    if (!rule?.enabled || blocked) {
      return {
        ok: false,
        error: "That date is not available. Please choose another day.",
      };
    }
    const [startHour, startMinute] = rule.startTime.split(":").map(Number);
    const [endHour, endMinute] = rule.endTime.split(":").map(Number);
    const [selectedHour, selectedMinute] = data.requestedTime.split(":").map(Number);
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    const selectedMinutes = selectedHour * 60 + selectedMinute;
    if (
      selectedMinutes < startMinutes ||
      selectedMinutes + rule.slotMinutes > endMinutes ||
      (selectedMinutes - startMinutes) % rule.slotMinutes !== 0
    ) {
      return {
        ok: false,
        error: "That time is not part of the available schedule.",
      };
    }
    const taken = await getBookedTimesForDate(data.requestedDate);
    if (taken.includes(data.requestedTime)) {
      return {
        ok: false,
        error:
          "That time slot has just been booked. Please choose another available slot.",
      };
    }

    let serviceTitle: string | undefined;
    if (data.serviceId) {
      const s = await getServiceById(data.serviceId);
      if (s) serviceTitle = s.title;
    }

    const created = await createAppointment({
      uid: user.uid,
      reference: generateReference("TAE"),
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      company: data.company || undefined,
      serviceId: data.serviceId,
      serviceTitle,
      requestedDate: data.requestedDate,
      requestedTime: data.requestedTime,
      durationMinutes: rule.slotMinutes,
      message: data.message || undefined,
      history: [
        {
          at: new Date().toISOString(),
          action: "request_submitted",
          note: "Customer submitted appointment request via website.",
        },
      ],
    });

    if (!created) {
      return {
        ok: false,
        error: "The booking service is unavailable right now. Please try again later.",
      };
    }
    revalidatePath("/admin/appointments");
    return { ok: true, reference: created.reference };
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "AppointmentConflictError"
    ) {
      return {
        ok: false,
        error: "That booking was just taken. Please choose another available time.",
      };
    }
    console.error("Appointment submission failed", {
      errorCode:
        error instanceof Error && /^[A-Za-z0-9_-]{1,80}$/.test(error.name)
          ? error.name
          : "unknown",
    });
    return {
      ok: false,
      error: "We could not save your appointment. Please try again.",
    };
  }
}

function addDays(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, day + days));
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function isValidISODate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}
