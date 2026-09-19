import { db } from "@/db";
import {
  admins,
  appointments,
  availabilityRules,
  blockedDates,
  blogCategories,
  blogPosts,
  enquiries,
  founders,
  portfolioCategories,
  portfolioProjects,
  services,
  siteSettings,
  teamMembers,
} from "@/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

function isDatabaseUnavailableError(error: unknown) {
  const parts: string[] = [];
  if (error instanceof Error) {
    parts.push(error.message);
    const maybeCause = (error as Error & { cause?: unknown }).cause;
    if (maybeCause instanceof Error) {
      parts.push(maybeCause.message);
    } else if (maybeCause) {
      parts.push(String(maybeCause));
    }
  } else if (error) {
    parts.push(String(error));
  }

  const text = parts.join(" \n ");
  return /Failed query|DATABASE_URL|ECONNREFUSED|ECONNRESET|ENOTFOUND|EAI_AGAIN|connect ECONNREFUSED|fetch failed|connection refused|timeout|timed out|pg.*error|could not connect/i.test(
    text,
  );
}

async function withDbFallback<T>(fallback: T, operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return fallback;
    }
    throw error;
  }
}

// ---------------- Site settings ----------------
export async function getSetting<T = unknown>(
  key: string,
  fallback: T,
): Promise<T> {
  return withDbFallback(fallback, async () => {
    const rows = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1);
    if (rows.length === 0) return fallback;
    return rows[0].value as T;
  });
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  try {
    const existing = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1);
    if (existing.length === 0) {
      await db.insert(siteSettings).values({ key, value });
    } else {
      await db
        .update(siteSettings)
        .set({ value, updatedAt: new Date() })
        .where(eq(siteSettings.key, key));
    }
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
  }
}

// ---------------- Admin accounts ----------------
export async function findAdminByEmail(email: string) {
  return withDbFallback(null, async () => {
    const rows = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email.toLowerCase()))
      .limit(1);
    return rows[0] ?? null;
  });
}

export async function findAdminById(id: number) {
  return withDbFallback(null, async () => {
    const rows = await db
      .select()
      .from(admins)
      .where(eq(admins.id, id))
      .limit(1);
    return rows[0] ?? null;
  });
}

export async function verifyAdminPassword(
  email: string,
  password: string,
): Promise<{ id: number; email: string; name: string } | null> {
  return withDbFallback(null, async () => {
    const admin = await findAdminByEmail(email);
    if (!admin) return null;
    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) return null;
    return { id: admin.id, email: admin.email, name: admin.name };
  });
}

export async function createAdmin(
  email: string,
  password: string,
  name: string,
): Promise<number> {
  return withDbFallback(0, async () => {
    const passwordHash = await bcrypt.hash(password, 10);
    const inserted = await db
      .insert(admins)
      .values({ email: email.toLowerCase(), name, passwordHash })
      .returning({ id: admins.id });
    return inserted[0].id;
  });
}

export async function ensureSeedAdmin(email: string, password: string, name: string) {
  const existing = await findAdminByEmail(email);
  if (!existing) {
    await createAdmin(email, password, name);
  }
}

// ---------------- Services ----------------
export async function listActiveServices() {
  return withDbFallback([], async () =>
    db
      .select()
      .from(services)
      .where(eq(services.active, true))
      .orderBy(asc(services.displayOrder), asc(services.id)),
  );
}

export async function listAllServices() {
  return withDbFallback([], async () =>
    db
      .select()
      .from(services)
      .orderBy(asc(services.displayOrder), asc(services.id)),
  );
}

export async function getServiceBySlug(slug: string) {
  return withDbFallback(null, async () => {
    const rows = await db
      .select()
      .from(services)
      .where(eq(services.slug, slug))
      .limit(1);
    return rows[0] ?? null;
  });
}

export async function getServiceById(id: number) {
  return withDbFallback(null, async () => {
    const rows = await db
      .select()
      .from(services)
      .where(eq(services.id, id))
      .limit(1);
    return rows[0] ?? null;
  });
}

