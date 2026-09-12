"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ApiError,
  api,
  setAccessToken,
  type AuthPayload,
  type Organization,
  type SessionUser,
} from "./api";

/** /users/me returns the user with organizationId populated as a document. */
type MeResponse = {
  _id: string;
  email: string;
  name: string;
  role: string;
  organizationId?: Organization | string;
};

export type RegisterInput = {
  email: string;
  password: string;
  name: string;
  organizationName: string;
  organizationType: "manufacturer" | "retailer" | "recycler" | "logistics";
  city: string;
  country: string;
};

type AuthState = {
  user: SessionUser | null;
  org: Organization | null;
  status: "loading" | "authenticated" | "anonymous";
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshOrg: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

const USER_KEY = "reloop_user";

function readStoredUser(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

function storeUser(user: SessionUser | null) {
  try {
    if (user) window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [org, setOrg] = useState<Organization | null>(null);
  const [status, setStatus] = useState<AuthState["status"]>("loading");

  const loadOrg = useCallback(async () => {
    try {
      const data = await api.get<Organization>("/organizations/me");
      setOrg(data);
    } catch {
      setOrg(null);
    }
  }, []);

  /* Restore on first mount. /users/me is asked for unconditionally: with no
     access token the call 401s, the client swaps the httpOnly refresh cookie
     for a fresh one and retries, so a session survives a reload even when
     localStorage was cleared. Anything else means genuinely signed out. */
  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      const stored = readStoredUser();
      if (stored) setUser(stored);

      try {
        const me = await api.get<MeResponse>("/users/me");
        if (cancelled) return;

        const orgField = me.organizationId;
        const organization =
          orgField && typeof orgField === "object"
            ? (orgField as Organization)
            : null;

        const session: SessionUser = {
          id: me._id,
          email: me.email,
          name: me.name,
          role: me.role,
          organizationId: organization?._id ?? String(orgField ?? ""),
        };

        storeUser(session);
        setUser(session);
        setOrg(organization);
        setStatus("authenticated");

        if (!organization) await loadOrg();
      } catch (err) {
        if (cancelled) return;

        /* Only a genuine auth failure signs the user out. A rate limit,
           server error or dropped connection keeps the stored session so a
           blip doesn't dump someone back on the login screen. */
        const status = err instanceof ApiError ? err.status : 0;
        const rejected = status === 401 || status === 403;

        if (!rejected && stored) {
          setStatus("authenticated");
          return;
        }

        setAccessToken(null);
        storeUser(null);
        setUser(null);
        setOrg(null);
        setStatus("anonymous");
      }
    };

    restore();
    return () => {
      cancelled = true;
    };
  }, [loadOrg]);

  const applySession = useCallback(
    async (payload: AuthPayload) => {
      setAccessToken(payload.accessToken);
      storeUser(payload.user);
      setUser(payload.user);
      setStatus("authenticated");
      await loadOrg();
    },
    [loadOrg],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const payload = await api.post<AuthPayload>("/auth/login", {
        email,
        password,
      });
      await applySession(payload);
    },
    [applySession],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const payload = await api.post<AuthPayload>("/auth/register", input);
      await applySession(payload);
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      /* clear the client session regardless */
    }
    setAccessToken(null);
    storeUser(null);
    setUser(null);
    setOrg(null);
    setStatus("anonymous");
  }, []);

  const value = useMemo(
    () => ({ user, org, status, login, register, logout, refreshOrg: loadOrg }),
    [user, org, status, login, register, logout, loadOrg],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
