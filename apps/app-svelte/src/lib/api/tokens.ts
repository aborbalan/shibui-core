import { apiGet } from './client';

// ─── Modelos ──────────────────────────────────────────────────────────────────

export type TokenCategory =
  | 'typography'
  | 'color-primitive'
  | 'color-semantic'
  | 'spacing'
  | 'shadow'
  | 'animation'
  | 'radius'
  | 'z-index'
  | 'glass'
  | 'spotlight';

export interface DesignTokenDto {
  id: string;
  name: string;
  cssVar: string;
  value: string;
  category: TokenCategory;
  description: string;
  darkValue: string | null;
}

// ─── Llamadas ─────────────────────────────────────────────────────────────────

/** GET /api/v1/tokens — catálogo completo de design tokens. */
export const getAllTokens = (): Promise<DesignTokenDto[]> =>
  apiGet<DesignTokenDto[]>('/api/v1/tokens');

/** GET /api/v1/tokens/category/:category — tokens de una categoría. */
export const getTokensByCategory = (category: TokenCategory): Promise<DesignTokenDto[]> =>
  apiGet<DesignTokenDto[]>(`/api/v1/tokens/category/${category}`);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Indexa el catálogo por categoría para repartirlo entre las secciones. */
export function groupByCategory(
  tokens: DesignTokenDto[]
): Record<TokenCategory, DesignTokenDto[]> {
  const groups = {} as Record<TokenCategory, DesignTokenDto[]>;
  for (const token of tokens) {
    (groups[token.category] ??= []).push(token);
  }
  return groups;
}
