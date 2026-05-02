/**
 * Centraliza todas las query keys del proyecto.
 * Usar siempre estas constantes en useQuery / invalidateQueries.
 *
 * Patrón: [scope, ...filters]
 * Docs: https://tkdodo.eu/blog/effective-react-query-keys
 */
export const queryKeys = {
  // ── Auth ──────────────────────────────────────────────
  auth: {
    all: ["auth"] as const,
    me: ["auth", "me"] as const,
  },

  // ── Projects ──────────────────────────────────────────
  projects: {
    all: ["projects"] as const,
    lists: () => [...queryKeys.projects.all, "list"] as const,
    detail: (id: string) => [...queryKeys.projects.all, "detail", id] as const,
  },

  // ── Experience ────────────────────────────────────────
  experience: {
    all: ["experience"] as const,
    list: () => [...queryKeys.experience.all, "list"] as const,
  },

  // ── Design System ─────────────────────────────────────
  designSystem: {
    all: ["design-system"] as const,
    components: () => [...queryKeys.designSystem.all, "components"] as const,
    tokens: () => [...queryKeys.designSystem.all, "tokens"] as const,
  },
} as const;
