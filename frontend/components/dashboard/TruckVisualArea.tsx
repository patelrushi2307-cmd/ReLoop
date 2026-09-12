"use client";

import { Minus, Move, Plus } from "lucide-react";
import { useState } from "react";
import type { Listing } from "@/lib/api";

const SLOTS = 8;

type Stat = {
  label: string;
  value: string;
  unit: string;
  context: string;
  accent: boolean;
};

/** Grade drives the slot label, so a loaded trailer reads at a glance. */
function CargoCell({ listing }: { listing?: Listing }) {
  const label = listing
    ? `${(listing.materialCategory ?? "lot").slice(0, 4).toUpperCase()}·${
        listing.grade ?? "—"
      }`
    : "EMPTY";

  return (
    <div
      title={listing?.title ?? "Unassigned slot"}
      className={`relative flex h-full flex-col items-center justify-center gap-1 border p-2 select-none ${
        listing
          ? "border-[var(--grey-400)]/45 bg-[var(--off-white)]/85"
          : "border-dashed border-[var(--grey-400)]/30 bg-transparent"
      }`}
    >
      <span
        className={`eyebrow ${
          listing ? "!text-[var(--muted)]" : "!text-[var(--faint)]"
        }`}
      >
        {label}
      </span>
      {listing?.massKg ? (
        <span className="tnum text-[11px] text-[var(--faint)]">
          {Math.round(listing.massKg).toLocaleString("en-US")} kg
        </span>
      ) : null}
    </div>
  );
}

export function TruckVisualArea({
  mode,
  onModeChange,
  stats,
  listings,
  loading,
}: {
  mode: "sell" | "buy";
  onModeChange: (mode: "sell" | "buy") => void;
  stats: Stat[];
  listings: Listing[];
  loading: boolean;
}) {
  const [zoomLevel, setZoomLevel] = useState(60);

  return (
    <div className="border-t border-[var(--line)] px-4 md:px-8">
      {/* Stats + mode switch */}
      <div className="flex flex-wrap items-end justify-between gap-6 py-8">
        <div className="grid flex-1 grid-cols-2 gap-x-10 gap-y-6 md:flex md:items-start md:gap-16">
          {stats.map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-3 border-t border-[var(--line)] pt-4"
            >
              <span className="eyebrow">{item.label}</span>
              <div className="flex items-baseline gap-3">
                <span
                  className={`tnum text-[clamp(1.9rem,3.2vw,2.6rem)] font-medium leading-none tracking-[-0.04em] ${
                    item.accent ? "text-orange" : ""
                  }`}
                >
                  {loading ? "—" : item.value}
                  {item.unit && (
                    <span className="text-[0.55em] font-medium tracking-[-0.01em]">
                      {item.unit}
                    </span>
                  )}
                </span>
                <span className="text-[13px] text-[var(--muted)]">
                  {item.context}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {(["sell", "buy"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => onModeChange(key)}
              className={`flex h-12 items-center rounded-full px-6 text-[14px] font-medium transition-colors ${
                key === mode
                  ? "bg-[var(--fg)] text-[var(--bg)]"
                  : "border border-[var(--line)] text-[var(--fg)] hover:border-[var(--fg)]"
              }`}
            >
              {key === "sell" ? "Sell item" : "Buy item"}
            </button>
          ))}
        </div>
      </div>

      {/* Load view */}
      <div className="relative flex min-h-[440px] w-full flex-col justify-end border border-[var(--line)] p-6">
        <div className="relative flex w-full flex-1 items-end justify-center">
          {/* Zoom controls */}
          <div className="absolute bottom-16 left-0 z-30 flex flex-col items-center gap-4">
            <div className="relative flex h-24 w-4 flex-col items-center justify-start rounded-full border border-[var(--line)] p-0.5">
              <div
                className="h-6 w-full cursor-pointer rounded-full bg-[var(--fg)] transition-transform hover:scale-105"
                style={{
                  marginTop: `${Math.max(0, Math.min(60, 100 - zoomLevel))}%`,
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(100, z + 10))}
                title="Zoom in"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[var(--line)] text-[var(--muted)] transition-colors hover:border-[var(--fg)] hover:text-[var(--fg)]"
              >
                <Plus className="h-3.5 w-3.5 stroke-[1.5]" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(20, z - 10))}
                title="Zoom out"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[var(--line)] text-[var(--muted)] transition-colors hover:border-[var(--fg)] hover:text-[var(--fg)]"
              >
                <Minus className="h-3.5 w-3.5 stroke-[1.5]" />
              </button>
            </div>
          </div>

          {/* Truck render + cargo overlay — geometry unchanged */}
          <div className="relative mr-4 ml-14 max-w-[1440px] flex-1 pb-4">
            <div className="relative w-full select-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/truck-target.png"
                alt="Truck and trailer, loaded with eight pallet positions"
                className="relative z-1 block h-auto w-full select-none pointer-events-none"
              />

              <div
                className="absolute z-2"
                style={{
                  left: "29.18%",
                  top: "1.92%",
                  width: "70.59%",
                  height: "70.77%",
                }}
              >
                <div className="box-border grid h-full w-full grid-cols-4 grid-rows-2 gap-2 p-1.5">
                  {Array.from({ length: SLOTS }).map((_, i) => (
                    <CargoCell key={i} listing={listings[i]} />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-center">
              <button
                type="button"
                title="Pan view"
                className="flex h-8 w-8 cursor-grab items-center justify-center rounded-full border border-[var(--line)] text-[var(--muted)] transition-colors hover:border-[var(--fg)] hover:text-[var(--fg)] active:cursor-grabbing"
              >
                <Move className="h-4 w-4 stroke-[1.5]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
