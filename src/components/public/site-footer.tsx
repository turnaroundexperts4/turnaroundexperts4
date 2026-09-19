import Link from "next/link";
import type { CSSProperties } from "react";
import { BrandLogo } from "@/components/brand/logo";

type SiteCompany = {
  name: string;
  short: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  website?: string;
  udyam?: string;
};

type SiteSocial = {
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
};

export function SiteFooter({
  company,
  social,
}: {
  company: SiteCompany;
  social: SiteSocial;
}) {
  const socialEntries: { label: string; url: string }[] = [];
  if (social.linkedin) socialEntries.push({ label: "LinkedIn", url: social.linkedin });
  if (social.twitter) socialEntries.push({ label: "Twitter", url: social.twitter });
  if (social.instagram) socialEntries.push({ label: "Instagram", url: social.instagram });
  if (social.facebook) socialEntries.push({ label: "Facebook", url: social.facebook });

  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-ink-900/10 bg-navy-950 text-paper noise-overlay">
      <div className="relative z-10 mx-auto max-w-[1380px] px-5 pb-10 pt-20 md:px-10 md:pt-28">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <BrandLogo size={52} withWordmark inverted />
            </div>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-300/90">
              {company.tagline}. We work with business owners across India on
              strategy, technology and operations — translating complexity into
              measurable outcomes.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-3 text-sm text-ink-300/90 sm:grid-cols-2">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-ink-300/60">
                  Phone
                </div>
                <a
                  className="mt-2 inline-block text-paper hover:text-accent-soft"
                  href={`tel:${company.phone.replace(/\s+/g, "")}`}
                >
                  {company.phone}
                </a>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-ink-300/60">
                  Email
                </div>
                <a
                  className="mt-2 inline-block text-paper hover:text-accent-soft break-all"
                  href={`mailto:${company.email}`}
                >
                  {company.email}
                </a>
              </div>
              <div className="sm:col-span-2">
                <div className="text-[11px] uppercase tracking-[0.18em] text-ink-300/60">
                  Office
                </div>
                <span className="mt-2 inline-block text-paper">
                  {company.address}
                </span>
              </div>
              {company.udyam ? (
                <div className="sm:col-span-2">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-ink-300/60">
                    Udyam Registration
                  </div>
                  <span className="mt-2 inline-block font-mono text-[13px] text-paper/95">
                    {company.udyam}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          <FooterColumn
            title="Company"
            items={[
              { label: "Home", href: "/" },
              { label: "Founders", href: "/founders" },
              { label: "Pricing", href: "/pricing" },
              { label: "Blog", href: "/blog" },
            ]}
          />
          <FooterColumn
            title="Work"
            items={[
              { label: "Services", href: "/services" },
              { label: "Portfolio", href: "/portfolio" },
              { label: "Book Appointment", href: "/book-appointment" },
              { label: "Contact", href: "/contact" },
            ]}
          />
          <div className="md:col-span-2">
            <FooterTitle>Connect</FooterTitle>
            <ul className="mt-5 space-y-2.5 text-sm text-ink-300/85">
              {socialEntries.length === 0 ? (
                <li className="text-ink-300/60">Configure social links in admin.</li>
              ) : (
                socialEntries.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 text-paper/90 hover:text-accent-soft"
                    >
                      {s.label}
                    </a>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -bottom-32 z-0 select-none"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            letterSpacing: "-0.04em",
            lineHeight: 0.8,
            color: "rgba(255,255,255,0.04)",
            fontSize: "clamp(120px, 22vw, 320px)",
          } as CSSProperties}
        >
          TurnAround
        </div>

        <div className="relative z-10 mt-20 flex flex-col-reverse items-start justify-between gap-6 border-t border-paper/10 pt-8 text-[12px] text-ink-300/70 md:flex-row md:items-center">
          <p>
            © {year} {company.name}. All rights reserved. Udyam{" "}
            <span className="text-paper/80">{company.udyam}</span>.
          </p>
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy" className="hover:text-paper">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-paper">
              Terms
            </Link>
            <a
              href={company.website || "#"}
              className="hover:text-paper"
              target="_blank"
              rel="noreferrer"
            >
              {company.website?.replace(/^https?:\/\//, "") || "turnaroundexperts.info"}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-[11px] uppercase tracking-[0.22em] text-ink-300/60">
      {children}
    </h4>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div className="md:col-span-2">
      <FooterTitle>{title}</FooterTitle>
      <ul className="mt-5 space-y-2.5 text-sm">
        {items.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              className="text-ink-300/90 transition hover:text-paper"
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
