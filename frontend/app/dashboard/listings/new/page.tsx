"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Field, inputClass } from "@/components/auth/AuthShell";
import {
  PageHeader,
  primaryButton,
  secondaryButton,
} from "@/components/dashboard/DashboardShell";
import { ApiError, api, type Listing } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { subtypesFor, useTaxonomy } from "@/lib/taxonomy";

type Facility = {
  _id: string;
  name: string;
  address?: { city?: string; country?: string };
};

const CATEGORIES = [
  "cardboard",
  "plastics",
  "pallets",
  "drums",
  "gaylords",
] as const;
const GRADES = ["A", "B", "C", "reject"] as const;
const PACKAGING_STATES = [
  "new",
  "reusable",
  "damaged_recyclable",
  "clean_scrap",
] as const;

/** Mon–Fri open, weekend closed — the shape the facility schema expects. */
const DEFAULT_HOURS = {
  monday: { closed: false, opens: "08:00", closes: "18:00" },
  tuesday: { closed: false, opens: "08:00", closes: "18:00" },
  wednesday: { closed: false, opens: "08:00", closes: "18:00" },
  thursday: { closed: false, opens: "08:00", closes: "18:00" },
  friday: { closed: false, opens: "08:00", closes: "18:00" },
  saturday: { closed: true },
  sunday: { closed: true },
};

