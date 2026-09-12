"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  ApiError,
  api,
  orgName,
  type Listing,
  type MatchResult,
} from "@/lib/api";
import { smallButton } from "./DashboardShell";

const kg = (value?: number) =>
  (value ?? 0).toLocaleString("en-US", { maximumFractionDigits: 0 });

/** The five weighted components behind the composite score. */
const SUBSCORES: { key: keyof MatchResult["subscores"]; label: string; weight: string }[] =
  [
    { key: "semanticFit", label: "Material", weight: "25%" },
    { key: "gradeFit", label: "Grade", weight: "20%" },
    { key: "priceFit", label: "Price", weight: "15%" },
    { key: "carbonScore", label: "Carbon", weight: "30%" },
    { key: "timingFit", label: "Timing", weight: "10%" },
  ];

const errorText = (err: unknown) =>
  err instanceof ApiError ? err.message : "Could not load recommendations.";

function priceOf(listing: Listing) {
  const amount = listing.askingPrice?.amount;
  if (!amount) return "Free claim";
  return `${amount.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })} ${listing.askingPrice?.currency ?? ""}`.trim();
}

/**
 * Lots the matching engine ranked against one standing requirement.
 *
 * Criteria are read server-side from the persisted requirement, so what is
 * shown here is scored against exactly what was saved — not against whatever
 * the form happens to hold.
 */
export function RequirementMatches({
  requirementId,
  onClose,
}: {
  requirementId: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchMatches = useCallback(
    () =>
      api.post<MatchResult[]>("/matching/recommendations", { requirementId }),
    [requirementId],
  );

  /* The panel mounts already loading, so the first run settles state from the
     promise rather than synchronously inside the effect. */
  useEffect(() => {
    let cancelled = false;
    fetchMatches()
      .then((result) => {
        if (cancelled) return;
        setMatches(Array.isArray(result) ? result : []);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(errorText(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchMatches]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMatches();
      setMatches(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setLoading(false);
    }
  };

  /* Same contract the listings page uses: the whole lot, free when unpriced. */
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

  return (
    <div className="mt-2 border-t border-[var(--line)] bg-[var(--panel)] px-5 py-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="eyebrow">Recommended lots</span>
        {!loading && (
          <span className="eyebrow tnum">({matches.length})</span>
        )}
        <button
          type="button"
          onClick={load}
          className="eyebrow ml-auto transition-colors hover:!text-[var(--fg)]"
        >
          Recompute
        </button>
        <button
          type="button"
          onClick={onClose}
          className="eyebrow transition-colors hover:!text-[var(--fg)]"
        >
          Hide
        </button>
      </div>

      {error && (
        <p className="mt-4 border-l-2 border-orange pl-3 text-[14px] text-[var(--fg)]">
          {error}
        </p>
      )}

      {loading ? (
        <p className="eyebrow mt-6">Ranking live lots…</p>
      ) : matches.length === 0 ? (
        <p className="body-copy mt-4 max-w-[64ch]">
          Nothing clears this requirement yet. The engine drops any lot below
          your minimum grade, beyond your maximum haul, or past the distance
          where the freight emits more carbon than the reuse saves — so a lot
          existing is not enough for it to appear here.
        </p>
      ) : (
        <ul className="mt-5 border-t border-[var(--line)]">
          {matches.map((match, i) => {
            const listing = match.listing;
            return (
              <li
                key={listing._id}
                className="grid gap-5 border-b border-[var(--line)] py-5 md:grid-cols-12 md:items-start"
              >
                {/* Rank + lot */}
                <div className="md:col-span-4">
                  <div className="flex items-center gap-3">
                    <span className="eyebrow tnum">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="tnum text-[19px] font-medium leading-none tracking-[-0.03em] text-orange">
                      {match.score}
                    </span>
                    <span className="eyebrow">match</span>
                  </div>
                  <p className="mt-2 text-[17px] font-medium tracking-[-0.02em]">
                    {listing.title ?? listing.materialSubtype ?? "Untitled lot"}
                  </p>
                  <p className="mt-1 text-[13px] text-[var(--muted)]">
                    {orgName(listing.organizationId)}
                    {listing.facilityId?.address?.city
                      ? ` · ${listing.facilityId.address.city}`
                      : ""}
                  </p>
                </div>

                {/* Why it scored that way */}
                <div className="md:col-span-4">
                  <span className="eyebrow block">Score breakdown</span>
                  <ul className="mt-2 flex flex-col gap-1">
                    {SUBSCORES.map((sub) => (
                      <li key={sub.key} className="flex items-center gap-2">
                        <span className="w-[52px] shrink-0 text-[12px] text-[var(--muted)]">
                          {sub.label}
                        </span>
                        <span className="h-[6px] w-full max-w-[120px] bg-[var(--line)]">
                          <span
                            className="block h-full bg-[var(--fg)]"
                            style={{
                              width: `${Math.max(
                                Math.min(match.subscores[sub.key], 100),
                                1,
                              )}%`,
                            }}
                          />
                        </span>
                        <span className="tnum shrink-0 text-[12px] text-[var(--muted)]">
                          {match.subscores[sub.key]}
                        </span>
                        <span className="eyebrow shrink-0 !text-[11px]">
                          {sub.weight}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lot facts */}
                <div className="md:col-span-2">
                  <span className="eyebrow block">Mass</span>
                  <span className="tnum text-[15px]">
                    {kg(listing.massKg)} kg
                  </span>
                  <span className="eyebrow mt-2 block">Grade</span>
                  <span className="tnum text-[15px]">
                    {listing.grade ?? "—"}
                  </span>
                  <span className="eyebrow mt-2 block">Price</span>
                  <span className="tnum text-[15px]">{priceOf(listing)}</span>
                </div>

                {/* Carbon + haul, and the action */}
                <div className="md:col-span-2 md:text-right">
                  <span className="eyebrow block">Net saved</span>
                  <span className="tnum text-[15px]">
                    {kg(match.carbonMetrics.netSavedKg)} kg CO₂e
                  </span>
                  <span className="block text-[12px] text-[var(--muted)]">
                    {kg(match.distanceKm)} km haul · break-even{" "}
                    {kg(match.carbonMetrics.breakEvenRadiusKm)} km
                  </span>
                  <button
                    type="button"
                    disabled={busyId === listing._id}
                    onClick={() => order(listing)}
                    className={`${smallButton} mt-3 !border-[var(--fg)]`}
                  >
                    {busyId === listing._id
                      ? "Placing…"
                      : listing.askingPrice?.amount
                        ? "Buy lot"
                        : "Claim lot"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
