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
};

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-paper px-5 py-24">
      <div className="mx-auto max-w-2xl">
        <h1 className="display-font text-4xl font-medium text-navy-900">Your account</h1>
        <div className="mt-8"><AuthRequired><AppointmentStatus /></AuthRequired></div>
      </div>
    </main>
  );
}

function AppointmentStatus() {
  const { user, signOutUser } = useUserAuth();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    let active = true;
    void user.getIdToken().then(async (token) => {
      const response = await fetch("/api/account/appointment", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!active) return;
      if (!response.ok) setError("Unable to load your appointment.");
      else setAppointment((await response.json()).appointment);
      setLoading(false);
    }).catch(() => {
      if (active) { setError("Unable to load your appointment."); setLoading(false); }
    });
    return () => { active = false; };
  }, [user]);

  return (
    <div className="rounded-2xl border border-ink-900/5 bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] text-ink-600">{user?.email}</p>
        <button onClick={() => void signOutUser()} className="text-[13px] underline">Sign out</button>
      </div>
      <h2 className="display-font mt-7 text-2xl font-medium text-navy-900">Appointment status</h2>
      {loading ? <p className="mt-4 text-ink-600">Loading…</p> : null}
      {error ? <p className="mt-4 text-red-700">{error}</p> : null}
      {!loading && !error && !appointment ? <p className="mt-4 text-ink-600">You do not have an active appointment.</p> : null}
      {appointment ? (
        <div className="mt-4 rounded-xl bg-paper-deep p-5 text-[14px]">
          <p><strong>Reference:</strong> {appointment.reference}</p>
          <p className="mt-2"><strong>Status:</strong> {appointment.status}</p>
          <p className="mt-2"><strong>Requested:</strong> {appointment.requestedDate} at {appointment.requestedTime}</p>
          {appointment.proposedDate ? <p className="mt-2"><strong>Proposed:</strong> {appointment.proposedDate} at {appointment.proposedTime}</p> : null}
          {appointment.adminNote ? <p className="mt-2"><strong>Note:</strong> {appointment.adminNote}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
