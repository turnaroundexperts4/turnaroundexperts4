import "dotenv/config";

import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import {
  DEFAULT_PORTFOLIO_CATEGORIES,
  DEFAULT_SERVICES,
} from "../src/lib/seed";
import { PORTFOLIO_SAMPLES } from "../src/lib/seed-portfolio";
import { slugify } from "../src/lib/utils";

const projectId = process.env.FIREBASE_PROJECT_ID ?? "tae-bef9c";
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!clientEmail || !privateKey) {
  throw new Error(
    "Set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY before seeding.",
  );
}

const app =
  getApps()[0] ??
  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
const firestore = getFirestore(app);

const BLOG_CATEGORIES = [
  { id: 1, name: "Insights", slug: "insights" },
  { id: 2, name: "Case Notes", slug: "case-notes" },
  { id: 3, name: "How-to", slug: "how-to" },
];

const BLOG_POSTS = [
  {
    id: 1,
    title: "Why most business growth problems are operating problems",
    slug: "why-most-business-growth-problems-are-operating-problems",
    excerpt:
      "When growth stalls, the answer is often hidden in the way work moves through the business.",
    content:
      "Growth is rarely blocked by one dramatic mistake. More often, small operating frictions compound until the owner becomes the bottleneck.\n\n## Start with the flow of work\n\nMap how a lead becomes a customer, how a customer becomes an order, and how an order gets delivered. The gaps between those stages usually reveal the highest-value fixes.\n\n## Measure before adding complexity\n\nA clear weekly scorecard is more useful than another disconnected tool. Track the few numbers that show demand, delivery quality and cash movement, then improve the system around them.",
    categoryId: 1,
    tags: ["Operations", "Growth", "Strategy"],
  },
  {
    id: 2,
    title: "The practical case for replacing spreadsheet sprawl",
    slug: "the-practical-case-for-replacing-spreadsheet-sprawl",
    excerpt:
      "Spreadsheets are useful tools, but they become expensive when they are asked to run the whole business.",
    content:
      "Spreadsheets help teams move quickly at the beginning. The problem starts when several versions become the operating system for sales, stock, staff and finance.\n\n## Find the handoffs\n\nThe first step is not buying an ERP. It is identifying where information is copied, re-entered or reconciled manually.\n\n## Build in phases\n\nA focused internal system should start with one painful workflow, deliver visibility, and expand only when the team trusts the first release.",
    categoryId: 2,
    tags: ["ERP", "Systems", "Efficiency"],
  },
  {
    id: 3,
    title: "A simple 90-day plan for improving digital acquisition",
    slug: "a-simple-90-day-plan-for-improving-digital-acquisition",
    excerpt:
      "A focused acquisition plan connects search intent, useful content and measurable conversion paths.",
    content:
      "Digital acquisition improves when every activity points toward a clear customer action. Start by understanding what your best customers search for and what evidence they need before contacting you.\n\n## Days 1–30: clarify\n\nDefine the audience, offers, search themes and conversion events. Fix the technical issues that prevent measurement.\n\n## Days 31–60: publish and test\n\nCreate useful pages around real questions, then test calls to action and landing-page structure.\n\n## Days 61–90: compound\n\nKeep the channels that produce qualified conversations, improve the pages that convert, and stop reporting vanity metrics as business results.",
    categoryId: 3,
    tags: ["SEO", "Marketing", "Lead Generation"],
  },
];

async function seed() {
  const categories = new Map<number, string>();
  for (const [index, category] of DEFAULT_PORTFOLIO_CATEGORIES.entries()) {
    const id = index + 1;
    categories.set(id, category.slug);
    await firestore.collection("portfolioCategories").doc(String(id)).set({
      id,
      ...category,
      active: true,
    });
  }

  for (const [index, service] of DEFAULT_SERVICES.entries()) {
    const id = index + 1;
    await firestore.collection("services").doc(String(id)).set({
      id,
      ...service,
      active: true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  for (const sample of PORTFOLIO_SAMPLES) {
    const categoryId =
      [...categories.entries()].find(([, slug]) => slug === sample.categorySlug)?.[0] ??
      null;
    if (!categoryId) continue;
    const slug = slugify(sample.title);
    const id = Math.abs(
      [...slug].reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) | 0, 0),
    );
    await firestore.collection("portfolioProjects").doc(String(id)).set({
      id,
      title: sample.title,
      slug,
      categoryId,
      description: sample.description,
      shortDescription: sample.shortDescription,
      projectUrl: sample.projectUrl ?? null,
      thumbnailUrl: sample.images[0] ?? null,
      imageUrls: sample.images,
      tags: sample.tags,
      client: sample.client,
      year: sample.year,
      featured: sample.featured ?? false,
      visible: true,
      displayOrder: sample.displayOrder,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }
  for (const category of BLOG_CATEGORIES) {
    await firestore
      .collection("blogCategories")
      .doc(String(category.id))
      .set(category, { merge: true });
  }
  for (const post of BLOG_POSTS) {
    await firestore
      .collection("blogPosts")
      .doc(String(post.id))
      .set(
        {
          ...post,
          coverUrl: null,
          published: true,
          publishedAt: new Date(),
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
  }
  console.log("Firebase Services and Portfolio content seeded.");
}

seed().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
