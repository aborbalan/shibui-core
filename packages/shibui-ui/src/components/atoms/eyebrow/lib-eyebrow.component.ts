import { LitElement, css, unsafeCSS, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { renderEyebrow } from './lib-eyebrow.html';
import type { LibSurface } from '../../../types';
import componentCss from './lib-eyebrow.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

export type EyebrowTone = 'default' | 'accent' | 'muted';
export type EyebrowLine = 'left' | 'right' | 'both' | 'none';
export type EyebrowSize = 'sm' | 'md' | 'lg';

/**
 * `<lib-eyebrow>` — Etiqueta introductoria previa a un titular.
 *
 * Elemento de texto en DM Mono muy pequeño con línea decorativa de gradiente.
 * El color y los efectos se adaptan automáticamente al katachi activo en el ancestro:
 * en kintsugi el acento es dorado, en terminal el drift se activa por contexto, etc.
 *
 * @tag lib-eyebrow
 *
 * @attr {'default'|'accent'|'muted'} tone
 * @attr {'default'|'light'|'dark'|'inverse'} surface
 *   Rol semántico del color. Default: `'accent'`.
 *   - accent  → acento del katachi activo (kaki/dorado/phosphor según contexto)
 *   - neutral → cálido-neutro (tono washi)
 *   - inverse → para uso sobre fondos oscuros (contraste claro)
 *   - muted   → muy atenuado, casi invisible
 *
 * @attr {'left'|'right'|'both'|'none'} line
 *   Posición de la línea decorativa. Default: `'left'`.
 *
 * @attr {'sm'|'md'|'lg'} size
 *   Tamaño tipográfico. Default: `'md'`.
 *
 * @attr {boolean} dot
 *   Reemplaza la línea por un punto de color.
 *
 * @attr {string} num
 *   Si se define, añade un badge numérico sufijo (ej: "01").
 *
 * @slot - Texto del eyebrow.
 *
 * @csspart base  - El span contenedor interno.
 * @csspart badge - El badge numérico (solo cuando `num` está definido).
 *
 * @example
 * <lib-eyebrow>Design System · v0.1.0</lib-eyebrow>
 * <lib-eyebrow tone="default" size="sm" dot>Sistema online</lib-eyebrow>
 * <div data-katachi="kintsugi">
 *   <lib-eyebrow line="both">✦ Featured</lib-eyebrow>
 * </div>
 * <lib-eyebrow num="41">Motion</lib-eyebrow>
 */
@customElement('lib-eyebrow')
export class LibEyebrow extends LitElement {

  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(componentCss)}`,
  ];

  /** Rol semántico del color del texto y la línea decorativa */
  @property({ type: String, reflect: true })
  tone: EyebrowTone = 'accent';

  /** Superficie/contexto (p.ej. 'inverse' para fondos oscuros). */
  @property({ type: String, reflect: true })
  surface: LibSurface = 'default';

  /** Posición de la línea decorativa */
  @property({ type: String, reflect: true })
  line: EyebrowLine = 'left';

  /** Tamaño tipográfico */
  @property({ type: String, reflect: true })
  size: EyebrowSize = 'md';

  /** Sustituye la línea por un punto de color */
  @property({ type: Boolean, reflect: true })
  dot = false;

  /**
   * Badge numérico añadido como sufijo.
   * Útil en listados de componentes ("41 · Motion").
   */
  @property({ type: String, reflect: true })
  num = '';

  protected override render(): TemplateResult {
    return renderEyebrow(this);
  }
}
