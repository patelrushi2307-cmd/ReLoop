"use client";

import { categoryOptions, useTaxonomy } from "@/lib/taxonomy";

/** Empty string means every category. */
export const ALL_CATEGORIES = "";

/**
 * Material category pills shared by the listings and requirements tables.
 * Options come from /categories/taxonomy so the slugs match what the API
 * filters on.
 */
export function CategoryFilter({
  value,
  onChange,
  label = "Category",
}: {
  value: string;
  onChange: (category: string) => void;
  label?: string;
}) {
  const { taxonomy } = useTaxonomy();
  const options = [
    { value: ALL_CATEGORIES, label: "All" },
    ...categoryOptions(taxonomy),
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="eyebrow mr-1">{label}</span>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value || "all"}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`flex h-9 items-center rounded-full border px-4 text-[13px] font-medium transition-colors ${
              active
                ? "border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]"
                : "border-[var(--line)] text-[var(--fg)] hover:border-[var(--fg)]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
