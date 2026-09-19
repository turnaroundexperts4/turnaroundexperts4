"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type LoginState } from "@/app/admin/login/actions";

const initial: LoginState = {};

export function LoginForm() {
  const [state, action] = useActionState(loginAction, initial);
  return (
    <form action={action} className="mt-6 grid grid-cols-1 gap-4">
      <div>
        <label
          htmlFor="email"
          className="block text-[12.5px] uppercase tracking-[0.18em] text-ink-300/80"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-2 w-full rounded-xl border border-paper/10 bg-navy-950 px-4 py-3 text-[15px] text-paper outline-none transition focus:border-paper/30"
          placeholder="you@tae.local"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-[12.5px] uppercase tracking-[0.18em] text-ink-300/80"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-2 w-full rounded-xl border border-paper/10 bg-navy-950 px-4 py-3 text-[15px] text-paper outline-none transition focus:border-paper/30"
          placeholder="••••••••"
        />
      </div>
      {state?.error ? (
        <div className="rounded-xl border border-red-300/40 bg-red-500/10 p-3 text-[13px] text-red-200">
          {state.error}
        </div>
      ) : null}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-paper px-5 py-3 text-[14px] font-medium text-navy-900 transition hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}
