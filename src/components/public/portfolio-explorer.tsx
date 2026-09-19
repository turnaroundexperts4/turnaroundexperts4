"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Category = { id: number; name: string; slug: string };
type Project = {
  id: number;
  title: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  categoryId: number;
  category: { name: string; slug: string } | null;
  thumbnailUrl: string | null;
  imageUrls: string[];
  tags: string[];
  client: string | null;
  year: number | null;
  projectUrl: string | null;
  featured?: boolean;
};

const SORT_OPTIONS = [
  { value: "recent", label: "Most recent" },
  { value: "name", label: "Alphabetical" },
  { value: "featured", label: "Featured first" },
];

export function PortfolioExplorer({
  categories,
  projects,
}: {
  categories: Category[];
  projects: Project[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = projects.filter((p) => {
      if (activeCategory !== "all" && p.category?.slug !== activeCategory)
        return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        (p.client ?? "").toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.category?.name ?? "").toLowerCase().includes(q) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    });
    if (sort === "name") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "featured") {
      list = [...list].sort(
        (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false),
      );
    }
    return list;
  }, [activeCategory, query, sort, projects]);

  const featured = filtered.filter((p) => p.featured).slice(0, 1)[0] ?? filtered[0];
  const rest = filtered.filter((p) => p.id !== featured?.id);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-3 rounded-full border border-ink-900/10 bg-white px-5 py-3.5 transition focus-within:border-navy-900/30">
          <Search className="h-4 w-4 text-ink-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, clients, categories, tags…"
            aria-label="Search portfolio"
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-ink-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <label
            htmlFor="sort"
            className="text-[12px] uppercase tracking-[0.18em] text-ink-500"
          >
            Sort
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-ink-900/10 bg-white px-4 py-2.5 text-[14px] text-ink-900 outline-none transition focus:border-navy-900/30"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category pills */}
      <div className="mt-6 -mx-2 flex gap-2 overflow-x-auto px-2 pb-2 scrollbar-thin">
        <FilterPill
          active={activeCategory === "all"}
          onClick={() => setActiveCategory("all")}
        >
          All
          <span className="ml-1.5 font-mono text-[11px] opacity-70">
            {projects.length}
          </span>
        </FilterPill>
        {categories.map((c) => {
          const count = projects.filter((p) => p.category?.slug === c.slug)
            .length;
          return (
            <FilterPill
              key={c.id}
              active={activeCategory === c.slug}
              onClick={() => setActiveCategory(c.slug)}
            >
              {c.name}
              <span className="ml-1.5 font-mono text-[11px] opacity-70">
                {count}
              </span>
            </FilterPill>
          );
        })}
      </div>

      <div className="mt-8 text-[13px] text-ink-500">
        {filtered.length} project{filtered.length === 1 ? "" : "s"}
        {activeCategory !== "all"
          ? ` in ${categories.find((c) => c.slug === activeCategory)?.name ?? activeCategory}`
          : ""}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-ink-900/5 bg-paper py-16 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-paper-deep text-ink-400">
            ✷
          </div>
          <h3 className="display-font text-[20px] text-navy-900">
            No projects match.
          </h3>
          <p className="mx-auto mt-2 max-w-md text-[14px] text-ink-500">
            Try a different keyword or category. Projects can be added from the
            admin panel.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {/* Featured / hero case study */}
          {featured ? (
            <FeaturedCaseStudy project={featured} />
          ) : null}

          {/* Grid of remaining projects with multi-image preview carousels */}
          {rest.length > 0 ? (
            <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {rest.map((p, idx) => (
                  <motion.li
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{
                      duration: 0.3,
                      delay: Math.min(idx * 0.03, 0.24),
                    }}
                  >
                    <CaseStudyCard project={p} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          ) : null}
        </div>
      )}
    </div>
  );
}

function FilterPill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-4 py-2 text-[13.5px] transition",
        active
          ? "border-navy-900 bg-navy-900 text-paper"
          : "border-ink-900/10 bg-paper text-ink-700 hover:border-navy-900/30 hover:text-navy-900",
      )}
    >
      {children}
    </button>
  );
}

