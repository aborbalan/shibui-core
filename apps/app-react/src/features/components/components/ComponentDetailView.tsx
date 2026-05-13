import React from "react";
import { LibButton, LibBadge, LibChip, LibDivider, LibSpinner } from "@shibui-ui/ui/react";
import type { ComponentDto, ExampleDto } from "../../../data/api/domain/components/api/components.api";
import { ComponentDetailExamples } from "./ComponentDetailExamples";

interface ComponentDetailViewProps {
  component: ComponentDto;
  examples: ExampleDto[];
  isLoadingExamples?: boolean;
  onBack: () => void;
}

const statusVariant: Record<string, string> = {
  stable:     "success",
  draft:      "warning",
  deprecated: "error",
};

const metaStyle: React.CSSProperties = {
  fontFamily: "var(--lib-font-mono)",
  fontSize: "0.65rem",
  color: "var(--color-kaki-500)",
};

export const ComponentDetailView: React.FC<ComponentDetailViewProps> = ({
  component,
  examples,
  isLoadingExamples,
  onBack,
}) => {
  return (
    <article>
      {/* Back */}
      <div style={{ marginBottom: "2rem" }}>
        <LibButton variant="ghost" size="sm" onClick={onBack}>
          ← Componentes
        </LibButton>
      </div>

      {/* Header */}
      <header style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
          <LibBadge
            variant={statusVariant[component.status] ?? "default"}
            size="sm"
            pill
          >
            {component.status.toUpperCase()}
          </LibBadge>
          <span style={metaStyle}>v{component.version}</span>
          {component.packageName && (
            <span style={metaStyle}>{component.packageName}</span>
          )}
        </div>

        <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 600, marginBottom: "0.5rem" }}>
          {component.name}
        </h1>

        <p style={{ fontFamily: "var(--lib-font-mono)", fontSize: "0.85rem", color: "var(--color-kaki-400)", marginBottom: "1rem" }}>
          {"<"}{component.tagName}{">"}
        </p>

        <p style={{ fontSize: "1rem", lineHeight: 1.65, color: "var(--color-ink-200)", maxWidth: "60ch" }}>
          {component.description}
        </p>
      </header>

      {/* Tags */}
      {component.tags.length > 0 && (
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "3rem" }}>
          {component.tags.map((tag) => (
            <LibChip key={tag} kind="static" size="xs" color="default">
              {tag}
            </LibChip>
          ))}
        </div>
      )}

      {/* Examples */}
      <section>
        <h2 style={{ fontFamily: "var(--lib-font-mono)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-kaki-400)", marginBottom: "0.75rem" }}>
          Ejemplos
        </h2>
        <LibDivider style={{ marginBottom: "1.25rem" }} />

        {isLoadingExamples ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "2rem 0" }}>
            <LibSpinner size="md" />
          </div>
        ) : (
          <ComponentDetailExamples examples={examples} />
        )}
      </section>
    </article>
  );
};
