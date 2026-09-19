import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { Eyebrow, Reveal } from "@/components/public/reveal";
import { getServiceBySlug, listActiveServices } from "@/lib/data";
import { ServiceIcon } from "@/components/public/service-icon";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service" };
  return {
    title: service.title,
    description: service.tagline ?? service.description.slice(0, 160),
  };
}

export default async function ServiceDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return notFound();
  const all = await listActiveServices();
  const others = all.filter((s) => s.id !== service.id).slice(0, 3);
  const benefits = (service.benefits ?? []) as string[];

  return (
    <>
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-[1380px] px-5 md:px-10">
          <Reveal>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-[13px] text-ink-500 transition hover:text-navy-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All services
            </Link>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-12">
            <div className="md:col-span-8">
              <Reveal>
                <Eyebrow>Service</Eyebrow>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="display-font mt-6 text-balance text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[1.05] tracking-[-0.03em] text-navy-900">
                  {service.title}
                </h1>
              </Reveal>
              {service.tagline ? (
                <Reveal delay={0.16}>
                  <p className="mt-5 text-[18px] leading-relaxed text-ink-700">
                    {service.tagline}
                  </p>
                </Reveal>
              ) : null}
              <Reveal delay={0.24}>
                <p className="mt-7 max-w-2xl text-[16.5px] leading-relaxed text-ink-700">
                  {service.description}
                </p>
              </Reveal>
              <Reveal delay={0.32}>
                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <Link
                    href="/book-appointment"
                    className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-6 py-3.5 text-[15px] font-medium text-paper transition hover:bg-navy-800"
                  >
                    {service.cta ?? "Talk to us"}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/portfolio"
                    className="inline-flex items-center gap-2 rounded-full border border-ink-900/15 px-6 py-3.5 text-[15px] font-medium text-ink-900 transition hover:bg-ink-900/[0.04]"
                  >
                    See related work
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </Reveal>
            </div>
            <Reveal className="md:col-span-4" delay={0.16}>
              <div className="rounded-2xl border border-ink-900/5 bg-paper-deep p-7">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-paper text-navy-900">
                  <ServiceIcon name={service.iconKey ?? "sparkle"} />
                </span>
                <div className="mt-5 text-[11px] uppercase tracking-[0.22em] text-ink-500">
                  Engagement
                </div>
                <div className="mt-2 text-[15px] text-ink-900">
                  Project-based, with optional retainer
                </div>
                <div className="mt-5 text-[11px] uppercase tracking-[0.22em] text-ink-500">
                  Typical duration
                </div>
                <div className="mt-2 text-[15px] text-ink-900">4–12 weeks</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {service.problem ? (
        <section className="border-t border-ink-900/5 bg-paper py-20">
          <div className="mx-auto grid max-w-[1380px] grid-cols-1 gap-12 px-5 md:px-10 md:grid-cols-12">
            <Reveal className="md:col-span-4">
              <Eyebrow>The problem</Eyebrow>
              <h2 className="display-font mt-5 text-balance text-[clamp(1.6rem,3vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.02em] text-navy-900">
                What this addresses.
              </h2>
            </Reveal>
            <Reveal className="md:col-span-7 md:col-start-6" delay={0.08}>
              <p className="text-[17px] leading-relaxed text-ink-700">
                {service.problem}
              </p>
            </Reveal>
          </div>
        </section>
      ) : null}

      {service.approach ? (
        <section className="border-t border-ink-900/5 bg-paper-deep py-20">
          <div className="mx-auto grid max-w-[1380px] grid-cols-1 gap-12 px-5 md:px-10 md:grid-cols-12">
            <Reveal className="md:col-span-4">
              <Eyebrow>The approach</Eyebrow>
              <h2 className="display-font mt-5 text-balance text-[clamp(1.6rem,3vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.02em] text-navy-900">
                How we work.
              </h2>
            </Reveal>
            <Reveal className="md:col-span-7 md:col-start-6" delay={0.08}>
              <p className="text-[17px] leading-relaxed text-ink-700">
                {service.approach}
              </p>
            </Reveal>
          </div>
        </section>
      ) : null}

      {benefits.length > 0 ? (
        <section className="border-t border-ink-900/5 bg-paper py-20">
          <div className="mx-auto max-w-[1380px] px-5 md:px-10">
            <Reveal>
              <Eyebrow>What you walk away with</Eyebrow>
              <h2 className="display-font mt-5 max-w-2xl text-balance text-[clamp(1.6rem,3vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.02em] text-navy-900">
                Concrete outcomes, not deliverable jargon.
              </h2>
            </Reveal>
            <div className="mt-12 grid grid-cols-1 gap-3 md:grid-cols-2">
              {benefits.map((b, idx) => (
                <Reveal key={b} delay={idx * 0.04}>
                  <div className="flex h-full gap-4 rounded-2xl border border-ink-900/5 bg-paper-deep p-6">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-paper text-[12px] font-mono text-ink-500">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[15.5px] leading-relaxed text-ink-900">{b}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {others.length > 0 ? (
        <section className="border-t border-ink-900/5 bg-paper-deep py-20">
          <div className="mx-auto max-w-[1380px] px-5 md:px-10">
            <Reveal>
              <Eyebrow>Other services</Eyebrow>
            </Reveal>
            <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3">
              {others.map((o, idx) => (
                <Reveal key={o.id} delay={idx * 0.04}>
                  <Link
                    href={`/services/${o.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-ink-900/5 bg-white p-6 transition hover:border-navy-900/15 hover:shadow-[var(--shadow-elevation-sm)]"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-paper text-navy-900">
                      <ServiceIcon name={o.iconKey ?? "sparkle"} />
                    </span>
                    <h3 className="display-font mt-6 text-[18px] font-medium text-navy-900">
                      {o.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[13.5px] text-ink-500">
                      {o.tagline ?? ""}
                    </p>
                    <div className="mt-auto flex items-center gap-2 pt-6 text-[13px] font-medium text-navy-900">
                      Explore →
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
