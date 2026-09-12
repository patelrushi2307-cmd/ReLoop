"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { ALL_CATEGORIES, CategoryFilter } from "./CategoryFilter";
import {
  formatKg,
  sumMass,
  sumUnits,
  useDashboardData,
} from "@/lib/dashboard-data";
import { ShipmentCardsRow } from "./ShipmentCardsRow";
import { TruckVisualArea } from "./TruckVisualArea";

export type DashboardMode = "sell" | "buy";

export function DashboardView({ initialMode }: { initialMode: DashboardMode }) {
  const [mode, setMode] = useState<DashboardMode>(initialMode);
  /* Empty means every category. */
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const { org } = useAuth();
  const { data, loading, error, reload } = useDashboardData(org?._id);

  const handleModeChange = (next: DashboardMode) => {
    setMode(next);
    window.history.replaceState(null, "", `/dashboard?mode=${next}`);
  };

  /* Sell shows what this org is putting on the exchange; buy shows the
     open market it can draw from. */
  const all = mode === "sell" ? data.myListings : data.marketListings;
  /* Lots are classified by material category; the filter narrows to one. */
  const listings = category
    ? all.filter((l) => l.materialCategory === category)
    : all;
  const unread = data.notifications.filter((n) => !n.read).length;

  const stats = [
    {
      label: "Weight",
      value: formatKg(sumMass(listings)),
      unit: "kg",
      context: `${listings.length} ${
        mode === "sell" ? "own listings" : "open listings"
      }`,
      accent: false,
    },
    {
      label: "Pallets",
      value: formatKg(sumUnits(listings)),
      unit: "",
      context: "declared units",
      accent: false,
    },
    {
      label: "Alerts",
      value: String(unread),
      unit: "",
      context: unread === 1 ? "unread notice" : "unread notices",
      accent: unread > 0,
    },
  ];

  return (
    <>
      <TruckVisualArea
          mode={mode}
          onModeChange={handleModeChange}
          stats={stats}
          listings={listings}
          loading={loading}
        />

        <section className="mt-16 px-4 md:px-8">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <span className="eyebrow tnum">03</span>
            <span className="eyebrow">
              {mode === "sell"
                ? "Currently packed shipment lots"
                : "Available lots on the exchange"}
            </span>
            <span className="eyebrow tnum">({listings.length})</span>
            <button
              type="button"
              onClick={reload}
              className="eyebrow ml-auto transition-colors hover:!text-[var(--fg)]"
            >
              Refresh
            </button>
          </div>

          <div className="mb-8">
            <CategoryFilter value={category} onChange={setCategory} />
          </div>

          <ShipmentCardsRow
            listings={listings}
            loading={loading}
            mode={mode}
            filtered={Boolean(category) && all.length > 0}
          />

          {error && (
            <p className="mt-6 border-l-2 border-orange pl-3 text-[14px] text-[var(--fg)]">
              {error}
            </p>
          )}
        </section>

        <div className="px-4 py-14 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-5">
            <span className="eyebrow">
              Role — {(org?.roles ?? ["seller"]).join(", ")}
            </span>
            <a
              href="/"
              className="roll text-[14px] font-medium text-[var(--fg)]"
            >
              <span>Back to site</span>
              <span aria-hidden>Back to site</span>
            </a>
          </div>
        </div>
    </>
  );
}
