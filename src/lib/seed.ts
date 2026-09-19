import "dotenv/config";
import { db } from "@/db";
import {
  availabilityRules,
  blogCategories,
  founders,
  portfolioCategories,
  services,
  teamMembers,
  siteSettings,
  admins,
} from "@/db/schema";
import {
  createAdmin,
  ensureSeedAdmin,
  setSetting,
} from "@/lib/data";
import { sql } from "drizzle-orm";

const DEFAULT_SERVICES = [
  {
    title: "Business Consulting",
    slug: "business-consulting",
    tagline: "Decisions grounded in evidence, not guesswork.",
    description:
      "We work with owners and leadership teams to diagnose what is actually limiting growth — operations, finance, marketing, or strategy — and translate it into a focused 90-day plan with measurable outcomes.",
    problem:
      "Most businesses operate without a live map of where they are leaking money, time, or customers. Decisions become emotional.",
    approach:
      "A structured diagnostic across operations, finance and growth, followed by a prioritised roadmap with ownership and milestones.",
    benefits: [
      "Clear picture of where the business leaks time and money",
      "Prioritised 90-day action plan with accountable ownership",
      "Aligned leadership team working from a single source of truth",
      "Visibility into measurable outcomes at every checkpoint",
    ],
    cta: "Book a Strategy Call",
    iconKey: "compass",
    displayOrder: 10,
  },
  {
    title: "Website & Web Application Development",
    slug: "web-development",
    tagline: "Conversion-focused websites and serious web apps.",
    description:
      "From high-performing marketing sites to complex web applications, we build on modern stacks with attention to performance, security and long-term maintainability.",
    problem:
      "Most websites are decorative brochures that don't generate leads, sales or trust. Most web apps are stitched together and slow to evolve.",
    approach:
      "Discovery, information architecture, design system, build, deploy, measure. Every layer is treated as a product, not a deliverable.",
    benefits: [
      "Fast, accessible, search-optimised public websites",
      "Web apps your team and customers can actually rely on",
      "Clean architecture that scales with you instead of against you",
      "No locked-in proprietary platforms or themes",
    ],
    cta: "Discuss Your Build",
    iconKey: "code",
    displayOrder: 20,
  },
  {
    title: "ERP & Internal Software",
    slug: "erp-software",
    tagline: "Operations systems designed around your business, not templates.",
    description:
      "Custom ERP-style systems that replace scattered spreadsheets and disconnected tools with a single internal source of truth.",
    problem:
      "Spreadsheets multiply. Tools don't talk to each other. Reporting takes days. Errors compound.",
    approach:
      "Map real workflows, design a tailored data model, ship in phases, and train teams to actually use it.",
    benefits: [
      "One source of truth across departments",
      "Real-time visibility into operations",
      "Processes encoded into the system, not in someone's head",
      "Scales as the business scales",
    ],
    cta: "Map Your Workflows",
    iconKey: "layers",
    displayOrder: 30,
  },
  {
    title: "E-commerce Solutions",
    slug: "e-commerce",
    tagline: "Stores that turn visitors into paying customers.",
    description:
      "End-to-end e-commerce builds — storefronts, checkout, payments, inventory and post-sale automation — engineered for revenue, not just aesthetics.",
    problem:
      "Cart abandonment, slow sites, fragmented inventory and disconnected marketing kill online sales.",
    approach:
      "Treat e-commerce as a system: product, merchandising, performance, fulfilment and retention, all working together.",
    benefits: [
      "Conversion-optimised checkout flows",
      "Reliable inventory and order operations",
      "Integrated marketing, analytics and retention",
      "Built to grow with catalogue and traffic",
    ],
    cta: "Plan a Storefront",
    iconKey: "shopping",
    displayOrder: 40,
  },
  {
    title: "Digital Marketing & SEO",
    slug: "digital-marketing",
    tagline: "Acquisition engines, not vanity metrics.",
    description:
      "Search-first marketing — technical SEO, content systems, paid acquisition and analytics — designed to compound over months, not days.",
    problem:
      "Most marketing spend disappears. Reporting is unclear. Content has no clear link to revenue.",
    approach:
      "Start from search intent, build a content and acquisition plan around it, then measure by what actually converts.",
    benefits: [
      "Search presence that builds over time",
      "Paid campaigns with real attribution",
      "Analytics your leadership actually trusts",
      "Content that produces leads, not just traffic",
    ],
    cta: "Build Your Funnel",
    iconKey: "trend",
    displayOrder: 50,
  },
  {
    title: "Accounting & Business Management",
    slug: "accounting-management",
    tagline: "Clean books. Clear decisions.",
    description:
      "Practical accounting, bookkeeping and business-management support — including compliance, reporting, cash-flow visibility and tooling.",
    problem:
      "Owners don't know what they actually made last month. Books are late. Decisions are made on instinct.",
    approach:
      "Set up clean books, monthly closing, dashboards and a rhythm your team can sustain.",
    benefits: [
      "Books closed monthly, on time",
      "Cash-flow visibility in real time",
      "Compliance handled without last-minute scrambles",
      "Decisions driven by accurate numbers",
    ],
    cta: "Organise Your Books",
    iconKey: "calculator",
    displayOrder: 60,
  },
];

