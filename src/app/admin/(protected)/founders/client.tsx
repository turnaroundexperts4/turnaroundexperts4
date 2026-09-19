"use client";

import { useState, useTransition } from "react";
import { Upload } from "lucide-react";
import {
  DrawerForm,
  Field,
  Input,
  Textarea,
} from "@/app/admin/_components/admin-fields";
import { saveFounder } from "@/app/admin/(protected)/founders/actions";

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

export function FoundersAdmin({ founders }: { founders: Founder[] }) {
  const [editing, setEditing] = useState<Founder | null>(null);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-[1100px]">
      <header>
        <span className="text-[11px] uppercase tracking-[0.22em] text-ink-500">
          Founders
        </span>
        <h1 className="display-font mt-2 text-[clamp(1.8rem,3.6vw,2.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-navy-900">
          Leadership profiles
        </h1>
        <p className="mt-2 text-[14px] text-ink-700">
          Edit founder details and photos. Profiles appear on the public
          Founders page and homepage.
        </p>
      </header>
      {msg ? (
        <div className="mt-4 rounded-full border border-emerald-300 bg-emerald-50 px-5 py-2 text-[13px] text-emerald-800">
          {msg}
        </div>
      ) : null}

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {founders.map((f) => (
          <article
            key={f.id}
            className="overflow-hidden rounded-2xl border border-ink-900/5 bg-paper"
          >
            <div className="aspect-[4/3] bg-paper-deep">
              {f.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={f.photoUrl}
                  alt={f.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center font-display text-6xl text-ink-400">
                  {f.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
                {f.isPrimary ? "Founder" : "Co-founder"} · {f.role}
              </div>
              <h3 className="display-font mt-2 text-[22px] text-navy-900">
                {f.name}
              </h3>
              <p className="mt-2 line-clamp-3 text-[14px] text-ink-700">
                {f.bio}
              </p>
              <button
                type="button"
                onClick={() => setEditing(f)}
                className="mt-5 rounded-full bg-navy-900 px-5 py-2 text-[13px] font-medium text-paper"
              >
                Edit profile
              </button>
            </div>
          </article>
        ))}
      </div>

      <DrawerForm
        open={editing !== null}
        title="Edit founder"
        onClose={() => setEditing(null)}
        size="lg"
      >
        {editing ? (
          <FounderForm
            key={editing.id}
            founder={editing}
            pending={pending}
            onSubmit={(fd) => {
              start(async () => {
                const r = await saveFounder(fd);
                if (r.ok) {
                  setEditing(null);
                  setMsg("Founder saved.");
                  setTimeout(() => setMsg(null), 2000);
                } else setMsg(r.error ?? "Error");
              });
            }}
          />
        ) : null}
      </DrawerForm>
    </div>
  );
}

function FounderForm({
  founder,
  onSubmit,
  pending,
}: {
  founder: Founder;
  onSubmit: (fd: FormData) => void;
  pending: boolean;
}) {
  const [photo, setPhoto] = useState(founder.photoUrl ?? "");
  const [uploading, setUploading] = useState(false);

  async function upload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "founders");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? "Upload failed");
      setPhoto(j.url);
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
        fd.append("id", String(founder.id));
        fd.set("photoUrl", photo);
        onSubmit(fd);
      }}
    >
      <div className="flex items-center gap-4">
        <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-2xl bg-paper-deep">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="font-display text-3xl text-ink-400">
              {founder.name.charAt(0)}
            </span>
          )}
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-ink-900/10 px-4 py-2 text-[13px] font-medium">
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading…" : "Replace photo"}
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
      <Field label="Name">
        <Input name="name" required defaultValue={founder.name} />
      </Field>
      <Field label="Role">
        <Input name="role" required defaultValue={founder.role} />
      </Field>
      <Field label="Bio">
        <Textarea name="bio" required rows={5} defaultValue={founder.bio} />
      </Field>
      <Field label="Responsibilities (one per line)">
        <Textarea
          name="responsibilities"
          rows={4}
          defaultValue={founder.responsibilities.join("\n")}
        />
      </Field>
      <Field label="Skills (comma separated)">
        <Input name="skills" defaultValue={founder.skills.join(", ")} />
      </Field>
      <Field label="Social links (one per line as Label|URL)">
        <Textarea
          name="social"
          rows={3}
          defaultValue={founder.social
            .map((s) => `${s.label}|${s.url}`)
            .join("\n")}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Display order">
          <Input
            name="displayOrder"
            type="number"
            defaultValue={founder.displayOrder}
          />
        </Field>
        <label className="mt-6 flex items-center justify-between rounded-2xl border border-ink-900/5 p-4">
          <span className="text-[14px] font-medium">Primary founder</span>
          <input
            type="checkbox"
            name="isPrimary"
            defaultChecked={founder.isPrimary}
          />
        </label>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending || uploading}
          className="rounded-full bg-navy-900 px-6 py-2.5 text-[13px] font-medium text-paper disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save founder"}
        </button>
      </div>
    </form>
  );
}
