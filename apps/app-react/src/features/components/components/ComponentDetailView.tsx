import React from "react";
import type { ComponentDto, ExampleDto } from "../../../data/api/domain/components/api/components.api";
import { ComponentDetailExamples } from "./ComponentDetailExamples";

interface ComponentDetailViewProps {
  component: ComponentDto;
  examples: ExampleDto[];
  isLoadingExamples?: boolean;
  onBack: () => void;
}

const statusColor: Record<string, string> = {
  stable: "var(--color-celadon-300)",
  draft: "var(--color-kaki-300)",
  deprecated: "color-mix(in oklch, red 60%, white)",
};

const tagStyle: React.CSSProperties = {
  fontFamily: "var(--lib-font-mono)",
  fontSize: "0.65rem",
  letterSpacing: "0.08em",
  padding: "0.2rem 0.55rem",
  borderRadius: "4px",
  background: "color-mix(in oklch, var(--color-kaki-600) 20%, transparent)",
  color: "var(--color-kaki-300)",
};

const sectionHeadingStyle: React.CSSProperties = {
  fontFamily: "var(--lib-font-mono)",
  fontSize: "0.7rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--color-kaki-400)",
  marginBottom: "1rem",
  paddingBottom: "0.5rem",
  borderBottom: "1px solid color-mix(in oklch, var(--color-kaki-600) 30%, transparent)",
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
      <button
        onClick={onBack}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--lib-font-mono)",
          fontSize: "0.72rem",
          color: "var(--color-kaki-400)",
          marginBottom: "2rem",
          padding: 0,
        }}
      >
        ← Componentes
      </button>

      {/* Header */}
      <header style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
          <span
            style={{
              fontFamily: "var(--lib-font-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.08em",
              color: statusColor[component.status] ?? statusColor.draft,
            }}
          >
            {component.status.toUpperCase()}
          </span>
          <span style={{ fontFamily: "var(--lib-font-mono)", fontSize: "0.65rem", color: "var(--color-kaki-500)" }}>
            v{component.version}
          </span>
          {component.packageName && (
            <span style={{ fontFamily: "var(--lib-font-mono)", fontSize: "0.65rem", color: "var(--color-kaki-500)" }}>
              {component.packageName}
            </span>
          )}
        </div>

        <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 600, marginBottom: "0.5rem" }}>
          {component.name}
        </h1>

        <p style={{
          fontFamily: "var(--lib-font-mono)",
          fontSize: "0.85rem",
          color: "var(--color-kaki-400)",
          marginBottom: "1rem",
        }}>
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
            <span key={tag} style={tagStyle}>{tag}</span>
          ))}
        </div>
      )}

      {/* Examples */}
      <section>
        <h2 style={sectionHeadingStyle}>Ejemplos</h2>
        {isLoadingExamples ? (
          <p style={{ fontFamily: "var(--lib-font-mono)", fontSize: "0.8rem", color: "var(--color-kaki-400)" }}>
            Cargando ejemplos…
          </p>
        ) : (
          <ComponentDetailExamples examples={examples} />
        )}
      </section>
    </article>
  );
};
