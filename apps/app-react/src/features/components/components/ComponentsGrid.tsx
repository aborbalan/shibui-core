import React from "react";
import { LibComponentGrid, LibSpinner, LibAlert, LibDivider } from "@shibui-ui/ui/react";
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
  marginBottom: "0.75rem",
};

export const ComponentsGrid: React.FC<ComponentsGridProps> = ({
  categories,
  onSelect,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
        <LibSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <LibAlert type="error" heading="Error al cargar componentes">
        {error.message}
      </LibAlert>
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
          <LibDivider style={{ marginBottom: "1rem" }} />
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
