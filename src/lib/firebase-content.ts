import {
  firebaseAdminConfigured,
  firestore,
  requireFirebaseAdmin,
} from "@/lib/firebase-admin";

type Service = {
  id: number;
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
  createdAt: Date;
  updatedAt: Date;
};

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  active: boolean;
  displayOrder: number;
};

type Project = {
  id: number;
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
  createdAt: Date;
  updatedAt: Date;
};

type BlogCategory = {
  id: number;
  name: string;
  slug: string;
};

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverUrl: string | null;
  categoryId: number | null;
  tags: string[];
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type AvailabilityRule = {
  id: number;
  dayOfWeek: number;
  enabled: boolean;
  startTime: string;
  endTime: string;
  slotMinutes: number;
};

type BlockedDate = { id: number; date: string; reason: string | null };

type Appointment = {
  id: number;
  reference: string;
  customerName: string;
  email: string;
  phone: string;
  company: string | null;
  serviceId: number | null;
  serviceTitle: string | null;
  requestedDate: string;
  requestedTime: string;
  message: string | null;
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "rescheduled"
    | "completed"
    | "cancelled";
  adminNote: string | null;
  proposedDate: string | null;
  proposedTime: string | null;
  history: { at: string; action: string; note?: string }[];
  createdAt: Date;
  updatedAt: Date;
  uid: string | null;
};

type Enquiry = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type Founder = {
  id: number;
  name: string;
  role: string;
  bio: string;
  responsibilities: string[];
  skills: string[];
  photoUrl: string | null;
  social: { label: string; url: string }[];
  displayOrder: number;
  isPrimary: boolean;
};

type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string;
  department: string | null;
  skills: string[];
  photoUrl: string | null;
  social: { label: string; url: string }[];
  active: boolean;
  displayOrder: number;
};

function dateValue(value: unknown) {
  if (value && typeof value === "object" && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate();
  }
  return value instanceof Date ? value : new Date();
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.map(String) : [];
}

function mapService(id: string, data: FirebaseFirestore.DocumentData): Service {
  return {
    id: Number(data.id ?? id),
    title: String(data.title ?? ""),
    slug: String(data.slug ?? id),
    tagline: data.tagline ?? null,
    description: String(data.description ?? ""),
    problem: data.problem ?? null,
    approach: data.approach ?? null,
    benefits: asStringArray(data.benefits),
    cta: data.cta ?? null,
    iconKey: data.iconKey ?? null,
    active: data.active !== false,
    displayOrder: Number(data.displayOrder ?? 0),
    createdAt: dateValue(data.createdAt),
    updatedAt: dateValue(data.updatedAt),
  };
}

function mapCategory(id: string, data: FirebaseFirestore.DocumentData): Category {
  return {
    id: Number(data.id ?? id),
    name: String(data.name ?? ""),
    slug: String(data.slug ?? id),
    description: data.description ?? null,
    active: data.active !== false,
    displayOrder: Number(data.displayOrder ?? 0),
  };
}

function mapProject(id: string, data: FirebaseFirestore.DocumentData): Project {
  return {
    id: Number(data.id ?? id),
    title: String(data.title ?? ""),
    slug: String(data.slug ?? id),
    categoryId: Number(data.categoryId ?? 0),
    description: String(data.description ?? ""),
    shortDescription: data.shortDescription ?? null,
    projectUrl: data.projectUrl ?? null,
    thumbnailUrl: data.thumbnailUrl ?? null,
    imageUrls: asStringArray(data.imageUrls),
    tags: asStringArray(data.tags),
    client: data.client ?? null,
    year: data.year == null ? null : Number(data.year),
    featured: data.featured === true,
    visible: data.visible !== false,
    displayOrder: Number(data.displayOrder ?? 0),
    createdAt: dateValue(data.createdAt),
    updatedAt: dateValue(data.updatedAt),
  };
}

function mapBlogCategory(
  id: string,
  data: FirebaseFirestore.DocumentData,
): BlogCategory {
  return {
    id: Number(data.id ?? id),
    name: String(data.name ?? ""),
    slug: String(data.slug ?? id),
  };
}

