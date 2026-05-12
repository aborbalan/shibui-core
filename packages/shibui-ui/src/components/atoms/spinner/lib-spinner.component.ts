import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import spinnerCss from './lib-spinner.css?inline';
import { spinnerTemplate } from './lib-spinner.html';

/* ── Tipos públicos ─────────────────────────────────────────── */

/**
 * Variante visual.
 * - `enso`     — trazo de pincel zen (SVG doble capa).
 * - `sumi`     — tinta disolviéndose en agua (conic-gradient).
 * - `kintsugi` — anillo dorado con halo de polvo de oro.
 * - `shizuku`  — gotas en órbita decreciente.
 */
export type SpinnerVariant = 'enso' | 'sumi' | 'kintsugi' | 'shizuku';

/** Tamaño del spinner. */
export type SpinnerSize = 'sm' | 'md' | 'lg';

/**
 * Tono de color.
 * Afecta a `enso` (stroke) y `sumi` (gradiente).
 * En `shizuku`, `tone="kaki"` equivale a `dark`.
 * No tiene efecto sobre `kintsugi` (siempre oro).
 */
export type SpinnerTone = 'ink' | 'kaki' | 'celadon';

/**
 * @element lib-spinner
 *
 * @prop {SpinnerVariant} variant  - Variante visual (default: enso).
 * @prop {SpinnerSize}    size     - Tamaño sm | md | lg (default: md).
 * @prop {SpinnerTone}    tone     - Tono de color (default: ink).
 * @prop {boolean}        dark     - Optimiza colores para fondos oscuros.
 * @prop {string}         label    - Texto accesible (default: 'Cargando').
 *
 * @csspart status - El div[role=status] raíz.
 */
@customElement('lib-spinner')
export class LibSpinner extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(spinnerCss)}`,
  ];

  @property({ type: String, reflect: true })
  variant: SpinnerVariant = 'enso';

  @property({ type: String, reflect: true })
  size: SpinnerSize = 'md';

  @property({ type: String, reflect: true })
  tone: SpinnerTone = 'ink';

  @property({ type: Boolean, reflect: true })
  dark: boolean = false;

  @property({ type: String })
  label: string = 'Cargando';

  override render(): TemplateResult {
    return spinnerTemplate({
      variant: this.variant,
      size:    this.size,
      tone:    this.tone,
      dark:    this.dark,
      label:   this.label,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-spinner': LibSpinner;
  }
}