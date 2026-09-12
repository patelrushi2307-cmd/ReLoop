"use client";

import { useState } from "react";
import type { Listing } from "@/lib/api";
import { categoryLabel, useTaxonomy } from "@/lib/taxonomy";

function TruckSilhouette({ className = "w-20 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect
        x="25"
        y="8"
        width="70"
        height="18"
        rx="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <line x1="91" y1="8" x2="91" y2="26" stroke="currentColor" strokeWidth="1.25" />
      <rect x="20" y="21" width="6" height="3" fill="currentColor" />
      <path
        d="M22 26V13C22 13 20 10 16 10H10C6 10 5 13 4 17L3 22C3 24 4 26 6 26H22Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path d="M15 12H11C8.5 12 7.5 14 7 17H15V12Z" fill="currentColor" />
      <circle cx="12" cy="28" r="3.4" fill="currentColor" />
      <circle cx="72" cy="28" r="3.4" fill="currentColor" />
      <circle cx="83" cy="28" r="3.4" fill="currentColor" />
    </svg>
  );
}

/** Shipment reference derived from the listing id, so it is stable and real. */
function lotReference(listing: Listing) {
  const country = (
    listing.facilityId?.address?.country ?? "INT"
  ).slice(0, 3).toUpperCase();
  return `${country}-${listing._id.slice(-6).toUpperCase()}`;
}

const num = (value?: number) =>
  typeof value === "number"
    ? value.toLocaleString("en-US", { maximumFractionDigits: 0 })
    : "—";

/** Asking price is the price of the whole lot; no price means it is a free claim. */
function priceOf(listing: Listing) {
  const amount = listing.askingPrice?.amount;
  if (!amount) return "Free claim";
  return `${amount.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })} ${listing.askingPrice?.currency ?? ""}`.trim();
}

function whereOf(listing: Listing) {
  const facility = listing.facilityId?.name;
  const city = listing.facilityId?.address?.city;
  return [facility, city].filter(Boolean).join(" · ") || "No facility";
}

/** One label/value line inside a card. */
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="eyebrow">{label}</span>
      <span className="tnum truncate text-[14px] text-[var(--fg)]">{value}</span>
    </div>
  );
}

export function ShipmentCardsRow({
  listings,
  loading,
  mode,
  filtered = false,
}: {
  listings: Listing[];
  loading: boolean;
  mode: "sell" | "buy";
  /** True when a category filter is narrowing the list, so "nothing here"
   *  means "nothing in this category" rather than "nothing at all". */
  filtered?: boolean;
}) {
  const { taxonomy } = useTaxonomy();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const visible = listings.slice(0, 5);

  if (loading) {
    return (
      <div className="border-t border-[var(--line)] py-10">
        <span className="eyebrow">Loading lots…</span>
      </div>
    );
  }

  if (visible.length === 0) {
    return (
      <div className="border-t border-[var(--line)] py-10">
        <p className="body-copy">
          {filtered
            ? "No lots in this category. Choose another category, or All."
            : mode === "sell"
              ? "No lots published yet. Create a listing and it will appear here with a break-even radius attached."
              : "No open lots on the exchange right now."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid border-t border-[var(--line)] sm:grid-cols-2 lg:grid-cols-5">
      {visible.map((listing, i) => {
        const isSelected = (selectedId ?? visible[0]._id) === listing._id;
        return (
          <button
            key={listing._id}
            type="button"
            onClick={() => setSelectedId(listing._id)}
            className={`group flex min-h-[136px] flex-col border-b border-[var(--line)] p-6 text-left transition-colors duration-500 sm:border-r lg:[&:nth-child(5n)]:border-r-0 ${
              isSelected ? "bg-[var(--panel)]" : "hover:bg-[var(--panel)]"
            }`}
          >
            <div className="flex items-start justify-between">
              <span className="eyebrow tnum">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`transition-colors ${
                  isSelected ? "text-orange" : "text-[var(--faint)]"
                }`}
              >
                <TruckSilhouette className="h-6 w-14" />
              </span>
            </div>

            {/* Category the lot is classified under */}
            <span
              className={`eyebrow mt-4 block ${isSelected ? "!text-orange" : ""}`}
            >
              {categoryLabel(taxonomy, listing.materialCategory)}
            </span>

            <p className="mt-1.5 text-[17px] font-medium leading-snug tracking-[-0.02em] text-[var(--fg)]">
              {listing.title ?? listing.materialSubtype ?? "Untitled lot"}
            </p>

            <span className="tnum mt-1 block text-[13px] text-[var(--muted)]">
              {lotReference(listing)}
            </span>

            {/* The lot itself */}
            <div className="mt-5 flex flex-col gap-2 border-t border-[var(--line)] pt-4">
              <Detail label="Mass" value={`${num(listing.massKg)} kg`} />
              <Detail label="Units" value={num(listing.unitCount)} />
              <Detail label="Grade" value={listing.grade ?? "—"} />
              <Detail label="Price" value={priceOf(listing)} />
            </div>

            <span className="mt-4 block truncate text-[13px] text-[var(--muted)]">
              {whereOf(listing)}
            </span>

            {listing.status && listing.status !== "published" && (
              <span className="eyebrow mt-2 block !text-orange">
                {listing.status}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
