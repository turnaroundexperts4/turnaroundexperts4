"use client";

import { useActionState, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Check, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitAppointment, type BookingState } from "@/app/(public)/book-appointment/actions";

type Service = { id: number; title: string; slug: string };
type SlotResp = {
  date: string;
  enabled: boolean;
  blocked?: boolean;
  reason?: string | null;
  slots: string[];
  availableSlots: string[];
  booked: string[];
};

const initialState: BookingState = { ok: false };

const HOURS_12 = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, "0")} ${period}`;
};

const TODAY = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const ISODate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export function BookingForm({ services }: { services: Service[] }) {
  const [rawState, formAction] = useActionState<BookingState | null, FormData>(
    submitAppointment,
    initialState,
  );
  const state: BookingState = rawState ?? initialState;
  const [step, setStep] = useState<"date" | "details">("date");

  // Date / slots state
  const todayStr = TODAY();
  const [month, setMonth] = useState(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slotData, setSlotData] = useState<SlotResp | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch slots when date selected.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    setSelectedTime(null);
    fetch(`/api/availability?date=${selectedDate}`)
      .then((r) => r.json())
      .then((d: SlotResp) => {
        setSlotData(d);
      })
      .catch(() => setSlotData(null))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const calendarGrid = useMemo(() => buildCalendarGrid(month, todayStr), [month, todayStr]);

  return (
    <div>
      {state.ok && state.reference ? (
        <Confirmation reference={state.reference} />
      ) : (
        <>
          <Steps step={step} />

          <AnimatePresence mode="wait">
            {step === "date" ? (
              <motion.div
                key="date-step"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                  <div className="rounded-2xl border border-ink-900/5 bg-white p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="display-font text-[18px] font-medium text-navy-900">
                        {month.toLocaleString("en-IN", { month: "long", year: "numeric" })}
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="Previous month"
                          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                          className="grid h-9 w-9 place-items-center rounded-full border border-ink-900/10 text-ink-700 transition hover:border-navy-900/30"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Next month"
                          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                          className="grid h-9 w-9 place-items-center rounded-full border border-ink-900/10 text-ink-700 transition hover:border-navy-900/30"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-6 grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-[0.18em] text-ink-500">
                      <div>Sun</div>
                      <div>Mon</div>
                      <div>Tue</div>
                      <div>Wed</div>
                      <div>Thu</div>
                      <div>Fri</div>
                      <div>Sat</div>
                    </div>
                    <div className="mt-3 grid grid-cols-7 gap-1">
                      {calendarGrid.map((cell, i) => (
                        <div key={i} className="aspect-square">
                          {cell ? (
                            <button
                              type="button"
                              disabled={cell.disabled}
                              onClick={() => !cell.disabled && setSelectedDate(cell.iso)}
                              className={cn(
                                "grid h-full w-full place-items-center rounded-xl text-[14px] transition",
                                cell.disabled
                                  ? "text-ink-300"
                                  : selectedDate === cell.iso
                                    ? "bg-navy-900 font-medium text-paper"
                                    : "text-ink-900 hover:bg-ink-900/[0.06]",
                              )}
                            >
                              {cell.day}
                            </button>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-ink-900/5 bg-white p-6">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-500">
                      <Clock className="h-3.5 w-3.5" />
                      Available slots
                    </div>
                    {!selectedDate ? (
                      <div className="mt-5 grid place-items-center py-14 text-center">
                        <Calendar className="h-7 w-7 text-ink-400" />
                        <p className="mt-3 text-[14px] text-ink-500">
                          Select a date to see available times.
                        </p>
                      </div>
                    ) : loadingSlots ? (
                      <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-11 animate-pulse rounded-full bg-paper-deep"
                          />
                        ))}
                      </div>
                    ) : slotData?.blocked ? (
                      <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-5 text-[14px] text-amber-900">
                        {slotData.reason ?? "This date is unavailable."}
                      </div>
                    ) : slotData && !slotData.enabled ? (
                      <div className="mt-5 grid place-items-center py-12 text-center text-[14px] text-ink-500">
                        TAE doesn&apos;t take appointments on this day of the week.
                      </div>
                    ) : (
                      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {slotData?.availableSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTime(slot)}
                            className={cn(
                              "rounded-full border px-3 py-2.5 text-[13.5px] transition",
                              selectedTime === slot
                                ? "border-navy-900 bg-navy-900 text-paper"
                                : "border-ink-900/10 text-ink-900 hover:border-navy-900/30",
                            )}
                          >
                            {HOURS_12(slot)}
                          </button>
                        ))}
                        {slotData?.availableSlots.length === 0 ? (
                          <div className="col-span-full rounded-xl border border-ink-900/5 bg-paper-deep p-4 text-center text-[14px] text-ink-500">
                            No slots remaining on this day.
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-end">
                  <button
                    type="button"
                    disabled={!selectedDate || !selectedTime}
                    onClick={() => setStep("details")}
                    className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-7 py-3.5 text-[15px] font-medium text-paper transition hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-ink-300"
                  >
                    Continue
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="details-step"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="rounded-2xl border border-ink-900/5 bg-white p-7">
                  <button
                    type="button"
                    onClick={() => setStep("date")}
                    className="inline-flex items-center gap-1 text-[13px] text-ink-500 transition hover:text-navy-900"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Change date/time
                  </button>

                  <div className="mt-4 rounded-xl bg-paper-deep p-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
                      Selected slot
                    </div>
                    <div className="display-font mt-1 text-[20px] text-navy-900">
                      {selectedDate
                        ? new Date(selectedDate + "T00:00:00").toLocaleDateString(
                            "en-IN",
                            {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )
                        : ""}
                      {selectedTime ? ` · ${HOURS_12(selectedTime)}` : ""}
                    </div>
                  </div>

                  <form action={formAction} className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">
                    <input type="hidden" name="requestedDate" value={selectedDate ?? ""} />
                    <input type="hidden" name="requestedTime" value={selectedTime ?? ""} />
                    <Field
                      label="Full name"
                      name="customerName"
                      required
                      placeholder="e.g. Ramesh Patel"
                      error={state.fieldErrors?.customerName}
                    />
                    <Field
                      label="Email"
                      type="email"
                      name="email"
                      required
                      placeholder="you@business.com"
                      error={state.fieldErrors?.email}
                    />
                    <Field
                      label="Phone"
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 …"
                      error={state.fieldErrors?.phone}
                    />
                    <Field
                      label="Company / business name"
                      name="company"
                      placeholder="Optional"
                    />
                    <div className="md:col-span-2">
                      <label className="block text-[13px] font-medium text-navy-900">
                        Service required
                      </label>
                      <select
                        name="serviceId"
                        defaultValue=""
                        className="mt-2 w-full rounded-xl border border-ink-900/10 bg-paper px-4 py-3 text-[15px] outline-none transition focus:border-navy-900/40"
                      >
                        <option value="">Choose a service (optional)</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[13px] font-medium text-navy-900">
                        What would you like to discuss?
                      </label>
                      <textarea
                        name="message"
                        rows={4}
                        placeholder="A few lines on your business and what you'd like help with."
                        className="mt-2 w-full rounded-xl border border-ink-900/10 bg-paper px-4 py-3 text-[15px] outline-none transition focus:border-navy-900/40"
                      />
                    </div>
                    {state.error ? (
                      <div className="md:col-span-2 rounded-xl border border-red-200 bg-red-50 p-4 text-[14px] text-red-800">
                        {state.error}
                      </div>
                    ) : null}
                    <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3 pt-2">
                      <p className="text-[13px] text-ink-500">
                        Submissions are reviewed by the TAE team. You&apos;ll receive
                        a confirmation by email once approved.
                      </p>
                      <SubmitButton />
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

function Steps({ step }: { step: "date" | "details" }) {
  return (
    <div className="mb-8 flex items-center gap-2">
      <Step active label="Date & time" number={1} current={step === "date"} />
      <div className="h-px flex-1 bg-ink-900/10" />
      <Step active label="Your details" number={2} current={step === "details"} />
    </div>
  );
}

function Step({
  active,
  label,
  number,
  current,
}: {
  active: boolean;
  label: string;
  number: number;
  current: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-full border px-4 py-2 text-[13px] transition",
        current
          ? "border-navy-900 bg-navy-900 text-paper"
          : active
            ? "border-paper text-ink-700"
            : "border-ink-900/10 text-ink-500",
      )}
    >
      <span className="grid h-5 w-5 place-items-center rounded-full bg-paper/20 text-[11px]">
        {number}
      </span>
      {label}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-navy-900">
        {label}
        {required ? <span className="ml-1 text-red-600">*</span> : null}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className={cn(
          "mt-2 w-full rounded-xl border bg-paper px-4 py-3 text-[15px] outline-none transition focus:border-navy-900/40",
          error ? "border-red-300" : "border-ink-900/10",
        )}
      />
      {error ? <p className="mt-1 text-[12.5px] text-red-700">{error}</p> : null}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-7 py-3.5 text-[15px] font-medium text-paper transition hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-ink-300"
    >
      {pending ? "Submitting…" : "Submit appointment request"}
    </button>
  );
}

function Confirmation({ reference }: { reference: string }) {
  const [details, setDetails] = useState<null | {
    customerName: string;
    requestedDate: string;
    requestedTime: string;
    serviceTitle?: string | null;
    status: string;
  }>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!reference) return;
    fetch(`/api/appointments/${reference}`)
      .then((r) => r.json())
      .then(setDetails)
      .catch(() => setDetails(null));
  }, [reference]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-ink-900/5 bg-white p-8 text-center md:p-12"
    >
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-navy-900 text-paper">
        <Check className="h-7 w-7" />
      </div>
      <h2 className="display-font mt-6 text-[28px] font-medium text-navy-900">
        Request received.
      </h2>
      <p className="mx-auto mt-3 max-w-md text-[15px] text-ink-700">
        Thank you. The TAE team will review your request and respond by email
        shortly. Your appointment is not yet confirmed.
      </p>
      <div className="mx-auto mt-8 max-w-md rounded-2xl border border-ink-900/5 bg-paper-deep p-5 text-left text-[14px]">
        <dl className="space-y-2.5">
          <div className="flex justify-between gap-3">
            <dt className="text-ink-500">Reference</dt>
            <dd className="font-mono text-navy-900">{reference}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-ink-500">Requested date</dt>
            <dd className="text-navy-900">
              {details?.requestedDate
                ? new Date(
                    details.requestedDate + "T00:00:00",
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-ink-500">Requested time</dt>
            <dd className="text-navy-900">
              {details?.requestedTime ? HOURS_12(details.requestedTime) : "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-ink-500">Service</dt>
            <dd className="text-navy-900">{details?.serviceTitle ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-ink-500">Status</dt>
            <dd>
              <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-0.5 text-[12px] font-medium text-amber-800">
                Pending review
              </span>
            </dd>
          </div>
        </dl>
      </div>
      <p className="mt-8 text-[13px] text-ink-500">
        Save your reference — keep it handy for any follow-up communication.
      </p>
    </motion.div>
  );
}

function buildCalendarGrid(
  month: Date,
  todayStr: string,
): { day: number; iso: string; disabled: boolean }[] {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const startDay = firstDay.getDay();
  const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const cells: { day: number; iso: string; disabled: boolean }[] = [];
  for (let i = 0; i < startDay; i++) {
    cells.push({ day: 0, iso: "", disabled: true });
    if (cells.length >= startDay) break;
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dt = new Date(month.getFullYear(), month.getMonth(), d);
    const iso = ISODate(dt);
    cells.push({
      day: d,
      iso,
      disabled: iso < todayStr || dt.getDay() === 0, // disable past and Sundays as default unavailable day
    });
  }
  return cells;
}
