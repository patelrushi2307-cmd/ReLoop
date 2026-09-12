/**
 * Client for the ReLoop API.
 *
 * The backend answers with an envelope — { success, data } on success and
 * { success: false, error: { code, message, fields } } on failure — so this
 * unwraps `data` and turns failures into a typed ApiError. The access token
 * lives in memory; the refresh token is an httpOnly cookie the browser sends
 * back to /auth/refresh on its own.
 */

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5050/api/v1";

export class ApiError extends Error {
  code: string;
  status: number;
  fields: Record<string, string>;

  constructor(
    message: string,
    code = "ERROR",
    status = 500,
    fields: Record<string, string> = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.fields = fields;
  }
}

const TOKEN_KEY = "reloop_access_token";

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (typeof window === "undefined") return;
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage can be unavailable; the in-memory token still works */
  }
}

export function getAccessToken() {
  if (accessToken) return accessToken;
  if (typeof window === "undefined") return null;
  try {
    accessToken = window.localStorage.getItem(TOKEN_KEY);
  } catch {
    accessToken = null;
  }
  return accessToken;
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  /** Set false for endpoints that must not retry after a refresh. */
  retryOnUnauthorized?: boolean;
  signal?: AbortSignal;
};

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return null;
    const json = await res.json();
    const token = json?.data?.accessToken ?? null;
    if (token) setAccessToken(token);
    return token;
  } catch {
    return null;
  }
}

export async function apiRequest<T>(
  path: string,
  { method = "GET", body, retryOnUnauthorized = true, signal }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload: BodyInit | undefined;
  if (body instanceof FormData) {
    payload = body;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: payload,
    credentials: "include",
    signal,
  });

  if (res.status === 401 && retryOnUnauthorized) {
    const fresh = await refreshAccessToken();
    if (fresh) {
      return apiRequest<T>(path, {
        method,
        body,
        retryOnUnauthorized: false,
        signal,
      });
    }
  }

  let json: {
    success?: boolean;
    data?: T;
    error?: { code?: string; message?: string; fields?: Record<string, string> };
  } | null = null;

  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok || json?.success === false) {
    throw new ApiError(
      json?.error?.message ?? `Request failed (${res.status})`,
      json?.error?.code ?? "ERROR",
      res.status,
      json?.error?.fields ?? {},
    );
  }

  return (json?.data ?? (null as unknown)) as T;
}

export const api = {
  get: <T>(path: string, signal?: AbortSignal) =>
    apiRequest<T>(path, { signal }),
  post: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, { method: "PATCH", body }),
  put: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, { method: "PUT", body }),
  delete: <T>(path: string) => apiRequest<T>(path, { method: "DELETE" }),
};

/* ---------------------------------------------------------------- */
/* Shapes returned by the endpoints this app reads                    */
/* ---------------------------------------------------------------- */

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId: string;
};

export type AuthPayload = { accessToken: string; user: SessionUser };

export type Organization = {
  _id: string;
  name: string;
  legalName?: string;
  type: string;
  contactEmail?: string;
  verified?: boolean;
  roles?: string[];
  address?: { city?: string; country?: string; street?: string };
};

export type Requirement = {
  _id: string;
  facilityId?: string | { _id?: string; name?: string };
  materialCategory?: string;
  materialSubtype?: string;
  minGrade?: string;
  massKgPerPeriod?: number;
  period?: "weekly" | "monthly" | string;
  maxPricePerKg?: number;
  maxDistanceKm?: number;
  status?: "active" | "paused" | "closed" | string;
  createdAt?: string;
};

export type Listing = {
  _id: string;
  organizationId?: string;
  title?: string;
  description?: string;
  status?: "draft" | "published" | "reserved" | "sold" | "expired" | string;
  materialCategory?: string;
  materialSubtype?: string;
  grade?: "A" | "B" | "C" | "reject" | string;
  gradeSource?: string;
  massKg?: number;
  unitCount?: number;
  packagingState?: string;
  availableFrom?: string;
  availableUntil?: string;
  askingPrice?: { amount?: number; currency?: string };
  openToOffers?: boolean;
  createdAt?: string;
  facilityId?: {
    _id?: string;
    name?: string;
    address?: { city?: string; country?: string };
  };
};

export type Paginated<T> = {
  items: T[];
  nextCursor?: string | null;
  hasMore?: boolean;
  total?: number;
};

export type OrderStatus =
  | "pending"
  | "accepted"
  | "in_transit"
  | "completed"
  | "cancelled";

type OrgRef = { _id?: string; name?: string };

export type Order = {
  _id: string;
  orderNumber?: string;
  status?: OrderStatus;
  orderType?: "free_claim" | "paid_purchase";
  totalPrice?: number;
  quantity?: number;
  unit?: string;
  deliveryNotes?: string;
  createdAt?: string;
  updatedAt?: string;
  buyerOrganizationId?: string | OrgRef;
  sellerOrganizationId?: string | OrgRef;
  listingId?:
    | string
    | {
        _id?: string;
        title?: string;
        materialCategory?: string;
        materialSubtype?: string;
        grade?: string;
        massKg?: number;
      };
  materialId?: string | { _id?: string; title?: string; materialType?: string };
};

export const orgId = (ref?: string | OrgRef) =>
  typeof ref === "string" ? ref : (ref?._id ?? "");

export const orgName = (ref?: string | OrgRef) =>
  typeof ref === "string" ? "Organisation" : (ref?.name ?? "Organisation");

export type Notification = {
  _id: string;
  title?: string;
  message?: string;
  read?: boolean;
  createdAt?: string;
  type?: string;
};

export type Category = {
  id: string;
  name: string;
  description?: string;
  subcategories?: string[];
};
