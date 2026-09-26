import { db } from "@/db";
import {
  admins,
  appointments,
  appointmentNotificationJobs,
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
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import bcrypt from "bcryptjs";
import {
  firebaseDeleteCategory,
  firebaseDeleteBlogPost,
  firebaseDeleteProject,
  firebaseDeleteService,
  firebaseGetCategoryBySlug,
  firebaseGetProjectBySlug,
  firebaseGetBlogPostBySlug,
  firebaseGetServiceBySlug,
  firebaseListCategories,
  firebaseListProjects,
  firebaseListBlogCategories,
  firebaseListBlogPosts,
  firebaseListAvailability,
  firebaseSaveAvailability,
  firebaseListBlockedDates,
  firebaseSaveBlockedDate,
  firebaseDeleteBlockedDate,
  firebaseListAppointments,
  firebaseGetAppointmentByRef,
  firebaseGetAppointmentByUid,
  firebaseGetLatestAppointmentByUid,
  firebaseGetBookedTimes,
  firebaseCreateAppointment,
  firebaseUpdateAppointment,
  firebaseListEnquiries,
  firebaseCreateEnquiry,
  firebaseUpdateEnquiryStatus,
  firebaseGetSetting,
  firebaseSetSetting,
  firebaseListCollection,
  firebaseListFounders,
  firebaseListTeamMembers,
  firebaseSaveCollectionItem,
  firebaseDeleteCollectionItem,
  firebaseListServices,
  firebaseSaveCategory,
  firebaseSaveProject,
  firebaseSaveBlogCategory,
  firebaseSaveBlogPost,
  firebaseSaveService,
  firebaseRetryLatestAppointmentNotification,
  firebaseAcceptAppointmentReschedule,
} from "@/lib/firebase-content";
import { firebaseAdminConfigured } from "@/lib/firebase-admin";

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
  const firebaseValue = await firebaseGetSetting<T>(key);
  if (firebaseValue !== null) return firebaseValue;
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
  if (firebaseAdminConfigured) {
    await firebaseSetSetting(key, value);
    return;
  }
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
  const firebaseServices = await firebaseListServices(true);
  if (firebaseServices) return firebaseServices;
  return withDbFallback([], async () =>
    db
      .select()
      .from(services)
      .where(eq(services.active, true))
      .orderBy(asc(services.displayOrder), asc(services.id)),
  );
}

export async function listAllServices() {
  const firebaseServices = await firebaseListServices(false);
  if (firebaseServices) return firebaseServices;
  return withDbFallback([], async () =>
    db
      .select()
      .from(services)
      .orderBy(asc(services.displayOrder), asc(services.id)),
  );
}

export async function getServiceBySlug(slug: string) {
  const firebaseService = await firebaseGetServiceBySlug(slug);
  if (firebaseService) return firebaseService;
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
  const firebaseId = await firebaseSaveService(undefined, input);
  if (firebaseId) return firebaseId;
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
  if (await firebaseListServices(false)) {
    await firebaseSaveService(id, patch);
    return;
  }
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
  if (await firebaseListServices(false)) {
    await firebaseDeleteService(id);
    return;
  }
  try {
    await db.delete(services).where(eq(services.id, id));
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
  }
}

// ---------------- Portfolio categories ----------------
export async function listActivePortfolioCategories() {
  const firebaseCategories = await firebaseListCategories(true);
  if (firebaseCategories) return firebaseCategories;
  return withDbFallback([], async () =>
    db
      .select()
      .from(portfolioCategories)
      .where(eq(portfolioCategories.active, true))
      .orderBy(asc(portfolioCategories.displayOrder), asc(portfolioCategories.id)),
  );
}

export async function listAllPortfolioCategories() {
  const firebaseCategories = await firebaseListCategories(false);
  if (firebaseCategories) return firebaseCategories;
  return withDbFallback([], async () =>
    db
      .select()
      .from(portfolioCategories)
      .orderBy(asc(portfolioCategories.displayOrder), asc(portfolioCategories.id)),
  );
}