function mapBlogPost(id: string, data: FirebaseFirestore.DocumentData): BlogPost {
  return {
    id: Number(data.id ?? id),
    title: String(data.title ?? ""),
    slug: String(data.slug ?? id),
    excerpt: data.excerpt ?? null,
    content: String(data.content ?? ""),
    coverUrl: data.coverUrl ?? null,
    categoryId: data.categoryId == null ? null : Number(data.categoryId),
    tags: asStringArray(data.tags),
    published: data.published === true,
    publishedAt: data.publishedAt ? dateValue(data.publishedAt) : null,
    createdAt: dateValue(data.createdAt),
    updatedAt: dateValue(data.updatedAt),
  };
}

function mapAvailability(id: string, data: FirebaseFirestore.DocumentData): AvailabilityRule {
  return {
    id: Number(data.id ?? id),
    dayOfWeek: Number(data.dayOfWeek ?? 0),
    enabled: data.enabled !== false,
    startTime: String(data.startTime ?? "10:00"),
    endTime: String(data.endTime ?? "17:00"),
    slotMinutes: Number(data.slotMinutes ?? 60),
  };
}

function mapBlockedDate(id: string, data: FirebaseFirestore.DocumentData): BlockedDate {
  return { id: Number(data.id ?? id), date: String(data.date ?? ""), reason: data.reason ?? null };
}

function mapAppointment(id: string, data: FirebaseFirestore.DocumentData): Appointment {
  return {
    id: Number(data.id ?? id),
    reference: String(data.reference ?? ""),
    customerName: String(data.customerName ?? ""),
    email: String(data.email ?? ""),
    phone: String(data.phone ?? ""),
    company: data.company ?? null,
    serviceId: data.serviceId == null ? null : Number(data.serviceId),
    serviceTitle: data.serviceTitle ?? null,
    requestedDate: String(data.requestedDate ?? ""),
    requestedTime: String(data.requestedTime ?? ""),
    message: data.message ?? null,
    status: (data.status ?? "pending") as Appointment["status"],
    adminNote: data.adminNote ?? null,
    proposedDate: data.proposedDate ?? null,
    proposedTime: data.proposedTime ?? null,
    history: Array.isArray(data.history) ? data.history : [],
    createdAt: dateValue(data.createdAt),
    updatedAt: dateValue(data.updatedAt),
    uid: data.uid ? String(data.uid) : null,
  };
}

function mapEnquiry(id: string, data: FirebaseFirestore.DocumentData): Enquiry {
  return {
    id: Number(data.id ?? id),
    name: String(data.name ?? ""),
    email: String(data.email ?? ""),
    phone: data.phone ?? null,
    company: data.company ?? null,
    service: data.service ?? null,
    message: String(data.message ?? ""),
    status: String(data.status ?? "new"),
    createdAt: dateValue(data.createdAt),
    updatedAt: dateValue(data.updatedAt),
  };
}

function enabled() {
  return Boolean(firebaseAdminConfigured && firestore);
}

function nextId(
  docs: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[],
) {
  return (
    docs.reduce((max, doc) => Math.max(max, Number(doc.data().id ?? 0)), 0) + 1
  );
}

export async function firebaseListServices(activeOnly: boolean) {
  if (!enabled()) return null;
  const snapshot = await firestore!.collection("services").get();
  return snapshot.docs
    .map((doc) => mapService(doc.id, doc.data()))
    .filter((service) => !activeOnly || service.active)
    .sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id);
}

export async function firebaseGetServiceBySlug(slug: string) {
  if (!enabled()) return null;
  const snapshot = await firestore!
    .collection("services")
    .where("slug", "==", slug)
    .limit(1)
    .get();
  const doc = snapshot.docs[0];
  return doc ? mapService(doc.id, doc.data()) : null;
}

export async function firebaseSaveService(
  id: number | undefined,
  input: Record<string, unknown>,
) {
  if (!enabled()) return 0;
  const { firestore: store } = requireFirebaseAdmin();
  const collection = store.collection("services");
  const target = id
    ? collection.doc(String(id))
    : collection.doc(String(nextId((await collection.get()).docs)));
  const now = new Date();
  await target.set(
    { ...input, id: Number(target.id), createdAt: now, updatedAt: now },
    { merge: true },
  );
  return Number(target.id);
}

export async function firebaseDeleteService(id: number) {
  if (!enabled()) return;
  const { firestore: store } = requireFirebaseAdmin();
  await store.collection("services").doc(String(id)).delete();
}

