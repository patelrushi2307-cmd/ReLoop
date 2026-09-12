"use client";

import { useCallback, useEffect, useState } from "react";
import { Field, inputClass } from "@/components/auth/AuthShell";
import {
  ALL_CATEGORIES,
  CategoryFilter,
} from "@/components/dashboard/CategoryFilter";
import {
  PageHeader,
  primaryButton,
  secondaryButton,
  smallButton,
} from "@/components/dashboard/DashboardShell";
import { RequirementMatches } from "@/components/dashboard/RequirementMatches";
import {
  ApiError,
  api,
  type Paginated,
  type Requirement,
} from "@/lib/api";
import {
  categoryLabel,
  categoryOptions,
  subtypesFor,
  useTaxonomy,
  type CategorySlug,
} from "@/lib/taxonomy";

type Facility = { _id: string; name: string };

const GRADES = ["A", "B", "C", "reject"] as const;

export default function RequirementsPage() {
  const { taxonomy } = useTaxonomy();
  const [items, setItems] = useState<Requirement[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [fields, setFields] = useState<Record<string, string>>({});
  /* Empty means every category. */
  const [category, setCategory] = useState(ALL_CATEGORIES);
  /* Requirement whose recommended lots are expanded, if any. */
  const [matchesFor, setMatchesFor] = useState<string | null>(null);

  const [form, setForm] = useState({
    facilityId: "",
    materialCategory: "cardboard" as CategorySlug,
    materialSubtype: "occ",
    minGrade: "B" as (typeof GRADES)[number],
    massKgPerPeriod: "5000",
    period: "monthly" as "weekly" | "monthly",
    maxPricePerKg: "",
    maxDistanceKm: "421",
    description: "",
  });

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const search = new URLSearchParams({ limit: "50" });
      if (category) search.set("materialCategory", category);
      const [res, facilityList] = await Promise.all([
        api.get<Paginated<Requirement>>(`/requirements?${search}`),
        api.get<Facility[]>("/facilities").catch(() => [] as Facility[]),
      ]);
      setItems(res.items ?? []);
      setFacilities(facilityList ?? []);
      if (facilityList?.length && !form.facilityId) {
        setForm((f) => ({ ...f, facilityId: facilityList[0]._id }));
      }
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not load requirements.",
      );
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (id: string, action: "pause" | "resume" | "close") => {
    setBusyId(id);
    setError(null);
    try {
      await api.post(`/requirements/${id}/${action}`);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : `Could not ${action}.`);
    } finally {
      setBusyId(null);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusyId("new");
    setError(null);
    setFields({});

    const body: Record<string, unknown> = {
      facilityId: form.facilityId,
      materialCategory: form.materialCategory,
      materialSubtype: form.materialSubtype,
      minGrade: form.minGrade,
      massKgPerPeriod: Number(form.massKgPerPeriod),
      period: form.period,
      description: form.description,
    };
    if (form.maxPricePerKg) body.maxPricePerKg = Number(form.maxPricePerKg);
    if (form.maxDistanceKm) body.maxDistanceKm = Number(form.maxDistanceKm);

    try {
      await api.post("/requirements", body);
      setShowForm(false);
      await load();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setFields(err.fields ?? {});
      } else {
        setError("Could not create the requirement.");
      }
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <PageHeader
        index="01"
        eyebrow="Requirements"
        title="What you are looking to take in"
        intro="A standing requirement tells the matching engine what you will accept — material, minimum grade, volume per period and how far you will haul it."
        action={
          <button
            type="button"
            onClick={() => setShowForm((s) => !s)}
            className={primaryButton}
          >
            {showForm ? "Close form" : "New requirement"}
          </button>
        }
      />

      {showForm && (
        <form onSubmit={onSubmit} className="mt-10 px-4 md:px-8">
          <div className="border-t border-[var(--line)] pt-8">
            <div className="grid gap-6 md:grid-cols-3">
              <Field label="Facility" error={fields.facilityId}>
                <select
                  required
                  value={form.facilityId}
                  onChange={(e) => set("facilityId", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select a facility</option>
                  {facilities.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Material category">
                <select
                  value={form.materialCategory}
                  onChange={(e) => {
                    const next = e.target.value as CategorySlug;
                    const first = subtypesFor(taxonomy, next)[0]?.slug ?? "";
                    setForm((f) => ({
                      ...f,
                      materialCategory: next,
                      materialSubtype: first,
                    }));
                  }}
                  className={inputClass}
                >
                  {categoryOptions(taxonomy).map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Subtype" error={fields.materialSubtype}>
                <select
                  required
                  value={form.materialSubtype}
                  onChange={(e) => set("materialSubtype", e.target.value)}
                  className={inputClass}
                >
                  {subtypesFor(taxonomy, form.materialCategory).map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Minimum grade">
                <select
                  value={form.minGrade}
                  onChange={(e) =>
                    set("minGrade", e.target.value as (typeof GRADES)[number])
                  }
                  className={inputClass}
                >
                  {GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Mass per period (kg)" error={fields.massKgPerPeriod}>
                <input
                  required
                  type="number"
                  min="1"
                  value={form.massKgPerPeriod}
                  onChange={(e) => set("massKgPerPeriod", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Period">
                <select
                  value={form.period}
                  onChange={(e) =>
                    set("period", e.target.value as "weekly" | "monthly")
                  }
                  className={inputClass}
                >
                  <option value="monthly">monthly</option>
                  <option value="weekly">weekly</option>
                </select>
              </Field>

              <Field label="Max price per kg (optional)">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.maxPricePerKg}
                  onChange={(e) => set("maxPricePerKg", e.target.value)}
                  placeholder="0.18"
                  className={inputClass}
                />
              </Field>

              <Field label="Max haul distance (km)">
                <input
                  type="number"
                  min="1"
                  value={form.maxDistanceKm}
                  onChange={(e) => set("maxDistanceKm", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            {error && (
              <p className="mt-8 border-l-2 border-orange pl-3 text-[14px] text-[var(--fg)]">
                {error}
              </p>
            )}

            <div className="mt-8 flex gap-3">
              <button
                type="submit"
                disabled={busyId === "new"}
                className={primaryButton}
              >
                {busyId === "new" ? "Saving…" : "Create requirement"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className={secondaryButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="mt-12 px-4 md:px-8">
        <CategoryFilter value={category} onChange={setCategory} />
      </div>

      <div className="mt-6 px-4 pb-20 md:px-8">
        {error && !showForm && (
          <p className="mb-6 border-l-2 border-orange pl-3 text-[14px] text-[var(--fg)]">
            {error}
          </p>
        )}

        {loading ? (
          <p className="eyebrow border-t border-[var(--line)] py-10">
            Loading requirements…
          </p>
        ) : items.length === 0 ? (
          <div className="border-t border-[var(--line)] py-10">
            <p className="body-copy">
              {category
                ? "No requirements in this category. Clear the filter to see everything."
                : "No standing requirements yet. Add one and the matching engine will start ranking lots against it."}
            </p>
          </div>
        ) : (
          <ul className="border-t border-[var(--line)]">
            {items.map((req, i) => (
              <li key={req._id} className="border-b border-[var(--line)]">
                <div className="grid gap-6 py-6 md:grid-cols-12 md:items-center">
                <div className="md:col-span-4">
                  <div className="flex items-center gap-3">
                    <span className="eyebrow tnum">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="eyebrow">
                      {categoryLabel(taxonomy, req.materialCategory)}
                    </span>
                  </div>
                  <p className="mt-2 text-[19px] font-medium tracking-[-0.02em]">
                    {req.materialSubtype ?? "Any subtype"}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <span className="eyebrow block">Volume</span>
                  <span className="tnum text-[17px]">
                    {(req.massKgPerPeriod ?? 0).toLocaleString("en-US")} kg
                  </span>
                  <span className="block text-[13px] text-[var(--muted)]">
                    per {req.period}
                  </span>
                </div>

                <div className="md:col-span-1">
                  <span className="eyebrow block">Min grade</span>
                  <span className="tnum text-[17px]">{req.minGrade}</span>
                </div>

                <div className="md:col-span-2">
                  <span className="eyebrow block">Max haul</span>
                  <span className="tnum text-[17px]">
                    {req.maxDistanceKm
                      ? `${req.maxDistanceKm.toLocaleString("en-US")} km`
                      : "—"}
                  </span>
                </div>

                <div className="md:col-span-1">
                  <span className="eyebrow block">Status</span>
                  <span
                    className={`text-[14px] ${
                      req.status === "active"
                        ? "text-[var(--fg)]"
                        : "text-orange"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 md:col-span-2 md:justify-end">
                  {req.status === "active" ? (
                    <button
                      type="button"
                      disabled={busyId === req._id}
                      onClick={() => act(req._id, "pause")}
                      className={smallButton}
                    >
                      Pause
                    </button>
                  ) : req.status === "paused" ? (
                    <button
                      type="button"
                      disabled={busyId === req._id}
                      onClick={() => act(req._id, "resume")}
                      className={smallButton}
                    >
                      Resume
                    </button>
                  ) : null}
                  {req.status !== "closed" && (
                    <button
                      type="button"
                      disabled={busyId === req._id}
                      onClick={() => act(req._id, "close")}
                      className={smallButton}
                    >
                      Close
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setMatchesFor((id) => (id === req._id ? null : req._id))
                    }
                    className={`${smallButton} !border-[var(--fg)]`}
                  >
                    {matchesFor === req._id ? "Hide matches" : "Find matches"}
                  </button>
                </div>
                </div>

                {matchesFor === req._id && (
                  <RequirementMatches
                    requirementId={req._id}
                    onClose={() => setMatchesFor(null)}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
