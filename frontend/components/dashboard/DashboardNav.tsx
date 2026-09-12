"use client";

import { Bell, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/content/site";
import { useAuth } from "@/lib/auth";

const NAV_ITEMS: { name: string; href?: string }[] = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Listings", href: "/dashboard/listings" },
  { name: "Requirements", href: "/dashboard/requirements" },
  { name: "Trades", href: "/dashboard/trades" },
  { name: "Impact", href: "/dashboard/impact" },
];

export function DashboardNav() {
  const { org, user, logout } = useAuth();
  const pathname = usePathname();

  const activeName = pathname?.startsWith("/dashboard/listings")
    ? "Listings"
    : pathname?.startsWith("/dashboard/requirements")
      ? "Requirements"
      : pathname?.startsWith("/dashboard/impact")
        ? "Impact"
        : pathname?.startsWith("/dashboard/trades")
          ? "Trades"
          : "Dashboard";

  const initials = (user?.name ?? "ReLoop")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--bg)]/85 backdrop-blur-md transition-colors duration-[600ms]">
      <div className="flex h-16 items-center justify-between px-4 md:h-[72px] md:px-8">
        <a href="/" className="flex items-baseline gap-3">
          <span className="text-[15px] font-semibold tracking-[0.2em] text-[var(--fg)]">
            {brand.wordmark}
          </span>
          <span className="eyebrow hidden sm:block">Circular logistics</span>
        </a>

        <div className="flex items-center gap-5">
          <span className="eyebrow hidden items-center gap-2 md:flex">
            <span
              className={`block h-1.5 w-1.5 rounded-full ${
                org?.verified ? "bg-orange" : "bg-[var(--faint)]"
              }`}
            />
            {org?.verified ? "Verified org" : "Unverified"}
          </span>

          {org?.name && (
            <span className="hidden text-[14px] font-medium text-[var(--fg)] lg:block">
              {org.name}
            </span>
          )}

          <button
            type="button"
            title="Search"
            className="flex h-9 w-9 items-center justify-center text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
          >
            <Search className="h-4 w-4 stroke-[1.5]" />
          </button>

          <button
            type="button"
            title="Notifications"
            className="relative flex h-9 w-9 items-center justify-center text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
          >
            <Bell className="h-4 w-4 stroke-[1.5]" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-orange" />
          </button>

          <div className="flex items-center gap-3">
            <span
              title={user?.name ?? undefined}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--line)] text-[11px] font-medium tracking-[0.08em] text-[var(--muted)]"
            >
              {initials}
            </span>
            <button
              type="button"
              onClick={() => logout()}
              title="Sign out"
              className="eyebrow transition-colors hover:!text-[var(--fg)]"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Section tabs — hairline rule, active marked by a single underline. */}
      <div className="flex gap-7 overflow-x-auto px-4 md:px-8">
        {NAV_ITEMS.map((item) => {
          const isActive = item.name === activeName;
          const className = `relative shrink-0 pb-3 pt-1 text-[14px] font-medium tracking-[-0.01em] transition-colors ${
            isActive
              ? "text-[var(--fg)]"
              : "text-[var(--faint)] hover:text-[var(--fg)]"
          }`;
          const underline = isActive ? (
            <span className="absolute inset-x-0 -bottom-px h-px bg-[var(--fg)]" />
          ) : null;

          return item.href ? (
            <Link key={item.name} href={item.href} className={className}>
              {item.name}
              {underline}
            </Link>
          ) : (
            <button
              key={item.name}
              type="button"
              title="Not built yet"
              className={className}
            >
              {item.name}
              {underline}
            </button>
          );
        })}
      </div>
    </header>
  );
}
