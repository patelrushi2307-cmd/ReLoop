"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell, Field, inputClass } from "@/components/auth/AuthShell";
import { ApiError } from "@/lib/api";
import { useAuth, type RegisterInput } from "@/lib/auth";

const ORG_TYPES: { value: RegisterInput["organizationType"]; label: string }[] =
  [
    { value: "manufacturer", label: "Manufacturer" },
    { value: "retailer", label: "Retailer" },
    { value: "recycler", label: "Recycler" },
    { value: "logistics", label: "Logistics operator" },
  ];

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<RegisterInput>({
    email: "",
    password: "",
    name: "",
    organizationName: "",
    organizationType: "manufacturer",
    city: "",
    country: "Netherlands",
  });
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof RegisterInput>(key: K, value: RegisterInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setFields({});
    try {
      await register(form);
      router.replace("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setFields(err.fields ?? {});
      } else {
        setError("Could not create the account. Try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Register"
      title="Put your surplus on the exchange"
      intro="One organisation, one operations desk. Registering creates your org record — listings, facilities and shipment lots hang off it."
      footer={
        <>
          Already registered?{" "}
          <a href="/login" className="font-medium text-[var(--fg)] underline">
            Sign in
          </a>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Your name" error={fields.name}>
            <input
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Operations lead"
              className={inputClass}
            />
          </Field>

          <Field label="Work email" error={fields.email}>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@company.com"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Password" error={fields.password}>
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            placeholder="At least 8 characters"
            className={inputClass}
          />
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Organisation" error={fields.organizationName}>
            <input
              required
              value={form.organizationName}
              onChange={(e) => set("organizationName", e.target.value)}
              placeholder="Company name"
              className={inputClass}
            />
          </Field>

          <Field label="Type" error={fields.organizationType}>
            <select
              value={form.organizationType}
              onChange={(e) =>
                set(
                  "organizationType",
                  e.target.value as RegisterInput["organizationType"],
                )
              }
              className={inputClass}
            >
              {ORG_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="City" error={fields.city}>
            <input
              required
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              placeholder="Rotterdam"
              className={inputClass}
            />
          </Field>

          <Field label="Country" error={fields.country}>
            <input
              required
              value={form.country}
              onChange={(e) => set("country", e.target.value)}
              placeholder="Netherlands"
              className={inputClass}
            />
          </Field>
        </div>

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
          {busy ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
