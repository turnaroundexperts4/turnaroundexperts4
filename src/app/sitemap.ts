import type { MetadataRoute } from "next";
import {
  listActiveServices,
  listAllProjects,
  listPublishedPosts,
} from "@/lib/data";

export const dynamic = "force-dynamic";

const siteUrl = "https://turnaroundexperts.in";
const staticPaths = [
  "/",
  "/services",
  "/portfolio",
  "/founders",
  "/blog",
  "/pricing",
  "/contact",
  "/book-appointment",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, projects, posts] = await Promise.all([
    listActiveServices(),
    listAllProjects(),
    listPublishedPosts(),
  ]);

  return [
    ...staticPaths.map((path) => ({ url: `${siteUrl}${path}` })),
    ...services.map((service) => ({
      url: `${siteUrl}/services/${encodeURIComponent(service.slug)}`,
    })),
    ...projects
      .filter(({ project }) => project.visible && project.slug)
      .map(({ project }) => ({
        url: `${siteUrl}/portfolio/${encodeURIComponent(project.slug)}`,
      })),
    ...posts
      .filter(({ post }) => post.published && post.slug)
      .map(({ post }) => ({
        url: `${siteUrl}/blog/${encodeURIComponent(post.slug)}`,
      })),
  ];
}
