import { LitElement, css, unsafeCSS, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import sharedTokens         from '../../../styles/shared/tokens.css?inline';
import componentCss         from './lib-sparkline.css?inline';
import { sparklineTemplate } from './lib-sparkline.html';
import type { SparklineType, SparklineTone } from './lib-sparkline.types';

/**
 * @element lib-sparkline
 *
 * Átomo de visualización: mini-gráfica inline sin ejes ni leyenda, pensada
 * para incrustarse en texto, celdas de tabla, `lib-counter` o `lib-metric-bar`.
 * El color usa `currentColor`; el atributo `tone` lo mapea a tokens semánticos,
 * así que es katachi-aware sin configuración extra.
 *
 * @prop {number[]}      values        — Serie de valores. Usar binding `.values=${...}`.
 * @prop {SparklineType} type          — 'line' (default) | 'area' | 'bar'.
 * @prop {SparklineTone} tone          — default | accent | info | success | warning | error.
 * @prop {number}        width         — Ancho en px. Default 100.
 * @prop {number}        height        — Alto en px. Default 28.
 * @prop {boolean}       smooth        — Suaviza la línea/área con curvas.
 * @prop {boolean}       show-end-dot  — Resalta el último punto.
 * @prop {number}        min           — Fuerza el mínimo del dominio (para escalas comparables).
 * @prop {number}        max           — Fuerza el máximo del dominio.
 *
 * @example
 * <lib-sparkline .values=${[3,5,2,8,6,9]} type="area" tone="success" show-end-dot></lib-sparkline>
 */
@customElement('lib-sparkline')
export class LibSparkline extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(componentCss)}`,
  ];

  @property({ type: Array })
  values: number[] = [];

  @property({ type: String, reflect: true })
  type: SparklineType = 'line';

  @property({ type: String, reflect: true })
  tone: SparklineTone = 'default';

  @property({ type: Number })
  width = 100;

  @property({ type: Number })
  height = 28;

  @property({ type: Boolean })
  smooth = false;

  @property({ type: Boolean, attribute: 'show-end-dot', reflect: true })
  showEndDot = false;

  @property({ type: Number })
  min: number | null = null;

  @property({ type: Number })
  max: number | null = null;

  override render(): TemplateResult {
    return sparklineTemplate({
      values:     this.values,
      type:       this.type,
      width:      this.width,
      height:     this.height,
      smooth:     this.smooth,
      showEndDot: this.showEndDot,
      min:        this.min,
      max:        this.max,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-sparkline': LibSparkline;
  }
}
