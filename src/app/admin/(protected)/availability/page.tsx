import {
  listAvailabilityRules,
  listBlockedDates,
} from "@/lib/data";
import { AvailabilityAdmin } from "@/app/admin/(protected)/availability/client";

export const dynamic = "force-dynamic";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default async function AvailabilityPage() {
  const [rules, blocked] = await Promise.all([
    listAvailabilityRules(),
    listBlockedDates(),
  ]);
  // Ensure all 7 days exist in the UI even if DB is missing one
  const byDay = new Map(rules.map((r) => [r.dayOfWeek, r]));
  const full = Array.from({ length: 7 }, (_, day) => {
    const r = byDay.get(day);
    return {
      dayOfWeek: day,
      name: DAY_NAMES[day],
      enabled: r?.enabled ?? day !== 0,
      startTime: r?.startTime ?? "10:00",
      endTime: r?.endTime ?? "17:00",
      slotMinutes: r?.slotMinutes ?? 60,
    };
  });
  return (
    <AvailabilityAdmin
      rules={full}
      blocked={blocked.map((b) => ({
        id: b.id,
        date: b.date,
        reason: b.reason,
      }))}
    />
  );
}
