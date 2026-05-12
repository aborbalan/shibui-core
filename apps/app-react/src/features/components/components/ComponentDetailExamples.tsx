import React from "react";
import { LibEmptyState, LibCodeBlock } from "@shibui-ui/ui/react";
import type { ExampleDto, ExampleFramework } from "../../../data/api/domain/components/api/components.api";

interface ComponentDetailExamplesProps {
  examples: ExampleDto[];
}

const FRAMEWORK_ORDER: ExampleFramework[] = ["vanilla", "react", "angular", "vue"];

const frameworkLabel: Record<ExampleFramework, string> = {
  vanilla: "HTML / Vanilla",
  react: "React",
  angular: "Angular",
  vue: "Vue",
};

const tabStyle = (active: boolean): React.CSSProperties => ({
  fontFamily: "var(--lib-font-mono)",
  fontSize: "0.72rem",
  letterSpacing: "0.06em",
  padding: "0.35rem 0.85rem",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  background: active
    ? "color-mix(in oklch, var(--color-kaki-500) 25%, transparent)"
    : "transparent",
  color: active ? "var(--color-kaki-200)" : "var(--color-kaki-500)",
  transition: "background 0.15s, color 0.15s",
});

export const ComponentDetailExamples: React.FC<ComponentDetailExamplesProps> = ({ examples }) => {
  const grouped = FRAMEWORK_ORDER.reduce<Record<ExampleFramework, ExampleDto[]>>(
    (acc, fw) => {
      acc[fw] = examples.filter((e) => e.framework === fw).sort((a, b) => a.order - b.order);
      return acc;
    },
    { vanilla: [], react: [], angular: [], vue: [] }
  );

  const availableFrameworks = FRAMEWORK_ORDER.filter((fw) => grouped[fw].length > 0);

  const [activeFramework, setActiveFramework] = React.useState<ExampleFramework | null>(
    availableFrameworks[0] ?? null
  );

  if (availableFrameworks.length === 0) {
    return (
      <LibEmptyState
        title="Sin ejemplos"
        description="Este componente no tiene ejemplos de código disponibles aún."
        icon="code"
      />
    );
  }

  const currentExamples = activeFramework ? grouped[activeFramework] : [];

  return (
    <div>
      <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {availableFrameworks.map((fw) => (
          <button
            key={fw}
            style={tabStyle(fw === activeFramework)}
            onClick={() => setActiveFramework(fw)}
          >
            {frameworkLabel[fw]}
          </button>
        ))}
      </div>

      {currentExamples.map((example) => (
        <div key={example.id} style={{ marginBottom: "1.5rem" }}>
          {example.title && (
            <p style={{
              fontFamily: "var(--lib-font-mono)",
              fontSize: "0.72rem",
              color: "var(--color-kaki-400)",
              marginBottom: "0.5rem",
            }}>
              {example.title}
            </p>
          )}
          {example.description && (
            <p style={{ fontSize: "0.85rem", color: "var(--color-ink-300)", marginBottom: "0.75rem" }}>
              {example.description}
            </p>
          )}
          <LibCodeBlock code={example.code} language="html" />
        </div>
      ))}
    </div>
  );
};
