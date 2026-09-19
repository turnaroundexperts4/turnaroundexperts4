import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow, Reveal } from "@/components/public/reveal";
import { listPublishedPosts } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights and field notes from TurnAround Experts.",
};

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const search = sp.q ?? "";
  const posts = await listPublishedPosts({ search });
  const [featured, ...rest] = posts;
  return (
    <>
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-[1380px] px-5 md:px-10">
          <Reveal>
            <Eyebrow>Insights</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="display-font mt-6 max-w-3xl text-balance text-[clamp(2.4rem,5.4vw,4.6rem)] font-medium leading-[1.05] tracking-[-0.03em] text-navy-900">
              From the TAE desk.
            </h1>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-ink-700">
              Field notes, brief essays and short case studies — useful
              thinking for owners, founders and operators.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-ink-900/5 bg-paper py-12">
        <div className="mx-auto max-w-[1380px] px-5 md:px-10">
          <form className="flex items-center gap-3 rounded-full border border-ink-900/10 bg-white px-5 py-3 transition focus-within:border-navy-900/30">
            <input
              type="search"
              name="q"
              defaultValue={search}
              placeholder="Search articles, tags, categories…"
              className="w-full bg-transparent text-[15px] outline-none placeholder:text-ink-400"
            />
            <button
              type="submit"
              className="rounded-full bg-navy-900 px-5 py-2 text-[13px] font-medium text-paper transition hover:bg-navy-800"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="bg-paper py-12 md:py-16">
        <div className="mx-auto max-w-[1380px] px-5 md:px-10">
          {posts.length === 0 ? (
            <Reveal>
              <div className="rounded-2xl border border-ink-900/5 bg-paper-deep py-16 text-center">
                <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-paper text-ink-400">
                  ✷
                </div>
                <h3 className="display-font text-[20px] text-navy-900">
                  No articles {search ? "match your search" : "published yet"}.
                </h3>
                <p className="mx-auto mt-2 max-w-md text-[14px] text-ink-500">
                  New writing will appear here as it&apos;s published from the admin
                  panel.
                </p>
              </div>
            </Reveal>
          ) : (
            <>
              {featured ? (
                <Reveal>
                  <Link
                    href={`/blog/${featured.post.slug}`}
                    className="group grid grid-cols-1 gap-10 overflow-hidden rounded-3xl border border-ink-900/5 bg-paper-deep md:grid-cols-2"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[360px]">
                      {featured.post.coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={featured.post.coverUrl}
                          alt={featured.post.title}
                          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center bg-paper text-ink-400">
                          <span className="font-display text-5xl">TAE</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center gap-4 p-7 md:p-12">
                      <div className="text-[11px] uppercase tracking-[0.22em] text-ink-500">
                        {featured.category?.name ?? "Insights"} ·{" "}
                        {formatDate(
                          featured.post.publishedAt ?? featured.post.createdAt,
                        )}
                      </div>
                      <h2 className="display-font text-balance text-[clamp(1.6rem,3vw,2.4rem)] font-medium leading-[1.1] text-navy-900">
                        {featured.post.title}
                      </h2>
                      {featured.post.excerpt ? (
                        <p className="text-[16px] text-ink-700">
                          {featured.post.excerpt}
                        </p>
                      ) : null}
                      <div className="mt-4 inline-flex items-center gap-2 text-[14px] font-medium text-navy-900">
                        Read article
                        <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ) : null}

              {rest.length > 0 ? (
                <div className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((p, idx) => (
                    <Reveal key={p.post.id} delay={idx * 0.04}>
                      <Link
                        href={`/blog/${p.post.slug}`}
                        className="group flex h-full flex-col rounded-2xl border border-ink-900/5 bg-paper p-6 transition hover:border-navy-900/15 hover:shadow-[var(--shadow-elevation-sm)]"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-paper-deep">
                          {p.post.coverUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.post.coverUrl}
                              alt={p.post.title}
                              loading="lazy"
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="mt-5 text-[11px] uppercase tracking-[0.18em] text-ink-500">
                          {p.category?.name ?? "Insights"} ·{" "}
                          {formatDate(
                            p.post.publishedAt ?? p.post.createdAt,
                          )}
                        </div>
                        <h3 className="display-font mt-3 text-[19px] font-medium leading-tight text-navy-900">
                          {p.post.title}
                        </h3>
                        {p.post.excerpt ? (
                          <p className="mt-2 line-clamp-3 text-[14px] text-ink-700">
                            {p.post.excerpt}
                          </p>
                        ) : null}
                        <div className="mt-auto flex items-center gap-2 pt-4 text-[13px] font-medium text-navy-900">
                          Read article →
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>
    </>
  );
}
