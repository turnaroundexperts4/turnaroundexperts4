"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/brand/logo";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Founders", href: "/founders" },
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
  { label: "My account", href: "/account" },
];

export function PublicNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-ink-900/5 bg-paper/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1380px] items-center justify-between px-5 md:h-20 md:px-10">
        <Link
          href="/"
          aria-label="TurnAround Experts home"
          className="flex items-center gap-3"
        >
          <BrandLogo size={44} withWordmark />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 lg:flex"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm text-ink-700 transition hover:bg-ink-900/[0.04] hover:text-navy-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/book-appointment"
            className="group inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-navy-800"
          >
            Book a Consultation
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <button
          aria-label="Open menu"
          onClick={() => setOpen((o) => !o)}
          className="grid h-10 w-10 place-items-center rounded-full border border-ink-900/10 bg-paper/70 backdrop-blur lg:hidden"
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="border-t border-ink-900/5 bg-paper lg:hidden"
          >
            <div className="mx-auto max-w-[1380px] px-5 py-6">
              <nav
                aria-label="Mobile"
                className="grid grid-cols-1 gap-1"
              >
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-2xl border border-ink-900/5 bg-white px-5 py-4 text-ink-900"
                  >
                    <span className="text-[15px] font-medium">
                      {item.label}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-ink-500" />
                  </Link>
                ))}
                <Link
                  href="/book-appointment"
                  onClick={() => setOpen(false)}
                  className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-navy-900 px-5 py-4 text-[15px] font-medium text-paper"
                >
                  Book a Consultation
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
