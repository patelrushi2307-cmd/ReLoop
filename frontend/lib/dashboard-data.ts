"use client";

import { useCallback, useEffect, useState } from "react";
import {
  api,
  type Listing,
  type Notification,
  type Order,
  type Paginated,
} from "./api";

export type DashboardData = {
  myListings: Listing[];
  marketListings: Listing[];
  orders: Order[];
  notifications: Notification[];
};

const EMPTY: DashboardData = {
  myListings: [],
  marketListings: [],
  orders: [],
  notifications: [],
};

/** Anything the API can't answer degrades to an empty list rather than
 *  taking the whole dashboard down with it. */
async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}

export function useDashboardData(organizationId?: string) {
  const [data, setData] = useState<DashboardData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const mineQuery = organizationId
        ? `/listings?limit=50&organizationId=${organizationId}`
        : "/listings?limit=50";

      const [mine, drafts, market, orders, notifications] = await Promise.all([
        safe(api.get<Paginated<Listing>>(mineQuery), { items: [] }),
        safe(api.get<Paginated<Listing>>("/listings?limit=50&status=draft"), {
          items: [],
        }),
        safe(api.get<Paginated<Listing>>("/listings?limit=50"), { items: [] }),
        safe(api.get<Order[]>("/orders"), []),
        safe(api.get<Notification[]>("/notifications"), []),
      ]);

      const mineItems = organizationId
        ? (mine.items ?? []).filter(
            (l) => String(l.organizationId) === String(organizationId),
          )
        : [];

      setData({
        myListings: [...mineItems, ...(drafts.items ?? [])],
        marketListings: market.items ?? [],
        orders: Array.isArray(orders) ? orders : [],
        notifications: Array.isArray(notifications) ? notifications : [],
      });
    } catch {
      setError("Could not reach the ReLoop API.");
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}

export function sumMass(listings: Listing[]) {
  return listings.reduce((total, l) => total + (l.massKg ?? 0), 0);
}

export function sumUnits(listings: Listing[]) {
  return listings.reduce((total, l) => total + (l.unitCount ?? 0), 0);
}

export function formatKg(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}
