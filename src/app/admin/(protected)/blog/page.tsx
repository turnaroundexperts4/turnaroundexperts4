import { listAllPosts, listBlogCategories } from "@/lib/data";
import { BlogAdmin } from "@/app/admin/(protected)/blog/client";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BlogAdminPage() {
  const [posts, categories] = await Promise.all([
    listAllPosts(),
    listBlogCategories(),
  ]);
  return (
    <BlogAdmin
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      posts={posts.map(({ post, category }) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverUrl: post.coverUrl,
        categoryId: post.categoryId,
        categoryName: category?.name ?? null,
        tags: (post.tags ?? []) as string[],
        published: post.published,
        publishedAt: post.publishedAt
          ? formatDate(post.publishedAt)
          : null,
      }))}
    />
  );
}
