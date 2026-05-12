import React from "react";
import { LibComponentGrid } from "@shibui-ui/ui/react";
import type { CategoryWithComponentsDto } from "../../../data/api/domain/components/api/components.api";
import { ComponentCard } from "./ComponentCard";

interface ComponentsGridProps {
  categories: CategoryWithComponentsDto[];
  onSelect: (slug: string) => void;
  isLoading?: boolean;
  error?: Error | null;
}

const sectionStyle: React.CSSProperties = {
  marginBottom: "3rem",
};

const headingStyle: React.CSSProperties = {
  fontFamily: "var(--lib-font-mono)",
  fontSize: "0.7rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--color-kaki-400)",
  marginBottom: "1rem",
  paddingBottom: "0.5rem",
  borderBottom: "1px solid color-mix(in oklch, var(--color-kaki-600) 30%, transparent)",
};

const loadingStyle: React.CSSProperties = {
  color: "var(--color-kaki-300)",
  fontFamily: "var(--lib-font-mono)",
  fontSize: "0.8rem",
  padding: "2rem 0",
};

const errorStyle: React.CSSProperties = {
  color: "color-mix(in oklch, red 60%, white)",
  fontFamily: "var(--lib-font-mono)",
  fontSize: "0.8rem",
  padding: "2rem 0",
};

export const ComponentsGrid: React.FC<ComponentsGridProps> = ({
  categories,
  onSelect,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return <p style={loadingStyle}>Cargando componentes…</p>;
  }

  if (error) {
    return (
      <p style={errorStyle}>
        Error al cargar componentes: {error.message}
      </p>
    );
  }

  return (
    <>
      {categories.map((category) => (
        <section key={category.id} style={sectionStyle} id={category.slug}>
          <h2 style={headingStyle}>
            {category.name}
            <span style={{ marginLeft: "0.5rem", opacity: 0.5 }}>
              ({category.components.length})
            </span>
          </h2>
          <LibComponentGrid>
            {category.components.map((component) => (
              <ComponentCard
                key={component.id}
                component={component}
                onSelect={onSelect}
              />
            ))}
          </LibComponentGrid>
        </section>
      ))}
    </>
  );
};
