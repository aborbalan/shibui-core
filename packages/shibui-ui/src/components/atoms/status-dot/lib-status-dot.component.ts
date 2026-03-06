import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { LibStatusDotStatus, LibStatusDotSize } from './lib-status-dot.html';
import { statusDotTemplate } from './lib-status-dot.html';
import statusDotCss from './lib-status-dot.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

/**
 * @element lib-status-dot
 *
 * Indicador de presencia con animación semántica por estado.
 * Cada estado tiene su propio ritmo extraído de conceptos japoneses:
 *   - 水 mizu   : online  — doble onda concéntrica (2.6s)
 *   - 息 iki    : away    — respiración scale+opacity (3s)
 *   - 速い hayai : busy    — parpadeo asimétrico (1.1s)
 *   - 間 ma     : offline — quietud total, sin movimiento
 *
 * @example — uso básico
 * <lib-status-dot status="online"></lib-status-dot>
 *
 * @example — con label inline
 * <lib-status-dot status="away" label></lib-status-dot>
 *
 * @example — sobre avatar (borde blanco)
 * <lib-status-dot status="busy" size="md" bordered></lib-status-dot>
 *
 * @example — tamaño grande en dashboard
 * <lib-status-dot status="online" size="lg"></lib-status-dot>
 */
@customElement('lib-status-dot')
export class LibStatusDot extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(statusDotCss)}`,
  ];

  /**
   * Estado de presencia.
   * - online  : celadón · onda mizu
   * - away    : kaki · respiración iki
   * - busy    : error · parpadeo hayai
   * - offline : washi-400 · quietud ma
   */
  @property({ type: String, reflect: true })
  status: LibStatusDotStatus = 'offline';

  /**
   * Tamaño del punto.
   * - sm : 6px  — tablas y listas densas
   * - md : 10px — uso general (default)
   * - lg : 14px — alta visibilidad
   */
  @property({ type: String, reflect: true })
  size: LibStatusDotSize = 'md';

  /**
   * Añade un halo blanco (`box-shadow: 0 0 0 2px --bg-elevated`)
   * para separar el punto visualmente cuando se posiciona sobre un avatar.
   */
  @property({ type: Boolean, reflect: true })
  bordered = false;

  /**
   * Muestra el texto del estado (Online / Away / Busy / Offline)
   * en línea con el punto. El color hereda el estado activo.
   */
  @property({ type: Boolean, reflect: true })
  label = false;

  override render(): TemplateResult {
    return statusDotTemplate({
      status:   this.status,
      size:     this.size,
      bordered: this.bordered,
      label:    this.label,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-status-dot': LibStatusDot;
  }
}