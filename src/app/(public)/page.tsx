import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatedBackdrop } from "@/components/public/animated-backdrop";
import { Eyebrow, Reveal } from "@/components/public/reveal";
import { BrandLogo } from "@/components/brand/logo";
import {
  getSetting,
  listActiveServices,
  listAllProjects,
  listActiveTeam,
  listPublishedPosts,
  listFounders,
  listActivePortfolioCategories,
} from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { ServiceIcon } from "@/components/public/service-icon";

export const dynamic = "force-dynamic";

type Seo = {
  title: string;
  description: string;
  keywords: string[];
};
type Company = {
  name: string;
  short: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  website?: string;
  udyam?: string;
};

const PROBLEM_GRID = [
  {
    code: "01",
    title: "Inefficient operations",
    body: "Workloads pile up in spreadsheets, WhatsApp and disconnected tools. Reporting lags the business by weeks.",
  },
  {
    code: "02",
    title: "Weak digital presence",
    body: "Your website doesn't generate enquiries, your brand doesn't read as serious, and the team can't update it themselves.",
  },
  {
    code: "03",
    title: "Marketing without attribution",
    body: "Spend on ads and content without knowing what actually converts, or what's worth continuing.",
  },
  {
    code: "04",
    title: "Accounting and management chaos",
    body: "Books are late, cash-flow is a guess and the owner is making decisions on instinct.",
  },
  {
    code: "05",
    title: "Scalability bottlenecks",
    body: "What worked at ₹50L revenue collapses at ₹5Cr. Hiring, systems and reporting weren't built for the next stage.",
  },
  {
    code: "06",
    title: "Technology and tooling gaps",
    body: "Internal software doesn't fit the way your team actually works. You're paying for tools you don't use.",
  },
];

const PROCESS = [
  { step: "Understand", text: "We sit with you, walk the business and surface what's actually limiting growth." },
  { step: "Analyse", text: "Data, operations and finance — turned into a clear diagnosis you can act on." },
  { step: "Strategise", text: "A 90-day plan with owners, milestones and outcomes — not a deck that gathers dust." },
  { step: "Execute", text: "We build, ship and run alongside your team until the work is live and used." },
  { step: "Improve", text: "Measured against agreed outcomes. Refined. Scaled. The cycle continues." },
];

const WHY_TAE = [
  {
    title: "We work backwards from outcomes",
    body: "Every engagement starts with a small number of measurable results. Everything else — strategy, build, marketing — ladders up to them.",
  },
  {
    title: "We build systems, not artefacts",
    body: "Websites, internal tools and marketing are built as maintainable systems your team can run, not as one-time deliverables.",
  },
  {
    title: "Strategy, tech and execution — one team",
    body: "You work with a partner that can diagnose, design, build and operate — instead of coordinating three agencies.",
  },
  {
    title: "Transparent pricing and process",
    body: "Clear scope, clear commercials, clear ownership. No surprises after the contract is signed.",
  },
];