export async function createService(input: {
  title: string;
  slug: string;
  tagline?: string;
  description: string;
  problem?: string;
  approach?: string;
  benefits?: string[];
  cta?: string;
  iconKey?: string;
  active?: boolean;
  displayOrder?: number;
}) {
  return withDbFallback(0, async () => {
    const inserted = await db
      .insert(services)
      .values({
        title: input.title,
        slug: input.slug,
        tagline: input.tagline,
        description: input.description,
        problem: input.problem,
        approach: input.approach,
        benefits: input.benefits ?? [],
        cta: input.cta,
        iconKey: input.iconKey,
        active: input.active ?? true,
        displayOrder: input.displayOrder ?? 0,
      })
      .returning({ id: services.id });
    return inserted[0].id;
  });
}

export async function updateService(
  id: number,
  patch: Partial<{
    title: string;
    slug: string;
    tagline: string | null;
    description: string;
    problem: string | null;
    approach: string | null;
    benefits: string[];
    cta: string | null;
    iconKey: string | null;
    active: boolean;
    displayOrder: number;
  }>,
) {
  try {
    await db
      .update(services)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(services.id, id));
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
  }
}

export async function deleteService(id: number) {
  try {
    await db.delete(services).where(eq(services.id, id));
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
  }
}

// ---------------- Portfolio categories ----------------
export async function listActivePortfolioCategories() {
  return withDbFallback([], async () =>
    db
      .select()
      .from(portfolioCategories)
      .where(eq(portfolioCategories.active, true))
      .orderBy(asc(portfolioCategories.displayOrder), asc(portfolioCategories.id)),
  );
}

export async function listAllPortfolioCategories() {
  return withDbFallback([], async () =>
    db
      .select()
      .from(portfolioCategories)
      .orderBy(asc(portfolioCategories.displayOrder), asc(portfolioCategories.id)),
  );
}

export async function getCategoryBySlug(slug: string) {
  return withDbFallback(null, async () => {
    const rows = await db
      .select()
      .from(portfolioCategories)
      .where(eq(portfolioCategories.slug, slug))
      .limit(1);
    return rows[0] ?? null;
  });
}

export async function getCategoryById(id: number) {
  return withDbFallback(null, async () => {
    const rows = await db
      .select()
      .from(portfolioCategories)
      .where(eq(portfolioCategories.id, id))
      .limit(1);
    return rows[0] ?? null;
  });
}

export async function createPortfolioCategory(input: {
  name: string;
  slug: string;
  description?: string;
  active?: boolean;
  displayOrder?: number;
}) {
  return withDbFallback(0, async () => {
    const ins = await db
      .insert(portfolioCategories)
      .values({ ...input })
      .returning({ id: portfolioCategories.id });
    return ins[0].id;
  });
}

export async function updatePortfolioCategory(
  id: number,
  patch: Partial<{
    name: string;
    slug: string;
    description: string | null;
    active: boolean;
    displayOrder: number;
  }>,
) {
  try {
    await db
      .update(portfolioCategories)
      .set(patch)
      .where(eq(portfolioCategories.id, id));
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
  }
}

export async function deletePortfolioCategory(id: number) {
  try {
    await db.delete(portfolioCategories).where(eq(portfolioCategories.id, id));
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
  }
}

