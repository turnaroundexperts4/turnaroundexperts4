import { NextResponse } from "next/server";
import {
  getBookedTimesForDate,
  listAvailabilityRules,
  listBlockedDates,
} from "@/lib/data";
import { businessTimeMinutes, todayISODate } from "@/lib/utils";

export const dynamic = "force-dynamic";

function generateSlots(
  start: string,
  end: string,
  step: number,
): string[] {
  const slots: string[] = [];
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  for (let m = startMin; m + step <= endMin + 1; m += step) {
    const hh = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    slots.push(`${hh}:${mm}`);
  }
  return slots;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  if (!date) {
    return NextResponse.json({ error: "Missing date" }, { status: 400 });
  }
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const [rules, blockedList, booked] = await Promise.all([
    listAvailabilityRules(),
    listBlockedDates(),
    getBookedTimesForDate(date),
  ]);

  const blockedDatesSet = new Set(blockedList.map((b) => b.date));
  if (blockedDatesSet.has(date)) {
    return NextResponse.json({
      date,
      blocked: true,
      reason: blockedList.find((b) => b.date === date)?.reason ?? null,
      slots: [],
      booked,
    });
  }

  // Treat the requested business date as a calendar date, independent of server TZ.
  const [year, month, day] = date.split("-").map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));
  if (
    parsedDate.getUTCFullYear() !== year ||
    parsedDate.getUTCMonth() !== month - 1 ||
    parsedDate.getUTCDate() !== day
  ) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
  const dayOfWeek = parsedDate.getUTCDay();
  const rule = rules.find((r) => r.dayOfWeek === dayOfWeek);

  if (!rule || !rule.enabled) {
    return NextResponse.json({
      date,
      enabled: false,
      slots: [],
      booked,
    });
  }

  const slots = generateSlots(rule.startTime, rule.endTime, rule.slotMinutes);
  // Past times today are also blocked
  const isToday = date === todayISODate();
  const nowMinutes = businessTimeMinutes();
  const available = slots.filter((slot) => {
    if (booked.includes(slot)) return false;
    if (isToday) {
      const [sh, sm] = slot.split(":").map(Number);
      const slotMin = sh * 60 + sm;
      if (slotMin <= nowMinutes) return false;
    }
    return true;
  });

  return NextResponse.json({
    date,
    enabled: true,
    rule: {
      startTime: rule.startTime,
      endTime: rule.endTime,
      slotMinutes: rule.slotMinutes,
    },
    slots,
    availableSlots: available,
    booked,
  });
}
