import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { generateUniqueId } from '../../../core/a11y';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import tooltipCss from './lib-tooltip.css?inline';
import { tooltipTemplate } from './lib-tooltip.html';

/* ── Tipos públicos ─────────────────────────────────────────── */

/**
 * Posición de la burbuja respecto al trigger.
 * Las cuatro cardinales centran la burbuja.
 * Las variantes -start/-end alinean al extremo — útiles
 * cuando el trigger está junto al borde de pantalla.
 */
export type TooltipPosition =
  | 'top' | 'bottom' | 'left' | 'right'
  | 'top-start' | 'top-end'
  | 'bottom-start' | 'bottom-end';

/**
 * Variante de color.
 * - `dark`    — washi-900, máximo contraste (default).
 * - `light`   — fondo blanco con borde, para superficies oscuras
 *               o cuando el contenido necesita estructura visible.
 * - `kaki`    — acento naranja terracota.
 * - `celadon` — estado positivo / informativo.
 * - `error`   — validación fallida o acción destructiva.
 */
export type TooltipVariant = 'dark' | 'light' | 'kaki' | 'celadon' | 'error';

/** Tamaño de la burbuja. */
export type TooltipSize = 'sm' | 'md' | 'lg';

/**
 * @element lib-tooltip
 *
 * Wrapper que envuelve cualquier trigger y muestra una burbuja
 * flotante en hover / focus. Sin JS para el caso base —
 * todo mediante CSS :hover + :focus-within.
 *
 * ## Uso simple
 * ```html
 * <lib-tooltip content="Guardar cambios">
 *   <button>...</button>
 * </lib-tooltip>
 * ```
 *
 * ## Contenido rico (slot="content")
 * ```html
 * <lib-tooltip position="top" variant="light" size="lg">
 *   <button>...</button>
 *   <span slot="content">
 *     <span class="tip-title">Tokens de color</span>
 *     <span class="tip-body">Paleta completa en CSS variables.</span>
 *     <div class="tip-sep"></div>
 *     <div class="tip-kbd"><kbd>⌘</kbd><kbd>K</kbd></div>
 *   </span>
 * </lib-tooltip>
 * ```
 *
 * @prop {TooltipPosition} position - Posición de la burbuja (default: top).
 * @prop {TooltipVariant}  variant  - Variante de color (default: dark).
 * @prop {TooltipSize}     size     - Tamaño sm | md | lg (default: md).
 * @prop {string}          content  - Texto simple. Para contenido rico usa slot="content".
 * @prop {boolean}         instant  - Elimina el delay de entrada de 300ms.
 * @prop {boolean}         open     - Abre la burbuja programáticamente.
 *
 * @slot          - El trigger (cualquier elemento interactivo).
 * @slot content  - Contenido rico de la burbuja (tip-title, tip-body, tip-kbd, tip-sep).
 *
 * @csspart wrapper - El div posicionador interno.
 * @csspart bubble  - El span de la burbuja flotante.
 */
@customElement('lib-tooltip')
export class LibTooltip extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(tooltipCss)}`,
  ];

  private _tipId: string;

  constructor() {
    super();
    this._tipId = generateUniqueId('tip-');
  }

  @property({ type: String, reflect: true })
  position: TooltipPosition = 'top';

  @property({ type: String, reflect: true })
  variant: TooltipVariant = 'dark';

  @property({ type: String, reflect: true })
  size: TooltipSize = 'md';

  @property({ type: String })
  content: string = '';

  @property({ type: Boolean, reflect: true })
  instant: boolean = false;

  /** Abre la burbuja programáticamente (equivale a `.is-open`). */
  @property({ type: Boolean, reflect: true })
  open: boolean = false;

  override render(): TemplateResult {
    return tooltipTemplate({
      position: this.position,
      variant:  this.variant,
      size:     this.size,
      content:  this.content,
      instant:  this.instant,
      open:     this.open,
      tipId:    this._tipId,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-tooltip': LibTooltip;
  }
}