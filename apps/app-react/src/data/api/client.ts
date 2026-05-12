/// <reference types="vite/client" />


// ─── Token helpers ────────────────────────────────────────────────────────────
const TOKEN_KEY = "admin_auth_token";

export const tokenStore = {
  get: (): string | null => sessionStorage.getItem(TOKEN_KEY),
  set: (token: string): void => sessionStorage.setItem(TOKEN_KEY, token),
  clear: (): void => sessionStorage.removeItem(TOKEN_KEY),
};

// ─── Types ────────────────────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  /** Skip JWT header (e.g. login endpoint) */
  public?: boolean;
};

// ─── Core client ──────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL as string;

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { body, public: isPublic, ...init } = opts;

  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");

  if (!isPublic) {
    const token = tokenStore.get();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    // Token expired — clear session and reload to trigger AuthGuard
    tokenStore.clear();
    window.location.href = "/admin/login";
    throw new ApiError(401, "UNAUTHORIZED", "Sesión expirada");
  }

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    throw new ApiError(
      res.status,
      String(data["code"] ?? "API_ERROR"),
      String(data["message"] ?? `Error ${res.status}`),
    );
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

// ─── Public API ───────────────────────────────────────────────────────────────
export const apiClient = {
  get: <T>(path: string, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, body: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "POST", body }),
  put: <T>(path: string, body: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "PUT", body }),
  patch: <T>(path: string, body: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "PATCH", body }),
  delete: <T>(path: string, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "DELETE" }),
};
