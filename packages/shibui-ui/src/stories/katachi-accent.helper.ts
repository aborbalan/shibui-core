import { html, TemplateResult } from 'lit';
import { expect } from 'storybook/test';
import type { KatachiId } from './katachi-stories.helper';

/* ============================================================
   KATACHI ACCENT — helper de tests (capa A · component test)
   ────────────────────────────────────────────────────────────
   Verifica el invariante: en el estado *seleccionado / activo*,
   el color de acento del componente es IGUAL al token de acento
   que el katachi resuelve (`--text-accent` / `--border-focus`).

   No se hardcodean valores: se compara la RELACIÓN acento↔token,
   así el mismo helper vale para los 6 katachis (jade en celadon,
   kaki en shizen/sabi, oro en kintsugi…).

   Requiere navegador real (cascada CSS + herencia de custom
   properties a través del Shadow DOM + color-mix/oklch). Corre
   vía @storybook/addon-vitest (`pnpm test:stories`).
   ============================================================ */

/** Envuelve contenido en un contexto katachi (igual que las stories Katachi*). */
export function katachiContext(
  katachi: KatachiId,
  content: TemplateResult,
): TemplateResult {
  return html`
    <div
      data-katachi="${katachi}"
      style="padding: var(--lib-space-lg); background: var(--bg-base);"
    >
      ${content}
    </div>
  `;
}

/** Propiedades de color computado que solemos comprobar. */
export type AccentColorProp =
  | 'color'
  | 'backgroundColor'
  | 'borderTopColor'
  | 'borderLeftColor';

/**
 * Resuelve el color computado de un token (`--text-accent`,
 * `--border-focus`…) en el árbol de custom properties de `contextEl`,
 * montando una sonda efímera. Devuelve la serialización del browser
 * para comparar 1:1 contra otro `getComputedStyle` del mismo motor —
 * evita líos de oklch vs rgb entre navegadores.
 */
export function resolveTokenColor(contextEl: Element, token: string): string {
  const probe = document.createElement('span');
  probe.style.color = `var(${token})`;
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  contextEl.appendChild(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}

/**
 * Afirma que el `prop` computado de `el` coincide con el token de
 * acento resuelto en `contextEl`. El acento del estado seleccionado
 * debe SEGUIR al token del katachi, no un primitivo cálido fijo.
 */
export function expectAccentMatchesToken(
  el: Element,
  prop: AccentColorProp,
  contextEl: Element,
  token: string,
): void {
  const expected = resolveTokenColor(contextEl, token);
  const actual = getComputedStyle(el)[prop];
  expect(actual).toBe(expected);
}
