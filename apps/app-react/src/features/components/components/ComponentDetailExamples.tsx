import React from "react";
import { LibEmptyState, LibCodeBlock, LibSegmentedControl } from "@shibui-ui/ui/react";
import type { ExampleDto, ExampleFramework } from "../../../data/api/domain/components/api/components.api";

interface ComponentDetailExamplesProps {
  examples: ExampleDto[];
}

interface SegmentedOption {
  label: string;
  value: string;
}

const FRAMEWORK_ORDER: ExampleFramework[] = ["vanilla", "react", "angular", "vue"];

const frameworkLabel: Record<ExampleFramework, string> = {
  vanilla: "HTML",
  react:   "React",
  angular: "Angular",
  vue:     "Vue",
};

// `lib-code-block` solo admite un set acotado y decorativo de lenguajes
// (bash|ts|js|html|css|json|text). No hay token jsx/tsx → React usa `ts`.
const frameworkLanguage: Record<ExampleFramework, "html" | "ts"> = {
  vanilla: "html",
  react:   "ts",
  angular: "html",
  vue:     "html",
};

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

  const options: SegmentedOption[] = availableFrameworks.map((fw) => ({
    label: frameworkLabel[fw],
    value: fw,
  }));

  const currentExamples = activeFramework ? grouped[activeFramework] : [];

  return (
    <div>
      {availableFrameworks.length > 1 && (
        <div style={{ marginBottom: "1.25rem" }}>
          <LibSegmentedControl
            display="outline"
            size="sm"
            options={options}
            value={activeFramework ?? availableFrameworks[0]}
            onUiLibChange={(e: CustomEvent) =>
              setActiveFramework(e.detail.value as ExampleFramework)
            }
          />
        </div>
      )}

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
          <LibCodeBlock code={example.code} language={frameworkLanguage[example.framework]} />
        </div>
      ))}
    </div>
  );
};
