"use client";

import { useState, useTransition } from "react";
import { Plus, Upload, Users } from "lucide-react";
import {
  ConfirmDialog,
  DrawerForm,
  EmptyState,
  Field,
  Input,
  Textarea,
} from "@/app/admin/_components/admin-fields";
import { removeTeamMember, saveTeamMember } from "@/app/admin/(protected)/team/actions";

type Member = {
  id: number;
  name: string;
  role: string;
  bio: string;
  department: string | null;
  skills: string[];
  photoUrl: string | null;
  active: boolean;
  displayOrder: number;
};

export function TeamAdmin({ members }: { members: Member[] }) {
  const [editing, setEditing] = useState<Member | null | "new">(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-[1320px]">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-[0.22em] text-ink-500">
            Team
          </span>
          <h1 className="display-font mt-2 text-[clamp(1.8rem,3.6vw,2.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-navy-900">
            Team members
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-[13px] font-medium text-paper"
        >
          <Plus className="h-4 w-4" /> Add member
        </button>
      </header>
      {msg ? (
        <div className="mt-4 rounded-full border border-emerald-300 bg-emerald-50 px-5 py-2 text-[13px] text-emerald-800">
          {msg}
        </div>
      ) : null}

      {members.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No team members"
            body="Add the people who deliver TAE work. They appear on the Founders page."
            cta="Add member"
            onClick={() => setEditing("new")}
            icon={<Users className="h-5 w-5" />}
          />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => (
            <article
              key={m.id}
              className="overflow-hidden rounded-2xl border border-ink-900/5 bg-paper"
            >
              <div className="aspect-square bg-paper-deep">
                {m.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.photoUrl}
                    alt={m.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center font-display text-5xl text-ink-400">
                    {m.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
                  {m.role}
                  {!m.active ? " · hidden" : ""}
                </div>
                <h3 className="display-font mt-1 text-[18px] text-navy-900">
                  {m.name}
                </h3>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(m)}
                    className="rounded-full bg-navy-900 px-4 py-1.5 text-[12.5px] font-medium text-paper"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(m.id)}
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

      <DrawerForm
        open={editing !== null}
        title={editing === "new" ? "New team member" : "Edit team member"}
        onClose={() => setEditing(null)}
      >
        {editing !== null ? (
          <MemberForm
            key={editing === "new" ? "new" : editing.id}
            member={editing === "new" ? null : editing}
            pending={pending}
            onSubmit={(fd) => {
              start(async () => {
                const r = await saveTeamMember(fd);
                if (r.ok) {
                  setEditing(null);
                  setMsg("Team member saved.");
                  setTimeout(() => setMsg(null), 2000);
                } else setMsg(r.error ?? "Error");
              });
            }}
          />
        ) : null}
      </DrawerForm>

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete team member?"
        body="This removes them from the public team section."
        danger
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId == null) return;
          const fd = new FormData();
          fd.append("id", String(deleteId));
          start(async () => {
            await removeTeamMember(fd);
            setDeleteId(null);
            setMsg("Member deleted.");
            setTimeout(() => setMsg(null), 2000);
          });
        }}
      />
    </div>
  );
}

function MemberForm({
  member,
  onSubmit,
  pending,
}: {
  member: Member | null;
  onSubmit: (fd: FormData) => void;
  pending: boolean;
}) {
  const [photo, setPhoto] = useState(member?.photoUrl ?? "");
  const [uploading, setUploading] = useState(false);

  async function upload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "team");
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
        if (member) fd.append("id", String(member.id));
        fd.set("photoUrl", photo);
        onSubmit(fd);
      }}
    >
      <div className="flex items-center gap-4">
        <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-2xl bg-paper-deep text-ink-400">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" className="h-full w-full object-cover" />
          ) : (
            "?"
          )}
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-ink-900/10 px-4 py-2 text-[13px] font-medium">
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading…" : "Upload photo"}
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
        <input type="hidden" name="photoUrl" value={photo} />
      </div>
      <Field label="Name">
        <Input name="name" required defaultValue={member?.name ?? ""} />
      </Field>
      <Field label="Role">
        <Input name="role" required defaultValue={member?.role ?? ""} />
      </Field>
      <Field label="Department">
        <Input name="department" defaultValue={member?.department ?? ""} />
      </Field>
      <Field label="Bio">
        <Textarea name="bio" required rows={4} defaultValue={member?.bio ?? ""} />
      </Field>
      <Field label="Skills (comma separated)">
        <Input name="skills" defaultValue={(member?.skills ?? []).join(", ")} />
      </Field>
      <Field label="Display order">
        <Input
          name="displayOrder"
          type="number"
          defaultValue={member?.displayOrder ?? 0}
        />
      </Field>
      <label className="flex items-center justify-between rounded-2xl border border-ink-900/5 p-4">
        <span className="text-[14px] font-medium">Active</span>
        <input
          type="checkbox"
          name="active"
          defaultChecked={member?.active ?? true}
        />
      </label>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending || uploading}
          className="rounded-full bg-navy-900 px-6 py-2.5 text-[13px] font-medium text-paper disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save member"}
        </button>
      </div>
    </form>
  );
}
