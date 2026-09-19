"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Briefcase,
  Plus,
  Search,
  Star,
  Trash2,
  Upload,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  ConfirmDialog,
  DrawerForm,
  EmptyState,
  Field,
  Input,
  Select,
  Textarea,
} from "@/app/admin/_components/admin-fields";
import {
  removeCategory,
  removeProject,
  saveCategory,
  saveProject,
} from "@/app/admin/(protected)/portfolio/actions";
import { cn } from "@/lib/utils";

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
  categoryName: string;
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
};

export function PortfolioAdmin({
  categories,
  projects,
}: {
  categories: Category[];
  projects: Project[];
}) {
  const [tab, setTab] = useState<"projects" | "categories">("projects");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Project | null | "new">(null);
  const [editingCat, setEditingCat] = useState<Category | null | "new">(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteCatId, setDeleteCatId] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    if (!text) return projects;
    return projects.filter((p) =>
      [p.title, p.client ?? "", p.categoryName, ...(p.tags ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(text),
    );
  }, [q, projects]);

  function flash(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2500);
  }

  return (
    <div className="mx-auto max-w-[1320px]">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-[0.22em] text-ink-500">
            Portfolio
          </span>
          <h1 className="display-font mt-2 text-[clamp(1.8rem,3.6vw,2.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-navy-900">
            Case studies & categories
          </h1>
          <p className="mt-2 max-w-xl text-[14px] text-ink-700">
            Manage projects, preview images, categories and live URLs. Changes
            appear on the public portfolio immediately.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-full border border-ink-900/10 bg-paper p-1">
            <button
              type="button"
              onClick={() => setTab("projects")}
              className={cn(
                "rounded-full px-4 py-1.5 text-[13px] font-medium transition",
                tab === "projects"
                  ? "bg-navy-900 text-paper"
                  : "text-ink-700 hover:text-navy-900",
              )}
            >
              Projects
            </button>
            <button
              type="button"
              onClick={() => setTab("categories")}
              className={cn(
                "rounded-full px-4 py-1.5 text-[13px] font-medium transition",
                tab === "categories"
                  ? "bg-navy-900 text-paper"
                  : "text-ink-700 hover:text-navy-900",
              )}
            >
              Categories
            </button>
          </div>
          <button
            type="button"
            onClick={() =>
              tab === "projects" ? setEditing("new") : setEditingCat("new")
            }
            className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-[13px] font-medium text-paper transition hover:bg-navy-800"
          >
            <Plus className="h-4 w-4" />
            {tab === "projects" ? "Add project" : "Add category"}
          </button>
        </div>
      </header>

      {message ? (
        <div className="mt-4 rounded-full border border-emerald-300 bg-emerald-50 px-5 py-2 text-[13px] text-emerald-800">
          {message}
        </div>
      ) : null}

      {tab === "projects" ? (
        <>
          <div className="mt-6 flex items-center gap-3 rounded-full border border-ink-900/10 bg-paper px-5 py-3">
            <Search className="h-4 w-4 text-ink-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search projects…"
              className="w-full bg-transparent text-[14.5px] outline-none placeholder:text-ink-400"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="mt-10">
              <EmptyState
                title="No projects yet"
                body="Add your first case study with 3–4 preview images, a category and optional live URL."
                cta="Add project"
                onClick={() => setEditing("new")}
                icon={<Briefcase className="h-5 w-5" />}
              />
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <article
                  key={p.id}
                  className="overflow-hidden rounded-2xl border border-ink-900/5 bg-paper"
                >
                  <div className="relative aspect-[16/10] bg-ink-100">
                    {p.thumbnailUrl || p.imageUrls[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.thumbnailUrl ?? p.imageUrls[0]}
                        alt={p.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-ink-400">
                        No image
                      </div>
                    )}
                    <div className="absolute left-3 top-3 flex gap-1.5">
                      <span className="rounded-full bg-paper/95 px-2.5 py-1 text-[11px] font-medium text-navy-900">
                        {p.categoryName}
                      </span>
                      {p.featured ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-navy-900/90 px-2.5 py-1 text-[11px] text-paper">
                          <Star className="h-3 w-3" /> Featured
                        </span>
                      ) : null}
                    </div>
                    <div className="absolute right-3 top-3">
                      {p.visible ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/90 px-2.5 py-1 text-[11px] text-paper">
                          <Eye className="h-3 w-3" /> Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-ink-700/90 px-2.5 py-1 text-[11px] text-paper">
                          <EyeOff className="h-3 w-3" /> Hidden
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="display-font text-[18px] font-medium text-navy-900">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-[12.5px] text-ink-500">
                      {p.client ?? "—"}
                      {p.year ? ` · ${p.year}` : ""}
                      {p.imageUrls?.length
                        ? ` · ${p.imageUrls.length} images`
                        : ""}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditing(p)}
                        className="rounded-full bg-navy-900 px-4 py-1.5 text-[12.5px] font-medium text-paper"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(p.id)}
                        className="rounded-full border border-red-200 px-4 py-1.5 text-[12.5px] font-medium text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-ink-900/5 bg-paper">
          {categories.length === 0 ? (
            <EmptyState
              title="No categories"
              body="Create categories such as Landing Pages, ERP, E-commerce, Logo Designs."
              cta="Add category"
              onClick={() => setEditingCat("new")}
            />
          ) : (
            <ul>
              {categories.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-900/5 px-6 py-4 last:border-b-0"
                >
                  <div>
                    <div className="font-medium text-navy-900">{c.name}</div>
                    <div className="text-[12.5px] text-ink-500">
                      /{c.slug} · order {c.displayOrder} ·{" "}
                      {c.active ? "active" : "inactive"} ·{" "}
                      {
                        projects.filter((p) => p.categoryId === c.id).length
                      }{" "}
                      projects
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingCat(c)}
                      className="rounded-full bg-navy-900 px-4 py-1.5 text-[12.5px] font-medium text-paper"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteCatId(c.id)}
                      className="rounded-full border border-red-200 px-4 py-1.5 text-[12.5px] font-medium text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Project drawer */}
      <DrawerForm
        open={editing !== null}
        title={editing === "new" ? "New project" : "Edit project"}
        onClose={() => setEditing(null)}
        size="lg"
      >
        {editing !== null ? (
          <ProjectForm
            key={editing === "new" ? "new" : editing.id}
            project={editing === "new" ? null : editing}
            categories={categories}
            pending={pending}
            onSubmit={(fd) => {
              startTransition(async () => {
                const res = await saveProject(fd);
                if (res.ok) {
                  setEditing(null);
                  flash("Project saved.");
                } else {
                  flash(res.error ?? "Could not save.");
                }
              });
            }}
          />
        ) : null}
      </DrawerForm>

      {/* Category drawer */}
      <DrawerForm
        open={editingCat !== null}
        title={editingCat === "new" ? "New category" : "Edit category"}
        onClose={() => setEditingCat(null)}
      >
        {editingCat !== null ? (
          <CategoryForm
            key={editingCat === "new" ? "new" : editingCat.id}
            category={editingCat === "new" ? null : editingCat}
            pending={pending}
            onSubmit={(fd) => {
              startTransition(async () => {
                const res = await saveCategory(fd);
                if (res.ok) {
                  setEditingCat(null);
                  flash("Category saved.");
                } else {
                  flash(res.error ?? "Could not save.");
                }
              });
            }}
          />
        ) : null}
      </DrawerForm>

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete project?"
        body="This permanently removes the project from the public portfolio."
        danger
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId == null) return;
          const fd = new FormData();
          fd.append("id", String(deleteId));
          startTransition(async () => {
            await removeProject(fd);
            setDeleteId(null);
            flash("Project deleted.");
          });
        }}
      />
      <ConfirmDialog
        open={deleteCatId !== null}
        title="Delete category?"
        body="Only delete categories that have no projects assigned."
        danger
        onCancel={() => setDeleteCatId(null)}
        onConfirm={() => {
          if (deleteCatId == null) return;
          const fd = new FormData();
          fd.append("id", String(deleteCatId));
          startTransition(async () => {
            await removeCategory(fd);
            setDeleteCatId(null);
            flash("Category deleted.");
          });
        }}
      />
    </div>
  );
}

