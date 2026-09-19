"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import {
  createTeamMember,
  deleteTeamMember,
  updateTeamMember,
} from "@/lib/data";

async function guard() {
  if (!(await requireAdmin())) throw new Error("Unauthorized");
}

function parseList(raw: FormDataEntryValue | null): string[] {
  if (!raw) return [];
  return String(raw)
    .split(/,|\n/)
    .map((x) => x.trim())
    .filter(Boolean);
}

export async function saveTeamMember(formData: FormData) {
  await guard();
  const id = formData.get("id") ? Number(formData.get("id")) : undefined;
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const department = String(formData.get("department") ?? "").trim() || null;
  const skills = parseList(formData.get("skills"));
  const photoUrl = String(formData.get("photoUrl") ?? "").trim() || null;
  const active =
    formData.get("active") === "on" || formData.get("active") === "true";
  const displayOrder = Number(formData.get("displayOrder") ?? 0);
  if (!name || !role || !bio) return { ok: false, error: "Name, role and bio required" };

  if (id) {
    await updateTeamMember(id, {
      name,
      role,
      bio,
      department,
      skills,
      photoUrl,
      active,
      displayOrder,
    });
  } else {
    await createTeamMember({
      name,
      role,
      bio,
      department: department ?? undefined,
      skills,
      photoUrl: photoUrl ?? undefined,
      active,
      displayOrder,
    });
  }
  revalidatePath("/admin/team");
  revalidatePath("/founders");
  revalidatePath("/");
  return { ok: true };
}

export async function removeTeamMember(formData: FormData) {
  await guard();
  const id = Number(formData.get("id"));
  if (!id) return { ok: false };
  await deleteTeamMember(id);
  revalidatePath("/admin/team");
  revalidatePath("/founders");
  revalidatePath("/");
  return { ok: true };
}
