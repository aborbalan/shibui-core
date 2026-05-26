/**
 * Contrato compartido entre las tres suites de consumer tests.
 *
 * Centraliza URLs, nombres de eventos y helpers de aserciones para que
 * cualquier cambio en la API de @shibui-ui/ui se propague a los tres
 * tests desde un único punto.
 */

// ── URLs de los fixtures ──────────────────────────────────────────────────────

export const FIXTURES = {
  REACT:   'http://localhost:5174',
  SVELTE:  'http://localhost:5175',
  ANGULAR: 'http://localhost:4201',
} as const;

// ── Eventos emitidos por la librería ─────────────────────────────────────────

export const EVENTS = {
  MODAL_CLOSE: 'ui-lib-modal-close',
  TABS_CHANGE:  'ui-lib-tabs-change',
  INPUT_CHANGE: 'ui-lib-input-change',
} as const;

// ── Valores de katachi ────────────────────────────────────────────────────────

export const KATACHI_IDS = [
  'wabi', 'kintsugi', 'sabi', 'terminal', 'shizen', 'celadon',
] as const;

export type KatachiId = typeof KATACHI_IDS[number];

// ── Tipo del registro de eventos capturados en window ────────────────────────
// Los fixtures exponen este objeto en window.__capturedEvents__ para que
// los tests puedan leer el detalle de los eventos disparados.

export type CapturedEventDetail = Record<string, unknown>;

export interface CapturedEventsMap {
  [eventName: string]: CapturedEventDetail[];
}

/**
 * Helper de evaluación — lee window.__capturedEvents__ desde Playwright.
 * Uso:
 *   const events = await page.evaluate(readCapturedEvents);
 *   expect(events['ui-lib-modal-close']).toHaveLength(1);
 */
export const readCapturedEvents = (): CapturedEventsMap =>
  (window as unknown as { __capturedEvents__: CapturedEventsMap }).__capturedEvents__ ?? {};