// ---------------- Portfolio projects ----------------
export async function listVisibleProjects(opts?: {
  categorySlug?: string;
  search?: string;
  featuredOnly?: boolean;
}) {
  return withDbFallback([], async () => {
    const conditions = [eq(portfolioProjects.visible, true)];
    if (opts?.featuredOnly) conditions.push(eq(portfolioProjects.featured, true));
    if (opts?.categorySlug) {
      const cat = await getCategoryBySlug(opts.categorySlug);
      if (!cat) return [];
      conditions.push(eq(portfolioProjects.categoryId, cat.id));
    }
    const rows = await db
      .select({
        project: portfolioProjects,
        category: portfolioCategories,
      })
      .from(portfolioProjects)
      .leftJoin(
        portfolioCategories,
        eq(portfolioProjects.categoryId, portfolioCategories.id),
      )
      .where(and(...conditions))
      .orderBy(
        asc(portfolioProjects.displayOrder),
        desc(portfolioProjects.id),
      );

    const search = opts?.search?.trim().toLowerCase();
    if (!search) return rows;
    return rows.filter(({ project, category }) => {
      const tags = (project.tags ?? []) as string[];
      return (
        project.title.toLowerCase().includes(search) ||
        (project.description ?? "").toLowerCase().includes(search) ||
        (category?.name ?? "").toLowerCase().includes(search) ||
        (project.client ?? "").toLowerCase().includes(search) ||
        tags.some((t) => t.toLowerCase().includes(search))
      );
    });
  });
}

export async function listAllProjects() {
  return withDbFallback([], async () =>
    db
      .select({
        project: portfolioProjects,
        category: portfolioCategories,
      })
      .from(portfolioProjects)
      .leftJoin(
        portfolioCategories,
        eq(portfolioProjects.categoryId, portfolioCategories.id),
      )
      .orderBy(asc(portfolioProjects.displayOrder), desc(portfolioProjects.id)),
  );
}

export async function getProjectBySlug(slug: string) {
  return withDbFallback(null, async () => {
    const rows = await db
      .select({
        project: portfolioProjects,
        category: portfolioCategories,
      })
      .from(portfolioProjects)
      .leftJoin(
        portfolioCategories,
        eq(portfolioProjects.categoryId, portfolioCategories.id),
      )
      .where(eq(portfolioProjects.slug, slug))
      .limit(1);
    return rows[0] ?? null;
  });
}

export async function getProjectById(id: number) {
  return withDbFallback(null, async () => {
    const rows = await db
      .select()
      .from(portfolioProjects)
      .where(eq(portfolioProjects.id, id))
      .limit(1);
    return rows[0] ?? null;
  });
}

export async function createProject(input: {
  title: string;
  slug: string;
  categoryId: number;
  description: string;
  shortDescription?: string;
  projectUrl?: string;
  thumbnailUrl?: string;
  imageUrls?: string[];
  tags?: string[];
  client?: string;
  year?: number;
  featured?: boolean;
  visible?: boolean;
  displayOrder?: number;
}) {
  return withDbFallback(0, async () => {
    const ins = await db
      .insert(portfolioProjects)
      .values({ ...input })
      .returning({ id: portfolioProjects.id });
    return ins[0].id;
  });
}

export async function updateProject(
  id: number,
  patch: Partial<{
    title: string;
    slug: string;
    categoryId: number;
    description: string;
    shortDescription: string | null;
    projectUrl: string | null;
    thumbnailUrl: string | null;
    imageUrls: string[];
    tags: string[];
    client: string | null;
    year: number | null;
    featured: boolean;
    visible: boolean;
    displayOrder: number;
  }>,
) {
  try {
    await db
      .update(portfolioProjects)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(portfolioProjects.id, id));
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
  }
}

export async function deleteProject(id: number) {
  try {
    await db.delete(portfolioProjects).where(eq(portfolioProjects.id, id));
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
  }
}

// ---------------- Founders ----------------
export async function listFounders() {
  return withDbFallback([], async () =>
    db
      .select()
      .from(founders)
      .orderBy(asc(founders.displayOrder), asc(founders.id)),
  );
}

export async function updateFounder(
  id: number,
  patch: Partial<{
    name: string;
    role: string;
    bio: string;
    responsibilities: string[];
    skills: string[];
    photoUrl: string | null;
    social: { label: string; url: string }[];
    displayOrder: number;
    isPrimary: boolean;
  }>,
) {
  try {
    await db.update(founders).set(patch).where(eq(founders.id, id));
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
  }
}

