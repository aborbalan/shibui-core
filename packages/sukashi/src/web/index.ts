// web — custom element <shibui-sukashi>. Único módulo que toca el DOM.
// OJO: importar este barrel evalúa `class extends HTMLElement` → solo en navegador,
// nunca desde el barrel raíz (que debe seguir siendo seguro en Node).
export { ShibuiSukashi } from './shibui-sukashi';
export { isAligned, offsetInCells } from './geometry';

import { ShibuiSukashi } from './shibui-sukashi';

// Registra el custom element (idempotente). Llamar desde la app/demo de navegador.
export function defineSukashi(tag = 'shibui-sukashi'): void {
  if (!customElements.get(tag)) customElements.define(tag, ShibuiSukashi);
}
