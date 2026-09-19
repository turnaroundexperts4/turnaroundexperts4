import type { Metadata } from "next";
import { Eyebrow, Reveal } from "@/components/public/reveal";
import { PortfolioExplorer } from "@/components/public/portfolio-explorer";
import {
  listActivePortfolioCategories,
  listVisibleProjects,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Selected projects by TurnAround Experts — websites, webapps, ERP, e-commerce, management software and logo design.",
};

export default async function PortfolioPage() {
  const [categories, projects] = await Promise.all([
    listActivePortfolioCategories(),
    listVisibleProjects(),
  ]);
  const flatProjects = projects.map((p) => ({
    id: p.project.id,
    title: p.project.title,
    slug: p.project.slug,
    description: p.project.description,
    shortDescription: p.project.shortDescription ?? null,
    categoryId: p.project.categoryId,
    category: p.category
      ? { name: p.category.name, slug: p.category.slug }
      : null,
    thumbnailUrl: p.project.thumbnailUrl ?? null,
    imageUrls: (p.project.imageUrls ?? []) as string[],
    tags: (p.project.tags ?? []) as string[],
    client: p.project.client ?? null,
    year: p.project.year ?? null,
    projectUrl: p.project.projectUrl ?? null,
    featured: p.project.featured,
  }));

  return (
    <>
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-[1380px] px-5 md:px-10">
          <Reveal>
            <Eyebrow>Portfolio</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="display-font mt-6 max-w-3xl text-balance text-[clamp(2.4rem,5.6vw,4.8rem)] font-medium leading-[1.04] tracking-[-0.03em] text-navy-900">
              Explore selected work created by TAE.
            </h1>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-ink-700">
              A curated library of websites, web apps, ERP systems, e-commerce
              stores, management software and brand identities — built for
              clients across India.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-ink-900/5 bg-paper py-12 md:py-20">
        <div className="mx-auto max-w-[1380px] px-5 md:px-10">
          <PortfolioExplorer
            categories={categories}
            projects={flatProjects}
          />
        </div>
      </section>
    </>
  );
}
