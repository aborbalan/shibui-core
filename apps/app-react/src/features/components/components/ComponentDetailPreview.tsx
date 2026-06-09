import React from "react";
import { LibCanvas, LibDivider } from "@shibui-ui/ui/react";
import type { ComponentDto, ApiPropDto } from "../../../data/api/domain/components/api/components.api";

/**
 * Vista previa en vivo del componente, renderizada dentro de un
 * `lib-canvas katachi="celadon"` — el mismo katachi en el que está hecha la
 * página. Es DATA-DRIVEN: las variantes salen del bloque `api` (props con
 * `options`, derivadas del manifiesto), no de listas hardcodeadas.
 *
 * Cobertura: un allowlist de componentes "hoja" que se renderizan bien con
 * una etiqueta/receta. Los componentes estructurales / overlay / charts se
 * omiten (no se rompe la página); el allowlist es extensible.
 */

// Nombres de prop que actúan como "eje de variante" (el primero con options gana).
const VARIANT_AXIS_NAMES = ["variant", "type", "tone", "kind", "color", "status", "intent"];

interface Recipe {
  /** Atributos base aplicados a cada instancia. */
  attrs?: Record<string, string>;
  /** Contenido de slot por defecto (texto/markup) para la instancia básica. */
  slot?: React.ReactNode;
  /** Si true, el valor de la variante se usa como texto del slot. */
  variantAsLabel?: boolean;
}

// Allowlist + recetas. Solo estos componentes muestran preview (de momento).
const RECIPES: Record<string, Recipe> = {
  "lib-button": { slot: "Botón", variantAsLabel: true },
  "lib-button-liquid": { slot: "Botón", variantAsLabel: true },
  "lib-badge": { slot: "Badge", variantAsLabel: true },
  "lib-chip": { slot: "Chip", variantAsLabel: true, attrs: { kind: "static" } },
  "lib-alert": { slot: "Mensaje de ejemplo", attrs: { heading: "Aviso" } },
  "lib-kbd": { slot: "Ctrl" },
  "lib-label": { slot: "Etiqueta" },
  "lib-eyebrow": { slot: "Eyebrow" },
  "lib-quote": { slot: "Una cita de ejemplo." },
  "lib-checkbox": { slot: "Opción" },
  "lib-radio": { slot: "Opción" },
  "lib-text-glitch": { slot: "Glitch" },
  "lib-status-dot": {},
  "lib-spinner": {},
  "lib-switch": {},
  "lib-divider": {},
  "lib-burger": {},
  "lib-close-button": {},
  "lib-skeleton": { attrs: { width: "140px", height: "1rem" } },
  "lib-progress": { attrs: { value: "60" } },
  "lib-progress-circle": { attrs: { value: "60" } },
  "lib-rating": { attrs: { value: "3" } },
  "lib-avatar": { attrs: { name: "Shibui" } },
  "lib-icon": { attrs: { name: "star" } },
  "lib-input": { attrs: { placeholder: "Escribe algo…" } },
};

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

const PreviewGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ marginBottom: "1.5rem" }}>
    <p style={groupLabelStyle}>{label}</p>
    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
      {children}
    </div>
  </div>
);

function findAxis(props: ApiPropDto[], names: string[]): ApiPropDto | undefined {
  for (const name of names) {
    const p = props.find((pr) => pr.name === name && pr.options && pr.options.length > 1);
    if (p) return p;
  }
  return undefined;
}

// Renderiza una instancia del custom element con atributos arbitrarios.
function renderInstance(
  tagName: string,
  attrs: Record<string, string>,
  slot: React.ReactNode,
  key: string,
): React.ReactNode {
  const Tag = tagName as unknown as React.FC<Record<string, unknown>>;
  return (
    <Tag key={key} {...attrs}>
      {slot}
    </Tag>
  );
}

interface ComponentDetailPreviewProps {
  component: ComponentDto;
}

export const ComponentDetailPreview: React.FC<ComponentDetailPreviewProps> = ({ component }) => {
  const recipe = RECIPES[component.tagName];
  if (!recipe) return null;

  const props = component.api?.props ?? [];
  const baseAttrs = recipe.attrs ?? {};
  const tag = component.tagName;

  const variantAxis = findAxis(props, VARIANT_AXIS_NAMES);
  const sizeProp = props.find((p) => p.name === "size" && p.options && p.options.length > 1);

  const variantAttr = variantAxis?.attribute ?? variantAxis?.name ?? "variant";

  return (
    <section style={{ marginBottom: "3rem" }}>
      <h2 style={sectionTitleStyle}>Vista previa</h2>
      <LibDivider style={{ marginBottom: "1.25rem" }} />

      <LibCanvas
        katachi="celadon"
        display="block"
        pad="xl"
        style={{ border: "1px solid var(--border-subtle)", borderRadius: "var(--lib-radius-lg, 12px)" }}
      >
        <PreviewGroup label="Uso básico">
          {renderInstance(tag, baseAttrs, recipe.slot, "basic")}
        </PreviewGroup>

        {variantAxis?.options && (
          <PreviewGroup label={`Variantes (${variantAxis.name})`}>
            {variantAxis.options.map((value) =>
              renderInstance(
                tag,
                { ...baseAttrs, [variantAttr]: value },
                recipe.variantAsLabel ? value : recipe.slot,
                `v-${value}`,
              ),
            )}
          </PreviewGroup>
        )}

        {sizeProp?.options && (
          <PreviewGroup label="Tamaños">
            {sizeProp.options.map((value) =>
              renderInstance(tag, { ...baseAttrs, size: value }, recipe.slot, `s-${value}`),
            )}
          </PreviewGroup>
        )}
      </LibCanvas>
    </section>
  );
};
