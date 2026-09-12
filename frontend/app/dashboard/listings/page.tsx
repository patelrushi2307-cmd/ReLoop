"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import {
  ALL_CATEGORIES,
  CategoryFilter,
} from "@/components/dashboard/CategoryFilter";
import {
  PageHeader,
  primaryButton,
  smallButton,
} from "@/components/dashboard/DashboardShell";
import { ApiError, api, type Listing, type Paginated } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { categoryLabel, useTaxonomy } from "@/lib/taxonomy";

type Breakeven = {
  breakEvenRadiusKm?: number;
  grossAvoidedKg?: number;
  reprocessKg?: number;
  emissionFactors?: {
    virgin?: number;
    reprocess?: number;
    freightPerTonneKm?: number;
    loadFactor?: number;
  };
  methodologyVersion?: string;
};

const STATUS_FILTERS = ["published", "draft", "market"] as const;

const round = (value?: number) =>
  typeof value === "number" ? Math.round(value).toLocaleString("en-US") : "—";

function ListingsView() {
  const { org } = useAuth();
  const { taxonomy } = useTaxonomy();
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>(
    params.get("view") === "market" ? "market" : "published",
  );
  /* Empty means every category. Seeded from the URL so a filtered view is shareable. */
  const [category, setCategory] = useState(
    params.get("category") ?? ALL_CATEGORIES,
  );
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [breakevens, setBreakevens] = useState<Record<string, Breakeven>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const search = new URLSearchParams({
        limit: "50",
        status: status === "draft" ? "draft" : "published",
      });
      /* Own published lots only; the market view is filtered below instead. */
      if (status === "published" && org?._id)
        search.set("organizationId", org._id);
      if (category) search.set("materialCategory", category);
      const res = await api.get<Paginated<Listing>>(`/listings?${search}`);
      const items = res.items ?? [];
      /* The market view is everything published by someone else. */
      setListings(
        status === "market"
          ? items.filter((l) => String(l.organizationId) !== String(org?._id))
          : items,
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load listings.");
    } finally {
      setLoading(false);
    }
  }, [status, category, org?._id]);

  useEffect(() => {
    load();
  }, [load]);

  const publish = async (id: string) => {
    setBusyId(id);
    setError(null);
    try {
      await api.post(`/listings/${id}/publish`);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not publish.");
    } finally {
      setBusyId(null);
    }
  };

  /* Orders are placed for the whole lot; a free claim when no price is set. */
  const order = async (listing: Listing) => {
    setBusyId(listing._id);
    setError(null);
    try {
      await api.post("/orders", {
        listingId: listing._id,
        quantity: listing.massKg ?? 0,
        orderType: listing.askingPrice?.amount ? "paid_purchase" : "free_claim",
      });
      router.push("/dashboard/trades");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not place the order.",
      );
    } finally {
      setBusyId(null);
    }
  };

  /* Keep the chosen category in the URL so the filtered view can be shared. */
  const selectCategory = (next: string) => {
    setCategory(next);
    const search = new URLSearchParams(params.toString());
    if (next) search.set("category", next);
    else search.delete("category");
    const qs = search.toString();
    router.replace(`/dashboard/listings${qs ? `?${qs}` : ""}`, {
      scroll: false,
    });
  };

  const loadBreakeven = async (id: string) => {
    setBusyId(id);
    try {
      const payload = await api.get<Breakeven>(`/listings/${id}/breakeven`);
      setBreakevens((b) => ({ ...b, [id]: payload }));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not compute the break-even radius.",
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <PageHeader
        index="01"
        eyebrow="Listings"
        title="What you have put on the exchange"
        intro="Every published lot carries a grade and a break-even radius. Drafts stay private until you publish them."
        action={
          <Link href="/dashboard/listings/new" className={primaryButton}>
            New listing
          </Link>
        }
      />

      <div className="mt-10 flex gap-6 px-4 md:px-8">
        {STATUS_FILTERS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setStatus(value)}
            className={`eyebrow pb-2 transition-colors ${
              status === value
                ? "!text-[var(--fg)] border-b border-[var(--fg)]"
                : "hover:!text-[var(--fg)]"
            }`}
          >
            {value}
          </button>
        ))}
        <button
          type="button"
          onClick={load}
          className="eyebrow ml-auto pb-2 transition-colors hover:!text-[var(--fg)]"
        >
          Refresh
        </button>
      </div>

      <div className="mt-6 px-4 md:px-8">
        <CategoryFilter value={category} onChange={selectCategory} />
      </div>

      <div className="mt-6 px-4 pb-20 md:px-8">
        {error && (
          <p className="mb-6 border-l-2 border-orange pl-3 text-[14px] text-[var(--fg)]">
            {error}
          </p>
        )}

        {loading ? (
          <p className="eyebrow border-t border-[var(--line)] py-10">
            Loading listings…
          </p>
        ) : listings.length === 0 ? (
          <div className="border-t border-[var(--line)] py-10">
            <p className="body-copy">
              {category
                ? "No lots in this category. Clear the filter to see everything."
                : "Nothing here yet. Create a listing and it will appear with a break-even radius attached."}
            </p>
          </div>
        ) : (
          <ul className="border-t border-[var(--line)]">
            {listings.map((listing, i) => {
              const breakeven = breakevens[listing._id];
              return (
                <li
                  key={listing._id}
                  className="grid gap-6 border-b border-[var(--line)] py-6 md:grid-cols-12 md:items-center"
                >
                  <div className="md:col-span-5">
                    <div className="flex items-center gap-3">
                      <span className="eyebrow tnum">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="eyebrow">
                        {categoryLabel(taxonomy, listing.materialCategory)}
                      </span>
                    </div>
                    <p className="mt-2 text-[19px] font-medium tracking-[-0.02em]">
                      {listing.title ?? "Untitled lot"}
                    </p>
                    <p className="mt-1 text-[14px] text-[var(--muted)]">
                      {listing.facilityId?.name ?? "No facility"}
                      {listing.facilityId?.address?.city
                        ? ` · ${listing.facilityId.address.city}`
                        : ""}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <span className="eyebrow block">Mass</span>
                    <span className="tnum text-[17px]">
                      {(listing.massKg ?? 0).toLocaleString("en-US")} kg
                    </span>
                  </div>

                  <div className="md:col-span-1">
                    <span className="eyebrow block">Grade</span>
                    <span className="tnum text-[17px]">
                      {listing.grade ?? "—"}
                    </span>
                  </div>

                  <div className="md:col-span-2">
                    <span className="eyebrow block">Break-even</span>
                    <span className="tnum text-[17px]">
                      {breakeven
                        ? `${round(breakeven.breakEvenRadiusKm)} km`
                        : "—"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 md:col-span-2 md:justify-end">
                    <button
                      type="button"
                      disabled={busyId === listing._id}
                      onClick={() => loadBreakeven(listing._id)}
                      className={smallButton}
                    >
                      Break-even
                    </button>
                    {listing.status === "draft" && (
                      <button
                        type="button"
                        disabled={busyId === listing._id}
                        onClick={() => publish(listing._id)}
                        className={`${smallButton} !border-[var(--fg)]`}
                      >
                        Publish
                      </button>
                    )}
                    {status === "market" && (
                      <button
                        type="button"
                        disabled={busyId === listing._id}
                        onClick={() => order(listing)}
                        className={`${smallButton} !border-[var(--fg)]`}
                      >
                        {listing.askingPrice?.amount ? "Buy lot" : "Claim lot"}
                      </button>
                    )}
                  </div>

                  {breakeven && (
                    <dl className="grid gap-4 border-t border-[var(--line)] pt-4 md:col-span-12 md:grid-cols-4">
                      <div>
                        <dt className="eyebrow">Gross avoided</dt>
                        <dd className="tnum text-[15px]">
                          {round(breakeven.grossAvoidedKg)} kg CO₂e
                        </dd>
                      </div>
                      <div>
                        <dt className="eyebrow">Reprocessing</dt>
                        <dd className="tnum text-[15px]">
                          −{round(breakeven.reprocessKg)} kg CO₂e
                        </dd>
                      </div>
                      <div>
                        <dt className="eyebrow">Load factor</dt>
                        <dd className="tnum text-[15px]">
                          {breakeven.emissionFactors?.loadFactor ?? "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="eyebrow">Factor version</dt>
                        <dd className="text-[15px] text-[var(--muted)]">
                          {breakeven.methodologyVersion ?? "—"}
                        </dd>
                      </div>
                    </dl>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={null}>
      <ListingsView />
    </Suspense>
  );
}