export async function getCategoryBySlug(slug: string) {
  const firebaseCategory = await firebaseGetCategoryBySlug(slug);
  if (firebaseCategory) return firebaseCategory;
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
  const firebaseId = await firebaseSaveCategory(undefined, input);
  if (firebaseId) return firebaseId;
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
  if (await firebaseListCategories(false)) {
    await firebaseSaveCategory(id, patch);
    return;
  }
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
  if (await firebaseListCategories(false)) {
    await firebaseDeleteCategory(id);
    return;
  }
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
  const firebaseProjects = await firebaseListProjects();
  if (firebaseProjects) {
    const categories = await firebaseListCategories(true);
    const activeCategoryIds = new Set((categories ?? []).map((category) => category.id));
    const search = opts?.search?.trim().toLowerCase();
    return firebaseProjects.filter(({ project, category }) => {
      if (!project.visible || !activeCategoryIds.has(project.categoryId)) return false;
      if (opts?.featuredOnly && !project.featured) return false;
      if (opts?.categorySlug && category?.slug !== opts.categorySlug) return false;
      if (!search) return true;
      const haystack = [
        project.title,
        project.description,
        category?.name ?? "",
        project.client ?? "",
        ...project.tags,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(search);
    });
  }
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
  const firebaseProjects = await firebaseListProjects();
  if (firebaseProjects) return firebaseProjects;
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
  const firebaseProject = await firebaseGetProjectBySlug(slug);
  if (firebaseProject) return firebaseProject;
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
  const firebaseId = await firebaseSaveProject(undefined, input);
  if (firebaseId) return firebaseId;
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
  if (await firebaseListProjects()) {
    await firebaseSaveProject(id, patch);
    return;
  }
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
  if (await firebaseListProjects()) {
    await firebaseDeleteProject(id);
    return;
  }
  try {
    await db.delete(portfolioProjects).where(eq(portfolioProjects.id, id));
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
  }
}

// ---------------- Founders ----------------
export async function listFounders() {
  const firebaseFounders = await firebaseListFounders();
  if (firebaseFounders) return firebaseFounders;
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
  if (await firebaseListCollection("founders")) {
    await firebaseSaveCollectionItem("founders", id, patch);
    return;
  }
  try {
    await db.update(founders).set(patch).where(eq(founders.id, id));
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
  }
}

export async function getFounderById(id: number) {
  const firebaseFounders = await firebaseListFounders();
  const firebaseFounder = firebaseFounders?.find((founder) => founder.id === id);
  if (firebaseFounder) return firebaseFounder;
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
  const firebaseTeam = await firebaseListTeamMembers();
  if (firebaseTeam) return firebaseTeam.filter((member) => member.active !== false);
  return withDbFallback([], async () =>
    db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.active, true))
      .orderBy(asc(teamMembers.displayOrder), asc(teamMembers.id)),
  );
}

export async function listAllTeam() {
  const firebaseTeam = await firebaseListTeamMembers();
  if (firebaseTeam) return firebaseTeam;
  return withDbFallback([], async () =>
    db
      .select()
      .from(teamMembers)
      .orderBy(asc(teamMembers.displayOrder), asc(teamMembers.id)),
  );
}

export async function getTeamMemberById(id: number) {
  const firebaseTeam = await firebaseListTeamMembers();
  const firebaseMember = firebaseTeam?.find((member) => member.id === id);
  if (firebaseMember) return firebaseMember;
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
  const firebaseId = await firebaseSaveCollectionItem("teamMembers", undefined, input);
  if (firebaseId) return firebaseId;
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
  if (await firebaseListCollection("teamMembers")) {
    await firebaseSaveCollectionItem("teamMembers", id, patch);
    return;
  }
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
  if (await firebaseListCollection("teamMembers")) {
    await firebaseDeleteCollectionItem("teamMembers", id);
    return;
  }
  try {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
  }
}

// ---------------- Availability ----------------
export async function listAvailabilityRules() {
  const firebaseRules = await firebaseListAvailability();
  if (firebaseRules) return firebaseRules;
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
  if (await firebaseListAvailability()) {
    await firebaseSaveAvailability(input);
    return;
  }
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
  const firebaseDates = await firebaseListBlockedDates();
  if (firebaseDates) return firebaseDates;
  return withDbFallback([], async () =>
    db
      .select()
      .from(blockedDates)
      .orderBy(asc(blockedDates.date)),
  );
}

export async function addBlockedDate(date: string, reason?: string) {
  if (await firebaseListBlockedDates()) {
    await firebaseSaveBlockedDate(date, reason);
    return;
  }
  try {
    await db.insert(blockedDates).values({ date, reason });
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
  }
}

export async function removeBlockedDate(id: number) {
  if (await firebaseListBlockedDates()) {
    await firebaseDeleteBlockedDate(id);
    return;
  }
  try {
    await db.delete(blockedDates).where(eq(blockedDates.id, id));
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
  }
}

