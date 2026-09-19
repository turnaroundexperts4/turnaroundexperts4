import { listFounders } from "@/lib/data";
import { FoundersAdmin } from "@/app/admin/(protected)/founders/client";

export const dynamic = "force-dynamic";

export default async function FoundersAdminPage() {
  const founders = await listFounders();
  return (
    <FoundersAdmin
      founders={founders.map((f) => ({
        id: f.id,
        name: f.name,
        role: f.role,
        bio: f.bio,
        responsibilities: (f.responsibilities ?? []) as string[],
        skills: (f.skills ?? []) as string[],
        photoUrl: f.photoUrl,
        social: (f.social ?? []) as { label: string; url: string }[],
        displayOrder: f.displayOrder,
        isPrimary: f.isPrimary,
      }))}
    />
  );
}
