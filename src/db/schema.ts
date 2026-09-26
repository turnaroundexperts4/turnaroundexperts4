import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  integer,
  timestamp,
  jsonb,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ---------- Enums ----------
export const appointmentStatusEnum = pgEnum("appointment_status", [
  "pending",
  "approved",
  "rejected",
  "rescheduled",
  "completed",
  "cancelled",
]);

export const enquiryStatusEnum = pgEnum("enquiry_status", [
  "new",
  "contacted",
  "in_progress",
  "closed",
]);

// ---------- Site / global settings ----------
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

// ---------- Admin accounts ----------
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

// ---------- Services ----------
export const services = pgTable(
  "services",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    tagline: varchar("tagline", { length: 300 }),
    description: text("description").notNull(),
    problem: text("problem"),
    approach: text("approach"),
    benefits: jsonb("benefits").$type<string[]>().default(sql`'[]'::jsonb`),
    cta: varchar("cta", { length: 200 }).default("Talk to us"),
    iconKey: varchar("icon_key", { length: 80 }),
    active: boolean("active").notNull().default(true),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    activeIdx: index("services_active_idx").on(t.active, t.displayOrder),
  }),
);

// ---------- Portfolio categories ----------
export const portfolioCategories = pgTable(
  "portfolio_categories",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    description: text("description"),
    active: boolean("active").notNull().default(true),
    displayOrder: integer("display_order").notNull().default(0),
  },
  (t) => ({
    activeIdx: index("portfolio_categories_active_idx").on(
      t.active,
      t.displayOrder,
    ),
  }),
);

// ---------- Portfolio projects ----------
export const portfolioProjects = pgTable(
  "portfolio_projects",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 220 }).notNull().unique(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => portfolioCategories.id),
    description: text("description").notNull(),
    shortDescription: varchar("short_description", { length: 400 }),
    projectUrl: varchar("project_url", { length: 500 }),
    thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
    imageUrls: jsonb("image_urls").$type<string[]>().default(sql`'[]'::jsonb`),
    tags: jsonb("tags").$type<string[]>().default(sql`'[]'::jsonb`),
    client: varchar("client", { length: 200 }),
    year: integer("year"),
    featured: boolean("featured").notNull().default(false),
    visible: boolean("visible").notNull().default(true),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    catIdx: index("portfolio_projects_cat_idx").on(t.categoryId, t.displayOrder),
    visibleIdx: index("portfolio_projects_visible_idx").on(
      t.visible,
      t.displayOrder,
    ),
  }),
);

// ---------- Founders ----------
export const founders = pgTable("founders", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  role: varchar("role", { length: 200 }).notNull(),
  bio: text("bio").notNull(),
  responsibilities: jsonb("responsibilities").$type<string[]>().default(sql`'[]'::jsonb`),
  skills: jsonb("skills").$type<string[]>().default(sql`'[]'::jsonb`),
  photoUrl: varchar("photo_url", { length: 500 }),
  social: jsonb("social").$type<{ label: string; url: string }[]>().default(sql`'[]'::jsonb`),
  displayOrder: integer("display_order").notNull().default(0),
  isPrimary: boolean("is_primary").notNull().default(false),
});

// ---------- Team ----------
export const teamMembers = pgTable(
  "team_members",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 200 }).notNull(),
    role: varchar("role", { length: 200 }).notNull(),
    bio: text("bio").notNull(),
    department: varchar("department", { length: 120 }),
    skills: jsonb("skills").$type<string[]>().default(sql`'[]'::jsonb`),
    photoUrl: varchar("photo_url", { length: 500 }),
    social: jsonb("social").$type<{ label: string; url: string }[]>().default(sql`'[]'::jsonb`),
    active: boolean("active").notNull().default(true),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    activeIdx: index("team_active_idx").on(t.active, t.displayOrder),
  }),
);

// ---------- Availability / working hours ----------
export const availabilityRules = pgTable("availability_rules", {
  id: serial("id").primaryKey(),
  dayOfWeek: integer("day_of_week").notNull(), // 0 = Sunday … 6 = Saturday
  enabled: boolean("enabled").notNull().default(true),
  startTime: varchar("start_time", { length: 5 }).notNull(), // "09:00"
  endTime: varchar("end_time", { length: 5 }).notNull(), // "17:00"
  slotMinutes: integer("slot_minutes").notNull().default(60),
});

export const blockedDates = pgTable("blocked_dates", {
  id: serial("id").primaryKey(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  reason: varchar("reason", { length: 200 }),
});

// ---------- Appointments ----------
export const appointments = pgTable(
  "appointments",
  {
    id: serial("id").primaryKey(),
    reference: varchar("reference", { length: 32 }).notNull().unique(),
    uid: varchar("uid", { length: 200 }),
    customerName: varchar("customer_name", { length: 200 }).notNull(),
    email: varchar("email", { length: 200 }).notNull(),
    phone: varchar("phone", { length: 40 }).notNull(),
    company: varchar("company", { length: 200 }),
    serviceId: integer("service_id").references(() => services.id),
    serviceTitle: varchar("service_title", { length: 200 }),
    requestedDate: varchar("requested_date", { length: 10 }).notNull(),
    requestedTime: varchar("requested_time", { length: 5 }).notNull(),
    message: text("message"),
    status: appointmentStatusEnum("status").notNull().default("pending"),
    adminNote: text("admin_note"),
    proposedDate: varchar("proposed_date", { length: 10 }),
    proposedTime: varchar("proposed_time", { length: 5 }),
    history: jsonb("history")
      .$type<
        { at: string; action: string; note?: string }[]
      >()
      .default(sql`'[]'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    statusIdx: index("appointments_status_idx").on(t.status, t.createdAt),
    dateIdx: index("appointments_date_idx").on(t.requestedDate),
    activeUidUnique: uniqueIndex("appointments_active_uid_unique")
      .on(t.uid)
      .where(sql`"status" in ('pending', 'approved', 'rescheduled') and "uid" is not null`),
    activeSlotUnique: uniqueIndex("appointments_active_slot_unique")
      .on(t.requestedDate, t.requestedTime)
      .where(sql`"status" in ('pending', 'approved', 'rescheduled')`),
  }),
);

// ---------- Blog ----------
export const blogCategories = pgTable("blog_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
});

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 300 }).notNull(),
    slug: varchar("slug", { length: 320 }).notNull().unique(),
    excerpt: varchar("excerpt", { length: 500 }),
    content: text("content").notNull(),
    coverUrl: varchar("cover_url", { length: 500 }),
    categoryId: integer("category_id").references(() => blogCategories.id),
    tags: jsonb("tags").$type<string[]>().default(sql`'[]'::jsonb`),
    published: boolean("published").notNull().default(false),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    publishedIdx: index("blog_published_idx").on(t.published, t.publishedAt),
  }),
);

// ---------- Enquiries (contact form) ----------
export const enquiries = pgTable(
  "enquiries",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 200 }).notNull(),
    email: varchar("email", { length: 200 }).notNull(),
    phone: varchar("phone", { length: 40 }),
    company: varchar("company", { length: 200 }),
    service: varchar("service", { length: 200 }),
    message: text("message").notNull(),
    status: enquiryStatusEnum("status").notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    statusIdx: index("enquiries_status_idx").on(t.status, t.createdAt),
  }),
);
