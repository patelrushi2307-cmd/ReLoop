"use client";

import type { ReactNode } from "react";
import { brand } from "@/content/site";

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="eyebrow">{label}</span>
      {children}
      {error && <span className="text-[13px] text-orange">{error}</span>}
    </label>
  );
}

export const inputClass =
  "h-12 w-full border border-[var(--line)] bg-[var(--panel)] px-4 text-[15px] text-[var(--fg)] outline-none transition-colors placeholder:text-[var(--faint)] focus:border-[var(--fg)]";

export function AuthShell({
  eyebrow,
  title,
  intro,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <div className="flex h-16 items-center justify-between border-b border-[var(--line)] px-4 md:h-[72px] md:px-8">
        <a href="/" className="flex items-baseline gap-3">
          <span className="text-[15px] font-semibold tracking-[0.2em] text-[var(--fg)]">
            {brand.wordmark}
          </span>
          <span className="eyebrow hidden sm:block">Circular logistics</span>
        </a>
        <a href="/" className="roll text-[14px] font-medium text-[var(--fg)]">
          <span>Back to site</span>
          <span aria-hidden>Back to site</span>
        </a>
      </div>

      <div className="mx-auto grid max-w-[1280px] gap-12 px-4 py-16 md:grid-cols-12 md:px-8 md:py-24">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <span className="eyebrow tnum">01</span>
            <span className="eyebrow">{eyebrow}</span>
          </div>
          <h1 className="display-sm mt-6 max-w-[16ch]">{title}</h1>
          <p className="body-copy mt-6">{intro}</p>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <div className="border-t border-[var(--line)] pt-8">{children}</div>
          <div className="mt-8 border-t border-[var(--line)] pt-5 text-[14px] text-[var(--muted)]">
            {footer}
          </div>
        </div>
      </div>
    </main>
  );
}