export async function firebaseListCategories(activeOnly: boolean) {
  if (!enabled()) return null;
  const snapshot = await firestore!.collection("portfolioCategories").get();
  return snapshot.docs
    .map((doc) => mapCategory(doc.id, doc.data()))
    .filter((category) => !activeOnly || category.active)
    .sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id);
}

export async function firebaseGetCategoryBySlug(slug: string) {
  if (!enabled()) return null;
  const snapshot = await firestore!
    .collection("portfolioCategories")
    .where("slug", "==", slug)
    .limit(1)
    .get();
  const doc = snapshot.docs[0];
  return doc ? mapCategory(doc.id, doc.data()) : null;
}

export async function firebaseSaveCategory(
  id: number | undefined,
  input: Record<string, unknown>,
) {
  if (!enabled()) return 0;
  const { firestore: store } = requireFirebaseAdmin();
  const collection = store.collection("portfolioCategories");
  const target = id
    ? collection.doc(String(id))
    : collection.doc(String(nextId((await collection.get()).docs)));
  await target.set({ ...input, id: Number(target.id) }, { merge: true });
  return Number(target.id);
}

export async function firebaseDeleteCategory(id: number) {
  if (!enabled()) return;
  const { firestore: store } = requireFirebaseAdmin();
  await store.collection("portfolioCategories").doc(String(id)).delete();
}

export async function firebaseListProjects() {
  if (!enabled()) return null;
  const [projectSnapshot, categorySnapshot] = await Promise.all([
    firestore!.collection("portfolioProjects").get(),
    firestore!.collection("portfolioCategories").get(),
  ]);
  const categories = new Map(
    categorySnapshot.docs.map((doc) => {
      const category = mapCategory(doc.id, doc.data());
      return [category.id, category] as const;
    }),
  );
  return projectSnapshot.docs
    .map((doc) => {
      const project = mapProject(doc.id, doc.data());
      return { project, category: categories.get(project.categoryId) ?? null };
    })
    .sort(
      (a, b) =>
        a.project.displayOrder - b.project.displayOrder ||
        b.project.id - a.project.id,
    );
}

export async function firebaseGetProjectBySlug(slug: string) {
  if (!enabled()) return null;
  const snapshot = await firestore!
    .collection("portfolioProjects")
    .where("slug", "==", slug)
    .limit(1)
    .get();
  const doc = snapshot.docs[0];
  if (!doc) return null;
  const project = mapProject(doc.id, doc.data());
  const category = await firebaseGetCategoryById(project.categoryId);
  return { project, category };
}

async function firebaseGetCategoryById(id: number) {
  if (!enabled()) return null;
  const doc = await firestore!.collection("portfolioCategories").doc(String(id)).get();
  return doc.exists ? mapCategory(doc.id, doc.data()!) : null;
}

export async function firebaseSaveProject(
  id: number | undefined,
  input: Record<string, unknown>,
) {
  if (!enabled()) return 0;
  const { firestore: store } = requireFirebaseAdmin();
  const collection = store.collection("portfolioProjects");
  const target = id
    ? collection.doc(String(id))
    : collection.doc(String(nextId((await collection.get()).docs)));
  const now = new Date();
  await target.set(
    { ...input, id: Number(target.id), createdAt: now, updatedAt: now },
    { merge: true },
  );
  return Number(target.id);
}

export async function firebaseDeleteProject(id: number) {
  if (!enabled()) return;
  const { firestore: store } = requireFirebaseAdmin();
  await store.collection("portfolioProjects").doc(String(id)).delete();
}

export async function firebaseListBlogCategories() {
  if (!enabled()) return null;
  const snapshot = await firestore!.collection("blogCategories").get();
  return snapshot.docs
    .map((doc) => mapBlogCategory(doc.id, doc.data()))
    .sort((a, b) => a.id - b.id);
}

export async function firebaseSaveBlogCategory(
  id: number | undefined,
  input: Record<string, unknown>,
) {
  if (!enabled()) return 0;
  const { firestore: store } = requireFirebaseAdmin();
  const collection = store.collection("blogCategories");
  const target = id
    ? collection.doc(String(id))
    : collection.doc(String(nextId((await collection.get()).docs)));
  await target.set({ ...input, id: Number(target.id) }, { merge: true });
  return Number(target.id);
}

