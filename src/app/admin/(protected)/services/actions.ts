"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createService, deleteService, updateService } from "@/lib/data";
import { slugify } from "@/lib/utils";

async function guard() {
  if (!(await requireAdmin())) throw new Error("Unauthorized");
}

function parseList(raw: FormDataEntryValue | null): string[] {
  if (!raw) return [];
  const s = String(raw);
  try {
    const j = JSON.parse(s);
    if (Array.isArray(j)) return j.map(String).filter(Boolean);
  } catch {
    /* fallthrough */
  }
  return s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

export async function saveService(formData: FormData) {
  await guard();
  const id = formData.get("id") ? Number(formData.get("id")) : undefined;
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "") || title);
  const tagline = String(formData.get("tagline") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim();
  const problem = String(formData.get("problem") ?? "").trim() || null;
  const approach = String(formData.get("approach") ?? "").trim() || null;
  const benefits = parseList(formData.get("benefits"));
  const cta = String(formData.get("cta") ?? "").trim() || null;
  const iconKey = String(formData.get("iconKey") ?? "").trim() || null;
  const active =
    formData.get("active") === "on" || formData.get("active") === "true";
  const displayOrder = Number(formData.get("displayOrder") ?? 0);
  if (!title || !description) return { ok: false, error: "Title and description required" };

  if (id) {
    await updateService(id, {
      title,
      slug,
      tagline,
      description,
      problem,
      approach,
      benefits,
      cta,
      iconKey,
      active,
      displayOrder,
    });
  } else {
    await createService({
      title,
      slug,
      tagline: tagline ?? undefined,
      description,
      problem: problem ?? undefined,
      approach: approach ?? undefined,
      benefits,
      cta: cta ?? undefined,
      iconKey: iconKey ?? undefined,
      active,
      displayOrder,
    });
  }
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
  return { ok: true };
}

export async function removeService(formData: FormData) {
  await guard();
  const id = Number(formData.get("id"));
  if (!id) return { ok: false };
  await deleteService(id);
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
  return { ok: true };
}
