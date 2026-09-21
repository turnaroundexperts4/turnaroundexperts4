"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Calendar,
  Check,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";
import {
  approveAppointment,
  cancelAppointment,
  completeAppointment,
  rejectAppointment,
  rescheduleAppointment,
} from "@/app/admin/(protected)/appointments/actions";

type Appointment = {
  id: number;
  reference: string;
  customerName: string;
  email: string;
  phone: string;
  company: string | null;
  serviceId: number | null;
  serviceTitle: string | null;
  requestedDate: string;
  requestedTime: string;
  message: string | null;
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "rescheduled"
    | "completed"
    | "cancelled";
  adminNote: string | null;
  proposedDate: string | null;
  proposedTime: string | null;
  createdAt: Date;
  history: { at: string; action: string; note?: string }[];
};

const HOURS_12 = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, "0")} ${period}`;
};

const STATUS_TONE: Record<string, string> = {
  pending: "border-amber-300 bg-amber-50 text-amber-800",
  approved: "border-emerald-300 bg-emerald-50 text-emerald-800",
  rejected: "border-red-300 bg-red-50 text-red-800",
  rescheduled: "border-sky-300 bg-sky-50 text-sky-800",
  completed: "border-ink-900/20 bg-ink-100 text-navy-900",
  cancelled: "border-red-300 bg-red-50 text-red-800",
};

const STATUSES = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rescheduled", label: "Rescheduled" },
  { value: "rejected", label: "Rejected" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function AppointmentsManager({
  appointments,
  statusFilter,
  query,
}: {
  appointments: Appointment[];
  statusFilter: string;
  query: string;
}) {
  const [openId, setOpenId] = useState<number | null>(null);
  const [status, setStatus] = useState(statusFilter);
  const [q, setQ] = useState(query);
  const [, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    return appointments
      .filter((a) => (status === "all" ? true : a.status === status))
      .filter((a) => {
        if (!text) return true;
        return (
          a.customerName.toLowerCase().includes(text) ||
          a.email.toLowerCase().includes(text) ||
          a.phone.toLowerCase().includes(text) ||
          a.reference.toLowerCase().includes(text) ||
          (a.serviceTitle ?? "").toLowerCase().includes(text)
        );
      });
  }, [appointments, q, status]);

  const open = appointments.find((a) => a.id === openId) ?? null;

  function updateAction(action: (fd: FormData) => Promise<unknown>, fd: FormData) {
    startTransition(async () => {
      await action(fd);
      setOpenId(null);
    });
  }

  return (
    <div className="mx-auto max-w-[1320px]">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-[0.22em] text-ink-500">
            Appointments
          </span>
          <h1 className="display-font mt-2 text-[clamp(1.8rem,3.6vw,2.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-navy-900">
            Booking requests
          </h1>
          <p className="mt-2 max-w-xl text-[14px] text-ink-700">
            Approve, reject, propose reschedules and mark appointments as
            completed. Customer reference lookup at{" "}
            <Link
              href="/appointment"
              className="font-medium text-navy-900 underline"
            >
              /appointment
            </Link>
            .
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center">
          {STATUSES.map((s) => {
            const count = s.value === "all"
              ? appointments.length
              : appointments.filter((a) => a.status === s.value).length;
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => setStatus(s.value)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-[12.5px] transition",
                  status === s.value
                    ? "border-navy-900 bg-navy-900 text-paper"
                    : "border-ink-900/10 bg-paper text-ink-700 hover:border-navy-900/30",
                )}
              >
                {s.label}{" "}
                <span
                  className={cn(
                    "ml-1.5 rounded-full px-1.5 text-[10.5px] font-mono",
                    status === s.value
                      ? "bg-paper/20"
                      : "bg-paper-deep text-ink-500",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      <div className="mt-6 flex items-center gap-3 rounded-full border border-ink-900/10 bg-paper px-5 py-3">
        <Search className="h-4 w-4 text-ink-500" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, email, phone or reference…"
          className="w-full bg-transparent text-[14.5px] outline-none placeholder:text-ink-400"
          aria-label="Search appointments"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-ink-900/5 bg-paper py-16 text-center">
          <Calendar className="mx-auto h-7 w-7 text-ink-400" />
          <h3 className="display-font mt-3 text-[20px] text-navy-900">
            No appointments found.
          </h3>
          <p className="mx-auto mt-2 max-w-md text-[14px] text-ink-500">
            Adjust the filters above, or check back after new submissions
            arrive.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-ink-900/5 bg-paper">
          <div className="hidden border-b border-ink-900/5 bg-paper-deep px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-ink-500 md:grid md:grid-cols-12">
            <div className="md:col-span-4">Customer</div>
            <div className="md:col-span-3">Service / Reference</div>
            <div className="md:col-span-2">Requested</div>
            <div className="md:col-span-2">Status</div>
            <div className="md:col-span-1 text-right">Open</div>
          </div>
          <ul>
            {filtered.map((a) => (
              <li
                key={a.id}
                className="grid grid-cols-1 gap-2 border-b border-ink-900/5 px-6 py-5 text-[14px] last:border-b-0 md:grid-cols-12 md:items-center"
              >
                <div className="md:col-span-4">
                  <div className="font-medium text-navy-900">
                    {a.customerName}
                  </div>
                  <div className="text-[12.5px] text-ink-500">
                    <a
                      href={`mailto:${a.email}`}
                      className="hover:text-navy-900"
                    >
                      {a.email}
                    </a>{" "}
                    · {a.phone}
                  </div>
                </div>
                <div className="md:col-span-3">
                  <div className="text-ink-900">{a.serviceTitle ?? "—"}</div>
                  <div className="font-mono text-[12px] text-ink-500">
                    {a.reference}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div>{new Date(a.requestedDate + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                  <div className="text-[12.5px] text-ink-500">
                    {HOURS_12(a.requestedTime)}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <span
                    className={cn(
                      "inline-flex rounded-full border px-3 py-1 text-[11.5px] font-medium uppercase tracking-wide",
                      STATUS_TONE[a.status],
                    )}
                  >
                    {a.status}
                  </span>
                </div>
                <div className="md:col-span-1 md:text-right">
                  <button
                    type="button"
                    onClick={() => setOpenId(a.id)}
                    className="inline-flex items-center gap-1 rounded-full border border-ink-900/10 bg-paper px-3 py-1.5 text-[12px] font-medium text-ink-900 transition hover:border-navy-900/30"
                  >
                    Open
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <AnimatePresence>
        {open ? (
          <Drawer key={open.id} onClose={() => setOpenId(null)}>
            <AppointmentDetail
              appointment={open}
              onApprove={(fd) => updateAction(approveAppointment, fd)}
              onReject={(fd) => updateAction(rejectAppointment, fd)}
              onReschedule={(fd) => updateAction(rescheduleAppointment, fd)}
              onComplete={(fd) => updateAction(completeAppointment, fd)}
              onCancel={(fd) => updateAction(cancelAppointment, fd)}
            />
          </Drawer>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Drawer({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <motion.div
      key="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-navy-950/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.aside
        onClick={(e) => e.stopPropagation()}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 60, opacity: 0 }}
        transition={{ type: "tween", duration: 0.25 }}
        className="absolute right-0 top-0 h-full w-full max-w-[640px] overflow-y-auto bg-paper"
        role="dialog"
        aria-label="Appointment details"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-900/5 bg-paper/95 px-7 py-4 backdrop-blur">
          <div className="text-[13px] uppercase tracking-[0.18em] text-ink-500">
            Appointment
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full border border-ink-900/10 text-ink-700 transition hover:border-navy-900/30"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </motion.aside>
    </motion.div>
  );
}

function AppointmentDetail({
  appointment: a,
  onApprove,
  onReject,
  onReschedule,
  onComplete,
  onCancel,
}: {
  appointment: Appointment;
  onApprove: (fd: FormData) => void;
  onReject: (fd: FormData) => void;
  onReschedule: (fd: FormData) => void;
  onComplete: (fd: FormData) => void;
  onCancel: (fd: FormData) => void;
}) {
  const [tab, setTab] = useState<"approve" | "reject" | "reschedule" | "complete">(
    a.status === "pending" ? "approve" : "reschedule",
  );
  return (
    <div className="px-7 py-6">
      <h2 className="display-font text-[24px] font-medium leading-tight text-navy-900">
        {a.customerName}
      </h2>
      <div className="mt-1 flex flex-wrap items-center gap-2 text-[12.5px] text-ink-500">
        <span
          className={cn(
            "rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-wide",
            STATUS_TONE[a.status],
          )}
        >
          {a.status}
        </span>
        <span className="font-mono">{a.reference}</span>
        <span>· {formatDateTime(a.createdAt)}</span>
      </div>

      <dl className="mt-7 grid grid-cols-2 gap-x-5 gap-y-4 text-[14px]">
        <Field label="Email" value={a.email} link={`mailto:${a.email}`} />
        <Field label="Phone" value={a.phone} link={`tel:${a.phone}`} />
        <Field label="Company" value={a.company ?? "—"} />
        <Field label="Service" value={a.serviceTitle ?? "—"} />
        <Field
          label="Requested date"
          value={`${new Date(a.requestedDate + "T00:00:00").toLocaleDateString(
            "en-IN",
            { weekday: "short", day: "numeric", month: "short", year: "numeric" },
          )} · ${HOURS_12(a.requestedTime)}`}
        />
        {a.proposedDate && a.proposedTime ? (
          <Field
            label="Proposed by TAE"
            value={`${new Date(a.proposedDate + "T00:00:00").toLocaleDateString(
              "en-IN",
              { weekday: "short", day: "numeric", month: "short", year: "numeric" },
            )} · ${HOURS_12(a.proposedTime)}`}
          />
        ) : (
          <Field label="Note" value={a.adminNote ?? "—"} />
        )}
      </dl>

      {a.message ? (
        <div className="mt-7 rounded-2xl border border-ink-900/5 bg-paper-deep p-5">
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
            Customer message
          </div>
          <p className="mt-2 text-[14.5px] leading-relaxed text-ink-900">
            {a.message}
          </p>
        </div>
      ) : null}

      {(a.history ?? []).length > 0 ? (
        <div className="mt-7 rounded-2xl border border-ink-900/5 bg-paper-deep p-5">
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
            Activity
          </div>
          <ul className="mt-3 space-y-3 text-[13.5px]">
            {(a.history as { at: string; action: string; note?: string }[]).map((h, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-navy-900" />
                <div>
                  <div className="font-medium text-navy-900">{h.action}</div>
                  {h.note ? (
                    <div className="text-ink-700">{h.note}</div>
                  ) : null}
                  <div className="text-[11.5px] text-ink-500">
                    {new Date(h.at).toLocaleString("en-IN")}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-8 grid grid-cols-4 gap-2 text-[12.5px]">
        {(
          [
            { v: "approve", l: "Approve" },
            { v: "reject", l: "Reject" },
            { v: "reschedule", l: "Reschedule" },
            { v: "complete", l: "Complete" },
          ] as const
        ).map((t) => (
          <button
            key={t.v}
            type="button"
            onClick={() => setTab(t.v)}
            className={cn(
              "rounded-full border px-3 py-2 font-medium transition",
              tab === t.v
                ? "border-navy-900 bg-navy-900 text-paper"
                : "border-ink-900/10 text-ink-700 hover:border-navy-900/30",
            )}
          >
            {t.l}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === "approve" ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
            <p className="text-[13.5px] text-ink-900">
              Approving confirms the appointment at the requested date/time.
            </p>
            <form
              className="mt-4"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData();
                fd.append("id", String(a.id));
                onApprove(fd);
              }}
            >
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-[13px] font-medium text-paper transition hover:bg-emerald-800"
              >
                <Check className="h-4 w-4" />
                Approve appointment
              </button>
            </form>
          </div>
        ) : null}

        {tab === "reject" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              fd.append("id", String(a.id));
              onReject(fd);
            }}
            className="rounded-2xl border border-red-200 bg-red-50/40 p-5"
          >
            <p className="text-[13.5px] text-ink-900">
              Provide a reason. Optionally suggest an alternative date/time —
              this will surface to the customer as a reschedule proposal.
            </p>
            <label className="mt-3 block text-[12.5px] font-medium text-navy-900">
              Reason
            </label>
            <textarea
              name="note"
              required
              rows={3}
              placeholder="e.g. That slot is unavailable — please find a better time."
              className="mt-1 w-full rounded-xl border border-ink-900/10 bg-paper px-4 py-3 text-[14px] outline-none focus:border-navy-900/40"
            />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12.5px] font-medium text-navy-900">
                  Suggested date (optional)
                </label>
                <input
                  type="date"
                  name="proposedDate"
                  className="mt-1 w-full rounded-xl border border-ink-900/10 bg-paper px-3 py-2 text-[14px] outline-none focus:border-navy-900/40"
                />
              </div>
              <div>
                <label className="block text-[12.5px] font-medium text-navy-900">
                  Suggested time (optional)
                </label>
                <input
                  type="time"
                  name="proposedTime"
                  className="mt-1 w-full rounded-xl border border-ink-900/10 bg-paper px-3 py-2 text-[14px] outline-none focus:border-navy-900/40"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-700 px-5 py-2.5 text-[13px] font-medium text-paper transition hover:bg-red-800"
            >
              Reject / propose alternative
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </form>
        ) : null}

        {tab === "reschedule" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              fd.append("id", String(a.id));
              onReschedule(fd);
            }}
            className="rounded-2xl border border-sky-200 bg-sky-50/40 p-5"
          >
            <p className="text-[13.5px] text-ink-900">
              Suggest an alternative date/time and tell the customer why.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12.5px] font-medium text-navy-900">
                  Proposed date
                </label>
                <input
                  required
                  type="date"
                  name="proposedDate"
                  defaultValue={a.proposedDate ?? a.requestedDate}
                  className="mt-1 w-full rounded-xl border border-ink-900/10 bg-paper px-3 py-2 text-[14px] outline-none focus:border-navy-900/40"
                />
              </div>
              <div>
                <label className="block text-[12.5px] font-medium text-navy-900">
                  Proposed time
                </label>
                <input
                  required
                  type="time"
                  name="proposedTime"
                  defaultValue={a.proposedTime ?? a.requestedTime}
                  className="mt-1 w-full rounded-xl border border-ink-900/10 bg-paper px-3 py-2 text-[14px] outline-none focus:border-navy-900/40"
                />
              </div>
            </div>
            <label className="mt-3 block text-[12.5px] font-medium text-navy-900">
              Note to customer
            </label>
            <textarea
              required
              name="note"
              rows={3}
              defaultValue={a.adminNote ?? ""}
              className="mt-1 w-full rounded-xl border border-ink-900/10 bg-paper px-4 py-3 text-[14px] outline-none focus:border-navy-900/40"
            />
            <button
              type="submit"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-sky-700 px-5 py-2.5 text-[13px] font-medium text-paper transition hover:bg-sky-800"
            >
              Send reschedule proposal
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </form>
        ) : null}

        {tab === "complete" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              fd.append("id", String(a.id));
              onComplete(fd);
            }}
            className="rounded-2xl border border-ink-900/10 bg-paper-deep/40 p-5"
          >
            <p className="text-[13.5px] text-ink-900">
              Mark this appointment as completed.
            </p>
            <label className="mt-3 block text-[12.5px] font-medium text-navy-900">
              Internal note (optional)
            </label>
            <textarea
              name="note"
              rows={2}
              className="mt-1 w-full rounded-xl border border-ink-900/10 bg-paper px-4 py-3 text-[14px] outline-none focus:border-navy-900/40"
            />
            <button
              type="submit"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-[13px] font-medium text-paper transition hover:bg-navy-800"
            >
              Mark as completed
              <Check className="h-4 w-4" />
            </button>
          </form>
        ) : null}
      </div>

      <div className="mt-8 border-t border-ink-900/5 pt-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData();
            fd.append("id", String(a.id));
            onCancel(fd);
          }}
        >
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full border border-red-300 px-5 py-2 text-[12.5px] font-medium text-red-700 transition hover:bg-red-50"
          >
            Cancel appointment
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  link,
}: {
  label: string;
  value: string;
  link?: string;
}) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
        {label}
      </dt>
      {link ? (
        <a
          href={link}
          className="mt-1 inline-block break-all text-ink-900 hover:text-navy-900"
        >
          {value}
        </a>
      ) : (
        <dd className="mt-1 text-ink-900">{value}</dd>
      )}
    </div>
  );
}