export async function firebaseListBlogPosts() {
  if (!enabled()) return null;
  const [postSnapshot, categorySnapshot] = await Promise.all([
    firestore!.collection("blogPosts").get(),
    firestore!.collection("blogCategories").get(),
  ]);
  const categories = new Map(
    categorySnapshot.docs.map((doc) => {
      const category = mapBlogCategory(doc.id, doc.data());
      return [category.id, category] as const;
    }),
  );
  return postSnapshot.docs
    .map((doc) => {
      const post = mapBlogPost(doc.id, doc.data());
      return { post, category: post.categoryId ? categories.get(post.categoryId) ?? null : null };
    })
    .sort(
      (a, b) =>
        (b.post.publishedAt?.getTime() ?? 0) -
          (a.post.publishedAt?.getTime() ?? 0) ||
        b.post.createdAt.getTime() - a.post.createdAt.getTime(),
    );
}

export async function firebaseGetBlogPostBySlug(slug: string) {
  if (!enabled()) return null;
  const rows = await firestore!
    .collection("blogPosts")
    .where("slug", "==", slug)
    .limit(1)
    .get();
  const doc = rows.docs[0];
  if (!doc) return null;
  const post = mapBlogPost(doc.id, doc.data());
  const category = post.categoryId
    ? (await firestore!.collection("blogCategories").doc(String(post.categoryId)).get())
    : null;
  return {
    post,
    category:
      category?.exists && category.data()
        ? mapBlogCategory(category.id, category.data()!)
        : null,
  };
}

export async function firebaseSaveBlogPost(
  id: number | undefined,
  input: Record<string, unknown>,
) {
  if (!enabled()) return 0;
  const { firestore: store } = requireFirebaseAdmin();
  const collection = store.collection("blogPosts");
  const target = id
    ? collection.doc(String(id))
    : collection.doc(String(nextId((await collection.get()).docs)));
  const now = new Date();
  await target.set(
    { ...input, id: Number(target.id), createdAt: now, updatedAt: now },
    { merge: true },
  );
  return Number(target.id);
}

export async function firebaseDeleteBlogPost(id: number) {
  if (!enabled()) return;
  const { firestore: store } = requireFirebaseAdmin();
  await store.collection("blogPosts").doc(String(id)).delete();
}

async function firebaseCollection(name: string) {
  if (!enabled()) return null;
  return firestore!.collection(name);
}

export async function firebaseListAvailability() {
  const collection = await firebaseCollection("availabilityRules");
  if (!collection) return null;
  const snapshot = await collection.get();
  return snapshot.docs.map((doc) => mapAvailability(doc.id, doc.data())).sort((a, b) => a.dayOfWeek - b.dayOfWeek);
}

export async function firebaseSaveAvailability(input: Omit<AvailabilityRule, "id">) {
  const collection = await firebaseCollection("availabilityRules");
  if (!collection) return 0;
  const target = collection.doc(String(input.dayOfWeek));
  await target.set({ ...input, id: input.dayOfWeek }, { merge: true });
  return input.dayOfWeek;
}

export async function firebaseListBlockedDates() {
  const collection = await firebaseCollection("blockedDates");
  if (!collection) return null;
  const snapshot = await collection.get();
  return snapshot.docs.map((doc) => mapBlockedDate(doc.id, doc.data())).sort((a, b) => a.date.localeCompare(b.date));
}

export async function firebaseSaveBlockedDate(date: string, reason?: string) {
  const collection = await firebaseCollection("blockedDates");
  if (!collection) return 0;
  const id = Math.abs([...date].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0));
  await collection.doc(String(id)).set({ id, date, reason: reason ?? null }, { merge: true });
  return id;
}

export async function firebaseDeleteBlockedDate(id: number) {
  const collection = await firebaseCollection("blockedDates");
  if (collection) await collection.doc(String(id)).delete();
}

