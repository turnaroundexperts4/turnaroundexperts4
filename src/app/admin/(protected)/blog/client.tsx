"use client";

import { useState, useTransition } from "react";
import { PenSquare, Plus, Upload } from "lucide-react";
import {
  ConfirmDialog,
  DrawerForm,
  EmptyState,
  Field,
  Input,
  Select,
  Textarea,
} from "@/app/admin/_components/admin-fields";
import { removePost, savePost } from "@/app/admin/(protected)/blog/actions";

type Cat = { id: number; name: string };
type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverUrl: string | null;
  categoryId: number | null;
  categoryName: string | null;
  tags: string[];
  published: boolean;
  publishedAt: string | null;
};

export function BlogAdmin({
  posts,
  categories,
}: {
  posts: Post[];
  categories: Cat[];
}) {
  const [editing, setEditing] = useState<Post | null | "new">(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-[1320px]">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-[0.22em] text-ink-500">
            Blog
          </span>
          <h1 className="display-font mt-2 text-[clamp(1.8rem,3.6vw,2.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-navy-900">
            Articles
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-[13px] font-medium text-paper"
        >
          <Plus className="h-4 w-4" /> New article
        </button>
      </header>
      {msg ? (
        <div className="mt-4 rounded-full border border-emerald-300 bg-emerald-50 px-5 py-2 text-[13px] text-emerald-800">
          {msg}
        </div>
      ) : null}

      {posts.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No articles yet"
            body="Write and publish insights that appear on the public blog."
            cta="New article"
            onClick={() => setEditing("new")}
            icon={<PenSquare className="h-5 w-5" />}
          />
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-ink-900/5 bg-paper">
          <ul>
            {posts.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-900/5 px-6 py-4 last:border-b-0"
              >
                <div className="min-w-0">
                  <div className="font-medium text-navy-900">{p.title}</div>
                  <div className="text-[12.5px] text-ink-500">
                    {p.published ? "Published" : "Draft"}
                    {p.categoryName ? ` · ${p.categoryName}` : ""}
                    {p.publishedAt ? ` · ${p.publishedAt}` : ""}
                  </div>
                </div>
                <div className="flex gap-2">
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
              </li>
            ))}
          </ul>
        </div>
      )}

      <DrawerForm
        open={editing !== null}
        title={editing === "new" ? "New article" : "Edit article"}
        onClose={() => setEditing(null)}
        size="lg"
      >
        {editing !== null ? (
          <PostForm
            key={editing === "new" ? "new" : editing.id}
            post={editing === "new" ? null : editing}
            categories={categories}
            pending={pending}
            onSubmit={(fd) => {
              start(async () => {
                const r = await savePost(fd);
                if (r.ok) {
                  setEditing(null);
                  setMsg("Article saved.");
                  setTimeout(() => setMsg(null), 2000);
                } else setMsg(r.error ?? "Error");
              });
            }}
          />
        ) : null}
      </DrawerForm>

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete article?"
        body="This permanently removes the article."
        danger
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId == null) return;
          const fd = new FormData();
          fd.append("id", String(deleteId));
          start(async () => {
            await removePost(fd);
            setDeleteId(null);
            setMsg("Article deleted.");
            setTimeout(() => setMsg(null), 2000);
          });
        }}
      />
    </div>
  );
}

function PostForm({
  post,
  categories,
  onSubmit,
  pending,
}: {
  post: Post | null;
  categories: Cat[];
  onSubmit: (fd: FormData) => void;
  pending: boolean;
}) {
  const [cover, setCover] = useState(post?.coverUrl ?? "");
  const [uploading, setUploading] = useState(false);

  async function upload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "blog");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? "Upload failed");
      setCover(j.url);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form
      className="space-y-4 px-7 py-6"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        if (post) fd.append("id", String(post.id));
        fd.set("coverUrl", cover);
        onSubmit(fd);
      }}
    >
      <Field label="Title">
        <Input name="title" required defaultValue={post?.title ?? ""} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Slug">
          <Input name="slug" defaultValue={post?.slug ?? ""} />
        </Field>
        <Field label="Category">
          <Select name="categoryId" defaultValue={post?.categoryId ?? ""}>
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label="Excerpt">
        <Input name="excerpt" defaultValue={post?.excerpt ?? ""} />
      </Field>
      <Field label="Content (paragraphs separated by blank lines; ## for headings)">
        <Textarea
          name="content"
          required
          rows={12}
          defaultValue={post?.content ?? ""}
        />
      </Field>
      <Field label="Tags (comma separated)">
        <Input name="tags" defaultValue={(post?.tags ?? []).join(", ")} />
      </Field>
      <div>
        <div className="text-[12.5px] font-medium text-navy-900">Cover image</div>
        <div className="mt-2 flex items-center gap-3">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt=""
              className="h-16 w-28 rounded-lg object-cover"
            />
          ) : null}
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-ink-900/10 px-4 py-2 text-[13px] font-medium">
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading…" : "Upload cover"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) upload(f);
              }}
            />
          </label>
        </div>
      </div>
      <label className="flex items-center justify-between rounded-2xl border border-ink-900/5 p-4">
        <span className="text-[14px] font-medium">Published</span>
        <input
          type="checkbox"
          name="published"
          defaultChecked={post?.published ?? false}
        />
      </label>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending || uploading}
          className="rounded-full bg-navy-900 px-6 py-2.5 text-[13px] font-medium text-paper disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save article"}
        </button>
      </div>
    </form>
  );
}
