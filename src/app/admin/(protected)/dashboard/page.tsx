import Link from "next/link";
import {
  CalendarCheck,
  Check,
  Sparkles,
  Users,
  Briefcase,
  Mail,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import {
  getDashboardStatsDetailed,
  listAppointments,
  listEnquiries,
} from "@/lib/data";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, appointments, enquiries] = await Promise.all([
    getDashboardStatsDetailed(),
    listAppointments(),
    listEnquiries(),
  ]);
  const recentAppts = appointments.slice(0, 6);
  const recentEnq = enquiries.slice(0, 5);

  return (
    <div className="mx-auto max-w-[1320px]">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-[0.22em] text-ink-500">
            Overview
          </span>
          <h1 className="display-font mt-2 text-[clamp(1.8rem,3.6vw,2.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-navy-900">
            Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/appointments"
            className="inline-flex items-center gap-2 rounded-full border border-ink-900/10 bg-paper px-5 py-2.5 text-[13px] font-medium text-ink-900 transition hover:bg-paper-deep"
          >
            <CalendarCheck className="h-4 w-4" />
            Appointments
          </Link>
          <Link
            href="/admin/portfolio"
            className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-[13px] font-medium text-paper transition hover:bg-navy-800"
          >
            Manage portfolio
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <StatCard
          label="Appointments"
          value={stats.appointments.total}
          icon={<CalendarCheck className="h-4 w-4" />}
        />
        <StatCard
          label="Pending"
          value={stats.appointments.pending}
          tone="amber"
          icon={<span className="block h-2 w-2 rounded-full bg-amber-500" />}
        />
        <StatCard
          label="Approved"
          value={stats.appointments.approved}
          tone="emerald"
          icon={<Check className="h-4 w-4" />}
        />
        <StatCard
          label="Rescheduled"
          value={stats.appointments.rescheduled}
          tone="sky"
          icon={<span className="block h-2 w-2 rounded-full bg-sky-500" />}
        />
        <StatCard
          label="Portfolio"
          value={stats.portfolio.total}
          icon={<Briefcase className="h-4 w-4" />}
        />
        <StatCard
          label="Services"
          value={stats.services.active}
          icon={<Sparkles className="h-4 w-4" />}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Link
          href="/admin/team"
          className="rounded-2xl border border-ink-900/5 bg-paper p-5 transition hover:border-navy-900/15"
        >
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-ink-500">
            Team members
            <Users className="h-3.5 w-3.5" />
          </div>
          <div className="mt-3 text-[34px] font-display text-navy-900">
            {stats.team.active}
          </div>
          <div className="text-[12.5px] text-ink-500">
            {stats.team.total} total · {stats.team.active} active
          </div>
        </Link>
        <Link
          href="/admin/enquiries"
          className="rounded-2xl border border-ink-900/5 bg-paper p-5 transition hover:border-navy-900/15"
        >
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-ink-500">
            Enquiries
            <Mail className="h-3.5 w-3.5" />
          </div>
          <div className="mt-3 text-[34px] font-display text-navy-900">
            {stats.enquiries.new}
          </div>
          <div className="text-[12.5px] text-ink-500">
            {stats.enquiries.new} new · {stats.enquiries.total} total
          </div>
        </Link>
        <div className="rounded-2xl border border-ink-900/5 bg-paper p-5">
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
            Quick actions
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <ActionLink href="/admin/portfolio">Add project</ActionLink>
            <ActionLink href="/admin/services">Add service</ActionLink>
            <ActionLink href="/admin/team">Add team member</ActionLink>
            <ActionLink href="/admin/blog">Add article</ActionLink>
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="rounded-2xl border border-ink-900/5 bg-paper lg:col-span-2">
          <div className="flex items-center justify-between border-b border-ink-900/5 px-6 py-4">
            <h2 className="display-font text-[16px] font-medium text-navy-900">
              Recent appointments
            </h2>
            <Link
              href="/admin/appointments"
              className="inline-flex items-center gap-1 text-[12.5px] text-ink-500 transition hover:text-navy-900"
            >
              View all
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {recentAppts.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-[14px] text-ink-500">
                No appointments yet.
              </p>
              <p className="mt-1 text-[12.5px] text-ink-400">
                Submissions from the booking page will appear here.
              </p>
            </div>
          ) : (
            <ul>
              {recentAppts.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between gap-3 border-b border-ink-900/5 px-6 py-4 last:border-b-0"
                >
                  <div className="min-w-0">
                    <div className="truncate text-[14px] font-medium text-navy-900">
                      {a.customerName}
                    </div>
                    <div className="truncate text-[12.5px] text-ink-500">
                      {a.serviceTitle ?? "—"} · {a.reference}
                    </div>
                  </div>
                  <div className="hidden text-right text-[12.5px] text-ink-500 sm:block">
                    {formatDateTime(a.createdAt)}
                  </div>
                  <StatusBadge status={a.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-2xl border border-ink-900/5 bg-paper">
          <div className="flex items-center justify-between border-b border-ink-900/5 px-6 py-4">
            <h2 className="display-font text-[16px] font-medium text-navy-900">
              Recent enquiries
            </h2>
            <Link
              href="/admin/enquiries"
              className="inline-flex items-center gap-1 text-[12.5px] text-ink-500 transition hover:text-navy-900"
            >
              View all
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {recentEnq.length === 0 ? (
            <div className="px-6 py-12 text-center text-[14px] text-ink-500">
              No enquiries yet.
            </div>
          ) : (
            <ul>
              {recentEnq.map((e) => (
                <li
                  key={e.id}
                  className="border-b border-ink-900/5 px-6 py-4 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[14px] font-medium text-navy-900">
                      {e.name}
                    </div>
                    <span className="rounded-full border border-ink-900/10 bg-paper px-2 py-0.5 text-[10px] uppercase tracking-wide text-ink-700">
                      {e.status}
                    </span>
                  </div>
                  <div className="mt-1 truncate text-[12.5px] text-ink-500">
                    {e.email}
                  </div>
                  <p className="mt-2 line-clamp-2 text-[13px] text-ink-700">
                    {e.message}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone?: "amber" | "emerald" | "sky";
}) {
  const toneClass =
    tone === "amber"
      ? "text-amber-600"
      : tone === "emerald"
        ? "text-emerald-600"
        : tone === "sky"
          ? "text-sky-600"
          : "text-ink-500";
  return (
    <div className="rounded-2xl border border-ink-900/5 bg-paper p-5">
      <div className={`flex items-center justify-between text-[11px] uppercase tracking-[0.18em] ${toneClass}`}>
        {label}
        {icon}
      </div>
      <div className="mt-3 font-display text-[34px] text-navy-900">{value}</div>
    </div>
  );
}

function ActionLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl bg-paper-deep px-3 py-2.5 text-[12.5px] font-medium text-ink-900 transition hover:bg-ink-200"
    >
      {children}
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "border-amber-300 bg-amber-50 text-amber-800",
    approved: "border-emerald-300 bg-emerald-50 text-emerald-800",
    rejected: "border-red-300 bg-red-50 text-red-800",
    rescheduled: "border-sky-300 bg-sky-50 text-sky-800",
    completed: "border-ink-900/20 bg-ink-100 text-navy-900",
    cancelled: "border-red-300 bg-red-50 text-red-800",
  };
  return (
    <span
      className={`rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-wide ${map[status] ?? "border-ink-900/10 bg-paper text-ink-700"}`}
    >
      {status}
    </span>
  );
}
