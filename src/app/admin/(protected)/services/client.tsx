"use client";

import { useState, useTransition } from "react";
import { Plus, Sparkles } from "lucide-react";
import {
  ConfirmDialog,
  DrawerForm,
  EmptyState,
  Field,
  Input,
  Select,
  Textarea,
} from "@/app/admin/_components/admin-fields";
import { removeService, saveService } from "@/app/admin/(protected)/services/actions";

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
};

export function ServicesAdmin({ services }: { services: Service[] }) {
  const [editing, setEditing] = useState<Service | null | "new">(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-[1320px]">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-[0.22em] text-ink-500">
            Services
          </span>
          <h1 className="display-font mt-2 text-[clamp(1.8rem,3.6vw,2.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-navy-900">
            Service catalogue
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-[13px] font-medium text-paper"
        >
          <Plus className="h-4 w-4" /> Add service
        </button>
      </header>
      {msg ? (
        <div className="mt-4 rounded-full border border-emerald-300 bg-emerald-50 px-5 py-2 text-[13px] text-emerald-800">
          {msg}
        </div>
      ) : null}

      {services.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No services"
            body="Add the services TAE offers. They power the public Services page and booking form."
            cta="Add service"
            onClick={() => setEditing("new")}
            icon={<Sparkles className="h-5 w-5" />}
          />
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-ink-900/5 bg-paper">
          <ul>
            {services.map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-900/5 px-6 py-4 last:border-b-0"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-navy-900">{s.title}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10.5px] uppercase tracking-wide ${
                        s.active
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-ink-100 text-ink-600"
                      }`}
                    >
                      {s.active ? "active" : "inactive"}
                    </span>
                  </div>
                  <div className="truncate text-[12.5px] text-ink-500">
                    /{s.slug} · order {s.displayOrder}
                    {s.tagline ? ` · ${s.tagline}` : ""}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(s)}
                    className="rounded-full bg-navy-900 px-4 py-1.5 text-[12.5px] font-medium text-paper"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(s.id)}
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
        title={editing === "new" ? "New service" : "Edit service"}
        onClose={() => setEditing(null)}
        size="lg"
      >
        {editing !== null ? (
          <form
            className="space-y-4 px-7 py-6"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              if (editing !== "new") fd.append("id", String(editing.id));
              start(async () => {
                const r = await saveService(fd);
                if (r.ok) {
                  setEditing(null);
                  setMsg("Service saved.");
                  setTimeout(() => setMsg(null), 2000);
                } else setMsg(r.error ?? "Error");
              });
            }}
          >
            <Field label="Title">
              <Input
                name="title"
                required
                defaultValue={editing === "new" ? "" : editing.title}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Slug">
                <Input
                  name="slug"
                  defaultValue={editing === "new" ? "" : editing.slug}
                />
              </Field>
              <Field label="Icon key">
                <Select
                  name="iconKey"
                  defaultValue={
                    editing === "new" ? "sparkle" : editing.iconKey ?? "sparkle"
                  }
                >
                  {[
                    "compass",
                    "code",
                    "layers",
                    "shopping",
                    "trend",
                    "calculator",
                    "sparkle",
                  ].map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Tagline">
              <Input
                name="tagline"
                defaultValue={editing === "new" ? "" : editing.tagline ?? ""}
              />
            </Field>
            <Field label="Description">
              <Textarea
                name="description"
                required
                rows={4}
                defaultValue={editing === "new" ? "" : editing.description}
              />
            </Field>
            <Field label="Problem">
              <Textarea
                name="problem"
                rows={3}
                defaultValue={editing === "new" ? "" : editing.problem ?? ""}
              />
            </Field>
            <Field label="Approach">
              <Textarea
                name="approach"
                rows={3}
                defaultValue={editing === "new" ? "" : editing.approach ?? ""}
              />
            </Field>
            <Field label="Benefits (one per line)">
              <Textarea
                name="benefits"
                rows={4}
                defaultValue={
                  editing === "new" ? "" : (editing.benefits ?? []).join("\n")
                }
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="CTA label">
                <Input
                  name="cta"
                  defaultValue={
                    editing === "new" ? "Talk to us" : editing.cta ?? ""
                  }
                />
              </Field>
              <Field label="Display order">
                <Input
                  name="displayOrder"
                  type="number"
                  defaultValue={
                    editing === "new" ? 0 : editing.displayOrder
                  }
                />
              </Field>
            </div>
            <label className="flex items-center justify-between rounded-2xl border border-ink-900/5 p-4">
              <span className="text-[14px] font-medium">Active</span>
              <input
                type="checkbox"
                name="active"
                defaultChecked={editing === "new" ? true : editing.active}
              />
            </label>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={pending}
                className="rounded-full bg-navy-900 px-6 py-2.5 text-[13px] font-medium text-paper disabled:opacity-60"
              >
                {pending ? "Saving…" : "Save service"}
              </button>
            </div>
          </form>
        ) : null}
      </DrawerForm>

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete service?"
        body="This removes the service from the public site."
        danger
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId == null) return;
          const fd = new FormData();
          fd.append("id", String(deleteId));
          start(async () => {
            await removeService(fd);
            setDeleteId(null);
            setMsg("Service deleted.");
            setTimeout(() => setMsg(null), 2000);
          });
        }}
      />
    </div>
  );
}