// ---------------- Appointments ----------------
export async function listAppointments(opts?: { status?: string }) {
  const firebaseAppointments = await firebaseListAppointments(opts?.status);
  if (firebaseAppointments) return firebaseAppointments;
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
  const firebaseAppointment = await firebaseGetAppointmentByRef(reference);
  if (firebaseAppointment) return firebaseAppointment;
  return withDbFallback(null, async () => {
    const rows = await db
      .select()
      .from(appointments)
      .where(eq(appointments.reference, reference))
      .limit(1);
    return rows[0] ?? null;
  });
}

export async function getAppointmentByUid(uid: string) {
  const firebaseAppointment = await firebaseGetAppointmentByUid(uid);
  if (firebaseAppointment) return firebaseAppointment;
  return withDbFallback(null, async () => {
    const rows = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.uid, uid),
          inArray(appointments.status, ["pending", "approved", "rescheduled"]),
        ),
      )
      .orderBy(desc(appointments.createdAt))
      .limit(1);
    return rows[0] ?? null;
  });
}

export async function getLatestAppointmentByUid(uid: string) {
  const firebaseAppointment = await firebaseGetLatestAppointmentByUid(uid);
  if (firebaseAppointment) return firebaseAppointment;
  return withDbFallback(null, async () => {
    const rows = await db
      .select()
      .from(appointments)
      .where(eq(appointments.uid, uid))
      .orderBy(desc(appointments.createdAt))
      .limit(1);
    return rows[0] ?? null;
  });
}

