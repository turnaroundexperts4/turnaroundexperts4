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