export async function firebaseListAppointments(status?: string) {
  const collection = await firebaseCollection("appointments");
  if (!collection) return null;
  const snapshot = await collection.get();
  return snapshot.docs
    .map((doc) => mapAppointment(doc.id, doc.data()))
    .filter((appointment) => !status || appointment.status === status)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function firebaseGetAppointmentByRef(reference: string) {
  const collection = await firebaseCollection("appointments");
  if (!collection) return null;
  const snapshot = await collection.where("reference", "==", reference).limit(1).get();
  const doc = snapshot.docs[0];
  return doc ? mapAppointment(doc.id, doc.data()) : null;
}

export async function firebaseGetAppointmentByUid(uid: string) {
  const collection = await firebaseCollection("appointments");
  if (!collection) return null;
  const snapshot = await collection.where("uid", "==", uid).limit(20).get();
  const active = snapshot.docs
    .map((doc) => mapAppointment(doc.id, doc.data()))
    .filter((appointment) => !["cancelled", "completed", "rejected"].includes(appointment.status))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return active[0] ?? null;
}

export async function firebaseGetBookedTimes(date: string) {
  const rows = await firebaseListAppointments();
  if (!rows) return null;
  return rows
    .filter((row) => row.requestedDate === date && ["approved", "pending", "rescheduled"].includes(row.status))
    .map((row) => row.requestedTime);
}

export async function firebaseCreateAppointment(input: Record<string, unknown>) {
  const collection = await firebaseCollection("appointments");
  if (!collection) return null;
  const id = nextId((await collection.get()).docs);
  const now = new Date();
  const record = Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  );
  const saved = {
    ...record,
    id,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };
  await collection.doc(String(id)).set(saved);
  return mapAppointment(String(id), saved);
}

export async function firebaseUpdateAppointment(
  id: number,
  next: Record<string, unknown>,
) {
  const collection = await firebaseCollection("appointments");
  if (!collection) return;
  const doc = await collection.doc(String(id)).get();
  if (!doc.exists) return;
  const current = mapAppointment(doc.id, doc.data()!);
  const history = next.historyEntry ? [...current.history, next.historyEntry] : current.history;
  await collection.doc(String(id)).set({ ...next, history, updatedAt: new Date() }, { merge: true });
}

export async function firebaseListEnquiries() {
  const collection = await firebaseCollection("enquiries");
  if (!collection) return null;
  const snapshot = await collection.get();
  return snapshot.docs.map((doc) => mapEnquiry(doc.id, doc.data())).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function firebaseCreateEnquiry(input: Record<string, unknown>) {
  const collection = await firebaseCollection("enquiries");
  if (!collection) return 0;
  const id = nextId((await collection.get()).docs);
  const now = new Date();
  const record = Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined));
  await collection.doc(String(id)).set({ ...record, id, status: "new", createdAt: now, updatedAt: now });
  return id;
}

export async function firebaseUpdateEnquiryStatus(id: number, status: string) {
  const collection = await firebaseCollection("enquiries");
  if (collection) {
    await collection.doc(String(id)).set({ status, updatedAt: new Date() }, { merge: true });
  }
}

export async function firebaseGetSetting<T>(key: string) {
  const collection = await firebaseCollection("siteSettings");
  if (!collection) return null;
  const doc = await collection.doc(key).get();
  return doc.exists ? (doc.data()?.value as T) : null;
}

export async function firebaseSetSetting(key: string, value: unknown) {
  const collection = await firebaseCollection("siteSettings");
  if (collection) await collection.doc(key).set({ key, value, updatedAt: new Date() }, { merge: true });
}

export async function firebaseListCollection<T>(name: string) {
  const collection = await firebaseCollection(name);
  if (!collection) return null;
  const snapshot = await collection.get();
  return snapshot.docs
    .map((doc) => ({ id: Number(doc.data().id ?? doc.id), ...doc.data() }) as T)
    .sort((a, b) => Number((a as { displayOrder?: number }).displayOrder ?? 0) - Number((b as { displayOrder?: number }).displayOrder ?? 0));
}

export async function firebaseListFounders() {
  return firebaseListCollection<Founder>("founders");
}

export async function firebaseListTeamMembers() {
  return firebaseListCollection<TeamMember>("teamMembers");
}

export async function firebaseSaveCollectionItem(
  name: string,
  id: number | undefined,
  input: Record<string, unknown>,
) {
  const collection = await firebaseCollection(name);
  if (!collection) return 0;
  const target = id
    ? collection.doc(String(id))
    : collection.doc(String(nextId((await collection.get()).docs)));
  await target.set({ ...input, id: Number(target.id) }, { merge: true });
  return Number(target.id);
}

export async function firebaseDeleteCollectionItem(name: string, id: number) {
  const collection = await firebaseCollection(name);
  if (collection) await collection.doc(String(id)).delete();
}
