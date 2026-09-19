import {
  listAllPortfolioCategories,
  listAllProjects,
} from "@/lib/data";
import { PortfolioAdmin } from "@/app/admin/(protected)/portfolio/client";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioPage() {
  const [categories, projects] = await Promise.all([
    listAllPortfolioCategories(),
    listAllProjects(),
  ]);
  return (
    <PortfolioAdmin
      categories={categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        active: c.active,
        displayOrder: c.displayOrder,
      }))}
      projects={projects.map(({ project, category }) => ({
        id: project.id,
        title: project.title,
        slug: project.slug,
        categoryId: project.categoryId,
        categoryName: category?.name ?? "—",
        description: project.description,
        shortDescription: project.shortDescription,
        projectUrl: project.projectUrl,
        thumbnailUrl: project.thumbnailUrl,
        imageUrls: (project.imageUrls ?? []) as string[],
        tags: (project.tags ?? []) as string[],
        client: project.client,
        year: project.year,
        featured: project.featured,
        visible: project.visible,
        displayOrder: project.displayOrder,
      }))}
    />
  );
}
