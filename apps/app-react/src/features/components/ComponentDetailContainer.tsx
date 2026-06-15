import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useComponentBySlug,
  useComponentExamples,
} from "../../data/api/domain/components/hooks/useComponents";
import { ComponentDetailView } from "./components/ComponentDetailView";

const errorStyle: React.CSSProperties = {
  color: "color-mix(in oklch, red 60%, black)",
  fontFamily: "var(--lib-font-mono)",
  fontSize: "0.8rem",
  padding: "4rem clamp(1.5rem, 4vw, 3.5rem)",
};

const loadingStyle: React.CSSProperties = {
  color: "var(--text-accent)",
  fontFamily: "var(--lib-font-mono)",
  fontSize: "0.8rem",
  padding: "4rem clamp(1.5rem, 4vw, 3.5rem)",
};

export const ComponentDetailContainer: React.FC = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: component, isPending, error } = useComponentBySlug(slug);
  const { data: examples = [], isPending: isLoadingExamples } = useComponentExamples(
    component?.id ?? ""
  );

  const handleBack = () => navigate("/componentes");

  return (
    <div
      style={{
        maxWidth: "860px",
        margin: "0 auto",
        padding: "calc(56px + 3rem) clamp(1.5rem, 4vw, 3.5rem) 6rem",
      }}
    >
      {isPending && <p style={loadingStyle}>Cargando componente…</p>}

      {error && (
        <p style={errorStyle}>
          Componente no encontrado: {error.message}
        </p>
      )}

      {component && (
        <ComponentDetailView
          component={component}
          examples={examples}
          isLoadingExamples={isLoadingExamples}
          onBack={handleBack}
        />
      )}
    </div>
  );
};
