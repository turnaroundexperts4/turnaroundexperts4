import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/public/reveal";
import { getPostBySlug } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const row = await getPostBySlug(slug);
  if (!row || !row.post.published) return { title: "Article" };
  return {
    title: row.post.title,
    description:
      row.post.excerpt ?? row.post.content.replace(/<[^>]+>/g, "").slice(0, 160),
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const row = await getPostBySlug(slug);
  if (!row || !row.post.published) return notFound();
  const { post, category } = row;
  const tags = (post.tags ?? []) as string[];

  return (
    <article className="bg-paper">
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[860px] px-5 md:px-10">
          <Reveal>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[13px] text-ink-500 transition hover:text-navy-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to blog
            </Link>
          </Reveal>
          <Reveal>
            <div className="mt-7 text-[11px] uppercase tracking-[0.22em] text-ink-500">
              {category?.name ?? "Insights"} ·{" "}
              {formatDate(post.publishedAt ?? post.createdAt)}
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="display-font mt-4 text-balance text-[clamp(2.2rem,5vw,3.6rem)] font-medium leading-[1.08] tracking-[-0.02em] text-navy-900">
              {post.title}
            </h1>
          </Reveal>
          {post.excerpt ? (
            <Reveal delay={0.12}>
              <p className="mt-6 text-[19px] leading-relaxed text-ink-700">
                {post.excerpt}
              </p>
            </Reveal>
          ) : null}
          {post.coverUrl ? (
            <Reveal delay={0.18}>
              <div className="mt-10 overflow-hidden rounded-2xl border border-ink-900/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.coverUrl}
                  alt={post.title}
                  className="h-auto w-full"
                />
              </div>
            </Reveal>
          ) : null}
          <Reveal delay={0.24}>
            <div className="prose prose-lg prose-headings:display-font prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-navy-900 prose-p:text-ink-900 prose-a:text-navy-900 prose-a:underline max-w-none mt-12 text-[17px] leading-relaxed text-ink-900">
              {post.content.split("\n\n").map((para, i) => {
                if (para.startsWith("## ")) {
                  return (
                    <h2 key={i} className="display-font mt-10 text-[24px] font-medium text-navy-900">
                      {para.slice(3)}
                    </h2>
                  );
                }
                if (para.startsWith("### ")) {
                  return (
                    <h3 key={i} className="display-font mt-8 text-[19px] font-medium text-navy-900">
                      {para.slice(4)}
                    </h3>
                  );
                }
                return (
                  <p key={i} className="my-5">
                    {para}
                  </p>
                );
              })}
            </div>
          </Reveal>
          {tags.length > 0 ? (
            <Reveal delay={0.32}>
              <div className="mt-12 flex flex-wrap gap-2 border-t border-ink-900/5 pt-8">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-paper-deep px-3 py-1 text-[12.5px] text-ink-700"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>
    </article>
  );
}
