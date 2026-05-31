import { html, nothing, type TemplateResult } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { craquelureSVG, condensationSVG } from "./celadon-generative";

/** SVG generativos precomputados (semilla fija → deterministas). */
const CRAQUELURE_SVG = craquelureSVG();
const CONDENSATION_SVG = condensationSVG();

/**
 * Decoraciones celadon disponibles como capas opt-in.
 * Cada nombre corresponde a una clase `.fx-*` de
 * `celadon-decorations.css` (que el componente debe importar e incluir
 * en su array `styles`). Pensadas para usarse bajo `data-katachi="celadon"`.
 *
 * - `craquelure`   — red de grietas (ice-crackle), estática · Surface/Structural
 * - `condensation` — micro-gotas frías, estática · Surface/Bar
 * - `depth`        — masa de agua hundida en la base, estática · Surface/Bar
 * - `mist`         — bruma jade que deriva (multiply), animada · Surface
 * - `reflejo`      — banda de luz que barre, animada · Surface/Interactive
 * - `iridescence`  — overlay opalescente en hover · cualquier interactivo
 * - `tide`         — oleaje que oscila, animada · Bar
 * - `meniscus`     — agua en reposo (curva cóncava), estática · Bar
 */
export type CeladonDecoration =
  | "craquelure"
  | "condensation"
  | "depth"
  | "mist"
  | "reflejo"
  | "iridescence"
  | "tide"
  | "meniscus";

const LAYER_CLASS: Record<CeladonDecoration, string> = {
  craquelure: "fx-craquelure",
  condensation: "fx-condensation",
  depth: "fx-depth",
  mist: "fx-mist",
  reflejo: "fx-reflejo",
  iridescence: "fx-iridescence",
  tide: "fx-tide",
  meniscus: "fx-meniscus",
};

/** Parsea una lista separada por espacios a decoraciones válidas (descarta desconocidas). */
export function parseDecorations(value?: string | null): CeladonDecoration[] {
  if (!value) return [];
  return value
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token): token is CeladonDecoration => token in LAYER_CLASS);
}

/**
 * Renderiza las capas `<div class="fx-*">` para las decoraciones indicadas.
 * Devuelve `nothing` si no hay ninguna válida. Las capas son `aria-hidden`
 * (puramente decorativas) y deben quedar DETRÁS del contenido del componente.
 */
function layerContent(decoration: CeladonDecoration): TemplateResult | typeof nothing {
  switch (decoration) {
    case "craquelure":
      return html`${unsafeHTML(CRAQUELURE_SVG)}`;
    case "condensation":
      return html`${unsafeHTML(CONDENSATION_SVG)}`;
    case "mist":
      // Tres capas de bruma distintas (paralaje), como el prototipo.
      return html`<span class="m1"></span><span class="m2"></span><span class="m3"></span>`;
    default:
      return nothing;
  }
}

export function celadonDecorationLayers(
  value?: string | null,
): TemplateResult | typeof nothing {
  const decorations = parseDecorations(value);
  if (decorations.length === 0) return nothing;
  return html`${decorations.map(
    (decoration) =>
      html`<div class="${LAYER_CLASS[decoration]}" aria-hidden="true">
        ${layerContent(decoration)}
      </div>`,
  )}`;
}
