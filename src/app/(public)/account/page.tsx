"use client";

import { useEffect, useState } from "react";
import { AuthRequired } from "@/components/auth/auth-required";
import { useUserAuth } from "@/components/auth/user-auth-provider";

type Appointment = {
  reference: string;
  requestedDate: string;
  requestedTime: string;
  status: string;
  adminNote: string | null;
  proposedDate: string | null;
  proposedTime: string | null;
  googleMeetLink: string | null;
  meetingStatus: string;
  cancellationReason: string | null;
};

function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function formatTime(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "UTC",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(Date.UTC(2000, 0, 1, hour, minute)));
}

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-paper px-5 py-24">
      <div className="mx-auto max-w-2xl">
        <h1 className="display-font text-4xl font-medium text-navy-900">Your account</h1>
        <div className="mt-8">
          <AuthRequired>
            <AppointmentStatus />
          </AuthRequired>
        </div>
      </div>
    </main>
  );
}

function AppointmentStatus() {
  const { user, signOutUser } = useUserAuth();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    if (!user) return;
    let active = true;
    void user
      .getIdToken()
      .then(async (token) => {
        const response = await fetch("/api/account/appointment", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!active) return;
        if (!response.ok) {
          setError("Unable to load your appointment.");
        } else {
          const result = (await response.json()) as {
            appointment: Appointment | null;
          };
          setAppointment(result.appointment);
        }
        setLoading(false);
      })
      .catch(() => {
        if (active) {
          setError("Unable to load your appointment.");
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [user]);

  async function acceptReschedule() {
    if (!user || !appointment) return;
    setAccepting(true);
    setActionError("");
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/account/appointment", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ reference: appointment.reference }),
      });
      const result = (await response.json()) as {
        appointment?: Appointment;
        error?: string;
      };
      if (!response.ok || !result.appointment) {
        setActionError(result.error ?? "We could not accept this reschedule.");
        return;
      }
      setAppointment(result.appointment);
    } catch {
      setActionError("We could not reach the appointment service. Please retry.");
    } finally {
      setAccepting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-ink-900/5 bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] text-ink-600">{user?.email}</p>
        <button
          onClick={() => void signOutUser()}
          className="text-[13px] underline"
        >
          Sign out
        </button>
      </div>
      <h2 className="display-font mt-7 text-2xl font-medium text-navy-900">
        Appointment status
      </h2>
      {loading ? <p className="mt-4 text-ink-600">Loading…</p> : null}
      {error ? <p className="mt-4 text-red-700">{error}</p> : null}
      {!loading && !error && !appointment ? (
        <p className="mt-4 text-ink-600">You do not have an active appointment.</p>
      ) : null}
      {appointment ? (
        <div className="mt-4 rounded-xl bg-paper-deep p-5 text-[14px]">
          <p><strong>Reference:</strong> {appointment.reference}</p>
          <p className="mt-2"><strong>Status:</strong> {appointment.status}</p>
          <p className="mt-2">
            <strong>Requested:</strong> {formatDate(appointment.requestedDate)} at{" "}
            {formatTime(appointment.requestedTime)} IST (Asia/Kolkata)
          </p>
          {appointment.proposedDate && appointment.proposedTime ? (
            <div className="mt-4 rounded-xl border border-sky-200 bg-white p-4">
              <p className="font-medium text-navy-900">A new time has been proposed</p>
              <p className="mt-2">
                {formatDate(appointment.proposedDate)} at{" "}
                {formatTime(appointment.proposedTime)} IST (Asia/Kolkata)
              </p>
              {appointment.adminNote ? (
                <p className="mt-2 text-ink-700">{appointment.adminNote}</p>
              ) : null}
              <button
                type="button"
                disabled={accepting}
                onClick={() => void acceptReschedule()}
                className="mt-4 rounded-full bg-navy-900 px-5 py-2.5 text-[13px] font-medium text-paper disabled:opacity-60"
              >
                {accepting ? "Updating appointment…" : "Accept proposed time"}
              </button>
            </div>
          ) : null}
          {actionError ? (
            <p role="alert" className="mt-3 text-red-700">{actionError}</p>
          ) : null}
          {appointment.googleMeetLink ? (
            <a
              href={appointment.googleMeetLink}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-4 inline-block rounded-full bg-navy-900 px-5 py-2.5 text-[13px] font-medium text-paper"
            >
              Join on Google Meet
            </a>
          ) : appointment.meetingStatus === "failed" ? (
            <p className="mt-4 text-amber-800">
              The team is resolving a meeting setup issue.
            </p>
          ) : null}
          {appointment.cancellationReason ? (
            <p className="mt-3"><strong>Cancellation reason:</strong> {appointment.cancellationReason}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