export async function getFounderById(id: number) {
  return withDbFallback(null, async () => {
    const rows = await db
      .select()
      .from(founders)
      .where(eq(founders.id, id))
      .limit(1);
    return rows[0] ?? null;
  });
}

// ---------------- Team ----------------
export async function listActiveTeam() {
  return withDbFallback([], async () =>
    db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.active, true))
      .orderBy(asc(teamMembers.displayOrder), asc(teamMembers.id)),
  );
}

export async function listAllTeam() {
  return withDbFallback([], async () =>
    db
      .select()
      .from(teamMembers)
      .orderBy(asc(teamMembers.displayOrder), asc(teamMembers.id)),
  );
}

export async function getTeamMemberById(id: number) {
  return withDbFallback(null, async () => {
    const rows = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.id, id))
      .limit(1);
    return rows[0] ?? null;
  });
}

export async function createTeamMember(input: {
  name: string;
  role: string;
  bio: string;
  department?: string;
  skills?: string[];
  photoUrl?: string;
  social?: { label: string; url: string }[];
  active?: boolean;
  displayOrder?: number;
}) {
  return withDbFallback(0, async () => {
    const ins = await db
      .insert(teamMembers)
      .values({ ...input })
      .returning({ id: teamMembers.id });
    return ins[0].id;
  });
}

export async function updateTeamMember(
  id: number,
  patch: Partial<{
    name: string;
    role: string;
    bio: string;
    department: string | null;
    skills: string[];
    photoUrl: string | null;
    social: { label: string; url: string }[];
    active: boolean;
    displayOrder: number;
  }>,
) {
  try {
    await db
      .update(teamMembers)
      .set(patch)
      .where(eq(teamMembers.id, id));
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
  }
}

export async function deleteTeamMember(id: number) {
  try {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
  }
}

// ---------------- Availability ----------------
export async function listAvailabilityRules() {
  return withDbFallback([], async () =>
    db
      .select()
      .from(availabilityRules)
      .orderBy(asc(availabilityRules.dayOfWeek)),
  );
}

export async function upsertAvailabilityRule(input: {
  dayOfWeek: number;
  enabled: boolean;
  startTime: string;
  endTime: string;
  slotMinutes: number;
}) {
  try {
    const existing = await db
      .select()
      .from(availabilityRules)
      .where(eq(availabilityRules.dayOfWeek, input.dayOfWeek))
      .limit(1);
    if (existing.length === 0) {
      await db.insert(availabilityRules).values({ ...input });
    } else {
      await db
        .update(availabilityRules)
        .set({
          enabled: input.enabled,
          startTime: input.startTime,
          endTime: input.endTime,
          slotMinutes: input.slotMinutes,
        })
        .where(eq(availabilityRules.dayOfWeek, input.dayOfWeek));
    }
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
  }
}

export async function listBlockedDates() {
  return withDbFallback([], async () =>
    db
      .select()
      .from(blockedDates)
      .orderBy(asc(blockedDates.date)),
  );
}

export async function addBlockedDate(date: string, reason?: string) {
  try {
    await db.insert(blockedDates).values({ date, reason });
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
  }
}

export async function removeBlockedDate(id: number) {
  try {
    await db.delete(blockedDates).where(eq(blockedDates.id, id));
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
  }
}

// ---------------- Appointments ----------------
export async function listAppointments(opts?: { status?: string }) {
  return withDbFallback([], async () => {
    const conditions = [] as ReturnType<typeof eq>[];
    if (opts?.status) conditions.push(eq(appointments.status, opts.status as never));
    return db
      .select()
      .from(appointments)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(appointments.createdAt));
  });
}

export async function getAppointmentByRef(reference: string) {
  return withDbFallback(null, async () => {
    const rows = await db
      .select()
      .from(appointments)
      .where(eq(appointments.reference, reference))
      .limit(1);
    return rows[0] ?? null;
  });
}