function isoDate(offsetDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export default function NewListingPage() {
  const router = useRouter();
  const { org } = useAuth();

  const { taxonomy } = useTaxonomy();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);

  const [form, setForm] = useState({
    facilityId: "",
    title: "",
    description: "",
    materialCategory: "cardboard" as (typeof CATEGORIES)[number],
    materialSubtype: "occ",
    grade: "A" as (typeof GRADES)[number],
    packagingState: "reusable" as (typeof PACKAGING_STATES)[number],
    massKg: "3000",
    unitCount: "",
    availableFrom: isoDate(0),
    availableUntil: isoDate(30),
    priceAmount: "",
    currency: "EUR",
    openToOffers: true,
    dockOpens: "08:00",
    dockCloses: "18:00",
    hasForklift: true,
    packagingMode: "palletised" as "loose" | "palletised",
    publishNow: true,
  });

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const loadFacilities = async () => {
    setLoadingFacilities(true);
    try {
      const list = await api.get<Facility[]>("/facilities");
      setFacilities(list ?? []);
      if (list?.length && !form.facilityId) {
        setForm((f) => ({ ...f, facilityId: list[0]._id }));
      }
    } catch {
      setFacilities([]);
    } finally {
      setLoadingFacilities(false);
    }
  };

  useEffect(() => {
    loadFacilities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* A listing needs a facility; orgs that have none get one created from
     their registered address so the flow is not a dead end. */
  const createFacility = async () => {
    setBusy(true);
    setError(null);
    try {
      const created = await api.post<Facility>("/facilities", {
        name: `${org?.name ?? "Operations"} yard`,
        facilityType: "warehouse",
        address: {
          street: org?.address?.street || "Operations Avenue 1",
          city: org?.address?.city || "Rotterdam",
          country: org?.address?.country || "Netherlands",
          postalCode: "3011AA",
        },
        location: { type: "Point", coordinates: [4.4792, 51.9225] },
        operatingHours: DEFAULT_HOURS,
        hasForklift: true,
      });
      await loadFacilities();
      if (created?._id) set("facilityId", created._id);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not create a facility.",
      );
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setFields({});

    const body: Record<string, unknown> = {
      facilityId: form.facilityId,
      materialCategory: form.materialCategory,
      materialSubtype: form.materialSubtype,
      title: form.title,
      description: form.description,
      grade: form.grade,
      gradeSource: "seller",
      massKg: Number(form.massKg),
      packagingState: form.packagingState,
      availableFrom: form.availableFrom,
      availableUntil: form.availableUntil,
      openToOffers: form.openToOffers,
      pickupConstraints: {
        dockHours: { opens: form.dockOpens, closes: form.dockCloses },
        hasForklift: form.hasForklift,
        packagingMode: form.packagingMode,
      },
    };

    if (form.unitCount) body.unitCount = Number(form.unitCount);
    if (form.priceAmount) {
      body.askingPrice = {
        amount: Number(form.priceAmount),
        currency: form.currency.toUpperCase(),
      };
    }

    try {
      const created = await api.post<Listing>("/listings", body);

      /* Photos are uploaded one at a time — the endpoint takes a single
         `file` — and publishing is refused below three. */
      for (const file of photos) {
        const payload = new FormData();
        payload.append("file", file);
        await api.post(`/listings/${created._id}/media`, payload);
      }

      if (form.publishNow && created?._id) {
        if (photos.length < 3) {
          setError(
            "Saved as a draft. Publishing needs at least 3 photos — add them and publish from the listings page.",
          );
          setBusy(false);
          return;
        }
        await api.post(`/listings/${created._id}/publish`);
      }
      router.push("/dashboard/listings");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setFields(err.fields ?? {});
      } else {
        setError("Could not create the listing.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        index="02"
        eyebrow="New listing"
        title="Publish a surplus lot"
        intro="Declare what you have, where it sits and when it can move. The break-even radius is computed from these values."
      />

      <form onSubmit={onSubmit} className="px-4 pb-24 md:px-8">
        <div className="mt-10 border-t border-[var(--line)] pt-8">
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Facility" error={fields.facilityId}>
              {loadingFacilities ? (
                <span className="text-[14px] text-[var(--muted)]">
                  Loading facilities…
                </span>
              ) : facilities.length > 0 ? (
                <select
                  required
                  value={form.facilityId}
                  onChange={(e) => set("facilityId", e.target.value)}
                  className={inputClass}
                >
                  {facilities.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.name}
                      {f.address?.city ? ` — ${f.address.city}` : ""}
                    </option>
                  ))}
                </select>
              ) : (
                <button
                  type="button"
                  onClick={createFacility}
                  disabled={busy}
                  className={secondaryButton}
                >
                  Create a facility first
                </button>
              )}
            </Field>

            <Field label="Title" error={fields.title}>
              <input
                required
                minLength={3}
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Grade A corrugated board, baled"
                className={inputClass}
              />
            </Field>

            <Field label="Material category" error={fields.materialCategory}>
              <select
                value={form.materialCategory}
                onChange={(e) => {
                  const next = e.target.value as (typeof CATEGORIES)[number];
                  const first = subtypesFor(taxonomy, next)[0]?.slug ?? "";
                  setForm((f) => ({
                    ...f,
                    materialCategory: next,
                    materialSubtype: first,
                  }));
                }}
                className={inputClass}
              >
                {(taxonomy.length
                  ? taxonomy.map((t) => ({ value: t.category, label: t.label }))
                  : CATEGORIES.map((c) => ({ value: c, label: c }))
                ).map((c) => (
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

            <Field label="Grade" error={fields.grade}>
              <select
                value={form.grade}
                onChange={(e) =>
                  set("grade", e.target.value as (typeof GRADES)[number])
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

            <Field label="Packaging state" error={fields.packagingState}>
              <select
                value={form.packagingState}
                onChange={(e) =>
                  set(
                    "packagingState",
                    e.target.value as (typeof PACKAGING_STATES)[number],
                  )
                }
                className={inputClass}
              >
                {PACKAGING_STATES.map((p) => (
                  <option key={p} value={p}>
                    {p.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Mass (kg)" error={fields.massKg}>
              <input
                required
                type="number"
                min="1"
                value={form.massKg}
                onChange={(e) => set("massKg", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Unit count (optional)" error={fields.unitCount}>
              <input
                type="number"
                min="1"
                value={form.unitCount}
                onChange={(e) => set("unitCount", e.target.value)}
                placeholder="120"
                className={inputClass}
              />
            </Field>

            <Field label="Available from" error={fields.availableFrom}>
              <input
                required
                type="date"
                value={form.availableFrom}
                onChange={(e) => set("availableFrom", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Available until" error={fields.availableUntil}>
              <input
                required
                type="date"
                value={form.availableUntil}
                onChange={(e) => set("availableUntil", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Asking price (optional)" error={fields.askingPrice}>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.priceAmount}
                onChange={(e) => set("priceAmount", e.target.value)}
                placeholder="450"
                className={inputClass}
              />
            </Field>

            <Field label="Currency">
              <input
                maxLength={3}
                value={form.currency}
                onChange={(e) => set("currency", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Dock opens">
              <input
                type="time"
                value={form.dockOpens}
                onChange={(e) => set("dockOpens", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Dock closes">
              <input
                type="time"
                value={form.dockCloses}
                onChange={(e) => set("dockCloses", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Packaging mode">
              <select
                value={form.packagingMode}
                onChange={(e) =>
                  set("packagingMode", e.target.value as "loose" | "palletised")
                }
                className={inputClass}
              >
                <option value="palletised">palletised</option>
                <option value="loose">loose</option>
              </select>
            </Field>
          </div>

          <div className="mt-8">
            <Field label="Photographs (3 minimum to publish)">
              <div className="flex flex-wrap items-center gap-4">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={(e) => setPhotos(Array.from(e.target.files ?? []))}
                  className="text-[14px] text-[var(--muted)] file:mr-4 file:h-9 file:cursor-pointer file:rounded-full file:border file:border-[var(--line)] file:bg-transparent file:px-4 file:text-[13px] file:font-medium file:text-[var(--fg)]"
                />
                <span className="tnum text-[13px] text-[var(--muted)]">
                  {photos.length} selected
                </span>
              </div>
            </Field>
          </div>

          <div className="mt-8">
            <Field label="Description" error={fields.description}>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Condition, contamination, storage and anything a buyer should know before collection."
                className={`${inputClass} h-auto py-3`}
              />
            </Field>
          </div>

          <div className="mt-8 flex flex-wrap gap-8">
            {[
              { key: "hasForklift" as const, label: "Forklift on site" },
              { key: "openToOffers" as const, label: "Open to offers" },
              { key: "publishNow" as const, label: "Publish immediately" },
            ].map((toggle) => (
              <label
                key={toggle.key}
                className="flex cursor-pointer items-center gap-3"
              >
                <input
                  type="checkbox"
                  checked={form[toggle.key]}
                  onChange={(e) => set(toggle.key, e.target.checked)}
                  className="h-4 w-4 accent-[var(--fg)]"
                />
                <span className="text-[14px] text-[var(--fg)]">
                  {toggle.label}
                </span>
              </label>
            ))}
          </div>

          {error && (
            <p className="mt-8 border-l-2 border-orange pl-3 text-[14px] text-[var(--fg)]">
              {error}
            </p>
          )}

          <div className="mt-10 flex flex-wrap gap-3 border-t border-[var(--line)] pt-8">
            <button
              type="submit"
              disabled={busy || !form.facilityId}
              className={primaryButton}
            >
              {busy ? "Saving…" : form.publishNow ? "Publish lot" : "Save draft"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard/listings")}
              className={secondaryButton}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
