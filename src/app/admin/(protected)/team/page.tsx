import { listAllTeam } from "@/lib/data";
import { TeamAdmin } from "@/app/admin/(protected)/team/client";

export const dynamic = "force-dynamic";

export default async function TeamAdminPage() {
  const team = await listAllTeam();
  return (
    <TeamAdmin
      members={team.map((m) => ({
        id: m.id,
        name: m.name,
        role: m.role,
        bio: m.bio,
        department: m.department,
        skills: (m.skills ?? []) as string[],
        photoUrl: m.photoUrl,
        active: m.active,
        displayOrder: m.displayOrder,
      }))}
    />
  );
}
