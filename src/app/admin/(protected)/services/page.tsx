import { listAllServices } from "@/lib/data";
import { ServicesAdmin } from "@/app/admin/(protected)/services/client";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await listAllServices();
  return (
    <ServicesAdmin
      services={services.map((s) => ({
        id: s.id,
        title: s.title,
        slug: s.slug,
        tagline: s.tagline,
        description: s.description,
        problem: s.problem,
        approach: s.approach,
        benefits: (s.benefits ?? []) as string[],
        cta: s.cta,
        iconKey: s.iconKey,
        active: s.active,
        displayOrder: s.displayOrder,
      }))}
    />
  );
}