function FeaturedCaseStudy({ project }: { project: Project }) {
  const images = collectImages(project);
  return (
    <article className="overflow-hidden rounded-3xl border border-ink-900/5 bg-white shadow-[var(--shadow-elevation-sm)]">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="relative lg:col-span-7">
          <ImageCarousel images={images} title={project.title} tall />
        </div>
        <div className="flex flex-col justify-between gap-8 p-7 md:p-10 lg:col-span-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-navy-900 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-paper">
                {project.category?.name ?? "Project"}
              </span>
              {project.featured ? (
                <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-navy-900">
                  Featured
                </span>
              ) : null}
              {project.year ? (
                <span className="text-[12px] text-ink-500">{project.year}</span>
              ) : null}
            </div>
            <h2 className="display-font mt-5 text-balance text-[clamp(1.7rem,3vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.02em] text-navy-900">
              {project.title}
            </h2>
            {project.client ? (
              <p className="mt-2 text-[13px] uppercase tracking-[0.16em] text-ink-500">
                {project.client}
              </p>
            ) : null}
            <p className="mt-5 text-[15.5px] leading-relaxed text-ink-700">
              {project.shortDescription ?? project.description}
            </p>
            {(project.tags ?? []).length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-1.5">
                {project.tags.slice(0, 6).map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-paper-deep px-2.5 py-1 text-[11.5px] text-ink-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/portfolio/${project.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-3 text-[14px] font-medium text-paper transition hover:bg-navy-800"
            >
              View case study
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            {project.projectUrl ? (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full border border-ink-900/15 px-5 py-3 text-[14px] font-medium text-ink-900 transition hover:bg-ink-900/[0.04]"
              >
                Visit live site
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {/* Thumbnail strip of remaining previews */}
      {images.length > 1 ? (
        <div className="border-t border-ink-900/5 bg-paper-deep/50 px-5 py-4 md:px-8">
          <div className="flex gap-3 overflow-x-auto scrollbar-thin">
            {images.slice(0, 6).map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-ink-900/5 bg-paper"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}

function CaseStudyCard({ project }: { project: Project }) {
  const images = collectImages(project);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-900/5 bg-white transition hover:border-navy-900/15 hover:shadow-[var(--shadow-elevation-md)]">
      <div className="relative">
        <ImageCarousel images={images} title={project.title} />
        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-paper/95 px-3 py-1 text-[11px] font-medium text-navy-900 backdrop-blur">
            {project.category?.name ?? "Project"}
          </span>
          {project.featured ? (
            <span className="rounded-full bg-navy-900/90 px-3 py-1 text-[11px] font-medium text-paper backdrop-blur">
              Featured
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="display-font text-[22px] font-medium leading-tight text-navy-900">
              {project.title}
            </h3>
            <p className="mt-1 text-[12.5px] text-ink-500">
              {project.client ? `${project.client}` : ""}
              {project.client && project.year ? " · " : ""}
              {project.year ?? ""}
            </p>
          </div>
        </div>
        <p className="line-clamp-2 text-[14px] leading-relaxed text-ink-700">
          {project.shortDescription ?? project.description}
        </p>
        {(project.tags ?? []).length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-full bg-paper-deep px-2.5 py-0.5 text-[11.5px] text-ink-700"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
          <Link
            href={`/portfolio/${project.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-navy-900 px-4 py-2 text-[13px] font-medium text-paper transition hover:bg-navy-800"
          >
            Case study
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          {project.projectUrl ? (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 rounded-full border border-ink-900/10 px-4 py-2 text-[13px] font-medium text-ink-900 transition hover:border-navy-900/30"
            >
              Live site
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function ImageCarousel({
  images,
  title,
  tall = false,
}: {
  images: string[];
  title: string;
  tall?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const list = images.length > 0 ? images : [];

  function go(delta: number) {
    if (list.length === 0) return;
    setIndex((i) => (i + delta + list.length) % list.length);
  }

  if (list.length === 0) {
    return (
      <div
        className={cn(
          "grid place-items-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 text-center",
          tall ? "aspect-[16/11] lg:aspect-auto lg:min-h-[480px]" : "aspect-[16/10]",
        )}
      >
        <div>
          <div className="font-display text-3xl text-paper/80">{title}</div>
          <div className="mt-2 text-[11px] uppercase tracking-[0.22em] text-paper/50">
            TAE Project
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-ink-100",
        tall ? "aspect-[16/11] lg:aspect-auto lg:min-h-[480px]" : "aspect-[16/10]",
      )}
    >
      <div
        className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {list.map((src, i) => (
          <div key={`${src}-${i}`} className="relative h-full w-full shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${title} preview ${i + 1}`}
              className="absolute inset-0 h-full w-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {list.length > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous preview"
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-paper/30 bg-paper/90 text-navy-900 backdrop-blur transition hover:bg-paper"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next preview"
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-paper/30 bg-paper/90 text-navy-900 backdrop-blur transition hover:bg-paper"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Preview ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-5 bg-paper" : "w-1.5 bg-paper/45 hover:bg-paper/70",
                )}
              />
            ))}
          </div>
          <div className="absolute bottom-3 right-3 rounded-full bg-navy-950/55 px-2.5 py-1 font-mono text-[11px] text-paper backdrop-blur">
            {index + 1}/{list.length}
          </div>
        </>
      ) : null}
    </div>
  );
}

function collectImages(p: Project): string[] {
  const urls = [...(p.imageUrls ?? [])];
  if (p.thumbnailUrl && !urls.includes(p.thumbnailUrl)) {
    urls.unshift(p.thumbnailUrl);
  }
  return urls.filter(Boolean);
}