function ProjectForm({
  project,
  categories,
  onSubmit,
  pending,
}: {
  project: Project | null;
  categories: Category[];
  onSubmit: (fd: FormData) => void;
  pending: boolean;
}) {
  const [images, setImages] = useState<string[]>(
    project?.imageUrls?.length
      ? project.imageUrls
      : project?.thumbnailUrl
        ? [project.thumbnailUrl]
        : [],
  );
  const [uploading, setUploading] = useState(false);
  const [thumb, setThumb] = useState(project?.thumbnailUrl ?? "");

  async function uploadFile(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "portfolio");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? "Upload failed");
      setImages((arr) => [...arr, j.url]);
      if (!thumb) setThumb(j.url);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form
      className="space-y-5 px-7 py-6"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        if (project) fd.append("id", String(project.id));
        fd.set("imageUrls", JSON.stringify(images));
        fd.set("thumbnailUrl", thumb || images[0] || "");
        onSubmit(fd);
      }}
    >
      <Field label="Title">
        <Input name="title" required defaultValue={project?.title ?? ""} />
      </Field>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Slug (optional)">
          <Input
            name="slug"
            defaultValue={project?.slug ?? ""}
            placeholder="auto-from-title"
          />
        </Field>
        <Field label="Category">
          <Select
            name="categoryId"
            required
            defaultValue={project?.categoryId ?? categories[0]?.id}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label="Short description">
        <Input
          name="shortDescription"
          defaultValue={project?.shortDescription ?? ""}
          maxLength={400}
        />
      </Field>
      <Field label="Full description">
        <Textarea
          name="description"
          required
          rows={5}
          defaultValue={project?.description ?? ""}
        />
      </Field>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field label="Client">
          <Input name="client" defaultValue={project?.client ?? ""} />
        </Field>
        <Field label="Year">
          <Input
            name="year"
            type="number"
            defaultValue={project?.year ?? new Date().getFullYear()}
          />
        </Field>
        <Field label="Display order">
          <Input
            name="displayOrder"
            type="number"
            defaultValue={project?.displayOrder ?? 0}
          />
        </Field>
      </div>
      <Field label="Project URL (live site)">
        <Input
          name="projectUrl"
          type="url"
          placeholder="https://…"
          defaultValue={project?.projectUrl ?? ""}
        />
      </Field>
      <Field label="Tags (comma separated)">
        <Input
          name="tags"
          defaultValue={(project?.tags ?? []).join(", ")}
          placeholder="ERP, Dashboard, Inventory"
        />
      </Field>

      <div>
        <div className="text-[12.5px] font-medium text-navy-900">
          Preview images (3–4 recommended)
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {images.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="group relative aspect-[16/10] overflow-hidden rounded-xl border border-ink-900/10 bg-paper-deep"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-end justify-between gap-1 bg-gradient-to-t from-navy-950/50 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => setThumb(src)}
                  className="rounded-full bg-paper px-2 py-1 text-[10px] font-medium text-navy-900"
                >
                  {thumb === src ? "Thumb ✓" : "Set thumb"}
                </button>
                <button
                  type="button"
                  onClick={() => setImages((arr) => arr.filter((_, x) => x !== i))}
                  className="rounded-full bg-red-600 px-2 py-1 text-[10px] font-medium text-paper"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
          <label className="grid aspect-[16/10] cursor-pointer place-items-center rounded-xl border border-dashed border-ink-900/20 bg-paper text-ink-500 transition hover:border-navy-900/40 hover:text-navy-900">
            <span className="flex flex-col items-center gap-1 text-[12px]">
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading…" : "Upload"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadFile(f);
                e.currentTarget.value = "";
              }}
            />
          </label>
        </div>
        <input type="hidden" name="thumbnailUrl" value={thumb} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex items-center justify-between rounded-2xl border border-ink-900/5 bg-paper p-4">
          <span>
            <span className="block text-[14px] font-medium text-navy-900">
              Featured
            </span>
            <span className="text-[12px] text-ink-500">Show on homepage</span>
          </span>
          <input
            type="checkbox"
            name="featured"
            defaultChecked={project?.featured ?? false}
            className="h-4 w-4"
          />
        </label>
        <label className="flex items-center justify-between rounded-2xl border border-ink-900/5 bg-paper p-4">
          <span>
            <span className="block text-[14px] font-medium text-navy-900">
              Visible
            </span>
            <span className="text-[12px] text-ink-500">Public portfolio</span>
          </span>
          <input
            type="checkbox"
            name="visible"
            defaultChecked={project?.visible ?? true}
            className="h-4 w-4"
          />
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="submit"
          disabled={pending || uploading}
          className="rounded-full bg-navy-900 px-6 py-2.5 text-[13px] font-medium text-paper transition hover:bg-navy-800 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save project"}
        </button>
      </div>
    </form>
  );
}

