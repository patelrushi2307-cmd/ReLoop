"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  PageHeader,
  primaryButton,
  smallButton,
} from "@/components/dashboard/DashboardShell";
import {
  ApiError,
  api,
  orgId,
  orgName,
  type Order,
  type OrderStatus,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";

type Side = "all" | "buying" | "selling";

const SIDES: { key: Side; label: string }[] = [
  { key: "all", label: "All trades" },
  { key: "buying", label: "Buying" },
  { key: "selling", label: "Selling" },
];

/** What each side may do next, mirroring the transitions the API enforces. */
function actionsFor(
  status: OrderStatus | undefined,
  isSeller: boolean,
  isBuyer: boolean,
): { next: OrderStatus; label: string }[] {
  switch (status) {
    case "pending":
      return [
        ...(isSeller
          ? [{ next: "accepted" as const, label: "Accept order" }]
          : []),
        { next: "cancelled" as const, label: "Cancel" },
      ];
    case "accepted":
      return [
        ...(isSeller
          ? [{ next: "in_transit" as const, label: "Mark dispatched" }]
          : []),
        { next: "cancelled" as const, label: "Cancel" },
      ];
    case "in_transit":
      return isBuyer
        ? [{ next: "completed" as const, label: "Confirm delivery" }]
        : [];
    default:
      return [];
  }
}

const money = (value?: number) =>
  typeof value === "number" && value > 0
    ? value.toLocaleString("en-US", { maximumFractionDigits: 2 })
    : "0";

const mass = (value?: number) =>
  (value ?? 0).toLocaleString("en-US", { maximumFractionDigits: 0 });

const when = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

export default function TradesPage() {
  const { org } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [side, setSide] = useState<Side>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await api.get<Order[]>("/orders");
      setOrders(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load trades.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const advance = async (id: string, status: OrderStatus) => {
    setBusyId(id);
    setError(null);
    try {
      await api.patch(`/orders/${id}/status`, { status });
      await load();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not update the order.",
      );
    } finally {
      setBusyId(null);
    }
  };

  const mine = org?._id ?? "";
  const isSelling = (o: Order) => orgId(o.sellerOrganizationId) === mine;
  const isBuying = (o: Order) => orgId(o.buyerOrganizationId) === mine;

  const visible = orders.filter((o) =>
    side === "buying" ? isBuying(o) : side === "selling" ? isSelling(o) : true,
  );

  const settled = orders.filter((o) => o.status === "completed");
  const open = orders.filter(
    (o) => o.status && !["completed", "cancelled"].includes(o.status),
  );
  const bought = settled.filter(isBuying);
  const sold = settled.filter(isSelling);

  const summary = [
    {
      label: "Open trades",
      value: String(open.length),
      context: `${orders.length} lifetime`,
    },
    {
      label: "Mass sold",
      value: mass(sold.reduce((t, o) => t + (o.quantity ?? 0), 0)),
      unit: "kg",
      context: `${sold.length} completed`,
    },
    {
      label: "Mass bought",
      value: mass(bought.reduce((t, o) => t + (o.quantity ?? 0), 0)),
      unit: "kg",
      context: `${bought.length} completed`,
    },
    {
      label: "Revenue settled",
      value: money(sold.reduce((t, o) => t + (o.totalPrice ?? 0), 0)),
      context: "from completed sales",
    },
  ];

  return (
    <>
      <PageHeader
        index="01"
        eyebrow="Trades"
        title="Everything you have bought and sold"
        intro="Each trade carries the lot, the counterparty and where it has reached. The seller accepts and dispatches; the buyer confirms delivery."
        action={
          <Link href="/dashboard/listings?view=market" className={primaryButton}>
            Browse open lots
          </Link>
        }
      />

      {/* Summary */}
      <div className="mt-10 px-4 md:px-8">
        <div className="grid gap-x-10 gap-y-8 border-t border-[var(--line)] pt-8 md:grid-cols-4">
          {summary.map((item) => (
            <div key={item.label} className="flex flex-col gap-3">
              <span className="eyebrow">{item.label}</span>
              <span className="tnum text-[clamp(1.7rem,2.8vw,2.3rem)] font-medium leading-none tracking-[-0.04em]">
                {loading ? "—" : item.value}
                {item.unit && (
                  <span className="text-[0.5em] font-medium"> {item.unit}</span>
                )}
              </span>
              <span className="text-[13px] text-[var(--muted)]">
                {item.context}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Side filter */}
      <div className="mt-12 flex gap-6 px-4 md:px-8">
        {SIDES.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setSide(s.key)}
            className={`eyebrow pb-2 transition-colors ${
              side === s.key
                ? "!text-[var(--fg)] border-b border-[var(--fg)]"
                : "hover:!text-[var(--fg)]"
            }`}
          >
            {s.label}
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

      <div className="mt-2 px-4 pb-20 md:px-8">
        {error && (
          <p className="mb-6 border-l-2 border-orange pl-3 text-[14px] text-[var(--fg)]">
            {error}
          </p>
        )}

        {loading ? (
          <p className="eyebrow border-t border-[var(--line)] py-10">
            Loading trades…
          </p>
        ) : visible.length === 0 ? (
          <div className="border-t border-[var(--line)] py-10">
            <p className="body-copy">
              No trades on this side yet. Open lots on the exchange can be
              ordered from the listings page, and they will appear here for both
              parties.
            </p>
          </div>
        ) : (
          <ul className="border-t border-[var(--line)]">
            {visible.map((order, i) => {
              const selling = isSelling(order);
              const lot =
                typeof order.listingId === "object" ? order.listingId : null;
              const counterparty = selling
                ? orgName(order.buyerOrganizationId)
                : orgName(order.sellerOrganizationId);
              const actions = actionsFor(
                order.status,
                selling,
                isBuying(order),
              );

              return (
                <li
                  key={order._id}
                  className="grid gap-5 border-b border-[var(--line)] py-6 md:grid-cols-12 md:items-center"
                >
                  <div className="md:col-span-4">
                    <div className="flex items-center gap-3">
                      <span className="eyebrow tnum">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`eyebrow ${
                          selling ? "!text-orange" : "!text-[var(--fg)]"
                        }`}
                      >
                        {selling ? "Sold" : "Bought"}
                      </span>
                      <span className="eyebrow tnum">{order.orderNumber}</span>
                    </div>
                    <p className="mt-2 text-[19px] font-medium tracking-[-0.02em]">
                      {lot?.title ?? "Lot"}
                    </p>
                    <p className="mt-1 text-[14px] text-[var(--muted)]">
                      {selling ? "to" : "from"} {counterparty}
                      {lot?.grade ? ` · grade ${lot.grade}` : ""}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <span className="eyebrow block">Quantity</span>
                    <span className="tnum text-[17px]">
                      {mass(order.quantity)} {order.unit ?? "kg"}
                    </span>
                  </div>

                  <div className="md:col-span-2">
                    <span className="eyebrow block">Value</span>
                    <span className="tnum text-[17px]">
                      {order.orderType === "free_claim"
                        ? "Free claim"
                        : money(order.totalPrice)}
                    </span>
                    <span className="block text-[13px] text-[var(--muted)]">
                      {when(order.createdAt)}
                    </span>
                  </div>

                  <div className="md:col-span-2">
                    <span className="eyebrow block">Status</span>
                    <span
                      className={`text-[15px] ${
                        order.status === "cancelled"
                          ? "text-orange"
                          : "text-[var(--fg)]"
                      }`}
                    >
                      {(order.status ?? "pending").replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 md:col-span-2 md:justify-end">
                    {actions.map((action) => (
                      <button
                        key={action.next}
                        type="button"
                        disabled={busyId === order._id}
                        onClick={() => advance(order._id, action.next)}
                        className={`${smallButton} ${
                          action.next === "cancelled"
                            ? ""
                            : "!border-[var(--fg)]"
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
