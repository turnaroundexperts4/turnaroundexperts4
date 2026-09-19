import "dotenv/config";
import { db } from "@/db";
import { portfolioCategories, portfolioProjects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { slugify } from "@/lib/utils";

export const PORTFOLIO_SAMPLES: {
  title: string;
  categorySlug: string;
  shortDescription: string;
  description: string;
  client: string;
  year: number;
  tags: string[];
  projectUrl?: string;
  featured?: boolean;
  images: string[];
  displayOrder: number;
}[] = [
  {
    title: "Northline Consulting — Conversion Landing System",
    categorySlug: "landing-pages",
    shortDescription:
      "A multi-page landing system built to turn paid traffic into qualified strategy calls.",
    description:
      "Northline needed a landing experience that matched the seriousness of their consulting practice. We designed and shipped a conversion-focused site with structured service pages, case proof and a native booking flow — built for paid acquisition and organic search.",
    client: "Northline Consulting",
    year: 2025,
    tags: ["Landing Page", "Lead Gen", "SEO", "Booking"],
    projectUrl: "https://turnaroundexperts.info",
    featured: true,
    images: [
      "/uploads/portfolio/landing-a1.jpg",
      "/uploads/portfolio/landing-a2.jpg",
      "/uploads/portfolio/webapp-a1.jpg",
      "/uploads/portfolio/erp-a1.jpg",
    ],
    displayOrder: 10,
  },
  {
    title: "Aarohan Operations Web App",
    categorySlug: "webapps",
    shortDescription:
      "Internal operations web app replacing three disconnected tools with a single source of truth.",
    description:
      "Aarohan's ops team was juggling spreadsheets, WhatsApp and a legacy tool. We designed and built a custom web app covering work orders, status tracking and reporting — with role-based access and a clean daily-use UI.",
    client: "Aarohan Industries",
    year: 2025,
    tags: ["Webapp", "Operations", "Dashboard", "RBAC"],
    featured: true,
    images: [
      "/uploads/portfolio/webapp-a1.jpg",
      "/uploads/portfolio/erp-a1.jpg",
      "/uploads/portfolio/staff-a1.jpg",
      "/uploads/portfolio/landing-a2.jpg",
    ],
    displayOrder: 20,
  },
  {
    title: "Shree Manufacturing ERP Module",
    categorySlug: "erp-solutions",
    shortDescription:
      "Phase-one ERP covering inventory, production batches and purchase orders.",
    description:
      "A focused ERP build for a mid-size manufacturer — inventory visibility, batch tracking and purchase-order workflows, designed around how the floor actually works rather than a generic template.",
    client: "Shree Manufacturing",
    year: 2024,
    tags: ["ERP", "Inventory", "Production", "Workflows"],
    images: [
      "/uploads/portfolio/erp-a1.jpg",
      "/uploads/portfolio/webapp-a1.jpg",
      "/uploads/portfolio/staff-a1.jpg",
      "/uploads/portfolio/logistics-a1.jpg",
    ],
    displayOrder: 30,
  },
  {
    title: "Kala Collective E-commerce",
    categorySlug: "e-commerce-websites",
    shortDescription:
      "Premium e-commerce storefront with clean product storytelling and reliable checkout.",
    description:
      "Kala Collective needed a storefront that felt editorial rather than template-driven. We designed product pages, collections, cart and checkout — with performance, mobile and conversion as first-class concerns.",
    client: "Kala Collective",
    year: 2025,
    tags: ["E-commerce", "Storefront", "Checkout", "Mobile"],
    images: [
      "/uploads/portfolio/ecom-a1.jpg",
      "/uploads/portfolio/landing-a1.jpg",
      "/uploads/portfolio/landing-a2.jpg",
      "/uploads/portfolio/logo-a1.jpg",
    ],
    displayOrder: 40,
  },
  {
    title: "StaffFlow — Attendance & Roster System",
    categorySlug: "staff-management",
    shortDescription:
      "Staff directory, attendance, leave and roster management for multi-location teams.",
    description:
      "A staff management system for businesses with multi-location teams. Directory, attendance logs, leave requests and rostering — with manager dashboards and exportable reports.",
    client: "Internal / Multi-client",
    year: 2024,
    tags: ["HR", "Attendance", "Rostering", "Reports"],
    images: [
      "/uploads/portfolio/staff-a1.jpg",
      "/uploads/portfolio/webapp-a1.jpg",
      "/uploads/portfolio/erp-a1.jpg",
      "/uploads/portfolio/hotel-a1.jpg",
    ],
    displayOrder: 50,
  },
  {
    title: "StayBook Hotel Operations Suite",
    categorySlug: "hotel-management",
    shortDescription:
      "Hotel booking, room occupancy and front-desk operations in one clean system.",
    description:
      "StayBook centralises room inventory, reservations, guest check-in/out and occupancy reporting for boutique hotels that outgrew spreadsheets and basic channel tools.",
    client: "Boutique Hotels Group",
    year: 2024,
    tags: ["Hospitality", "Bookings", "Front Desk", "Occupancy"],
    images: [
      "/uploads/portfolio/hotel-a1.jpg",
      "/uploads/portfolio/webapp-a1.jpg",
      "/uploads/portfolio/ecom-a1.jpg",
      "/uploads/portfolio/staff-a1.jpg",
    ],
    displayOrder: 60,
  },
  {
    title: "RouteGrid Cab & Logistics Console",
    categorySlug: "cab-logistics",
    shortDescription:
      "Fleet tracking, trip assignment and delivery status for a regional logistics operator.",
    description:
      "A logistics console covering vehicle assignment, live trip status, driver coordination and basic route reporting — designed for operators running mixed fleets across Gujarat.",
    client: "RouteGrid Logistics",
    year: 2025,
    tags: ["Logistics", "Fleet", "Tracking", "Dispatch"],
    images: [
      "/uploads/portfolio/logistics-a1.jpg",
      "/uploads/portfolio/erp-a1.jpg",
      "/uploads/portfolio/webapp-a1.jpg",
      "/uploads/portfolio/staff-a1.jpg",
    ],
    displayOrder: 70,
  },
  {
    title: "Meridian Brand Identity System",
    categorySlug: "logo-designs",
    shortDescription:
      "Logo system, monogram and brand marks for a professional services firm.",
    description:
      "A complete identity system — primary mark, monogram, lockups and usage rules — designed to work across stationery, web and signage without losing clarity.",
    client: "Meridian Advisory",
    year: 2024,
    tags: ["Logo", "Brand Identity", "Monogram", "Guidelines"],
    images: [
      "/uploads/portfolio/logo-a1.jpg",
      "/uploads/portfolio/landing-a1.jpg",
      "/uploads/portfolio/landing-a2.jpg",
      "/uploads/portfolio/ecom-a1.jpg",
    ],
    displayOrder: 80,
  },
  {
    title: "Factory Outlet POS Companion",
    categorySlug: "factory-outlet",
    shortDescription:
      "Outlet-facing stock and billing companion for a multi-store factory outlet network.",
    description:
      "A lightweight companion system for factory outlets — stock visibility, simple billing flows and end-of-day summaries that sync back to the central inventory.",
    client: "Gujarat Outlet Network",
    year: 2023,
    tags: ["POS", "Outlet", "Inventory", "Retail"],
    images: [
      "/uploads/portfolio/ecom-a1.jpg",
      "/uploads/portfolio/erp-a1.jpg",
      "/uploads/portfolio/webapp-a1.jpg",
      "/uploads/portfolio/landing-a2.jpg",
    ],
    displayOrder: 90,
  },
  {
    title: "Praxis Marketing Site",
    categorySlug: "landing-pages",
    shortDescription:
      "High-performance marketing website for a digital-first professional services firm.",
    description:
      "A clean marketing site with service architecture, case studies and lead capture — designed for clarity and speed rather than visual noise.",
    client: "Praxis Group",
    year: 2025,
    tags: ["Website", "Marketing", "Case Studies", "Performance"],
    images: [
      "/uploads/portfolio/landing-a2.jpg",
      "/uploads/portfolio/landing-a1.jpg",
      "/uploads/portfolio/webapp-a1.jpg",
      "/uploads/portfolio/logo-a1.jpg",
    ],
    displayOrder: 100,
  },
];

async function seedPortfolio() {
  const cats = await db.select().from(portfolioCategories);
  const bySlug = new Map(cats.map((c) => [c.slug, c]));

  for (const sample of PORTFOLIO_SAMPLES) {
    const cat = bySlug.get(sample.categorySlug);
    if (!cat) {
      console.warn(`Missing category: ${sample.categorySlug}`);
      continue;
    }
    const slug = slugify(sample.title);
    const existing = await db
      .select()
      .from(portfolioProjects)
      .where(eq(portfolioProjects.slug, slug))
      .limit(1);
    if (existing.length > 0) {
      // Update images/metadata so re-runs stay fresh
      await db
        .update(portfolioProjects)
        .set({
          title: sample.title,
          description: sample.description,
          shortDescription: sample.shortDescription,
          categoryId: cat.id,
          client: sample.client,
          year: sample.year,
          tags: sample.tags,
          projectUrl: sample.projectUrl ?? null,
          featured: sample.featured ?? false,
          visible: true,
          thumbnailUrl: sample.images[0] ?? null,
          imageUrls: sample.images,
          displayOrder: sample.displayOrder,
          updatedAt: new Date(),
        })
        .where(eq(portfolioProjects.id, existing[0].id));
      console.log(`Updated: ${sample.title}`);
      continue;
    }
    await db.insert(portfolioProjects).values({
      title: sample.title,
      slug,
      categoryId: cat.id,
      description: sample.description,
      shortDescription: sample.shortDescription,
      client: sample.client,
      year: sample.year,
      tags: sample.tags,
      projectUrl: sample.projectUrl ?? null,
      featured: sample.featured ?? false,
      visible: true,
      thumbnailUrl: sample.images[0] ?? null,
      imageUrls: sample.images,
      displayOrder: sample.displayOrder,
    });
    console.log(`Inserted: ${sample.title}`);
  }
}

if (process.argv[1]?.endsWith("seed-portfolio.ts")) {
  seedPortfolio()
    .then(() => {
      console.log("Portfolio samples ready.");
      process.exit(0);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