const DEFAULT_PORTFOLIO_CATEGORIES = [
  { name: "Landing Pages", slug: "landing-pages", displayOrder: 10 },
  { name: "Webapps", slug: "webapps", displayOrder: 20 },
  { name: "ERP Solutions", slug: "erp-solutions", displayOrder: 30 },
  { name: "E-commerce Websites", slug: "e-commerce-websites", displayOrder: 40 },
  { name: "Staff Management Software", slug: "staff-management", displayOrder: 50 },
  { name: "Hotel Management Software", slug: "hotel-management", displayOrder: 60 },
  { name: "Other Software Solutions", slug: "other-software", displayOrder: 70 },
  { name: "Cab & Logistics Management", slug: "cab-logistics", displayOrder: 80 },
  { name: "Factory Outlet Solutions", slug: "factory-outlet", displayOrder: 90 },
  { name: "Logo Designs", slug: "logo-designs", displayOrder: 100 },
];

const DEFAULT_FOUNDERS = [
  {
    name: "Lucky Varandani Nevendram",
    role: "Founder · Strategy & Operations",
    bio: "Founder of TurnAround Experts. Works with business owners on growth strategy, operational fixes and revenue clarity across Gujarat and beyond.",
    responsibilities: [
      "Leads client strategy and consulting engagements",
      "Drives operations and delivery at TAE",
      "Owns long-term vision and partnerships",
    ],
    skills: ["Strategy", "Operations", "Consulting", "Growth"],
    photoUrl: null,
    social: [
      { label: "LinkedIn", url: "https://www.linkedin.com/" },
    ],
    displayOrder: 10,
    isPrimary: true,
  },
  {
    name: "Rudradutt Padhya Devendrakumar",
    role: "Co-founder · Technology & Engineering",
    bio: "Co-founder of TurnAround Experts. Leads the engineering side — building the websites, web apps and internal systems behind client work.",
    responsibilities: [
      "Heads engineering and product delivery",
      "Owns system architecture for client builds",
      "Leads internal tooling and infrastructure",
    ],
    skills: ["Web Development", "Systems", "Architecture", "Product"],
    photoUrl: null,
    social: [
      { label: "LinkedIn", url: "https://www.linkedin.com/" },
    ],
    displayOrder: 20,
    isPrimary: false,
  },
];

const DEFAULT_TEAM = [
  {
    name: "Design Lead",
    role: "Design & Brand",
    bio: "Owns visual systems for client brands and internal TAE work — from identity through product UI.",
    department: "Design",
    skills: ["UI Design", "Brand Systems", "Figma"],
    photoUrl: null,
    active: true,
    displayOrder: 10,
  },
  {
    name: "Engineering Lead",
    role: "Web Engineering",
    bio: "Drives front-end and full-stack delivery for client projects, focused on clean architecture and maintainable code.",
    department: "Engineering",
    skills: ["React", "Next.js", "TypeScript", "Node.js"],
    photoUrl: null,
    active: true,
    displayOrder: 20,
  },
  {
    name: "Growth Lead",
    role: "SEO & Acquisition",
    bio: "Builds search-first marketing systems and conversion funnels that compound over time.",
    department: "Marketing",
    skills: ["SEO", "Content Strategy", "Analytics"],
    photoUrl: null,
    active: true,
    displayOrder: 30,
  },
  {
    name: "Operations Associate",
    role: "Client Operations",
    bio: "Keeps client engagements running smoothly — from kickoff through delivery and ongoing support.",
    department: "Operations",
    skills: ["Coordination", "Client Operations", "Comms"],
    photoUrl: null,
    active: true,
    displayOrder: 40,
  },
];

const DEFAULT_AVAILABILITY = [
  { dayOfWeek: 1, enabled: true, startTime: "10:00", endTime: "17:00", slotMinutes: 60 },
  { dayOfWeek: 2, enabled: true, startTime: "10:00", endTime: "17:00", slotMinutes: 60 },
  { dayOfWeek: 3, enabled: true, startTime: "10:00", endTime: "17:00", slotMinutes: 60 },
  { dayOfWeek: 4, enabled: true, startTime: "10:00", endTime: "17:00", slotMinutes: 60 },
  { dayOfWeek: 5, enabled: true, startTime: "10:00", endTime: "16:00", slotMinutes: 60 },
  { dayOfWeek: 6, enabled: true, startTime: "10:00", endTime: "14:00", slotMinutes: 60 },
  { dayOfWeek: 0, enabled: false, startTime: "10:00", endTime: "14:00", slotMinutes: 60 },
];

