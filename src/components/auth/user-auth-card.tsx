"use client";

import { useState } from "react";
import { useUserAuth } from "./user-auth-provider";

export function UserAuthCard() {
  const { authError, signIn, signUp, signInWithGoogle } = useUserAuth();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "signIn") await signIn(email, password);
      else await signUp(email, password);
    } catch {
      setError(
        mode === "signIn"
          ? "Unable to sign in. Check your email and password."
          : "Unable to create the account. Use a valid email and a password of at least 6 characters.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-ink-900/5 bg-white p-6">
      <h2 className="display-font text-[24px] font-medium text-navy-900">
        Sign in to continue
      </h2>
      <p className="mt-2 text-[14px] text-ink-600">
        Your appointment and enquiry history is linked to your account.
      </p>
      <form onSubmit={submit} className="mt-5 grid gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          className="rounded-xl border border-ink-900/10 bg-paper px-4 py-3 text-[15px]"
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          className="rounded-xl border border-ink-900/10 bg-paper px-4 py-3 text-[15px]"
        />
        {error || authError ? (
          <p className="text-[13px] text-red-700">{error || authError}</p>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-navy-900 px-5 py-3 text-[14px] font-medium text-paper disabled:bg-ink-300"
        >
          {busy ? "Please wait…" : mode === "signIn" ? "Sign in" : "Create account"}
        </button>
      </form>
      <button
        type="button"
        onClick={() =>
          void signInWithGoogle().catch((error: unknown) => {
            const code =
              typeof error === "object" &&
              error !== null &&
              "code" in error &&
              typeof error.code === "string"
                ? error.code
                : "";
            setError(
              code === "auth/invalid-credential"
                ? "Google sign-in is not configured correctly in Firebase. Enable the Google provider and save its support email."
                : code === "auth/unauthorized-domain"
                  ? "This website domain is not authorized in Firebase Authentication."
                : code === "auth/popup-blocked"
                  ? "Google sign-in was blocked by the browser. Allow popups for this site and try again."
                  : code
                    ? `Google sign-in failed (${code}).`
                    : "Google sign-in was not completed.",
            );
          })
        }
        className="mt-3 w-full rounded-full border border-ink-900/15 px-5 py-3 text-[14px] font-medium text-navy-900"
      >
        Continue with Google
      </button>
      <button
        type="button"
        onClick={() => {
          setMode(mode === "signIn" ? "signUp" : "signIn");
          setError("");
        }}
        className="mt-4 text-[13px] text-ink-600 underline"
      >
        {mode === "signIn" ? "Create a new account" : "Already have an account? Sign in"}
      </button>
    </div>
  );
}
