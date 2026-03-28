import { LitElement, css, unsafeCSS, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { renderQuote } from './lib-quote.html';
import componentCss from './lib-quote.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

/**
 * `<lib-quote>` — Cita display editorial.
 *
 * Blockquote en Cormorant Garamond con acento itálico en kaki y
 * atribución en DM Mono. Patrón recurrente en hero sections, CTAs
 * y secciones de filosofía del sistema Shibui.
 *
 * @tag lib-quote
 *
 * @attr {string}                  text    - Primera línea de la cita (alternativa al slot).
 * @attr {string}                  accent  - Segunda línea en itálica kaki.
 * @attr {string}                  cite    - Atribución (ej: "— Principio Shibui · 渋い").
 * @attr {'dark'|'light'|'washi'}  surface - Superficie de fondo. Default: `dark`.
 * @attr {'sm'|'md'|'lg'}          size    - Tamaño tipográfico fluido. Default: `md`.
 *
 * @slot - Primera línea de la cita como rich content (alternativa al atributo `text`).
 *
 * @csspart blockquote - El elemento blockquote raíz.
 * @csspart text       - El párrafo de la cita.
 * @csspart accent     - El em de la segunda línea.
 * @csspart cite       - El elemento cite de atribución.
 *
 * @cssprop --q-text-color   - Color del texto principal.
 * @cssprop --q-accent-color - Color del acento itálico.
 * @cssprop --q-cite-color   - Color de la atribución.
 * @cssprop --q-size         - Tamaño de fuente (sobreescribe el atributo `size`).
 *
 * @example
 * <lib-quote
 *   text="Lo bello no se anuncia."
 *   accent="Se descubre con pausa."
 *   cite="— Principio Shibui · 渋い"
 *   surface="dark"
 * ></lib-quote>
 *
 * <!-- Con slot -->
 * <lib-quote accent="Se descubre con pausa." cite="— Principio Shibui">
 *   Lo bello no se anuncia.
 * </lib-quote>
 */
@customElement('lib-quote')
export class LibQuote extends LitElement {

  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(componentCss)}`,
  ];

  /** Primera línea de la cita */
  @property({ type: String })
  text = '';

  /** Segunda línea en itálica kaki */
  @property({ type: String })
  accent = '';

  /** Atribución */
  @property({ type: String })
  cite = '';

  /** Superficie de fondo */
  @property({ type: String, reflect: true })
  surface: 'dark' | 'light' | 'washi' = 'dark';

  /** Tamaño tipográfico fluido */
  @property({ type: String, reflect: true })
  size: 'sm' | 'md' | 'lg' = 'md';

  protected override render(): TemplateResult {
    return renderQuote(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-quote': LibQuote;
  }
}