import type React from "react";
import { atomPreviews } from "./atom-previews";
import { moleculePreviews } from "./molecule-previews";
import { organismPreviews } from "./organism-previews";

/**
 * Registro de mini-previews del catálogo, keyed por tagName exacto
 * (`lib-button`, `lib-badge`…). Los tags sin entrada caen al placeholder
 * de ComponentPreview y NUNCA se montan dinámicamente (los data-driven
 * de @shibui-ui/ui crashean si se montan sin datos válidos).
 */
export const componentPreviews: Record<string, () => React.ReactElement> = {
  ...atomPreviews,
  ...moleculePreviews,
  ...organismPreviews,
};
