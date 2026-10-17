import { describe, expect, it, vi } from "vitest";

const { listActiveServices, listAllProjects, listPublishedPosts } = vi.hoisted(
  () => ({
    listActiveServices: vi.fn(),
    listAllProjects: vi.fn(),
    listPublishedPosts: vi.fn(),
  }),
);

vi.mock("@/lib/data", () => ({
  listActiveServices,
  listAllProjects,
  listPublishedPosts,
}));

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

describe("public search metadata routes", () => {
  it("allows public content while excluding private and user-specific routes", () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/account", "/appointment"],
      },
      sitemap: "https://turnaroundexperts.in/sitemap.xml",
    });
  });

  it("lists canonical public pages and only active or published content", async () => {
    listActiveServices.mockResolvedValue([{ slug: "business-consulting" }]);
    listAllProjects.mockResolvedValue([
      { project: { slug: "visible-work", visible: true } },
      { project: { slug: "hidden-work", visible: false } },
    ]);
    listPublishedPosts.mockResolvedValue([
      { post: { slug: "published-post", published: true } },
      { post: { slug: "draft-post", published: false } },
    ]);

    const entries = await sitemap();
    const urls = entries.map(({ url }) => url);

    expect(urls).toEqual(
      expect.arrayContaining([
        "https://turnaroundexperts.in/",
        "https://turnaroundexperts.in/services",
        "https://turnaroundexperts.in/portfolio",
        "https://turnaroundexperts.in/blog",
        "https://turnaroundexperts.in/services/business-consulting",
        "https://turnaroundexperts.in/portfolio/visible-work",
        "https://turnaroundexperts.in/blog/published-post",
      ]),
    );
    expect(urls).not.toContain(
      "https://turnaroundexperts.in/portfolio/hidden-work",
    );
    expect(urls).not.toContain("https://turnaroundexperts.in/blog/draft-post");
  });
});
