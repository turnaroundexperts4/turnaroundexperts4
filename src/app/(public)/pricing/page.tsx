import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow, Reveal } from "@/components/public/reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Engagement Models",
  description:
    "How TAE engagements are priced — consultation, project-based, custom and retainer.",
};

const MODELS = [
  {
    name: "Consultation",
    price: "Per engagement",
    desc: "A focused 30–60 minute session for owners who need a quick second opinion.",
    bullets: [
      "One-off video or in-person meeting",
      "Written summary of observations",
      "Direction on next steps — even outside TAE",
    ],
    cta: "Book a consultation",
    href: "/book-appointment",
  },
  {
    name: "Project-Based",
    price: "Quoted per project",
    desc: "Defined scope, fixed timelines, agreed outcomes. Best for website, ERP and marketing builds.",
    bullets: [
      "Discovery → design → build → launch",
      "Fixed scope, fixed milestones",
      "Ownership of source, content and accounts",
    ],
    cta: "Start a project",
    href: "/contact",
    featured: true,
  },
  {
    name: "Custom Solutions",
    price: "By proposal",
    desc: "Multi-stakeholder or multi-phase programs — internal systems, transformations, AI workflow builds.",
    bullets: [
      "Structured discovery and design phase",
      "Phased delivery with checkpoints",
      "Executive-level reporting",
    ],
    cta: "Talk to us",
    href: "/contact",
  },
  {
    name: "Retainer / Ongoing",
    price: "Monthly retainer",
    desc: "Continuous support — marketing, SEO, hosting, ops support and access to the team.",
    bullets: [
      "Monthly capacity reserved for your business",
      "Roadmap-led planning each quarter",
      "Priority response on change requests",
    ],
    cta: "Discuss retainer",
    href: "/contact",
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-[1380px] px-5 md:px-10">
          <Reveal>
            <Eyebrow>Engagement Models</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="display-font mt-6 max-w-3xl text-balance text-[clamp(2.4rem,5.4vw,4.4rem)] font-medium leading-[1.05] tracking-[-0.03em] text-navy-900">
              Pricing shaped to the outcome, not the hour.
            </h1>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-ink-700">
              We don&apos;t publish flat rate cards because the work is
              structured around outcomes — not line items. Below are the
              engagement models we work in. Real numbers come after a short
              scoping conversation.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-ink-900/5 bg-paper-deep py-20 md:py-24">
        <div className="mx-auto max-w-[1380px] px-5 md:px-10">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {MODELS.map((m, idx) => (
              <Reveal key={m.name} delay={idx * 0.05}>
                <div
                  className={`relative flex h-full flex-col rounded-3xl border p-8 md:p-10 ${
                    m.featured
                      ? "border-navy-900 bg-navy-900 text-paper"
                      : "border-ink-900/5 bg-paper text-ink-900"
                  }`}
                >
                  {m.featured ? (
                    <span className="absolute right-6 top-6 rounded-full bg-paper px-3 py-1 text-[11px] font-medium text-navy-900">
                      Most common
                    </span>
                  ) : null}
                  <div
                    className={`text-[11px] uppercase tracking-[0.22em] ${
                      m.featured ? "text-ink-300/80" : "text-ink-500"
                    }`}
                  >
                    {m.name}
                  </div>
                  <div
                    className={`display-font mt-4 text-[32px] font-medium leading-tight ${
                      m.featured ? "text-paper" : "text-navy-900"
                    }`}
                  >
                    {m.price}
                  </div>
                  <p
                    className={`mt-4 max-w-md text-[15.5px] leading-relaxed ${
                      m.featured ? "text-ink-300/85" : "text-ink-700"
                    }`}
                  >
                    {m.desc}
                  </p>
                  <ul
                    className={`mt-8 space-y-2.5 text-[14.5px] ${
                      m.featured ? "text-paper" : "text-ink-900"
                    }`}
                  >
                    {m.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3">
                        <span
                          className={`mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                            m.featured ? "bg-paper" : "bg-navy-900"
                          }`}
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={m.href}
                    className={`mt-10 inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px] font-medium transition ${
                      m.featured
                        ? "bg-paper text-navy-900 hover:bg-ink-100"
                        : "bg-navy-900 text-paper hover:bg-navy-800"
                    }`}
                  >
                    {m.cta}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-950 text-paper py-20 md:py-28 noise-overlay">
        <div className="relative z-10 mx-auto max-w-[1100px] px-5 text-center md:px-10">
          <Reveal>
            <h2 className="display-font mx-auto max-w-3xl text-balance text-[clamp(1.8rem,3.4vw,2.6rem)] font-medium leading-[1.1] tracking-[-0.02em] text-paper">
              Want a clear quote for your business?
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-5 max-w-xl text-[15.5px] leading-relaxed text-ink-300/85">
              A 30-minute conversation is enough for us to give you a
              directional quote and a 90-day engagement plan.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <Link
              href="/book-appointment"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-paper px-7 py-3.5 text-[15px] font-medium text-navy-900 transition hover:bg-ink-100"
            >
              Book a Consultation
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
