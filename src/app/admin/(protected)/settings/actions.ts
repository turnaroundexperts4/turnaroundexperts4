"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { setSetting } from "@/lib/data";

async function guard() {
  if (!(await requireAdmin())) throw new Error("Unauthorized");
}

export async function saveSettings(formData: FormData) {
  await guard();
  await setSetting("company", {
    name: String(formData.get("name") ?? "TurnAround Experts"),
    short: String(formData.get("short") ?? "TAE"),
    tagline: String(
      formData.get("tagline") ?? "Turning Challenges into Profits",
    ),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    address: String(formData.get("address") ?? ""),
    website: String(formData.get("website") ?? ""),
    udyam: String(formData.get("udyam") ?? ""),
  });
  await setSetting("social", {
    linkedin: String(formData.get("linkedin") ?? ""),
    instagram: String(formData.get("instagram") ?? ""),
    twitter: String(formData.get("twitter") ?? ""),
    facebook: String(formData.get("facebook") ?? ""),
  });
  await setSetting("seo", {
    title: String(formData.get("seoTitle") ?? ""),
    description: String(formData.get("seoDescription") ?? ""),
    keywords: String(formData.get("seoKeywords") ?? "")
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
  });
  await setSetting("booking", {
    minLeadDays: Number(formData.get("minLeadDays") ?? 1),
    maxLeadDays: Number(formData.get("maxLeadDays") ?? 60),
  });
  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/book-appointment");
  return { ok: true };
}