function CategoryForm({
  category,
  onSubmit,
  pending,
}: {
  category: Category | null;
  onSubmit: (fd: FormData) => void;
  pending: boolean;
}) {
  return (
    <form
      className="space-y-5 px-7 py-6"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        if (category) fd.append("id", String(category.id));
        onSubmit(fd);
      }}
    >
      <Field label="Name">
        <Input name="name" required defaultValue={category?.name ?? ""} />
      </Field>
      <Field label="Slug (optional)">
        <Input name="slug" defaultValue={category?.slug ?? ""} />
      </Field>
      <Field label="Description">
        <Textarea
          name="description"
          rows={3}
          defaultValue={category?.description ?? ""}
        />
      </Field>
      <Field label="Display order">
        <Input
          name="displayOrder"
          type="number"
          defaultValue={category?.displayOrder ?? 0}
        />
      </Field>
      <label className="flex items-center justify-between rounded-2xl border border-ink-900/5 bg-paper p-4">
        <span className="text-[14px] font-medium text-navy-900">Active</span>
        <input
          type="checkbox"
          name="active"
          defaultChecked={category?.active ?? true}
          className="h-4 w-4"
        />
      </label>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-navy-900 px-6 py-2.5 text-[13px] font-medium text-paper disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save category"}
        </button>
      </div>
    </form>
  );
}