export default async function HomePage() {
  const [seo, company, services, allProjects, team, posts, founders, categories] =
    await Promise.all([
      getSetting<Seo>("seo", {
        title: "TurnAround Experts — Turning Challenges into Profits",
        description:
          "TAE helps businesses across India with technology, digital services and consulting.",
        keywords: [],
      }),
      getSetting<Company>("company", {
        name: "TurnAround Experts",
        short: "TAE",
        tagline: "Turning Challenges into Profits",
        phone: "+91 9512384715",
        email: "turnaroundexperts4@gmail.com",
        address: "Palanpur, Banaskantha, Gujarat, India",
        udyam: "UDYAM-GJ-04-0064063",
      }),
      listActiveServices(),
      listAllProjects(),
      listActiveTeam(),
      listPublishedPosts(),
      listFounders(),
      listActivePortfolioCategories(),
    ]);

  const featured = allProjects
    .filter((p) => p.project.visible && p.project.featured)
    .slice(0, 6);
  const projects = featured.length > 0 ? featured : allProjects.filter((p) => p.project.visible).slice(0, 6);
  const recentPosts = posts.slice(0, 3);
  const founder = founders[0];
  const coFounder = founders[1];
  const leadTeam = team.slice(0, 4);

  return (
    <>
      {/* ------------------------ HERO ------------------------ */}
      <section className="relative isolate overflow-hidden bg-navy-950 text-paper">
        <AnimatedBackdrop />

        <div className="relative z-10 mx-auto grid min-h-[88vh] max-w-[1380px] grid-cols-1 items-center gap-12 px-5 py-24 md:px-10 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Reveal>
              <div className="flex items-center gap-4">
                <BrandLogo size={56} markOnly withWordmark={false} inverted />
                <span className="text-[11px] uppercase tracking-[0.32em] text-ink-300/80">
                  {company.short} · {company.tagline}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h1
                className="display-font mt-8 max-w-4xl text-balance text-[clamp(2.6rem,5.6vw,5rem)] font-medium leading-[1.02] tracking-[-0.03em] text-paper"
              >
                We diagnose where the business loses money — and we build the fix.
              </h1>
            </Reveal>

            <Reveal delay={0.18}>
              <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-ink-300/90">
                TurnAround Experts (TAE) is a technology, digital and consulting
                studio based in Palanpur, Gujarat. We help owners and leadership
                teams across India untangle operations, ship serious software
                and turn strategy into measurable revenue.
              </p>
            </Reveal>

            <Reveal delay={0.28}>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  href="/book-appointment"
                  className="group inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3.5 text-[15px] font-medium text-navy-900 transition hover:bg-ink-100"
                >
                  Book a Consultation
                  <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link
                  href="/portfolio"
                  className="group inline-flex items-center gap-2 rounded-full border border-paper/15 px-6 py-3.5 text-[15px] font-medium text-paper/90 backdrop-blur transition hover:border-paper/30 hover:bg-paper/[0.06]"
                >
                  See selected work
                  <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.36}>
              <div className="mt-16 grid max-w-3xl grid-cols-2 gap-6 border-t border-paper/10 pt-8 text-[13px] text-ink-300/85 md:grid-cols-4">
                <div>
                  <div className="font-display text-2xl text-paper">10+</div>
                  <div className="mt-1 text-ink-300/70">categories of software built</div>
                </div>
                <div>
                  <div className="font-display text-2xl text-paper">Udyam</div>
                  <div className="mt-1 text-ink-300/70">registered · GJ-04</div>
                </div>
                <div>
                  <div className="font-display text-2xl text-paper">In-house</div>
                  <div className="mt-1 text-ink-300/70">strategy + engineering</div>
                </div>
                <div>
                  <div className="font-display text-2xl text-paper">India</div>
                  <div className="mt-1 text-ink-300/70">serving clients across</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------ TRUST / COMPANY INTRO ------------------------ */}
      <section className="border-b border-ink-900/5 bg-paper py-24 md:py-32">
        <div className="mx-auto grid max-w-[1380px] grid-cols-1 gap-12 px-5 md:px-10 md:grid-cols-12">
          <Reveal className="md:col-span-4">
            <Eyebrow>The company</Eyebrow>
            <h2 className="display-font mt-5 text-balance text-[clamp(1.8rem,3.4vw,2.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-navy-900">
              A serious partner for serious business problems.
            </h2>
          </Reveal>
          <Reveal className="md:col-span-7 md:col-start-6" delay={0.08}>
            <div className="space-y-5 text-[17px] leading-relaxed text-ink-700">
              <p>
                TAE was founded to give Indian SMEs access to the kind of
                strategy + technology partnership that larger companies take for
                granted — without the agency overhead and template work.
              </p>
              <p>
                We combine three practices under one roof:{" "}
                <span className="font-medium text-navy-900">consulting</span>,{" "}
                <span className="font-medium text-navy-900">technology</span> and{" "}
                <span className="font-medium text-navy-900">digital growth</span>.
                Engagements can start from a single diagnostic and grow into a
                full build-out of your internal systems and online presence.
              </p>
              <p>
                Our work is grounded in Palanpur, Gujarat and extends to clients
                across India — hospitality, retail, logistics, manufacturing,
                professional services and more.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------ WHAT WE SOLVE ------------------------ */}
      <section className="bg-paper-deep py-24 md:py-32">
        <div className="mx-auto max-w-[1380px] px-5 md:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <Eyebrow>What we solve</Eyebrow>
              <h2 className="display-font mt-5 max-w-2xl text-balance text-[clamp(1.8rem,3.4vw,2.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-navy-900">
                Symptoms we hear from owners every week.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-md text-[15px] text-ink-500">
                Each of these usually points back to a small number of
                structural causes. We find the cause, not just the symptom.
              </p>
            </Reveal>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROBLEM_GRID.map((p, idx) => (
              <Reveal key={p.code} delay={idx * 0.04}>
                <div className="group flex h-full flex-col rounded-2xl border border-ink-900/5 bg-paper p-7 transition hover:border-navy-900/20 hover:shadow-[var(--shadow-elevation-md)]">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-ink-500">
                    <span>{p.code}</span>
                    <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <h3 className="display-font mt-8 text-[22px] font-medium text-navy-900">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-700">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------ SERVICES ------------------------ */}
      <section className="bg-paper py-24 md:py-32">
        <div className="mx-auto max-w-[1380px] px-5 md:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <Eyebrow>Services</Eyebrow>
              <h2 className="display-font mt-5 max-w-xl text-balance text-[clamp(1.8rem,3.4vw,2.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-navy-900">
                Six practices. One team. Outcome-driven.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Link
                href="/services"
                className="group inline-flex items-center gap-2 text-[15px] font-medium text-navy-900"
              >
                View all services
                <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((s, idx) => (
              <Reveal key={s.id} delay={idx * 0.04}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink-900/5 bg-white p-7 transition hover:border-navy-900/15 hover:shadow-[var(--shadow-elevation-md)]"
                >
                  <div className="flex items-start justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-paper text-navy-900">
                      <ServiceIcon name={s.iconKey ?? "sparkle"} />
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-ink-400">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="display-font mt-8 text-[22px] font-medium text-navy-900">
                    {s.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-[14.5px] text-ink-500">
                    {s.tagline ?? ""}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-8">
                    <span className="text-[13px] text-ink-700">
                      {s.cta ?? "Talk to us"}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-navy-900 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------ WHY TAE ------------------------ */}
      <section className="bg-navy-950 text-paper py-24 md:py-32 noise-overlay">
        <div className="relative z-10 mx-auto max-w-[1380px] px-5 md:px-10">
          <Reveal>
            <Eyebrow>
              <span className="text-ink-300/80">Why TAE</span>
            </Eyebrow>
            <h2 className="display-font mt-5 max-w-3xl text-balance text-[clamp(1.8rem,3.6vw,3rem)] font-medium leading-[1.08] tracking-[-0.02em] text-paper">
              Built for owners who want the work to actually ship.
            </h2>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-paper/10 bg-paper/10 md:grid-cols-2">
            {WHY_TAE.map((w, idx) => (
              <Reveal key={w.title} delay={idx * 0.05}>
                <div className="h-full bg-navy-950 p-8 md:p-10">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-ink-300/70">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <h3 className="display-font mt-6 text-[22px] font-medium text-paper">
                    {w.title}
                  </h3>
                  <p className="mt-4 text-[15.5px] leading-relaxed text-ink-300/85">
                    {w.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------ PROCESS ------------------------ */}
      <section className="bg-paper py-24 md:py-32">
        <div className="mx-auto max-w-[1380px] px-5 md:px-10">
          <Reveal>
            <Eyebrow>Process</Eyebrow>
            <h2 className="display-font mt-5 max-w-2xl text-balance text-[clamp(1.8rem,3.4vw,2.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-navy-900">
              A clear path from diagnosis to outcome.
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-5">
            {PROCESS.map((p, idx) => (
              <Reveal key={p.step} delay={idx * 0.06}>
                <div className="group h-full rounded-2xl border border-ink-900/5 bg-white p-7 transition hover:border-navy-900/15 hover:shadow-[var(--shadow-elevation-sm)]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[12px] text-ink-400">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px flex-1 bg-ink-200" />
                  </div>
                  <h3 className="display-font mt-6 text-[20px] font-medium text-navy-900">
                    {p.step}
                  </h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-ink-700">
                    {p.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------ SELECTED WORK ------------------------ */}
      <section className="bg-paper-deep py-24 md:py-32">
        <div className="mx-auto max-w-[1380px] px-5 md:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <Eyebrow>Selected work</Eyebrow>
              <h2 className="display-font mt-5 max-w-xl text-balance text-[clamp(1.8rem,3.4vw,2.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-navy-900">
                Case studies from the TAE portfolio.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Link
                href="/portfolio"
                className="group inline-flex items-center gap-2 text-[15px] font-medium text-navy-900"
              >
                Explore the full portfolio
                <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>

          {projects.length === 0 ? (
            <Reveal>
              <div className="mt-14 rounded-2xl border border-ink-900/5 bg-paper p-12 text-center">
                <p className="text-[15px] text-ink-700">No portfolio projects yet.</p>
                <p className="mt-1 text-[13px] text-ink-500">
                  Add categories and projects from the admin panel.
                </p>
              </div>
            </Reveal>
          ) : (
            <div className="mt-14 space-y-5">
              {/* Featured large case study */}
              {projects[0] ? (
                <Reveal>
                  <HomeFeaturedProject
                    title={projects[0].project.title}
                    slug={projects[0].project.slug}
                    client={projects[0].project.client}
                    year={projects[0].project.year}
                    category={projects[0].category?.name ?? "Project"}
                    short={
                      projects[0].project.shortDescription ??
                      projects[0].project.description
                    }
                    images={
                      [
                        projects[0].project.thumbnailUrl,
                        ...((projects[0].project.imageUrls ?? []) as string[]),
                      ].filter(Boolean) as string[]
                    }
                    projectUrl={projects[0].project.projectUrl}
                  />
                </Reveal>
              ) : null}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {projects.slice(1, 5).map((p, idx) => {
                  const images = [
                    p.project.thumbnailUrl,
                    ...((p.project.imageUrls ?? []) as string[]),
                  ].filter(Boolean) as string[];
                  return (
                    <Reveal key={p.project.id} delay={idx * 0.05}>
                      <HomeCaseCard
                        title={p.project.title}
                        slug={p.project.slug}
                        client={p.project.client}
                        year={p.project.year}
                        category={p.category?.name ?? "Project"}
                        short={
                          p.project.shortDescription ?? p.project.description
                        }
                        images={images}
                        projectUrl={p.project.projectUrl}
                      />
                    </Reveal>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ------------------------ FOUNDERS PREVIEW ------------------------ */}
      {founder || coFounder ? (
        <section className="bg-paper py-24 md:py-32">
          <div className="mx-auto max-w-[1380px] px-5 md:px-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <Reveal>
                <Eyebrow>Leadership</Eyebrow>
                <h2 className="display-font mt-5 max-w-xl text-balance text-[clamp(1.8rem,3.4vw,2.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-navy-900">
                  The people behind TAE.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <Link
                  href="/founders"
                  className="group inline-flex items-center gap-2 text-[15px] font-medium text-navy-900"
                >
                  Meet the team
                  <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </Reveal>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-2">
              {[founder, coFounder].filter(Boolean).map((f, idx) => (
                <Reveal key={f!.id} delay={idx * 0.05}>
                  <Link
                    href="/founders"
                    className="group block overflow-hidden rounded-2xl border border-ink-900/5 bg-white transition hover:border-navy-900/15 hover:shadow-[var(--shadow-elevation-md)]"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-5">
                      <div className="relative aspect-square bg-paper-deep sm:aspect-auto sm:col-span-2">
                        {f!.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={f!.photoUrl}
                            alt={f!.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center bg-paper text-ink-400">
                            <span className="font-display text-6xl">{(f!.name || "?").charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-3 p-7 sm:col-span-3 sm:p-9">
                        <div className="text-[11px] uppercase tracking-[0.22em] text-ink-500">
                          {f!.role}
                        </div>
                        <h3 className="display-font text-[26px] font-medium leading-tight text-navy-900">
                          {f!.name}
                        </h3>
                        <p className="text-[14.5px] leading-relaxed text-ink-700">
                          {f!.bio}
                        </p>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ------------------------ TEAM PREVIEW ------------------------ */}
      {leadTeam.length > 0 ? (
        <section className="bg-paper-deep py-24 md:py-32">
          <div className="mx-auto max-w-[1380px] px-5 md:px-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <Reveal>
                <Eyebrow>Team</Eyebrow>
                <h2 className="display-font mt-5 max-w-xl text-balance text-[clamp(1.8rem,3.4vw,2.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-navy-900">
                  The people who deliver.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <Link
                  href="/founders"
                  className="group inline-flex items-center gap-2 text-[15px] font-medium text-navy-900"
                >
                  Meet the team
                  <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </Reveal>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {leadTeam.map((m, idx) => (
                <Reveal key={m.id} delay={idx * 0.04}>
                  <Link
                    href="/founders"
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-900/5 bg-paper transition hover:border-navy-900/15 hover:shadow-[var(--shadow-elevation-sm)]"
                  >
                    <div className="aspect-square bg-paper-deep">
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
                          <span className="font-display text-4xl">
                            {(m.name || "?").charAt(0)}
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
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ------------------------ INSIGHTS / BLOG PREVIEW ------------------------ */}
      {recentPosts.length > 0 ? (
        <section className="bg-paper py-24 md:py-32">
          <div className="mx-auto max-w-[1380px] px-5 md:px-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <Reveal>
                <Eyebrow>Insights</Eyebrow>
                <h2 className="display-font mt-5 max-w-xl text-balance text-[clamp(1.8rem,3.4vw,2.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-navy-900">
                  From the TAE desk.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <Link
                  href="/blog"
                  className="group inline-flex items-center gap-2 text-[15px] font-medium text-navy-900"
                >
                  Read the blog
                  <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </Reveal>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-3">
              {recentPosts.map((entry, idx) => (
                <Reveal key={entry.post.id} delay={idx * 0.04}>
                  <Link
                    href={`/blog/${entry.post.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-ink-900/5 bg-white p-6 transition hover:border-navy-900/15 hover:shadow-[var(--shadow-elevation-sm)]"
                  >
                    <div className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
                      {entry.category?.name ?? "Insights"} ·{" "}
                      {formatDate(entry.post.publishedAt ?? entry.post.createdAt)}
                    </div>
                    <h3 className="display-font mt-4 text-[20px] font-medium leading-tight text-navy-900">
                      {entry.post.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-[14.5px] text-ink-700">
                      {entry.post.excerpt ?? ""}
                    </p>
                    <div className="mt-auto flex items-center gap-2 pt-6 text-[13px] font-medium text-navy-900">
                      Read article
                      <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ------------------------ FINAL CTA ------------------------ */}
      <section className="bg-navy-950 text-paper py-24 md:py-32 noise-overlay">
        <div className="relative z-10 mx-auto max-w-[1100px] px-5 text-center md:px-10">
          <Reveal>
            <Eyebrow>
              <span className="text-ink-300/80">Book a consultation</span>
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="display-font mx-auto mt-6 max-w-3xl text-balance text-[clamp(2rem,4.4vw,3.6rem)] font-medium leading-[1.08] tracking-[-0.02em] text-paper">
              If your business needs a diagnosis and a plan — not another deck — let&apos;s talk.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-6 max-w-xl text-[15.5px] leading-relaxed text-ink-300/85">
              Book a 30-minute consultation. We&apos;ll review where you are, what&apos;s
              blocking the next stage of growth, and what a serious 90-day plan
              would look like.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                href="/book-appointment"
                className="inline-flex items-center gap-2 rounded-full bg-paper px-7 py-3.5 text-[15px] font-medium text-navy-900 transition hover:bg-ink-100"
              >
                Book a Consultation
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-paper/15 px-7 py-3.5 text-[15px] font-medium text-paper/90 transition hover:bg-paper/[0.06]"
              >
                Send an enquiry
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function HomeFeaturedProject({
  title,
  slug,
  client,
  year,
  category,
  short,
  images,
  projectUrl,
}: {
  title: string;
  slug: string;
  client: string | null;
  year: number | null;
  category: string;
  short: string;
  images: string[];
  projectUrl: string | null;
}) {
  const unique = Array.from(new Set(images)).slice(0, 4);
  const cover = unique[0];
  return (
    <article className="overflow-hidden rounded-3xl border border-ink-900/5 bg-white shadow-[var(--shadow-elevation-sm)]">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="relative aspect-[16/11] overflow-hidden bg-ink-100 lg:col-span-7 lg:aspect-auto lg:min-h-[420px]">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center bg-navy-900 text-paper">
              <span className="font-display text-3xl">{category}</span>
            </div>
          )}
          <span className="absolute left-4 top-4 rounded-full bg-paper/95 px-3 py-1 text-[11px] font-medium text-navy-900 backdrop-blur">
            {category}
          </span>
        </div>
        <div className="flex flex-col justify-between gap-6 p-7 md:p-10 lg:col-span-5">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
              Featured case study
              {year ? ` · ${year}` : ""}
            </div>
            <h3 className="display-font mt-3 text-balance text-[clamp(1.5rem,2.6vw,2.1rem)] font-medium leading-[1.1] text-navy-900">
              {title}
            </h3>
            {client ? (
              <p className="mt-2 text-[13px] text-ink-500">{client}</p>
            ) : null}
            <p className="mt-4 line-clamp-4 text-[15px] leading-relaxed text-ink-700">
              {short}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/portfolio/${slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-[13px] font-medium text-paper transition hover:bg-navy-800"
            >
              View case study
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            {projectUrl ? (
              <a
                href={projectUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full border border-ink-900/15 px-5 py-2.5 text-[13px] font-medium text-ink-900 transition hover:bg-ink-900/[0.04]"
              >
                Live site
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
      {unique.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto border-t border-ink-900/5 bg-paper-deep/40 px-5 py-3">
          {unique.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border border-ink-900/5 bg-paper"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function HomeCaseCard({
  title,
  slug,
  client,
  year,
  category,
  short,
  images,
  projectUrl,
}: {
  title: string;
  slug: string;
  client: string | null;
  year: number | null;
  category: string;
  short: string;
  images: string[];
  projectUrl: string | null;
}) {
  const unique = Array.from(new Set(images)).slice(0, 4);
  const cover = unique[0];
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-900/5 bg-white transition hover:border-navy-900/15 hover:shadow-[var(--shadow-elevation-md)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full place-items-center bg-navy-900 text-paper">
            <span className="font-display text-2xl">{category}</span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-paper/95 px-3 py-1 text-[11px] font-medium text-navy-900 backdrop-blur">
          {category}
        </span>
        {unique.length > 1 ? (
          <div className="absolute bottom-3 left-3 right-3 flex gap-1.5">
            {unique.slice(0, 4).map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="h-10 flex-1 overflow-hidden rounded-md border border-paper/40 bg-paper/30 backdrop-blur"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div>
          <h3 className="display-font text-[20px] font-medium leading-tight text-navy-900">
            {title}
          </h3>
          <p className="mt-1 text-[12.5px] text-ink-500">
            {client ? client : ""}
            {client && year ? " · " : ""}
            {year ?? ""}
          </p>
        </div>
        <p className="line-clamp-2 text-[14px] leading-relaxed text-ink-700">
          {short}
        </p>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <Link
            href={`/portfolio/${slug}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-navy-900 px-4 py-2 text-[13px] font-medium text-paper transition hover:bg-navy-800"
          >
            Case study
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          {projectUrl ? (
            <a
              href={projectUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 rounded-full border border-ink-900/10 px-4 py-2 text-[13px] font-medium text-ink-900 transition hover:border-navy-900/30"
            >
              Live site
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
