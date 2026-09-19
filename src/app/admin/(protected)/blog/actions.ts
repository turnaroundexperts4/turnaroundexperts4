"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import {
  createPost,
  deletePost,
  listBlogCategories,
  updatePost,
} from "@/lib/data";
import { slugify } from "@/lib/utils";

async function guard() {
  if (!(await requireAdmin())) throw new Error("Unauthorized");
}

function parseTags(raw: FormDataEntryValue | null): string[] {
  if (!raw) return [];
  return String(raw)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export async function savePost(formData: FormData) {
  await guard();
  const id = formData.get("id") ? Number(formData.get("id")) : undefined;
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "") || title);
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "").trim();
  const coverUrl = String(formData.get("coverUrl") ?? "").trim() || null;
  if (coverUrl && coverUrl.length > 500) {
    return { ok: false, error: "Cover image URL is too long." };
  }
  const categoryIdRaw = formData.get("categoryId");
  const categoryId =
    categoryIdRaw && String(categoryIdRaw) !== ""
      ? Number(categoryIdRaw)
      : null;
  const tags = parseTags(formData.get("tags"));
  const published =
    formData.get("published") === "on" ||
    formData.get("published") === "true";
  if (!title || !content) return { ok: false, error: "Title and content required" };

  if (id) {
    await updatePost(id, {
      title,
      slug,
      excerpt,
      content,
      coverUrl,
      categoryId,
      tags,
      published,
      publishedAt: published ? new Date() : null,
    });
  } else {
    await createPost({
      title,
      slug,
      excerpt: excerpt ?? undefined,
      content,
      coverUrl: coverUrl ?? undefined,
      categoryId: categoryId ?? undefined,
      tags,
      published,
      publishedAt: published ? new Date() : null,
    });
  }
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/");
  return { ok: true };
}

export async function removePost(formData: FormData) {
  await guard();
  const id = Number(formData.get("id"));
  if (!id) return { ok: false };
  await deletePost(id);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/");
  return { ok: true };
}

export async function getCategories() {
  return listBlogCategories();
}
