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

  // ── About ─────────────────────────────────────────────
  about: {
    all: ["about"] as const,
    profile: ["about", "profile"] as const,
    experience: ["about", "experience"] as const,
    skills: ["about", "skills"] as const,
    education: ["about", "education"] as const,
    languages: ["about", "languages"] as const,
  },

  // ── Projects ──────────────────────────────────────────
  projects: {
    all: ["projects"] as const,
    lists: () => [...queryKeys.projects.all, "list"] as const,
    detail: (id: string) => [...queryKeys.projects.all, "detail", id] as const,
  },

  // ── Components ────────────────────────────────────────
  components: {
    all: ["components"] as const,
    withCategories: ["components", "with-categories"] as const,
    bySlug: (slug: string) => ["components", "slug", slug] as const,
    examples: (componentId: string) =>
      ["components", "examples", componentId] as const,
  },

  // ── Tokens ────────────────────────────────────────────
  tokens: {
    all: ["tokens"] as const,
    categories: ["tokens", "categories"] as const,
    byCategory: (category: string) =>
      ["tokens", "category", category] as const,
    detail: (id: string) => ["tokens", "detail", id] as const,
  },
} as const;
