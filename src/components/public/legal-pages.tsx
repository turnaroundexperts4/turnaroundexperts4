import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Eyebrow, Reveal } from "@/components/public/reveal";

export function LegalPage({
  title,
  description,
  backHref = "/",
  backLabel = "Home",
  sections,
}: {
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
  sections: { heading: string; body: string }[];
}) {
  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-[860px] px-5 md:px-10">
        <Reveal>
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-[13px] text-ink-500 transition hover:text-navy-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {backLabel}
          </Link>
        </Reveal>
        <Reveal delay={0.06}>
          <h1 className="display-font mt-6 text-balance text-[clamp(2rem,4.4vw,3.2rem)] font-medium leading-[1.1] tracking-[-0.02em] text-navy-900">
            {title}
          </h1>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-5 text-[16px] leading-relaxed text-ink-700">
            {description}
          </p>
        </Reveal>
        <div className="mt-12 space-y-10">
          {sections.map((s, idx) => (
            <Reveal key={s.heading} delay={idx * 0.04}>
              <h2 className="display-font text-[22px] font-medium text-navy-900">
                {s.heading}
              </h2>
              <p className="mt-3 text-[16px] leading-relaxed text-ink-700">
                {s.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
