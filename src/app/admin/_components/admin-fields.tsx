"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, X } from "lucide-react";

export function EmptyState({
  title,
  body,
  cta,
  onClick,
  icon,
}: {
  title: string;
  body: string;
  cta: string;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-ink-900/5 bg-paper py-16 text-center">
      {icon ? (
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-paper-deep text-ink-400">
          {icon}
        </div>
      ) : null}
      <h3 className="display-font text-[20px] text-navy-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-[14px] text-ink-500">{body}</p>
      <button
        type="button"
        onClick={onClick}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-[13px] font-medium text-paper transition hover:bg-navy-800"
      >
        <Plus className="h-4 w-4" />
        {cta}
      </button>
    </div>
  );
}

export function DrawerForm({
  open,
  title,
  children,
  onClose,
  size = "md",
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  size?: "md" | "lg";
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-navy-950/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 60, opacity: 0 }}
            transition={{ type: "tween", duration: 0.25 }}
            className={`absolute right-0 top-0 h-full w-full overflow-y-auto bg-paper ${
              size === "lg" ? "max-w-[760px]" : "max-w-[640px]"
            }`}
            role="dialog"
            aria-label={title}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-900/5 bg-paper/95 px-7 py-4 backdrop-blur">
              <div className="text-[14px] uppercase tracking-[0.18em] text-ink-500">
                {title}
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-full border border-ink-900/10 text-ink-700 transition hover:border-navy-900/30"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function ConfirmDialog({
  open,
  title,
  body,
  onCancel,
  onConfirm,
  danger,
}: {
  open: boolean;
  title: string;
  body: string;
  onCancel: () => void;
  onConfirm: () => void;
  danger?: boolean;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 grid place-items-center bg-navy-950/40 p-5 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md rounded-2xl border border-ink-900/5 bg-paper p-6 shadow-lg"
            role="dialog"
          >
            <h3 className="display-font text-[20px] font-medium text-navy-900">
              {title}
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-700">
              {body}
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-full border border-ink-900/10 px-5 py-2 text-[13px] font-medium text-ink-900 transition hover:bg-paper-deep"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-medium text-paper transition ${
                  danger
                    ? "bg-red-700 hover:bg-red-800"
                    : "bg-navy-900 hover:bg-navy-800"
                }`}
              >
                <Trash2 className="h-4 w-4" />
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function Field({
  label,
  error,
  children,
  hint,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[12.5px] font-medium text-navy-900">
        {label}
      </span>
      {children}
      {hint && !error ? (
        <span className="mt-1 block text-[12px] text-ink-500">{hint}</span>
      ) : null}
      {error ? (
        <span className="mt-1 block text-[12.5px] text-red-700">{error}</span>
      ) : null}
    </label>
  );
}

export function Input({
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`mt-1 w-full rounded-xl border border-ink-900/10 bg-paper px-4 py-3 text-[14.5px] outline-none transition focus:border-navy-900/40 ${
        props.className ?? ""
      }`}
    />
  );
}

export function Textarea({
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`mt-1 w-full rounded-xl border border-ink-900/10 bg-paper px-4 py-3 text-[14.5px] outline-none transition focus:border-navy-900/40 ${
        props.className ?? ""
      }`}
    />
  );
}

export function Select({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      {...props}
      className={`mt-1 w-full rounded-xl border border-ink-900/10 bg-paper px-4 py-3 text-[14.5px] outline-none transition focus:border-navy-900/40 ${
        props.className ?? ""
      }`}
    >
      {children}
    </select>
  );
}

export function ToggleRow({
  label,
  description,
  name,
  defaultChecked,
}: {
  label: string;
  description?: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-ink-900/5 bg-paper p-4">
      <span className="min-w-0">
        <span className="block text-[14px] font-medium text-navy-900">
          {label}
        </span>
        {description ? (
          <span className="mt-0.5 block text-[12.5px] text-ink-500">
            {description}
          </span>
        ) : null}
      </span>
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="relative h-6 w-11 cursor-pointer appearance-none rounded-full bg-paper-deep outline-none transition checked:bg-navy-900 before:absolute before:left-1 before:top-1 before:inline-block before:h-4 before:w-4 before:rounded-full before:bg-paper before:transition before:content-[''] checked:before:left-6"
      />
    </label>
  );
}

export function StringListEditor({
  name,
  items,
  onChange,
}: {
  name: string;
  items: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={JSON.stringify(items)} />
      {items.map((it, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <input
            value={it}
            onChange={(e) => {
              const next = [...items];
              next[idx] = e.target.value;
              onChange(next);
            }}
            className="flex-1 rounded-xl border border-ink-900/10 bg-paper px-4 py-2.5 text-[14px] outline-none focus:border-navy-900/40"
            placeholder="Add a benefit / responsibility"
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== idx))}
            className="grid h-10 w-10 place-items-center rounded-xl border border-ink-900/10 text-red-600 transition hover:border-red-200"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="inline-flex items-center gap-1.5 rounded-xl border border-ink-900/10 bg-paper px-3 py-1.5 text-[12.5px] font-medium text-ink-900 transition hover:border-navy-900/30"
      >
        <Plus className="h-3.5 w-3.5" />
        Add item
      </button>
    </div>
  );
}

export function Toast({
  message,
  tone = "success",
}: {
  message: string;
  tone?: "success" | "error";
}) {
  const [show, setShow] = useState(true);
  if (!show) return null;
  setTimeout(() => setShow(false), 2400);
  return (
    <div
      role="status"
      className={`fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full border px-5 py-2.5 text-[13px] font-medium shadow-lg backdrop-blur ${
        tone === "error"
          ? "border-red-300 bg-red-50 text-red-800"
          : "border-emerald-300 bg-emerald-50 text-emerald-800"
      }`}
    >
      {message}
    </div>
  );
}
