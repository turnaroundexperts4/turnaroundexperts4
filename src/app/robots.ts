import type { MetadataRoute } from "next";

const siteUrl = "https://turnaroundexperts.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/account", "/appointment"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
