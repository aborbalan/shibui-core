import { LitElement, css, unsafeCSS, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { renderEyebrow } from './lib-eyebrow.html';
import componentCss from './lib-eyebrow.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

export type EyebrowColor  = 'kaki' | 'washi' | 'celadon' | 'white' | 'muted' | 'dark';
export type EyebrowLine   = 'left' | 'right' | 'both' | 'none';
export type EyebrowSize   = 'sm' | 'md' | 'lg';
export type EyebrowEffect = 'none' | 'kintsugi' | 'glitch';

/**
 * `<lib-eyebrow>` — Etiqueta introductoria previa a un titular.
 *
 * Elemento de texto en DM Mono muy pequeño con línea decorativa de gradiente.
 * Unifica los patrones `.sg-section-label`, `.hero-eyebrow` y `.section-label`
 * en un único componente agnóstico.
 *
 * @tag lib-eyebrow
 *
 * @attr {'kaki'|'washi'|'celadon'|'white'|'muted'|'dark'} color
 *   Color del texto y de la línea decorativa. Default: `'kaki'`.
 *
 * @attr {'left'|'right'|'both'|'none'} line
 *   Posición de la línea decorativa. Default: `'left'`.
 *
 * @attr {'sm'|'md'|'lg'} size
 *   Tamaño tipográfico. Default: `'md'`.
 *
 * @attr {'none'|'kintsugi'|'glitch'} effect
 *   Efecto especial de animación. Default: `'none'`.
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
 * <lib-eyebrow color="celadon" size="sm" dot>Sistema online</lib-eyebrow>
 * <lib-eyebrow effect="kintsugi" line="both">✦ Featured</lib-eyebrow>
 * <lib-eyebrow effect="glitch" line="none">⌗ runtime · session</lib-eyebrow>
 * <lib-eyebrow num="41">Motion</lib-eyebrow>
 */
@customElement('lib-eyebrow')
export class LibEyebrow extends LitElement {

  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(componentCss)}`,
  ];

  /** Color del texto y la línea decorativa */
  @property({ type: String, reflect: true })
  color: EyebrowColor = 'kaki';

  /** Posición de la línea decorativa */
  @property({ type: String, reflect: true })
  line: EyebrowLine = 'left';

  /** Tamaño tipográfico */
  @property({ type: String, reflect: true })
  size: EyebrowSize = 'md';

  /** Efecto especial animado */
  @property({ type: String, reflect: true })
  effect: EyebrowEffect = 'none';

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
