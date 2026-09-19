"use client";

import { useMemo, useState } from "react";
import { Search, Mail, Phone, Briefcase, Building2 } from "lucide-react";
import { updateEnquiry } from "@/app/admin/(protected)/enquiries/actions";
import { cn } from "@/lib/utils";

type Item = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  message: string;
  status: string;
  createdAt: string;
};

const STATUSES = ["new", "contacted", "in_progress", "closed"] as const;

const STATUS_TONE: Record<string, string> = {
  new: "border-amber-300 bg-amber-50 text-amber-800",
  contacted: "border-sky-300 bg-sky-50 text-sky-800",
  in_progress: "border-indigo-300 bg-indigo-50 text-indigo-800",
  closed: "border-emerald-300 bg-emerald-50 text-emerald-800",
};

export function EnquiriesClient({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState(initial);
  const [q, setQ] = useState("");
  const [active, setActive] = useState<Item | null>(null);

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    if (!text) return items;
    return items.filter((i) =>
      [i.name, i.email, i.phone ?? "", i.company ?? "", i.service ?? "", i.message]
        .join(" ")
        .toLowerCase()
        .includes(text),
    );
  }, [q, items]);

  async function setStatus(id: number, status: "new" | "contacted" | "in_progress" | "closed") {
    const fd = new FormData();
    fd.append("id", String(id));
    fd.append("status", status);
    setItems((arr) =>
      arr.map((i) => (i.id === id ? { ...i, status } : i)),
    );
    await updateEnquiry(fd);
  }

  return (
    <div className="mx-auto max-w-[1320px]">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-[0.22em] text-ink-500">
            Enquiries
          </span>
          <h1 className="display-font mt-2 text-[clamp(1.8rem,3.6vw,2.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-navy-900">
            Customer enquiries
          </h1>
        </div>
      </header>

      <div className="mt-6 flex items-center gap-3 rounded-full border border-ink-900/10 bg-paper px-5 py-3">
        <Search className="h-4 w-4 text-ink-500" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search enquiries…"
          className="w-full bg-transparent text-[14.5px] outline-none placeholder:text-ink-400"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-ink-900/5 bg-paper py-16 text-center">
          <Mail className="mx-auto h-7 w-7 text-ink-400" />
          <h3 className="display-font mt-3 text-[20px] text-navy-900">
            No enquiries found.
          </h3>
          <p className="mx-auto mt-2 max-w-md text-[14px] text-ink-500">
            Contact-form submissions from the public site will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-ink-900/5 bg-paper">
          <div className="hidden border-b border-ink-900/5 bg-paper-deep px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-ink-500 md:grid md:grid-cols-12">
            <div className="md:col-span-4">From</div>
            <div className="md:col-span-5">Message</div>
            <div className="md:col-span-2">Service</div>
            <div className="md:col-span-1 text-right">Status</div>
          </div>
          <ul>
            {filtered.map((e) => (
              <li
                key={e.id}
                className="grid cursor-pointer grid-cols-1 gap-2 border-b border-ink-900/5 px-6 py-4 text-[14px] last:border-b-0 hover:bg-paper-deep md:grid-cols-12 md:items-center"
                onClick={() => setActive(e)}
              >
                <div className="md:col-span-4">
                  <div className="font-medium text-navy-900">{e.name}</div>
                  <div className="text-[12.5px] text-ink-500">
                    {e.email}
                    {e.phone ? ` · ${e.phone}` : ""}
                  </div>
                </div>
                <div className="line-clamp-2 text-ink-700 md:col-span-5">
                  {e.message}
                </div>
                <div className="text-[12.5px] text-ink-500 md:col-span-2">
                  {e.service ?? "—"}
                </div>
                <div className="md:col-span-1 md:text-right">
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-wide",
                      STATUS_TONE[e.status] ?? "border-ink-900/10",
                    )}
                  >
                    {e.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {active ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-navy-950/40 p-5 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <div
            className="w-full max-w-[640px] overflow-hidden rounded-2xl border border-ink-900/5 bg-paper"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-ink-900/5 bg-paper-deep px-6 py-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
                Enquiry from {active.createdAt}
              </div>
              <h2 className="display-font mt-1 text-[20px] text-navy-900">
                {active.name}
              </h2>
            </div>
            <div className="space-y-3 p-6 text-[14px]">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 rounded-xl border border-ink-900/5 bg-paper-deep p-3">
                  <Mail className="h-4 w-4 text-ink-500" />
                  <a
                    href={`mailto:${active.email}`}
                    className="truncate text-navy-900"
                  >
                    {active.email}
                  </a>
                </div>
                {active.phone ? (
                  <div className="flex items-center gap-2 rounded-xl border border-ink-900/5 bg-paper-deep p-3">
                    <Phone className="h-4 w-4 text-ink-500" />
                    <a href={`tel:${active.phone}`} className="text-navy-900">
                      {active.phone}
                    </a>
                  </div>
                ) : null}
                {active.company ? (
                  <div className="flex items-center gap-2 rounded-xl border border-ink-900/5 bg-paper-deep p-3">
                    <Building2 className="h-4 w-4 text-ink-500" />
                    <span className="text-navy-900">{active.company}</span>
                  </div>
                ) : null}
                {active.service ? (
                  <div className="flex items-center gap-2 rounded-xl border border-ink-900/5 bg-paper-deep p-3">
                    <Briefcase className="h-4 w-4 text-ink-500" />
                    <span className="text-navy-900">{active.service}</span>
                  </div>
                ) : null}
              </div>
              <div className="rounded-xl border border-ink-900/5 bg-paper-deep p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
                  Message
                </div>
                <p className="mt-2 whitespace-pre-line text-[14.5px] leading-relaxed text-ink-900">
                  {active.message}
                </p>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
                  Set status
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={async () => {
                        await setStatus(active.id, s);
                        setActive({ ...active, status: s });
                      }}
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition",
                        active.status === s
                          ? "border-navy-900 bg-navy-900 text-paper"
                          : "border-ink-900/10 bg-paper text-ink-700 hover:border-navy-900/30",
                      )}
                    >
                      {s.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  className="rounded-full border border-ink-900/10 px-5 py-2 text-[13px] font-medium text-ink-900 transition hover:bg-paper-deep"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
