"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { DashboardNav } from "./DashboardNav";

export function DashboardShell({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "anonymous") router.replace("/login?next=/dashboard");
  }, [status, router]);

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
        <span className="eyebrow">
          {status === "loading" ? "Restoring session" : "Redirecting to sign in"}
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <DashboardNav />
      <main>{children}</main>
    </div>
  );
}

/** Section header used across every dashboard route. */
export function PageHeader({
  index,
  eyebrow,
  title,
  intro,
  action,
}: {
  index: string;
  eyebrow: string;
  title: string;
  intro?: string;
  action?: ReactNode;
}) {
  return (
    <div className="px-4 pt-12 md:px-8">
      <div className="flex items-center gap-3">
        <span className="eyebrow tnum">{index}</span>
        <span className="eyebrow">{eyebrow}</span>
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="display-sm max-w-[18ch]">{title}</h1>
          {intro && <p className="body-copy mt-5">{intro}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

export const primaryButton =
  "flex h-12 items-center justify-center rounded-full bg-[var(--fg)] px-6 text-[14px] font-medium text-[var(--bg)] transition-opacity hover:opacity-85 disabled:opacity-50";

export const secondaryButton =
  "flex h-12 items-center justify-center rounded-full border border-[var(--line)] px-6 text-[14px] font-medium text-[var(--fg)] transition-colors hover:border-[var(--fg)] disabled:opacity-50";

export const smallButton =
  "flex h-9 items-center rounded-full border border-[var(--line)] px-4 text-[13px] font-medium text-[var(--fg)] transition-colors hover:border-[var(--fg)] disabled:opacity-50";
