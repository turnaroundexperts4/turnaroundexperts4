"use client";

import { useState, useTransition } from "react";
import { Field, Input, Textarea } from "@/app/admin/_components/admin-fields";
import { saveSettings } from "@/app/admin/(protected)/settings/actions";

export function SettingsAdmin({
  company,
  social,
  seo,
  booking,
}: {
  company: Record<string, string>;
  social: Record<string, string>;
  seo: { title: string; description: string; keywords: string };
  booking: { minLeadDays: number; maxLeadDays: number };
}) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-[900px]">
      <header>
        <span className="text-[11px] uppercase tracking-[0.22em] text-ink-500">
          Settings
        </span>
        <h1 className="display-font mt-2 text-[clamp(1.8rem,3.6vw,2.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-navy-900">
          Website settings
        </h1>
        <p className="mt-2 text-[14px] text-ink-700">
          Company contact details, social links, SEO defaults and booking
          window. Changes flow into the public footer, contact page and booking
          rules.
        </p>
      </header>
      {msg ? (
        <div className="mt-4 rounded-full border border-emerald-300 bg-emerald-50 px-5 py-2 text-[13px] text-emerald-800">
          {msg}
        </div>
      ) : null}

      <form
        className="mt-8 space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          start(async () => {
            await saveSettings(fd);
            setMsg("Settings saved.");
            setTimeout(() => setMsg(null), 2000);
          });
        }}
      >
        <section className="rounded-2xl border border-ink-900/5 bg-paper p-6">
          <h2 className="display-font text-[18px] text-navy-900">Company</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Company name">
              <Input name="name" defaultValue={company.name ?? ""} required />
            </Field>
            <Field label="Short name">
              <Input name="short" defaultValue={company.short ?? "TAE"} />
            </Field>
            <Field label="Tagline">
              <Input name="tagline" defaultValue={company.tagline ?? ""} />
            </Field>
            <Field label="Phone">
              <Input name="phone" defaultValue={company.phone ?? ""} />
            </Field>
            <Field label="Email">
              <Input
                name="email"
                type="email"
                defaultValue={company.email ?? ""}
              />
            </Field>
            <Field label="Website">
              <Input name="website" defaultValue={company.website ?? ""} />
            </Field>
            <Field label="Address">
              <Input name="address" defaultValue={company.address ?? ""} />
            </Field>
            <Field label="Udyam registration">
              <Input name="udyam" defaultValue={company.udyam ?? ""} />
            </Field>
          </div>
        </section>

        <section className="rounded-2xl border border-ink-900/5 bg-paper p-6">
          <h2 className="display-font text-[18px] text-navy-900">Social</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="LinkedIn">
              <Input name="linkedin" defaultValue={social.linkedin ?? ""} />
            </Field>
            <Field label="Instagram">
              <Input name="instagram" defaultValue={social.instagram ?? ""} />
            </Field>
            <Field label="Twitter / X">
              <Input name="twitter" defaultValue={social.twitter ?? ""} />
            </Field>
            <Field label="Facebook">
              <Input name="facebook" defaultValue={social.facebook ?? ""} />
            </Field>
          </div>
        </section>

        <section className="rounded-2xl border border-ink-900/5 bg-paper p-6">
          <h2 className="display-font text-[18px] text-navy-900">SEO defaults</h2>
          <div className="mt-4 space-y-4">
            <Field label="Default title">
              <Input name="seoTitle" defaultValue={seo.title ?? ""} />
            </Field>
            <Field label="Default description">
              <Textarea
                name="seoDescription"
                rows={3}
                defaultValue={seo.description ?? ""}
              />
            </Field>
            <Field label="Keywords (comma separated)">
              <Input name="seoKeywords" defaultValue={seo.keywords ?? ""} />
            </Field>
          </div>
        </section>

        <section className="rounded-2xl border border-ink-900/5 bg-paper p-6">
          <h2 className="display-font text-[18px] text-navy-900">Booking window</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Field label="Min lead days">
              <Input
                name="minLeadDays"
                type="number"
                min={0}
                defaultValue={booking.minLeadDays}
              />
            </Field>
            <Field label="Max lead days">
              <Input
                name="maxLeadDays"
                type="number"
                min={1}
                defaultValue={booking.maxLeadDays}
              />
            </Field>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-navy-900 px-7 py-3 text-[14px] font-medium text-paper disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
