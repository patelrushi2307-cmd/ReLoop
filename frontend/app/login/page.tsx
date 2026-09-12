"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AuthShell, Field, inputClass } from "@/components/auth/AuthShell";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

function LoginForm() {
  const { login, status } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.replace(next);
  }, [status, router, next]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(email, password);
      router.replace(next);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not sign in. Try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Sign in"
      title="Back to your exchange"
      intro="Listings, matches and shipment lots are scoped to your organisation. Sign in to pick up where the desk left off."
      footer={
        <>
          No account yet?{" "}
          <a href="/register" className="font-medium text-[var(--fg)] underline">
            Register an organisation
          </a>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <Field label="Work email">
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className={inputClass}
          />
        </Field>

        <Field label="Password">
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={inputClass}
          />
        </Field>

        {error && (
          <p className="border-l-2 border-orange pl-3 text-[14px] text-[var(--fg)]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="flex h-12 items-center justify-center rounded-full bg-[var(--fg)] px-6 text-[14px] font-medium text-[var(--bg)] transition-opacity disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
