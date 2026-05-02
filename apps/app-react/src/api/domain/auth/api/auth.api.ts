import { apiClient, tokenStore } from "../../../client";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "viewer";
}

// ─── API calls ────────────────────────────────────────────────────────────────
export const authApi = {
  /** POST /auth/login — obtiene token; no adjunta Bearer header */
  login: async (payload: LoginPayload): Promise<AuthTokens> => {
    const tokens = await apiClient.post<AuthTokens>("/auth/login", payload, {
      public: true,
    });
    tokenStore.set(tokens.accessToken);
    return tokens;
  },

  /** GET /auth/me — perfil del usuario autenticado */
  me: (): Promise<AuthUser> => apiClient.get<AuthUser>("/auth/me"),

  /** POST /auth/logout */
  logout: async (): Promise<void> => {
    await apiClient.post<void>("/auth/logout", {}).catch(() => {
      // Silenciar: limpiamos token de todos modos
    });
    tokenStore.clear();
  },
};