export async function getBookedTimesForDate(date: string) {
  return withDbFallback([], async () => {
    const rows = await db
      .select({
        time: appointments.requestedTime,
        status: appointments.status,
      })
      .from(appointments)
      .where(eq(appointments.requestedDate, date));
    const blocked = new Set<string>();
    for (const r of rows) {
      if (["approved", "pending", "rescheduled"].includes(r.status)) {
        blocked.add(r.time);
      }
    }
    return Array.from(blocked);
  });
}

export async function createAppointment(input: {
  reference: string;
  customerName: string;
  email: string;
  phone: string;
  company?: string;
  serviceId?: number;
  serviceTitle?: string;
  requestedDate: string;
  requestedTime: string;
  message?: string;
  history: { at: string; action: string; note?: string }[];
}) {
  return withDbFallback(null, async () => {
    const ins = await db
      .insert(appointments)
      .values({
        reference: input.reference,
        customerName: input.customerName,
        email: input.email,
        phone: input.phone,
        company: input.company,
        serviceId: input.serviceId,
        serviceTitle: input.serviceTitle,
        requestedDate: input.requestedDate,
        requestedTime: input.requestedTime,
        message: input.message,
        history: input.history,
        status: "pending",
      })
      .returning({ id: appointments.id, reference: appointments.reference });
    return ins[0];
  });
}

export async function updateAppointmentStatus(
  id: number,
  next: {
    status:
      | "pending"
      | "approved"
      | "rejected"
      | "rescheduled"
      | "completed"
      | "cancelled";
    adminNote?: string | null;
    proposedDate?: string | null;
    proposedTime?: string | null;
    historyEntry?: { at: string; action: string; note?: string };
  },
) {
  try {
    const existing = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, id))
      .limit(1);
    const current = existing[0];
    if (!current) return;
    const history = (current.history ?? []) as {
      at: string;
      action: string;
      note?: string;
    }[];
    if (next.historyEntry) history.push(next.historyEntry);
    await db
      .update(appointments)
      .set({
        status: next.status,
        adminNote: next.adminNote ?? current.adminNote,
        proposedDate: next.proposedDate ?? current.proposedDate,
        proposedTime: next.proposedTime ?? current.proposedTime,
        history,
        updatedAt: new Date(),
      })
      .where(eq(appointments.id, id));
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
  }
}

// ---------------- Blog ----------------
export async function listPublishedPosts(opts?: { search?: string; categorySlug?: string }) {
  return withDbFallback([], async () => {
    const conditions = [eq(blogPosts.published, true)];
    if (opts?.categorySlug) {
      const cat = await db
        .select()
        .from(blogCategories)
        .where(eq(blogCategories.slug, opts.categorySlug))
        .limit(1);
      if (!cat[0]) return [];
      conditions.push(eq(blogPosts.categoryId, cat[0].id));
    }
    const rows = await db
      .select({
        post: blogPosts,
        category: blogCategories,
      })
      .from(blogPosts)
      .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
      .where(and(...conditions))
      .orderBy(desc(blogPosts.publishedAt));
    const search = opts?.search?.trim().toLowerCase();
    if (!search) return rows;
    return rows.filter(({ post, category }) => {
      const tags = (post.tags ?? []) as string[];
      return (
        post.title.toLowerCase().includes(search) ||
        (post.excerpt ?? "").toLowerCase().includes(search) ||
        (post.content ?? "").toLowerCase().includes(search) ||
        (category?.name ?? "").toLowerCase().includes(search) ||
        tags.some((t) => t.toLowerCase().includes(search))
      );
    });
  });
}

export async function listAllPosts() {
  return withDbFallback([], async () =>
    db
      .select({ post: blogPosts, category: blogCategories })
      .from(blogPosts)
      .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
      .orderBy(desc(blogPosts.createdAt)),
  );
}

export async function getPostBySlug(slug: string) {
  return withDbFallback(null, async () => {
    const rows = await db
      .select({ post: blogPosts, category: blogCategories })
      .from(blogPosts)
      .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
      .where(eq(blogPosts.slug, slug))
      .limit(1);
    return rows[0] ?? null;
  });
}

