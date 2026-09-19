import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Eyebrow, Reveal } from "@/components/public/reveal";
import { ProjectCarousel } from "@/components/public/project-carousel";
import { getProjectBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const row = await getProjectBySlug(slug);
  if (!row) return { title: "Project" };
  return {
    title: row.project.title,
    description:
      row.project.shortDescription ?? row.project.description.slice(0, 160),
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const row = await getProjectBySlug(slug);
  if (!row || !row.project.visible) return notFound();
  const images = (row.project.imageUrls ?? []) as string[];
  const tags = (row.project.tags ?? []) as string[];

  return (
    <article className="bg-paper">
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1380px] px-5 md:px-10">
          <Reveal>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-[13px] text-ink-500 transition hover:text-navy-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to portfolio
            </Link>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-12">
            <Reveal className="md:col-span-8">
              <Eyebrow>{row.category?.name ?? "Project"}</Eyebrow>
              <h1 className="display-font mt-5 text-balance text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[1.05] tracking-[-0.03em] text-navy-900">
                {row.project.title}
              </h1>
              {row.project.shortDescription ? (
                <p className="mt-5 text-[18px] leading-relaxed text-ink-700">
                  {row.project.shortDescription}
                </p>
              ) : null}
            </Reveal>
            <Reveal className="md:col-span-4" delay={0.08}>
              <div className="rounded-2xl border border-ink-900/5 bg-paper-deep p-6">
                <dl className="grid grid-cols-2 gap-4 text-[14px]">
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
                      Client
                    </dt>
                    <dd className="mt-1 text-ink-900">
                      {row.project.client ?? "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
                      Year
                    </dt>
                    <dd className="mt-1 text-ink-900">
                      {row.project.year ?? "—"}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
                      Category
                    </dt>
                    <dd className="mt-1 text-ink-900">
                      {row.category?.name ?? "Project"}
                    </dd>
                  </div>
                  {tags.length > 0 ? (
                    <div className="col-span-2">
                      <dt className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
                        Tags
                      </dt>
                      <dd className="mt-2 flex flex-wrap gap-1.5">
                        {tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-paper px-2.5 py-1 text-[12px] text-ink-700"
                          >
                            {t}
                          </span>
                        ))}
                      </dd>
                    </div>
                  ) : null}
                </dl>
                {row.project.projectUrl ? (
                  <a
                    href={row.project.projectUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy-900 px-5 py-3 text-[14px] font-medium text-paper transition hover:bg-navy-800"
                  >
                    Visit project
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-14" delay={0.1}>
            <ProjectCarousel
              images={
                images.length > 0
                  ? images
                  : row.project.thumbnailUrl
                    ? [row.project.thumbnailUrl]
                    : []
              }
              alt={row.project.title}
            />
          </Reveal>

          {row.project.description ? (
            <Reveal className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-12" delay={0.16}>
              <div className="md:col-span-3">
                <Eyebrow>Brief</Eyebrow>
              </div>
              <div className="md:col-span-9">
                <p className="text-[17px] leading-relaxed text-ink-900">
                  {row.project.description}
                </p>
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>
    </article>
  );
}
