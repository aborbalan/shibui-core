import { apiClient } from "../../../client";

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  meta: { timestamp: string; path: string };
}

// ─── DTOs ────────────────────────────────────────────────────────────────────

export type TokenCategory =
  | "typography"
  | "color-primitive"
  | "color-semantic"
  | "spacing"
  | "shadow"
  | "animation"
  | "radius"
  | "z-index"
  | "glass"
  | "spotlight";

export interface DesignTokenDto {
  id: string;
  name: string;
  cssVar: string;
  value: string;
  category: TokenCategory;
  description: string;
  darkValue: string | null;
}

// ─── API calls ────────────────────────────────────────────────────────────────

export const tokensApi = {
  /** GET /api/v1/tokens — lista completa de design tokens */
  getAll: (): Promise<DesignTokenDto[]> =>
    apiClient.get<ApiEnvelope<DesignTokenDto[]>>("/api/v1/tokens", { public: true }).then(r => r.data),

  /** GET /api/v1/tokens/categories — listado de categorías disponibles */
  getCategories: (): Promise<TokenCategory[]> =>
    apiClient.get<ApiEnvelope<TokenCategory[]>>("/api/v1/tokens/categories", { public: true }).then(r => r.data),

  /** GET /api/v1/tokens/category/:category — tokens filtrados por categoría */
  getByCategory: (category: TokenCategory): Promise<DesignTokenDto[]> =>
    apiClient.get<ApiEnvelope<DesignTokenDto[]>>(`/api/v1/tokens/category/${category}`, { public: true }).then(r => r.data),

  /** GET /api/v1/tokens/:id — token individual */
  getOne: (id: string): Promise<DesignTokenDto> =>
    apiClient.get<ApiEnvelope<DesignTokenDto>>(`/api/v1/tokens/${id}`, { public: true }).then(r => r.data),
};
