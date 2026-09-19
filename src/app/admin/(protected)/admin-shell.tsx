"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  Briefcase,
  Sparkles,
  Users,
  Crown,
  PenSquare,
  Clock,
  Mail,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/brand/logo";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/appointments", label: "Appointments", icon: Calendar },
  { href: "/admin/enquiries", label: "Enquiries", icon: Mail },
  { href: "/admin/availability", label: "Availability", icon: Clock },
  { href: "/admin/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/admin/services", label: "Services", icon: Sparkles },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/founders", label: "Founders", icon: Crown },
  { href: "/admin/blog", label: "Blog", icon: PenSquare },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

export function AdminShell({
  name,
  email,
  children,
}: {
  name: string;
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper text-ink-900">
      <div className="flex min-h-screen">
        <aside
          aria-label="Admin sidebar"
          className={cn(
            "fixed inset-y-0 left-0 z-40 hidden w-[260px] shrink-0 flex-col border-r border-ink-900/5 bg-paper-deep lg:flex",
          )}
        >
          <SidebarContent pathname={pathname} name={name} email={email} />
        </aside>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen ? (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-navy-950/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <motion.aside
                initial={{ x: -260 }}
                animate={{ x: 0 }}
                exit={{ x: -260 }}
                transition={{ type: "tween", duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
                className="absolute inset-y-0 left-0 w-[280px] border-r border-ink-900/5 bg-paper"
              >
                <SidebarContent
                  pathname={pathname}
                  name={name}
                  email={email}
                  onCloseMobile={() => setMobileOpen(false)}
                />
              </motion.aside>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="flex min-h-screen flex-1 flex-col lg:pl-[260px]">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink-900/5 bg-paper/85 px-5 backdrop-blur lg:hidden">
            <Link href="/admin/dashboard" className="text-[14px] font-semibold tracking-tight">
              TAE Admin
            </Link>
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((o) => !o)}
              className="grid h-10 w-10 place-items-center rounded-full border border-ink-900/10"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </header>

          <main className="flex-1 px-5 py-8 md:px-10 md:py-12">{children}</main>
        </div>
      </div>
    </div>
  );
}

function SidebarContent({
  pathname,
  name,
  email,
  onCloseMobile,
}: {
  pathname: string;
  name: string;
  email: string;
  onCloseMobile?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-ink-900/5 px-6 lg:h-20">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-3"
          onClick={onCloseMobile}
        >
          <BrandLogo size={40} withWordmark={false} markOnly />
          <div>
            <div className="text-[14px] font-semibold tracking-tight text-navy-900">
              TAE Admin
            </div>
            <div className="text-[10.5px] uppercase tracking-[0.18em] text-ink-500">
              TurnAround Experts
            </div>
          </div>
        </Link>
        {onCloseMobile ? null : (
          <Link
            href="/"
            target="_blank"
            className="hidden items-center gap-1 rounded-full bg-paper px-3 py-1.5 text-[11.5px] font-medium text-navy-900 transition hover:bg-ink-100 lg:inline-flex"
          >
            View site
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        )}
      </div>

      <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onCloseMobile}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] transition",
                    active
                      ? "bg-navy-900 text-paper"
                      : "text-ink-700 hover:bg-paper hover:text-navy-900",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-ink-900/5 p-4">
        <div className="rounded-2xl bg-paper p-4">
          <div className="text-[13px] font-medium text-navy-900">{name}</div>
          <div className="truncate text-[12px] text-ink-500">{email}</div>
          <form action="/admin/logout" method="post" className="mt-3">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-ink-900/10 bg-paper px-3 py-2 text-[12.5px] font-medium text-ink-900 transition hover:bg-paper-deep"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
