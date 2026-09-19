"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createPortfolioCategory,
  createProject,
  deletePortfolioCategory,
  deleteProject,
  updatePortfolioCategory,
  updateProject,
} from "@/lib/data";
import { slugify } from "@/lib/utils";
import { requireAdmin } from "@/lib/auth";

async function guard() {
  const s = await requireAdmin();
  if (!s) throw new Error("Unauthorized");
}

const ProjectSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  title: z.string().min(2).max(200),
  slug: z.string().max(220).optional().or(z.literal("")),
  categoryId: z.coerce.number().int().positive(),
  description: z.string().min(5),
  shortDescription: z.string().max(400).optional().or(z.literal("")),
  projectUrl: z.string().max(500).optional().or(z.literal("")),
  thumbnailUrl: z.string().max(500).optional().or(z.literal("")),
  imageUrls: z.string().optional().or(z.literal("")), // JSON
  tags: z.string().optional().or(z.literal("")), // comma or JSON
  client: z.string().max(200).optional().or(z.literal("")),
  year: z.coerce.number().int().min(1990).max(2100).optional().or(z.nan()),
  featured: z.coerce.boolean().optional(),
  visible: z.coerce.boolean().optional(),
  displayOrder: z.coerce.number().int().optional(),
});

function parseTags(raw?: string): string[] {
  if (!raw) return [];
  try {
    const j = JSON.parse(raw);
    if (Array.isArray(j)) return j.map(String).filter(Boolean);
  } catch {
    /* comma-separated */
  }
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function parseImages(raw?: string): string[] {
  if (!raw) return [];
  try {
    const j = JSON.parse(raw);
    if (Array.isArray(j)) return j.map(String).filter(Boolean);
  } catch {
    /* line-separated */
  }
  return raw
    .split(/\n|,/)
    .map((t) => t.trim())
    .filter(Boolean);
}

export async function saveProject(formData: FormData) {
  await guard();
  const featured = formData.get("featured") === "on" || formData.get("featured") === "true";
  const visible =
    formData.get("visible") === null
      ? true
      : formData.get("visible") === "on" || formData.get("visible") === "true";
  const parsed = ProjectSchema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    slug: formData.get("slug") ?? "",
    categoryId: formData.get("categoryId"),
    description: formData.get("description"),
    shortDescription: formData.get("shortDescription") ?? "",
    projectUrl: formData.get("projectUrl") ?? "",
    thumbnailUrl: formData.get("thumbnailUrl") ?? "",
    imageUrls: formData.get("imageUrls") ?? "",
    tags: formData.get("tags") ?? "",
    client: formData.get("client") ?? "",
    year: formData.get("year") || undefined,
    featured,
    visible,
    displayOrder: formData.get("displayOrder") || 0,
  });
  if (!parsed.success) {
    return { ok: false, error: "Please fill required fields correctly." };
  }
  const d = parsed.data;
  const slug = d.slug ? slugify(d.slug) : slugify(d.title);
  const imageUrls = parseImages(d.imageUrls);
  const tags = parseTags(d.tags);
  const year = Number.isFinite(d.year as number) ? (d.year as number) : undefined;

  if (d.id) {
    await updateProject(d.id, {
      title: d.title,
      slug,
      categoryId: d.categoryId,
      description: d.description,
      shortDescription: d.shortDescription || null,
      projectUrl: d.projectUrl || null,
      thumbnailUrl: d.thumbnailUrl || imageUrls[0] || null,
      imageUrls,
      tags,
      client: d.client || null,
      year: year ?? null,
      featured: d.featured ?? false,
      visible: d.visible ?? true,
      displayOrder: d.displayOrder ?? 0,
    });
  } else {
    await createProject({
      title: d.title,
      slug,
      categoryId: d.categoryId,
      description: d.description,
      shortDescription: d.shortDescription || undefined,
      projectUrl: d.projectUrl || undefined,
      thumbnailUrl: d.thumbnailUrl || imageUrls[0] || undefined,
      imageUrls,
      tags,
      client: d.client || undefined,
      year,
      featured: d.featured ?? false,
      visible: d.visible ?? true,
      displayOrder: d.displayOrder ?? 0,
    });
  }
  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  revalidatePath("/");
  return { ok: true };
}

export async function removeProject(formData: FormData) {
  await guard();
  const id = Number(formData.get("id"));
  if (!id) return { ok: false, error: "Invalid id" };
  await deleteProject(id);
  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  revalidatePath("/");
  return { ok: true };
}

export async function saveCategory(formData: FormData) {
  await guard();
  const id = formData.get("id") ? Number(formData.get("id")) : undefined;
  const name = String(formData.get("name") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const active =
    formData.get("active") === "on" || formData.get("active") === "true" || formData.get("active") === null;
  const displayOrder = Number(formData.get("displayOrder") ?? 0);
  if (!name) return { ok: false, error: "Name required" };
  const slug = slugRaw ? slugify(slugRaw) : slugify(name);
  if (id) {
    await updatePortfolioCategory(id, {
      name,
      slug,
      description: description || null,
      active,
      displayOrder,
    });
  } else {
    await createPortfolioCategory({
      name,
      slug,
      description: description || undefined,
      active,
      displayOrder,
    });
  }
  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  return { ok: true };
}

export async function removeCategory(formData: FormData) {
  await guard();
  const id = Number(formData.get("id"));
  if (!id) return { ok: false };
  await deletePortfolioCategory(id);
  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  return { ok: true };
}
