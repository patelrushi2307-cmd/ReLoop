"use client";

import { useCallback, useEffect, useState } from "react";
import { Field, inputClass } from "@/components/auth/AuthShell";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { ApiError, api, type Listing, type Paginated } from "@/lib/api";
import { subtypesFor, useTaxonomy } from "@/lib/taxonomy";

type VehicleRow = {
  vehicleType: string;
  label: string;
  source: string;
  efFreightPerTonneKm: number;
  maxPayloadKg: number;
  tripsRequired: number;
  transportEmissionsKg: number;
  netSavedKg: number;
  breakEvenRadiusKm: number;
  classification: string;
  extraVersusBestKg: number;
  percentWorseThanBest: number;
};

type Comparison = {
  massKg: number;
  distanceKm: number;
  loadFactor: number;
  grossAvoidedKg: number;
  reprocessKg: number;
  best: { vehicleType: string; label: string };
  worst: { vehicleType: string; label: string };
  spreadKg: number;
  vehicles: VehicleRow[];
  methodologyVersion: string;
};

const kg = (value: number) =>
  value.toLocaleString("en-US", { maximumFractionDigits: 0 });

export default function ImpactPage() {
  const { taxonomy } = useTaxonomy();
  const [lots, setLots] = useState<Listing[]>([]);
  const [data, setData] = useState<Comparison | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    materialCategory: "cardboard",
    materialSubtype: "occ",
    massKg: 3000,
    distanceKm: 182,
    loadFactor: 0.75,
  });

  useEffect(() => {
    api
      .get<Paginated<Listing>>("/listings?limit=20")
      .then((res) => setLots(res.items ?? []))
      .catch(() => setLots([]));
  }, []);

  const compare = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.post<Comparison>("/carbon/compare", {
        materialCategory: form.materialCategory,
        materialSubtype: form.materialSubtype,
        massKg: Number(form.massKg),
        distanceKm: Number(form.distanceKm),
        loadFactor: Number(form.loadFactor),
      });
      setData(result);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not run the comparison.",
      );
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => {
    compare();
  }, [compare]);

  const applyLot = (id: string) => {
    const lot = lots.find((l) => l._id === id);
    if (!lot) return;
    setForm((f) => ({
      ...f,
      massKg: Math.round(lot.massKg ?? f.massKg),
      materialCategory: lot.materialCategory ?? f.materialCategory,
      materialSubtype: lot.materialSubtype ?? f.materialSubtype,
    }));
  };

  const best = data?.vehicles[0];
  const worstRow = data?.vehicles[data.vehicles.length - 1];
  const maxTransport = data
    ? Math.max(...data.vehicles.map((v) => v.transportEmissionsKg), 1)
    : 1;

  return (
    <>
      <PageHeader
        index="01"
        eyebrow="Impact"
        title="What the haul costs in carbon"
        intro="The same lot, carried the same distance, by each vehicle class. Reuse avoids virgin production; freight emits. This is where the two meet."
      />

      {/* Controls */}
      <div className="mt-10 px-4 md:px-8">
        <div className="grid gap-6 border-t border-[var(--line)] pt-8 md:grid-cols-5">
          <Field label="Start from a lot">
            <select
              onChange={(e) => applyLot(e.target.value)}
              defaultValue=""
              className={inputClass}
            >
              <option value="">Manual entry</option>
              {lots.map((lot) => (
                <option key={lot._id} value={lot._id}>
                  {lot.title ?? lot.materialSubtype}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Material">
            <select
              value={form.materialCategory}
              onChange={(e) => {
                const next = e.target.value;
                const first = subtypesFor(taxonomy, next)[0]?.slug ?? "";
                setForm((f) => ({
                  ...f,
                  materialCategory: next,
                  materialSubtype: first,
                }));
              }}
              className={inputClass}
            >
              {taxonomy.map((t) => (
                <option key={t.category} value={t.category}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Subtype">
            <select
              value={form.materialSubtype}
              onChange={(e) =>
                setForm((f) => ({ ...f, materialSubtype: e.target.value }))
              }
              className={inputClass}
            >
              {subtypesFor(taxonomy, form.materialCategory).map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Mass (kg)">
            <input
              type="number"
              min={1}
              value={form.massKg}
              onChange={(e) =>
                setForm((f) => ({ ...f, massKg: Number(e.target.value) }))
              }
              className={inputClass}
            />
          </Field>

          <Field label="Load factor">
            <input
              type="number"
              min={0.1}
              max={1}
              step={0.05}
              value={form.loadFactor}
              onChange={(e) =>
                setForm((f) => ({ ...f, loadFactor: Number(e.target.value) }))
              }
              className={inputClass}
            />
          </Field>
        </div>

        {/* Distance is the variable that decides everything, so it gets its own control. */}
        <div className="mt-8 border-t border-[var(--line)] pt-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <span className="eyebrow">Haul distance</span>
            <div className="flex items-baseline gap-2">
              <span className="tnum text-[clamp(1.9rem,3.2vw,2.6rem)] font-medium leading-none tracking-[-0.04em]">
                {kg(form.distanceKm)}
              </span>
              <span className="text-[15px] text-[var(--muted)]">km</span>
            </div>
          </div>
          <input
            type="range"
            min={10}
            max={3000}
            step={10}
            value={form.distanceKm}
            onChange={(e) =>
              setForm((f) => ({ ...f, distanceKm: Number(e.target.value) }))
            }
            className="mt-4 w-full accent-[var(--fg)]"
          />
        </div>
      </div>

      {error && (
        <p className="mt-8 px-4 md:px-8">
          <span className="border-l-2 border-orange pl-3 text-[14px] text-[var(--fg)]">
            {error}
          </span>
        </p>
      )}

      {/* Headline figures */}
      {data && best && (
        <div className="mt-12 px-4 md:px-8">
          <div className="grid gap-x-10 gap-y-8 border-t border-[var(--line)] pt-8 md:grid-cols-4">
            <div className="flex flex-col gap-3">
              <span className="eyebrow">Net saved, best vehicle</span>
              <span className="tnum text-[clamp(1.9rem,3.2vw,2.6rem)] font-medium leading-none tracking-[-0.04em]">
                {kg(best.netSavedKg)}
                <span className="text-[0.5em] font-medium"> kg CO₂e</span>
              </span>
              <span className="text-[13px] text-[var(--muted)]">
                {best.label}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <span className="eyebrow">Penalty, worst vehicle</span>
              <span className="tnum text-[clamp(1.9rem,3.2vw,2.6rem)] font-medium leading-none tracking-[-0.04em] text-orange">
                +{kg(data.spreadKg)}
                <span className="text-[0.5em] font-medium"> kg CO₂e</span>
              </span>
              <span className="text-[13px] text-[var(--muted)]">
                {worstRow?.label} over the same {kg(data.distanceKm)} km
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <span className="eyebrow">Gross avoided</span>
              <span className="tnum text-[clamp(1.9rem,3.2vw,2.6rem)] font-medium leading-none tracking-[-0.04em]">
                {kg(data.grossAvoidedKg)}
                <span className="text-[0.5em] font-medium"> kg CO₂e</span>
              </span>
              <span className="text-[13px] text-[var(--muted)]">
                less {kg(data.reprocessKg)} kg reprocessing
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <span className="eyebrow">Break-even radius</span>
              <span className="tnum text-[clamp(1.9rem,3.2vw,2.6rem)] font-medium leading-none tracking-[-0.04em]">
                {kg(best.breakEvenRadiusKm)}
                <span className="text-[0.5em] font-medium"> km</span>
              </span>
              <span className="text-[13px] text-[var(--muted)]">
                past this, the trade emits more than it saves
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle comparison */}
      <div className="mt-14 px-4 pb-20 md:px-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="eyebrow tnum">02</span>
          <span className="eyebrow">Transport emissions by vehicle</span>
          {loading && <span className="eyebrow">— recomputing</span>}
        </div>

        <ul className="border-t border-[var(--line)]">
          {data?.vehicles.map((vehicle, i) => {
            const width = (vehicle.transportEmissionsKg / maxTransport) * 100;
            const isBest = i === 0;
            const negative = vehicle.classification === "carbon-negative";

            return (
              <li
                key={vehicle.vehicleType}
                className="grid gap-4 border-b border-[var(--line)] py-6 md:grid-cols-12 md:items-center"
              >
                <div className="md:col-span-3">
                  <div className="flex items-center gap-3">
                    <span className="eyebrow tnum">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {isBest && <span className="eyebrow !text-orange">Best</span>}
                  </div>
                  <p className="mt-2 text-[17px] font-medium tracking-[-0.02em]">
                    {vehicle.label}
                  </p>
                  <p className="mt-1 text-[13px] text-[var(--muted)]">
                    {vehicle.efFreightPerTonneKm} kg CO₂e per tonne-km
                    {vehicle.tripsRequired > 1
                      ? ` · ${vehicle.tripsRequired} trips`
                      : ""}
                  </p>
                </div>

                <div className="md:col-span-5">
                  <div className="h-8 w-full border border-[var(--line)]">
                    <div
                      className={`h-full ${
                        isBest ? "bg-[var(--fg)]" : "bg-[var(--grey-400)]"
                      }`}
                      style={{ width: `${Math.max(width, 1)}%` }}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <span className="eyebrow block">Transport</span>
                  <span className="tnum text-[17px]">
                    {kg(vehicle.transportEmissionsKg)} kg
                  </span>
                  {vehicle.extraVersusBestKg > 0 && (
                    <span className="tnum block text-[13px] text-orange">
                      +{kg(vehicle.extraVersusBestKg)} kg ·{" "}
                      {vehicle.percentWorseThanBest}%
                    </span>
                  )}
                </div>

                <div className="md:col-span-2 md:text-right">
                  <span className="eyebrow block">Net saved</span>
                  <span
                    className={`tnum text-[17px] ${
                      negative ? "text-orange" : ""
                    }`}
                  >
                    {kg(vehicle.netSavedKg)} kg
                  </span>
                  <span className="block text-[13px] text-[var(--muted)]">
                    break-even {kg(vehicle.breakEvenRadiusKm)} km
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        {data && (
          <p className="mt-6 max-w-[62ch] text-[13px] text-[var(--muted)]">
            Factors {data.methodologyVersion}. Load factor {data.loadFactor}.
            Vehicle figures are indicative DEFRA-derived values and must be
            replaced with citable published values before any public impact
            claim.
          </p>
        )}
      </div>
    </>
  );
}
