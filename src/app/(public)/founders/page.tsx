import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Eyebrow, Reveal } from "@/components/public/reveal";
import { listActiveTeam, listFounders } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Founders & Team",
  description:
    "Meet the founders and team of TurnAround Experts — leadership behind TAE's consulting, technology and digital practice.",
};

export default async function FoundersPage() {
  const [founders, team] = await Promise.all([listFounders(), listActiveTeam()]);
  const primary = founders.find((f) => f.isPrimary) ?? founders[0];
  const co = founders.find((f) => !f.isPrimary) ?? founders[1];

  return (
    <>
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-[1380px] px-5 md:px-10">
          <Reveal>
            <Eyebrow>Founders</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="display-font mt-6 max-w-3xl text-balance text-[clamp(2.4rem,5.4vw,4.6rem)] font-medium leading-[1.05] tracking-[-0.03em] text-navy-900">
              The two people behind TAE.
            </h1>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-ink-700">
              TAE was founded on a simple premise — that Indian businesses
              deserve access to strategy, technology and growth expertise
              comparable to large consultancies, without the overhead.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- Founder editorial layout ---------- */}
      {primary ? (
        <section className="border-t border-ink-900/5 bg-paper-deep py-20 md:py-28">
          <div className="mx-auto grid max-w-[1380px] grid-cols-1 gap-12 px-5 md:px-10 md:grid-cols-12">
            <Reveal className="md:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-ink-900/5 bg-paper">
                {primary.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={primary.photoUrl}
                    alt={primary.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-paper text-ink-400">
                    <span className="font-display text-[10rem]">
                      {primary.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </Reveal>
            <Reveal className="md:col-span-6 md:col-start-7" delay={0.08}>
              <div className="text-[11px] uppercase tracking-[0.22em] text-ink-500">
                Founder · {primary.role}
              </div>
              <h2 className="display-font mt-5 text-balance text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.06] tracking-[-0.02em] text-navy-900">
                {primary.name}
              </h2>
              <p className="mt-6 text-[17px] leading-relaxed text-ink-700">
                {primary.bio}
              </p>

              {(primary.responsibilities ?? []).length > 0 ? (
                <div className="mt-10">
                  <Eyebrow>Responsibilities</Eyebrow>
                  <ul className="mt-5 space-y-2.5 text-[15px] text-ink-900">
                    {(primary.responsibilities as string[]).map((r) => (
                      <li key={r} className="flex items-start gap-3">
                        <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-navy-900" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {(primary.skills ?? []).length > 0 ? (
                <div className="mt-8 flex flex-wrap gap-2">
                  {(primary.skills as string[]).map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-ink-900/10 bg-paper px-3 py-1.5 text-[12.5px] text-ink-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              ) : null}

              {(primary.social ?? []).length > 0 ? (
                <div className="mt-8 flex flex-wrap gap-3">
                  {(primary.social as { label: string; url: string }[]).map(
                    (s) => (
                      <a
                        key={s.label}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1.5 rounded-full bg-navy-900 px-4 py-2 text-[13px] font-medium text-paper transition hover:bg-navy-800"
                      >
                        {s.label}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    ),
                  )}
                </div>
              ) : null}
            </Reveal>
          </div>
        </section>
      ) : null}

      {co ? (
        <section className="border-t border-ink-900/5 bg-paper py-20 md:py-28">
          <div className="mx-auto grid max-w-[1380px] grid-cols-1 gap-12 px-5 md:px-10 md:grid-cols-12">
            <Reveal className="md:col-span-6 md:order-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-ink-900/5 bg-paper">
                {co.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={co.photoUrl}
                    alt={co.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-paper text-ink-400">
                    <span className="font-display text-[10rem]">
                      {co.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </Reveal>
            <Reveal className="md:col-span-6 md:order-1" delay={0.08}>
              <div className="text-[11px] uppercase tracking-[0.22em] text-ink-500">
                Co-founder · {co.role}
              </div>
              <h2 className="display-font mt-5 text-balance text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.06] tracking-[-0.02em] text-navy-900">
                {co.name}
              </h2>
              <p className="mt-6 text-[17px] leading-relaxed text-ink-700">
                {co.bio}
              </p>

              {(co.responsibilities ?? []).length > 0 ? (
                <div className="mt-10">
                  <Eyebrow>Responsibilities</Eyebrow>
                  <ul className="mt-5 space-y-2.5 text-[15px] text-ink-900">
                    {(co.responsibilities as string[]).map((r) => (
                      <li key={r} className="flex items-start gap-3">
                        <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-navy-900" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {(co.skills ?? []).length > 0 ? (
                <div className="mt-8 flex flex-wrap gap-2">
                  {(co.skills as string[]).map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-ink-900/10 bg-paper px-3 py-1.5 text-[12.5px] text-ink-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              ) : null}

              {(co.social ?? []).length > 0 ? (
                <div className="mt-8 flex flex-wrap gap-3">
                  {(co.social as { label: string; url: string }[]).map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 rounded-full bg-navy-900 px-4 py-2 text-[13px] font-medium text-paper transition hover:bg-navy-800"
                    >
                      {s.label}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              ) : null}
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* ---------- Team ---------- */}
      <section className="border-t border-ink-900/5 bg-paper-deep py-20 md:py-28">
        <div className="mx-auto max-w-[1380px] px-5 md:px-10">
          <Reveal>
            <Eyebrow>Team</Eyebrow>
            <h2 className="display-font mt-5 max-w-2xl text-balance text-[clamp(1.8rem,3.4vw,2.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-navy-900">
              The people who deliver the work.
            </h2>
          </Reveal>

          {team.length === 0 ? (
            <Reveal>
              <div className="mt-12 rounded-2xl border border-ink-900/5 bg-paper p-12 text-center">
                <p className="text-[15px] text-ink-700">
                  Team members will appear here once added from the admin
                  panel.
                </p>
              </div>
            </Reveal>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((m, idx) => (
                <Reveal key={m.id} delay={idx * 0.04}>
                  <article className="flex h-full overflow-hidden rounded-2xl border border-ink-900/5 bg-paper">
                    <div className="flex w-32 shrink-0 bg-paper-deep sm:w-40">
                      {m.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={m.photoUrl}
                          alt={m.name}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-ink-400">
                          <span className="font-display text-3xl">
                            {m.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-5">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
                        {m.role}
                      </div>
                      <h3 className="display-font text-[18px] font-medium text-navy-900">
                        {m.name}
                      </h3>
                      <p className="line-clamp-3 text-[13.5px] text-ink-700">
                        {m.bio}
                      </p>
                      {(m.skills ?? []).length > 0 ? (
                        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                          {(m.skills as string[]).slice(0, 3).map((s) => (
                            <span
                              key={s}
                              className="rounded-full bg-paper-deep px-2 py-0.5 text-[11px] text-ink-700"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}

          <Reveal className="mt-16">
            <Link
              href="/book-appointment"
              className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-6 py-3.5 text-[15px] font-medium text-paper transition hover:bg-navy-800"
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
