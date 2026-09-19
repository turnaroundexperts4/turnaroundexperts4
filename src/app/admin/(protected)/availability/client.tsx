"use client";

import { useState, useTransition } from "react";
import { Clock, Plus, Trash2 } from "lucide-react";
import { Field, Input } from "@/app/admin/_components/admin-fields";
import {
  blockDate,
  saveAvailability,
  unblockDate,
} from "@/app/admin/(protected)/availability/actions";

type Rule = {
  dayOfWeek: number;
  name: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
  slotMinutes: number;
};
type Blocked = { id: number; date: string; reason: string | null };

export function AvailabilityAdmin({
  rules,
  blocked,
}: {
  rules: Rule[];
  blocked: Blocked[];
}) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-[1100px]">
      <header>
        <span className="text-[11px] uppercase tracking-[0.22em] text-ink-500">
          Availability
        </span>
        <h1 className="display-font mt-2 text-[clamp(1.8rem,3.6vw,2.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-navy-900">
          Working hours & blocked dates
        </h1>
        <p className="mt-2 max-w-xl text-[14px] text-ink-700">
          Controls which slots appear on the public booking page. Already-booked
          pending/approved times are blocked automatically.
        </p>
      </header>
      {msg ? (
        <div className="mt-4 rounded-full border border-emerald-300 bg-emerald-50 px-5 py-2 text-[13px] text-emerald-800">
          {msg}
        </div>
      ) : null}

      <form
        className="mt-8 overflow-hidden rounded-2xl border border-ink-900/5 bg-paper"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          start(async () => {
            await saveAvailability(fd);
            setMsg("Working hours saved.");
            setTimeout(() => setMsg(null), 2000);
          });
        }}
      >
        <div className="border-b border-ink-900/5 bg-paper-deep px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-ink-500">
          Weekly schedule
        </div>
        <ul>
          {rules.map((r) => (
            <li
              key={r.dayOfWeek}
              className="grid grid-cols-1 items-center gap-3 border-b border-ink-900/5 px-6 py-4 last:border-b-0 md:grid-cols-12"
            >
              <div className="flex items-center gap-3 md:col-span-3">
                <input
                  type="checkbox"
                  name={`enabled_${r.dayOfWeek}`}
                  defaultChecked={r.enabled}
                  className="h-4 w-4"
                />
                <span className="font-medium text-navy-900">{r.name}</span>
              </div>
              <div className="md:col-span-3">
                <label className="text-[11px] text-ink-500">Start</label>
                <Input
                  name={`start_${r.dayOfWeek}`}
                  type="time"
                  defaultValue={r.startTime}
                />
              </div>
              <div className="md:col-span-3">
                <label className="text-[11px] text-ink-500">End</label>
                <Input
                  name={`end_${r.dayOfWeek}`}
                  type="time"
                  defaultValue={r.endTime}
                />
              </div>
              <div className="md:col-span-3">
                <label className="text-[11px] text-ink-500">Slot (minutes)</label>
                <Input
                  name={`slot_${r.dayOfWeek}`}
                  type="number"
                  min={15}
                  step={15}
                  defaultValue={r.slotMinutes}
                />
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-end px-6 py-4">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-[13px] font-medium text-paper disabled:opacity-60"
          >
            <Clock className="h-4 w-4" />
            {pending ? "Saving…" : "Save schedule"}
          </button>
        </div>
      </form>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <form
          className="rounded-2xl border border-ink-900/5 bg-paper p-6"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            start(async () => {
              const r = await blockDate(fd);
              if (r.ok) {
                setMsg("Date blocked.");
                (e.target as HTMLFormElement).reset();
              } else setMsg(r.error ?? "Error");
              setTimeout(() => setMsg(null), 2000);
            });
          }}
        >
          <h2 className="display-font text-[18px] text-navy-900">
            Block a date
          </h2>
          <div className="mt-4 space-y-3">
            <Field label="Date">
              <Input name="date" type="date" required />
            </Field>
            <Field label="Reason (optional)">
              <Input name="reason" placeholder="Holiday / offsite / full" />
            </Field>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-[13px] font-medium text-paper"
            >
              <Plus className="h-4 w-4" /> Block date
            </button>
          </div>
        </form>

        <div className="rounded-2xl border border-ink-900/5 bg-paper p-6">
          <h2 className="display-font text-[18px] text-navy-900">
            Blocked dates
          </h2>
          {blocked.length === 0 ? (
            <p className="mt-4 text-[14px] text-ink-500">No blocked dates.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {blocked.map((b) => (
                <li
                  key={b.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-ink-900/5 bg-paper-deep px-4 py-3 text-[14px]"
                >
                  <div>
                    <div className="font-medium text-navy-900">{b.date}</div>
                    {b.reason ? (
                      <div className="text-[12.5px] text-ink-500">
                        {b.reason}
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const fd = new FormData();
                      fd.append("id", String(b.id));
                      start(async () => {
                        await unblockDate(fd);
                        setMsg("Date unblocked.");
                        setTimeout(() => setMsg(null), 2000);
                      });
                    }}
                    className="grid h-9 w-9 place-items-center rounded-full border border-red-200 text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