export async function createPost(input: {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverUrl?: string;
  categoryId?: number;
  tags?: string[];
  published?: boolean;
  publishedAt?: Date | null;
}) {
  return withDbFallback(0, async () => {
    const ins = await db
      .insert(blogPosts)
      .values({
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt,
        content: input.content,
        coverUrl: input.coverUrl,
        categoryId: input.categoryId,
        tags: input.tags ?? [],
        published: input.published ?? false,
        publishedAt:
          input.publishedAt ?? (input.published ? new Date() : null),
      })
      .returning({ id: blogPosts.id });
    return ins[0].id;
  });
}

export async function updatePost(
  id: number,
  patch: Partial<{
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    coverUrl: string | null;
    categoryId: number | null;
    tags: string[];
    published: boolean;
    publishedAt: Date | null;
  }>,
) {
  try {
    await db
      .update(blogPosts)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(blogPosts.id, id));
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
  }
}

export async function deletePost(id: number) {
  try {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
  }
}

export async function listBlogCategories() {
  return withDbFallback([], async () =>
    db
      .select()
      .from(blogCategories)
      .orderBy(asc(blogCategories.id)),
  );
}

export async function createBlogCategory(name: string, slug: string) {
  return withDbFallback(0, async () => {
    const ins = await db
      .insert(blogCategories)
      .values({ name, slug })
      .returning({ id: blogCategories.id });
    return ins[0].id;
  });
}

// ---------------- Enquiries ----------------
export async function listEnquiries() {
  return withDbFallback([], async () =>
    db
      .select()
      .from(enquiries)
      .orderBy(desc(enquiries.createdAt)),
  );
}

export async function createEnquiry(input: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
}) {
  return withDbFallback(0, async () => {
    const ins = await db
      .insert(enquiries)
      .values({ ...input })
      .returning({ id: enquiries.id });
    return ins[0].id;
  });
}

export async function updateEnquiryStatus(
  id: number,
  status: "new" | "contacted" | "in_progress" | "closed",
) {
  try {
    await db
      .update(enquiries)
      .set({ status })
      .where(eq(enquiries.id, id));
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
  }
}

// ---------------- Dashboard stats ----------------
export async function getDashboardStats() {
  return getDashboardStatsDetailed();
}

export async function getDashboardStatsDetailed() {
  return withDbFallback(
    {
      appointments: { total: 0, pending: 0, approved: 0, rejected: 0, rescheduled: 0, completed: 0, cancelled: 0 },
      portfolio: { total: 0, visible: 0, featured: 0 },
      services: { total: 0, active: 0 },
      team: { total: 0, active: 0 },
      enquiries: { total: 0, new: 0 },
    },
    async () => {
      const allAppts = await db.select().from(appointments);
      const allProj = await db.select().from(portfolioProjects);
      const allSrv = await db.select().from(services);
      const allTeam = await db.select().from(teamMembers);
      const allEnq = await db.select().from(enquiries);

      const inc = (arr: { status?: string | null }[], status: string) =>
        arr.filter((a) => a.status === status).length;

      return {
        appointments: {
          total: allAppts.length,
          pending: inc(allAppts, "pending"),
          approved: inc(allAppts, "approved"),
          rejected: inc(allAppts, "rejected"),
          rescheduled: inc(allAppts, "rescheduled"),
          completed: inc(allAppts, "completed"),
          cancelled: inc(allAppts, "cancelled"),
        },
        portfolio: {
          total: allProj.length,
          visible: allProj.filter((p) => p.visible).length,
          featured: allProj.filter((p) => p.featured).length,
        },
        services: {
          total: allSrv.length,
          active: allSrv.filter((s) => s.active).length,
        },
        team: {
          total: allTeam.length,
          active: allTeam.filter((m) => m.active).length,
        },
        enquiries: {
          total: allEnq.length,
          new: allEnq.filter((e) => e.status === "new").length,
        },
      };
    },
  );
}
