import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow, Reveal } from "@/components/public/reveal";
import { listActiveServices } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services",
  description:
    "TAE services across consulting, technology, ERP, e-commerce, SEO and accounting.",
};

export default async function ServicesPage() {
  const services = await listActiveServices();

  return (
    <>
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-[1380px] px-5 md:px-10">
          <Reveal>
            <Eyebrow>Services</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="display-font mt-6 max-w-3xl text-balance text-[clamp(2.4rem,5.4vw,4.4rem)] font-medium leading-[1.05] tracking-[-0.03em] text-navy-900">
              Practices built for owners who measure.
            </h1>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-ink-700">
              Every service is structured to produce measurable outcomes —
              engagement models, not deliverables. Use them individually or
              together as a single programme.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-ink-900/5 bg-paper py-12 md:py-20">
        <div className="mx-auto max-w-[1380px] px-5 md:px-10">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {services.length === 0 ? (
              <Reveal>
                <div className="col-span-full rounded-2xl border border-ink-900/5 bg-paper-deep p-12 text-center">
                  <p className="text-[15px] text-ink-700">
                    No services published yet.
                  </p>
                  <p className="mt-1 text-[13px] text-ink-500">
                    Add services from the admin panel.
                  </p>
                </div>
              </Reveal>
            ) : (
              services.map((s, idx) => (
                <Reveal key={s.id} delay={idx * 0.04}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-ink-900/5 bg-white p-7 transition hover:border-navy-900/15 hover:shadow-[var(--shadow-elevation-md)]"
                  >
                    <div className="flex items-start justify-between">
                      <span className="grid h-12 w-12 place-items-center rounded-xl bg-paper text-navy-900 font-mono text-sm">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-ink-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-navy-900" />
                    </div>
                    <h2 className="display-font mt-8 text-[24px] font-medium leading-tight text-navy-900">
                      {s.title}
                    </h2>
                    {s.tagline ? (
                      <p className="mt-2 text-[14.5px] text-ink-500">
                        {s.tagline}
                      </p>
                    ) : null}
                    <p className="mt-5 line-clamp-3 text-[14.5px] leading-relaxed text-ink-700">
                      {s.description}
                    </p>
                    <ul className="mt-6 space-y-1.5 text-[13.5px] text-ink-700">
                      {Array.isArray(s.benefits)
                        ? (s.benefits as string[])
                            .slice(0, 2)
                            .map((b) => (
                              <li key={b} className="flex items-start gap-2">
                                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-navy-900" />
                                <span>{b}</span>
                              </li>
                            ))
                        : null}
                    </ul>
                    <div className="mt-auto flex items-center gap-2 pt-7 text-[13px] font-medium text-navy-900">
                      Explore service →
                    </div>
                  </Link>
                </Reveal>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="bg-navy-950 text-paper py-20 md:py-28 noise-overlay">
        <div className="relative z-10 mx-auto max-w-[1100px] px-5 text-center md:px-10">
          <Reveal>
            <h2 className="display-font mx-auto max-w-2xl text-balance text-[clamp(1.8rem,3.6vw,2.6rem)] font-medium leading-[1.1] tracking-[-0.02em] text-paper">
              Not sure which service fits?
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-5 max-w-xl text-[15.5px] leading-relaxed text-ink-300/85">
              Book a 30-minute consultation. We&apos;ll point you to the right
              engagement — even if it isn&apos;t with us.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <Link
              href="/book-appointment"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-paper px-7 py-3.5 text-[15px] font-medium text-navy-900 transition hover:bg-ink-100"
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
