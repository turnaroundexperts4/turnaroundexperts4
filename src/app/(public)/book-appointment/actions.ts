"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createAppointment,
  getBookedTimesForDate,
  getServiceById,
  getSetting,
} from "@/lib/data";
import { generateReference, todayISODate } from "@/lib/utils";

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

  // Server-side validation: date is not in past + within allowed lead window
  const today = todayISODate();
  if (data.requestedDate < today) {
    return { ok: false, error: "Selected date is in the past." };
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

  // Server-side conflict check — prevents race-condition-style duplicate bookings
  const taken = await getBookedTimesForDate(data.requestedDate);
  if (taken.includes(data.requestedTime)) {
    return {
      ok: false,
      error:
        "That time slot has just been booked. Please choose another available slot.",
    };
  }

  // Resolve service title for admin readability
  let serviceTitle: string | undefined = undefined;
  if (data.serviceId) {
    const s = await getServiceById(data.serviceId);
    if (s) serviceTitle = s.title;
  }

  // Create
  const reference = generateReference("TAE");
  const created = await createAppointment({
    reference,
    customerName: data.customerName,
    email: data.email,
    phone: data.phone,
    company: data.company || undefined,
    serviceId: data.serviceId,
    serviceTitle,
    requestedDate: data.requestedDate,
    requestedTime: data.requestedTime,
    message: data.message || undefined,
    history: [
      {
        at: new Date().toISOString(),
        action: "request_submitted",
        note: "Customer submitted appointment request via website.",
      },
    ],
  });

  revalidatePath("/admin/appointments");
  if (!created) {
    return { ok: false, error: "The booking service is unavailable right now. Please try again later." };
  }
  return { ok: true, reference: created.reference };
}

function addDays(date: string, days: number): string {
  const d = new Date(date + "T00:00:00");
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}
