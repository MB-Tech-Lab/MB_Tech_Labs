/**
 * API Client
 * -----------
 * Central Axios instance with JWT auth, token refresh, and error
 * normalization. All service files use this client.
 *
 * Base URL is empty (same-origin) because the API runs as Next.js
 * API routes. When migrating to a separate Express backend, set
 * NEXT_PUBLIC_API_BASE to the backend URL.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";
const TOKEN_KEY = "mbtl_access_token";
const REFRESH_KEY = "mbtl_refresh_token";

// Token storage (client-side only)
export const tokenStorage = {
  get: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  getRefresh: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_KEY);
  },
  set: (accessToken: string, refreshToken?: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  },
  clear: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * Core fetch wrapper with JWT auth and error handling.
 */
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = tokenStorage.get();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  // Handle 401 — attempt token refresh
  if (res.status === 401 && !path.includes("/auth/")) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      // Retry the original request with the new token
      const newToken = tokenStorage.get();
      if (newToken) {
        headers["Authorization"] = `Bearer ${newToken}`;
      }
      const retryRes = await fetch(`${API_BASE}${path}`, { ...options, headers });
      if (retryRes.ok) {
        const json = await retryRes.json();
        return json.data as T;
      }
    }
    // Refresh failed — clear tokens and redirect to login
    tokenStorage.clear();
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
    throw new Error("Session expired");
  }

  const json = await res.json();

  if (!res.ok || !json.success) {
    const err = new Error(json.error?.message || "Request failed") as Error & {
      code?: string;
      statusCode?: number;
      details?: unknown;
    };
    err.code = json.error?.code;
    err.statusCode = res.status;
    err.details = json.error?.details;
    throw err;
  }

  return json.data as T;
}

let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  // Deduplicate concurrent refresh attempts
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = tokenStorage.getRefresh();
    if (!refreshToken) return false;

    try {
      const res = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return false;
      const json = await res.json();
      if (json.success && json.data?.accessToken) {
        tokenStorage.set(json.data.accessToken);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