const DEFAULT_SETTINGS = {
  company: {
    name: "TurnAround Experts",
    short: "TAE",
    tagline: "Turning Challenges into Profits",
    phone: "+91 9512384715",
    email: "turnaroundexperts4@gmail.com",
    address: "Palanpur, Banaskantha, Gujarat, India",
    website: "https://turnaroundexperts.info",
    udyam: "UDYAM-GJ-04-0064063",
  },
  social: {
    linkedin: "https://www.linkedin.com/",
    instagram: "",
    twitter: "",
    facebook: "",
  },
  seo: {
    title: "TurnAround Experts — Turning Challenges into Profits",
    description:
      "TAE helps businesses across India with technology, digital services and consulting — strategy, web, ERP, e-commerce, SEO, accounting and operations.",
    keywords: [
      "TurnAround Experts",
      "TAE",
      "business consulting",
      "website development",
      "web application development",
      "ERP",
      "digital services",
      "Palanpur",
      "Gujarat",
    ],
  },
  booking: {
    minLeadDays: 1,
    maxLeadDays: 60,
  },
};

async function seedIfEmpty() {
  // Services
  const existingServices = await db.select().from(services);
  if (existingServices.length === 0) {
    for (const s of DEFAULT_SERVICES) {
      await db.insert(services).values({
        title: s.title,
        slug: s.slug,
        tagline: s.tagline,
        description: s.description,
        problem: s.problem,
        approach: s.approach,
        benefits: s.benefits,
        cta: s.cta,
        iconKey: s.iconKey,
        active: true,
        displayOrder: s.displayOrder,
      });
    }
    console.log("Seeded services.");
  }

  // Portfolio categories
  const existingCats = await db.select().from(portfolioCategories);
  if (existingCats.length === 0) {
    for (const c of DEFAULT_PORTFOLIO_CATEGORIES) {
      await db.insert(portfolioCategories).values({
        name: c.name,
        slug: c.slug,
        active: true,
        displayOrder: c.displayOrder,
      });
    }
    console.log("Seeded portfolio categories.");
  }

  // Founders
  const existingFounders = await db.select().from(founders);
  if (existingFounders.length === 0) {
    for (const f of DEFAULT_FOUNDERS) {
      await db.insert(founders).values({
        name: f.name,
        role: f.role,
        bio: f.bio,
        responsibilities: f.responsibilities,
        skills: f.skills,
        photoUrl: f.photoUrl,
        social: f.social,
        displayOrder: f.displayOrder,
        isPrimary: f.isPrimary,
      });
    }
    console.log("Seeded founders.");
  }

  // Team
  const existingTeam = await db.select().from(teamMembers);
  if (existingTeam.length === 0) {
    for (const t of DEFAULT_TEAM) {
      await db.insert(teamMembers).values({
        name: t.name,
        role: t.role,
        bio: t.bio,
        department: t.department,
        skills: t.skills,
        photoUrl: t.photoUrl,
        active: t.active,
        displayOrder: t.displayOrder,
        social: [],
      });
    }
    console.log("Seeded team members.");
  }

  // Availability
  const existingRules = await db.select().from(availabilityRules);
  if (existingRules.length === 0) {
    for (const r of DEFAULT_AVAILABILITY) {
      await db.insert(availabilityRules).values(r);
    }
    console.log("Seeded availability rules.");
  }

  // Settings (always upsert so values are kept current)
  await setSetting("company", DEFAULT_SETTINGS.company);
  await setSetting("social", DEFAULT_SETTINGS.social);
  await setSetting("seo", DEFAULT_SETTINGS.seo);
  await setSetting("booking", DEFAULT_SETTINGS.booking);
  console.log("Upserted site settings.");

  // Blog categories
  const existingBC = await db.select().from(blogCategories);
  if (existingBC.length === 0) {
    await db.insert(blogCategories).values([
      { name: "Insights", slug: "insights" },
      { name: "Case Notes", slug: "case-notes" },
      { name: "How-to", slug: "how-to" },
    ]);
    console.log("Seeded blog categories.");
  }

  // Default admin
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@tae.local";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "tae-admin-2026";
  const adminName = process.env.SEED_ADMIN_NAME || "TAE Admin";
  await ensureSeedAdmin(adminEmail, adminPassword, adminName);
  console.log(`Admin ready: ${adminEmail}`);
}

seedIfEmpty()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
