"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { updateFounder } from "@/lib/data";

async function guard() {
  if (!(await requireAdmin())) throw new Error("Unauthorized");
}

function parseList(raw: FormDataEntryValue | null): string[] {
  if (!raw) return [];
  return String(raw)
    .split(/\n|,/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function parseSocial(raw: FormDataEntryValue | null): { label: string; url: string }[] {
  if (!raw) return [];
  try {
    const j = JSON.parse(String(raw));
    if (Array.isArray(j)) return j;
  } catch {
    /* lines label|url */
  }
  return String(raw)
    .split("\n")
    .map((line) => {
      const [label, url] = line.split("|").map((x) => x.trim());
      return label && url ? { label, url } : null;
    })
    .filter(Boolean) as { label: string; url: string }[];
}

export async function saveFounder(formData: FormData) {
  await guard();
  const id = Number(formData.get("id"));
  if (!id) return { ok: false, error: "Missing id" };
  await updateFounder(id, {
    name: String(formData.get("name") ?? "").trim(),
    role: String(formData.get("role") ?? "").trim(),
    bio: String(formData.get("bio") ?? "").trim(),
    responsibilities: parseList(formData.get("responsibilities")),
    skills: parseList(formData.get("skills")),
    photoUrl: String(formData.get("photoUrl") ?? "").trim() || null,
    social: parseSocial(formData.get("social")),
    displayOrder: Number(formData.get("displayOrder") ?? 0),
    isPrimary: formData.get("isPrimary") === "on" || formData.get("isPrimary") === "true",
  });
  revalidatePath("/admin/founders");
  revalidatePath("/founders");
  revalidatePath("/");
  return { ok: true };
}
