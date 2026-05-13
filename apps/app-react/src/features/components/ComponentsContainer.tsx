import React from "react";
import { useNavigate } from "react-router-dom";
import { LibBackground, LibDisplayHeading, LibInput } from "@shibui-ui/ui/react";
import { useCategoriesWithComponents } from "../../data/api/domain/components/hooks/useComponents";
import { ComponentsGrid } from "./components/ComponentsGrid";
import type { CategoryWithComponentsDto } from "../../data/api/domain/components/api/components.api";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function filterCategories(
  categories: CategoryWithComponentsDto[],
  query: string
): CategoryWithComponentsDto[] {
  if (!query.trim()) return categories;
  const q = query.toLowerCase();
  return categories
    .map((cat) => ({
      ...cat,
      components: cat.components.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.tagName.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      ),
    }))
    .filter((cat) => cat.components.length > 0);
}

// ─── Component ───────────────────────────────────────────────────────────────

export const ComponentsContainer: React.FC = () => {
  const navigate = useNavigate();
  const { data: categories = [], isPending, error } = useCategoriesWithComponents();
  const [query, setQuery] = React.useState("");

  const filtered = filterCategories(categories, query);
  const totalComponents = categories.reduce((acc, c) => acc + c.components.length, 0);

  const handleSelect = (slug: string) => navigate(`/componentes/${slug}`);

  return (
    <LibBackground variant="midnight">
      <div
        style={{
          maxWidth: "1080px",
          margin: "0 auto",
          padding: "calc(56px + 3rem) clamp(1.5rem, 4vw, 3.5rem) 6rem",
        }}
      >
        {/* Título */}
        <div style={{ marginBottom: "2.5rem" }}>
          <LibDisplayHeading
            tag="h1"
            size="md"
            surface="dark"
            line1="Librería de"
            accent="componentes"
            description={
              !isPending && !error
                ? `${totalComponents} componentes · ${categories.length} categorías`
                : undefined
            }
          />
        </div>

        {/* Buscador */}
        <div style={{ maxWidth: "420px", marginBottom: "2.5rem" }}>
          <LibInput
            placeholder="Buscar por nombre, tag o descripción…"
            value={query}
            onUiLibInput={(e: CustomEvent<{ value: string }>) =>
              setQuery(e.detail.value)
            }
          >
            <lib-icon slot="prefix" name="magnifying-glass" size="sm" />
          </LibInput>
        </div>

        {/* Grid */}
        <ComponentsGrid
          categories={filtered}
          onSelect={handleSelect}
          isLoading={isPending}
          error={error}
          emptySearch={query.trim().length > 0 && filtered.length === 0}
        />
      </div>
    </LibBackground>
  );
};
