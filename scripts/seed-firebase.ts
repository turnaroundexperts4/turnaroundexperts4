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
  console.log("Firebase Services and Portfolio content seeded.");
}

seed().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
