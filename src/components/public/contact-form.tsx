"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

type ServiceOpt = { id: number; title: string };

export function ContactForm({ services }: { services: ServiceOpt[] }) {
  const [state, setState] = useState<
    | { kind: "idle" }
    | { kind: "loading" }
    | { kind: "success" }
    | { kind: "error"; message: string }
    | { kind: "validation"; errors: Record<string, string> }
  >({ kind: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const company = String(data.get("company") ?? "").trim();
    const service = String(data.get("service") ?? "").trim();

    const validationErrors: Record<string, string> = {};
    if (name.length < 2) validationErrors.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      validationErrors.email = "Please enter a valid email.";
    if (message.length < 10)
      validationErrors.message = "Please share at least a sentence or two.";
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setState({ kind: "validation", errors: validationErrors });
      return;
    }
    setErrors({});
    setState({ kind: "loading" });
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, company, service, message }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Submission failed");
      }
      setState({ kind: "success" });
      form.reset();
    } catch (err) {
      setState({
        kind: "error",
        message:
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
      });
    }
  }

  if (state.kind === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-ink-900/5 bg-white p-8 text-center"
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-navy-900 text-paper">
          <Check className="h-7 w-7" />
        </div>
        <h2 className="display-font mt-6 text-[26px] font-medium text-navy-900">
          Enquiry received.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] text-ink-700">
          Thank you. The TAE team will respond to your message within one
          business day. For urgent conversations, use the booking page.
        </p>
        <button
          type="button"
          onClick={() => setState({ kind: "idle" })}
          className="mt-6 text-[13px] font-medium text-navy-900 underline"
        >
          Send another enquiry
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-ink-900/5 bg-white p-7">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Your name" name="name" required error={errors.name} />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          error={errors.email}
        />
        <Field label="Phone" name="phone" />
        <Field label="Company" name="company" />
        <div className="md:col-span-2">
          <label className="block text-[13px] font-medium text-navy-900">
            Service of interest
          </label>
          <select
            name="service"
            defaultValue=""
            className="mt-2 w-full rounded-xl border border-ink-900/10 bg-paper px-4 py-3 text-[15px] outline-none transition focus:border-navy-900/40"
          >
            <option value="">Choose a service (optional)</option>
            {services.map((s) => (
              <option key={s.id} value={s.title}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-[13px] font-medium text-navy-900">
            Message<span className="ml-1 text-red-600">*</span>
          </label>
          <textarea
            name="message"
            rows={5}
            required
            placeholder="Tell us about your business and what you'd like help with."
            className={`mt-2 w-full rounded-xl border bg-paper px-4 py-3 text-[15px] outline-none transition focus:border-navy-900/40 ${
              errors.message ? "border-red-300" : "border-ink-900/10"
            }`}
          />
          {errors.message ? (
            <p className="mt-1 text-[12.5px] text-red-700">{errors.message}</p>
          ) : null}
        </div>
      </div>
      {state.kind === "error" ? (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-[14px] text-red-800">
          {state.message}
        </div>
      ) : null}
      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-[13px] text-ink-500">
          We respond within one business day.
        </p>
        <button
          type="submit"
          disabled={state.kind === "loading"}
          className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-7 py-3.5 text-[15px] font-medium text-paper transition hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-ink-300"
        >
          {state.kind === "loading" ? "Sending…" : "Send enquiry"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-navy-900">
        {label}
        {required ? <span className="ml-1 text-red-600">*</span> : null}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className={`mt-2 w-full rounded-xl border bg-paper px-4 py-3 text-[15px] outline-none transition focus:border-navy-900/40 ${
          error ? "border-red-300" : "border-ink-900/10"
        }`}
      />
      {error ? <p className="mt-1 text-[12.5px] text-red-700">{error}</p> : null}
    </div>
  );
}