export async function getBookedTimesForDate(date: string) {
  const firebaseTimes = await firebaseGetBookedTimes(date);
  if (firebaseTimes) return firebaseTimes;
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
  uid: string;
  reference: string;
  customerName: string;
  email: string;
  phone: string;
  company?: string;
  serviceId?: number;
  serviceTitle?: string;
  requestedDate: string;
  requestedTime: string;
  durationMinutes?: number;
  message?: string;
  history: { at: string; action: string; note?: string }[];
}) {
  const firebaseAppointment = await firebaseCreateAppointment(input);
  if (firebaseAppointment) return firebaseAppointment;
  return db.transaction(async (transaction) => {
    const [created] = await transaction
      .insert(appointments)
      .values({
        reference: input.reference,
        uid: input.uid,
        customerName: input.customerName,
        email: input.email,
        phone: input.phone,
        company: input.company,
        serviceId: input.serviceId,
        serviceTitle: input.serviceTitle,
        requestedDate: input.requestedDate,
        requestedTime: input.requestedTime,
        durationMinutes: input.durationMinutes ?? 60,
        message: input.message,
        history: input.history,
        status: "pending",
        notificationVersion: 1,
        notificationStatus: "queued",
        lastNotificationType: "booking_received",
      })
      .returning({ id: appointments.id, reference: appointments.reference });
    await transaction.insert(appointmentNotificationJobs).values({
      id: `${created.reference}_1`,
      appointmentId: created.id,
      appointmentReference: created.reference,
      eventType: "booking_received",
      version: 1,
    });
    return created;
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
    requestedDate?: string;
    requestedTime?: string;
    cancellationReason?: string | null;
    internalNote?: string | null;
    durationMinutes?: number;
    notificationType?:
      | "approved"
      | "rejected"
      | "reschedule_proposed"
      | "rescheduled_confirmed"
      | "cancelled";
    previousDate?: string;
    previousTime?: string;
    historyEntry?: { at: string; action: string; note?: string };
  },
) {
  if (firebaseAdminConfigured) {
    const updated = await firebaseUpdateAppointment(id, next);
    if (!updated) throw new Error("Appointment not found.");
    return updated;
  }
  return db.transaction(async (transaction) => {
    const [current] = await transaction
      .select()
      .from(appointments)
      .where(eq(appointments.id, id))
      .for("update")
      .limit(1);
    if (!current) throw new Error("Appointment not found.");
    const {
      historyEntry,
      notificationType,
      previousDate,
      previousTime,
      ...patch
    } = next;
    const unchanged =
      current.status === patch.status &&
      Object.entries(patch).every(([key, value]) => {
        if (key === "status") return true;
        const oldValue = (current as unknown as Record<string, unknown>)[key];
        return JSON.stringify(oldValue ?? null) === JSON.stringify(value ?? null);
      });
    if (notificationType && unchanged) return current;
    const history = [
      ...((current.history ?? []) as {
        at: string;
        action: string;
        note?: string;
      }[]),
      ...(historyEntry ? [historyEntry] : []),
    ];
    const version = notificationType
      ? current.notificationVersion + 1
      : current.notificationVersion;
    const [updated] = await transaction
      .update(appointments)
      .set({
        ...patch,
        history,
        notificationVersion: version,
        notificationStatus: notificationType
          ? "queued"
          : current.notificationStatus,
        lastNotificationType:
          notificationType ?? current.lastNotificationType,
        lastNotificationError: notificationType
          ? null
          : current.lastNotificationError,
        updatedAt: new Date(),
      })
      .where(eq(appointments.id, id))
      .returning();
    if (notificationType) {
      await transaction.insert(appointmentNotificationJobs).values({
        id: `${current.reference}_${version}`,
        appointmentId: id,
        appointmentReference: current.reference,
        eventType: notificationType,
        version,
        previousDate: previousDate ?? current.requestedDate,
        previousTime: previousTime ?? current.requestedTime,
      });
    }
    return updated;
  });
}

export async function retryLatestAppointmentNotification(id: number) {
  if (firebaseAdminConfigured) {
    return firebaseRetryLatestAppointmentNotification(id);
  }
  return db.transaction(async (transaction) => {
    const [appointment] = await transaction
      .select()
      .from(appointments)
      .where(eq(appointments.id, id))
      .for("update")
      .limit(1);
    if (!appointment) throw new Error("Appointment not found.");
    const [job] = await transaction
      .select()
      .from(appointmentNotificationJobs)
      .where(
        and(
          eq(appointmentNotificationJobs.appointmentId, id),
          eq(appointmentNotificationJobs.status, "failed"),
        ),
      )
      .orderBy(desc(appointmentNotificationJobs.version))
      .limit(1)
      .for("update");
    if (!job || job.version !== appointment.notificationVersion) return false;
    const now = new Date();
    await transaction
      .update(appointmentNotificationJobs)
      .set({
        status: "pending",
        attempts: 0,
        nextAttemptAt: now,
        leaseUntil: null,
        lastErrorCode: null,
        updatedAt: now,
      })
      .where(eq(appointmentNotificationJobs.id, job.id));
    await transaction
      .update(appointments)
      .set({
        notificationStatus: "queued",
        lastNotificationError: null,
        updatedAt: now,
      })
      .where(eq(appointments.id, id));
    return true;
  });
}

export async function acceptAppointmentReschedule(
  reference: string,
  uid: string,
) {
  if (firebaseAdminConfigured) {
    return firebaseAcceptAppointmentReschedule(reference, uid);
  }
  return db.transaction(async (transaction) => {
    const [current] = await transaction
      .select()
      .from(appointments)
      .where(eq(appointments.reference, reference))
      .for("update")
      .limit(1);
    if (
      !current ||
      current.uid !== uid ||
      current.status !== "rescheduled" ||
      !current.proposedDate ||
      !current.proposedTime
    ) {
      return null;
    }
    const requestedDate = current.proposedDate;
    const requestedTime = current.proposedTime;
    const conflicts = await transaction
      .select({ id: appointments.id })
      .from(appointments)
      .where(
        and(
          eq(appointments.requestedDate, requestedDate),
          eq(appointments.requestedTime, requestedTime),
          inArray(appointments.status, ["pending", "approved", "rescheduled"]),
        ),
      )
      .limit(1);
    if (conflicts.some(({ id: conflictId }) => conflictId !== current.id)) {
      const error = new Error("The proposed appointment time is no longer available.");
      error.name = "AppointmentConflictError";
      throw error;
    }
    const now = new Date();
    const version = current.notificationVersion + 1;
    const history = [
      ...((current.history ?? []) as {
        at: string;
        action: string;
        note?: string;
      }[]),
      {
        at: now.toISOString(),
        action: "reschedule_accepted",
        note: "Customer accepted the proposed appointment time.",
      },
    ];
    const [updated] = await transaction
      .update(appointments)
      .set({
        requestedDate,
        requestedTime,
        proposedDate: null,
        proposedTime: null,
        status: "approved",
        history,
        notificationVersion: version,
        notificationStatus: "queued",
        lastNotificationType: "rescheduled_confirmed",
        lastNotificationError: null,
        meetingStatus: current.googleEventId ? "pending" : "not_required",
        updatedAt: now,
      })
      .where(eq(appointments.id, current.id))
      .returning();
    await transaction.insert(appointmentNotificationJobs).values({
      id: `${current.reference}_${version}`,
      appointmentId: current.id,
      appointmentReference: current.reference,
      eventType: "rescheduled_confirmed",
      version,
      previousDate: current.requestedDate,
      previousTime: current.requestedTime,
    });
    return updated;
  });
}

// ---------------- Blog ----------------
export async function listPublishedPosts(opts?: { search?: string; categorySlug?: string }) {
  const firebasePosts = await firebaseListBlogPosts();
  if (firebasePosts) {
    const search = opts?.search?.trim().toLowerCase();
    return firebasePosts.filter(({ post, category }) => {
      if (!post.published) return false;
      if (opts?.categorySlug && category?.slug !== opts.categorySlug) return false;
      if (!search) return true;
      return [
        post.title,
        post.excerpt ?? "",
        post.content,
        category?.name ?? "",
        ...post.tags,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search);
    });
  }
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
  const firebasePosts = await firebaseListBlogPosts();
  if (firebasePosts) return firebasePosts;
  return withDbFallback([], async () =>
    db
      .select({ post: blogPosts, category: blogCategories })
      .from(blogPosts)
      .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
      .orderBy(desc(blogPosts.createdAt)),
  );
}

export async function getPostBySlug(slug: string) {
  const firebasePost = await firebaseGetBlogPostBySlug(slug);
  if (firebasePost) return firebasePost;
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
  const firebaseId = await firebaseSaveBlogPost(undefined, input);
  if (firebaseId) return firebaseId;
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
  if (await firebaseListBlogPosts()) {
    await firebaseSaveBlogPost(id, patch);
    return;
  }
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
  if (await firebaseListBlogPosts()) {
    await firebaseDeleteBlogPost(id);
    return;
  }
  try {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
  }
}

export async function listBlogCategories() {
  const firebaseCategories = await firebaseListBlogCategories();
  if (firebaseCategories) return firebaseCategories;
  return withDbFallback([], async () =>
    db
      .select()
      .from(blogCategories)
      .orderBy(asc(blogCategories.id)),
  );
}

export async function createBlogCategory(name: string, slug: string) {
  const firebaseId = await firebaseSaveBlogCategory(undefined, { name, slug });
  if (firebaseId) return firebaseId;
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
  const firebaseEnquiries = await firebaseListEnquiries();
  if (firebaseEnquiries) return firebaseEnquiries;
  return withDbFallback([], async () =>
    db
      .select()
      .from(enquiries)
      .orderBy(desc(enquiries.createdAt)),
  );
}

export async function createEnquiry(input: {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
}) {
  const firebaseId = await firebaseCreateEnquiry(input);
  if (firebaseId) return firebaseId;
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
  if (await firebaseListEnquiries()) {
    await firebaseUpdateEnquiryStatus(id, status);
    return;
  }
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
  const [
    firebaseAppts,
    firebaseProjects,
    firebaseServices,
    firebaseTeam,
    firebaseEnquiries,
  ] = await Promise.all([
    firebaseListAppointments(),
    firebaseListProjects(),
    firebaseListServices(false),
    firebaseListTeamMembers(),
    firebaseListEnquiries(),
  ]);

  if (
    firebaseAppts &&
    firebaseProjects &&
    firebaseServices &&
    firebaseTeam &&
    firebaseEnquiries
  ) {
    const countStatus = (rows: { status?: string | null }[], status: string) =>
      rows.filter((row) => row.status === status).length;

    return {
      appointments: {
        total: firebaseAppts.length,
        pending: countStatus(firebaseAppts, "pending"),
        approved: countStatus(firebaseAppts, "approved"),
        rejected: countStatus(firebaseAppts, "rejected"),
        rescheduled: countStatus(firebaseAppts, "rescheduled"),
        completed: countStatus(firebaseAppts, "completed"),
        cancelled: countStatus(firebaseAppts, "cancelled"),
      },
      portfolio: {
        total: firebaseProjects.length,
        visible: firebaseProjects.filter(({ project }) => project.visible).length,
        featured: firebaseProjects.filter(({ project }) => project.featured).length,
      },
      services: {
        total: firebaseServices.length,
        active: firebaseServices.filter((service) => service.active).length,
      },
      team: {
        total: firebaseTeam.length,
        active: firebaseTeam.filter((member) => member.active).length,
      },
      enquiries: {
        total: firebaseEnquiries.length,
        new: countStatus(firebaseEnquiries, "new"),
      },
    };
  }

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
