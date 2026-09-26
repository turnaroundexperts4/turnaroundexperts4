import { listAppointments } from "@/lib/data";
import { AppointmentsManager } from "@/app/admin/(protected)/appointments/manager";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const all = await listAppointments();
  const normalized = all.map((a) => ({
    id: a.id,
    reference: a.reference,
    customerName: a.customerName,
    email: a.email,
    phone: a.phone,
    company: a.company ?? null,
    serviceId: a.serviceId ?? null,
    serviceTitle: a.serviceTitle ?? null,
    requestedDate: a.requestedDate,
    requestedTime: a.requestedTime,
    message: a.message ?? null,
    status: a.status,
    adminNote: a.adminNote ?? null,
    proposedDate: a.proposedDate ?? null,
    proposedTime: a.proposedTime ?? null,
    durationMinutes: a.durationMinutes,
    googleEventId: a.googleEventId ?? null,
    googleMeetLink: a.googleMeetLink ?? null,
    meetingStatus: a.meetingStatus,
    cancellationReason: a.cancellationReason ?? null,
    internalNote: a.internalNote ?? null,
    notificationStatus: a.notificationStatus,
    lastNotificationType: a.lastNotificationType ?? null,
    lastNotificationError: a.lastNotificationError ?? null,
    createdAt: a.createdAt,
    history: (a.history ?? []) as { at: string; action: string; note?: string }[],
  }));
  return (
    <AppointmentsManager
      appointments={normalized}
      statusFilter={sp.status ?? "all"}
      query={sp.q ?? ""}
    />
  );
}
