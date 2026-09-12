"use client";

import { useEffect, useState } from "react";
import { api } from "./api";

export type TaxonomyEntry = {
  category: string;
  label: string;
  subtypes: { slug: string; label: string }[];
};

/** Used until the API answers, and if it cannot be reached at all. */
export const FALLBACK_CATEGORIES = [
  { value: "cardboard", label: "Cardboard" },
  { value: "plastics", label: "Plastics" },
  { value: "pallets", label: "Pallets" },
  { value: "drums", label: "Drums" },
  { value: "gaylords", label: "Gaylords" },
] as const;

/** The slugs the API validates listings and requirements against. */
export type CategorySlug = (typeof FALLBACK_CATEGORIES)[number]["value"];

/** Served by the API so the slugs always match what the validator accepts. */
export function useTaxonomy() {
  const [taxonomy, setTaxonomy] = useState<TaxonomyEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get<TaxonomyEntry[]>("/categories/taxonomy")
      .then((data) => {
        if (!cancelled) setTaxonomy(data ?? []);
      })
      .catch(() => {
        if (!cancelled) setTaxonomy([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { taxonomy, loading };
}

export function subtypesFor(taxonomy: TaxonomyEntry[], category: string) {
  return taxonomy.find((t) => t.category === category)?.subtypes ?? [];
}

/** Category slug + label pairs for selects and filters. */
export function categoryOptions(
  taxonomy: TaxonomyEntry[],
): { value: string; label: string }[] {
  return taxonomy.length
    ? taxonomy.map((t) => ({ value: t.category, label: t.label }))
    : [...FALLBACK_CATEGORIES];
}

export function categoryLabel(taxonomy: TaxonomyEntry[], category?: string) {
  if (!category) return "—";
  return (
    categoryOptions(taxonomy).find((c) => c.value === category)?.label ??
    category
  );
}
