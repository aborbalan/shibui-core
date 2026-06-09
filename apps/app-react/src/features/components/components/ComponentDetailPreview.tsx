import React from "react";
import { LibButton, LibCanvas, LibDivider } from "@shibui-ui/ui/react";

/**
 * Vista previa en vivo del componente, renderizada dentro de un
 * `lib-canvas katachi="celadon"` — el mismo katachi en el que está hecha la
 * página (LibBackground celadon-wash + header celadon). Así cada uso se ve tal
 * cual queda en su contexto real.
 *
 * Registro extensible por `tagName`: si un componente no tiene preview
 * registrada, la sección simplemente no aparece. Punto de partida: lib-button.
 */

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: "var(--lib-font-mono)",
  fontSize: "0.7rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--color-kaki-700)",
  marginBottom: "0.75rem",
};

const groupLabelStyle: React.CSSProperties = {
  fontFamily: "var(--lib-font-mono)",
  fontSize: "0.65rem",
  letterSpacing: "0.05em",
  color: "var(--text-secondary)",
  margin: "0 0 0.6rem",
};

const PreviewGroup: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div style={{ marginBottom: "1.5rem" }}>
    <p style={groupLabelStyle}>{label}</p>
    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
      {children}
    </div>
  </div>
);

// Registro de previews en vivo, indexado por tagName del componente.
const PREVIEWS: Record<string, React.ReactNode> = {
  "lib-button": (
    <>
      <PreviewGroup label="Variantes">
        <LibButton variant="primary">Primary</LibButton>
        <LibButton variant="secondary">Secondary</LibButton>
        <LibButton variant="accent">Accent</LibButton>
        <LibButton variant="ghost">Ghost</LibButton>
        <LibButton variant="danger">Danger</LibButton>
      </PreviewGroup>

      <PreviewGroup label="Tamaños">
        <LibButton variant="primary" size="sm">Small</LibButton>
        <LibButton variant="primary" size="md">Medium</LibButton>
        <LibButton variant="primary" size="lg">Large</LibButton>
        <LibButton variant="primary" size="xl">XLarge</LibButton>
      </PreviewGroup>

      <PreviewGroup label="Estados y efectos">
        <LibButton variant="primary" disabled>Disabled</LibButton>
        <LibButton variant="primary" glass>Glass</LibButton>
        {/* spotlight = efecto signature celadon (spotlight-water reactivo al cursor) */}
        <LibButton variant="accent" spotlight>Spotlight</LibButton>
      </PreviewGroup>
    </>
  ),
};

interface ComponentDetailPreviewProps {
  tagName: string;
}

export const ComponentDetailPreview: React.FC<ComponentDetailPreviewProps> = ({ tagName }) => {
  const preview = PREVIEWS[tagName];
  if (!preview) return null;

  return (
    <section style={{ marginBottom: "3rem" }}>
      <h2 style={sectionTitleStyle}>Vista previa</h2>
      <LibDivider style={{ marginBottom: "1.25rem" }} />

      <LibCanvas
        katachi="celadon"
        display="block"
        pad="xl"
        style={{
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--lib-radius-lg, 12px)",
        }}
      >
        {preview}
      </LibCanvas>
    </section>
  );
};
