import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import spinnerCss from './lib-spinner.css?inline';
import { spinnerTemplate } from './lib-spinner.html';

/* ── Tipos públicos ─────────────────────────────────────────── */

/**
 * Variante visual (forma del spinner — estructural, no paleta).
 * - `enso`    — trazo de pincel zen (SVG doble capa).
 * - `sumi`    — tinta disolviéndose en agua (conic-gradient).
 * - `kin`     — anillo dorado con halo de polvo de oro.   era 'kintsugi'
 * - `shizuku` — gotas en órbita decreciente.
 */
export type SpinnerTheme = 'enso' | 'sumi' | 'kin' | 'shizuku';

/** Tamaño del spinner. */
export type SpinnerSize = 'sm' | 'md' | 'lg';

/**
 * Tono de color (subconjunto canónico de `LibTone`).
 * Afecta a `enso` (stroke) y `sumi` (gradiente).
 * En `shizuku`, `tone="accent"` activa las gotas doradas.
 * No tiene efecto sobre `kin` (siempre oro).
 * - `default` — tinta oscura (era 'ink')
 * - `accent`  — cálido kaki/persimón       era 'kaki'
 * - `info`    — jade celadón sereno         era 'celadon'/'cool'
 */
export type SpinnerTone = 'default' | 'accent' | 'info';

/**
 * @element lib-spinner
 *
 * @prop {SpinnerTheme}   theme    - Variante estética (default: enso).
 * @prop {SpinnerSize}    size     - Tamaño sm | md | lg (default: md).
 * @prop {SpinnerTone}    tone     - Tono de color (default: default).
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
  theme: SpinnerTheme = 'enso';

  @property({ type: String, reflect: true })
  size: SpinnerSize = 'md';

  @property({ type: String, reflect: true })
  tone: SpinnerTone = 'default';

  @property({ type: Boolean, reflect: true })
  dark: boolean = false;

  @property({ type: String })
  label: string = 'Cargando';

  override render(): TemplateResult {
    return spinnerTemplate({
      theme: this.theme,
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