"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUserAuth } from "@/components/auth/user-auth-provider";

type Status = {
  reference: string;
  customerName: string;
  requestedDate: string;
  requestedTime: string;
  serviceTitle: string | null;
  status: string;
  proposedDate: string | null;
  proposedTime: string | null;
  adminNote: string | null;
  googleMeetLink: string | null;
  meetingStatus: string;
  cancellationReason: string | null;
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

export function AppointmentStatusViewer({
  initialReference,
}: {
  initialReference?: string;
}) {
  const [reference, setReference] = useState(initialReference ?? "");
  const [data, setData] = useState<Status | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserAuth();

  async function lookup(ref: string) {
    if (!ref) return;
    if (!user) {
      setError("Sign in to view your appointment.");
      return;
    }
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/appointments/${encodeURIComponent(ref)}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Not found");
      }
      const j = (await res.json()) as Status;
      setData(j);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't find that appointment reference.",
      );
    } finally {
      setLoading(false);
    }
  }

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (initialReference && user) {
      void lookup(initialReference);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialReference, user]);
  /* eslint-enable react-hooks/set-state-in-effect */

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    lookup(reference.trim().toUpperCase());
  }

  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="flex items-center gap-3 rounded-full border border-ink-900/10 bg-white px-5 py-3.5"
      >
        <Search className="h-4 w-4 text-ink-500" />
        <input
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="Enter reference (e.g. TAE-AB12CD-3F)"
          className="w-full bg-transparent text-[15px] outline-none placeholder:text-ink-400"
          aria-label="Appointment reference"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-navy-900 px-5 py-2 text-[13px] font-medium text-paper transition hover:bg-navy-800 disabled:opacity-60"
        >
          {loading ? "Looking up…" : "Check status"}
        </button>
      </form>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-[14px] text-red-800">
          {error}
        </div>
      ) : null}

      {data ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-2xl border border-ink-900/5 bg-white p-7"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-ink-500">
                Reference
              </div>
              <div className="mt-1 font-mono text-[15px] text-navy-900">
                {data.reference}
              </div>
            </div>
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-[12px] font-medium uppercase tracking-wide",
                STATUS_TONE[data.status] ?? "border-ink-900/10 bg-paper-deep",
              )}
            >
              {data.status}
            </span>
          </div>

          <dl className="mt-7 grid grid-cols-1 gap-x-8 gap-y-4 text-[14.5px] sm:grid-cols-2">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
                Customer
              </dt>
              <dd className="mt-1 text-navy-900">{data.customerName}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
                Service
              </dt>
              <dd className="mt-1 text-navy-900">
                {data.serviceTitle ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
                Requested date
              </dt>
              <dd className="mt-1 text-navy-900">
                {new Date(`${data.requestedDate}T00:00:00Z`).toLocaleDateString(
                  "en-IN",
                  {
                    timeZone: "UTC",
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  },
                )}{" "}
                · {HOURS_12(data.requestedTime)} IST (Asia/Kolkata)
              </dd>
            </div>
            {data.proposedDate && data.proposedTime ? (
              <div>
                <dt className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
                  Proposed by TAE
                </dt>
                <dd className="mt-1 text-navy-900">
                  {new Date(`${data.proposedDate}T00:00:00Z`).toLocaleDateString(
                    "en-IN",
                    {
                      timeZone: "UTC",
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    },
                  )}{" "}
                  · {HOURS_12(data.proposedTime)} IST (Asia/Kolkata)
                </dd>
              </div>
            ) : null}
          </dl>

          {data.adminNote ? (
            <div className="mt-7 rounded-xl border border-ink-900/5 bg-paper-deep p-5">
              <div className="text-[11px] uppercase tracking-[0.22em] text-ink-500">
                Note from the team
              </div>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-900">
                {data.adminNote}
              </p>
            </div>
          ) : null}

          {data.googleMeetLink ? (
            <a
              href={data.googleMeetLink}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-7 inline-flex rounded-full bg-navy-900 px-5 py-2.5 text-[13px] font-medium text-paper"
            >
              Join on Google Meet
            </a>
          ) : data.meetingStatus === "failed" ? (
            <p className="mt-5 text-[13px] text-amber-800">
              The team is resolving a meeting setup issue.
            </p>
          ) : null}
          {data.cancellationReason ? (
            <p className="mt-4 text-[13px] text-red-800">
              Cancellation reason: {data.cancellationReason}
            </p>
          ) : null}

          <div className="mt-7 rounded-xl border border-ink-900/5 bg-paper-deep p-5 text-[13.5px] leading-relaxed text-ink-700">
            <StatusExplainer status={data.status} />
          </div>

          <a
            href="/contact"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-[13px] font-medium text-paper transition hover:bg-navy-800"
          >
            Need to reach us?
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </motion.div>
      ) : null}
    </div>
  );
}

function StatusExplainer({ status }: { status: string }) {
  switch (status) {
    case "pending":
      return "We've received your request. The TAE team is reviewing and will follow up shortly.";
    case "approved":
      return "Your appointment is confirmed. Please add it to your calendar.";
    case "rescheduled":
      return "The team has proposed a different date/time. Please review the proposal in your account and accept it if it works for you.";
    case "rejected":
      return "We're unable to honour this request as submitted. If a new slot has been proposed, please review above.";
    case "completed":
      return "This appointment has been completed. Thank you for taking the time to meet with us.";
    case "cancelled":
      return "This appointment has been cancelled. Please book again at a time that suits you.";
    default:
      return "We have received your request. The TAE team will follow up by email.";
  }
}
