import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../atoms/progress/lib-progress.component';
import { metricBarTemplate }             from './lib-metric-bar.html';
import componentCss                       from './lib-metric-bar.css?inline';
import sharedTokens                       from '../../../styles/shared/tokens.css?inline';
import type { ProgressTone, ProgressSize } from './lib-metric-bar.types';

/**
 * @element lib-metric-bar
 *
 * Molécula de métrica: wrapper semántico sobre `lib-progress` que combina
 * etiqueta, barra y valor con formato de unidad en un único componente.
 *
 * Diseñado para listas verticales de métricas en dashboards (CPU, RAM,
 * disco, red…). Categoría: `app/metric`.
 *
 * @prop {string}       label      — Nombre de la métrica ("CPU", "RAM")
 * @prop {number}       value      — Valor actual (0–max). Default 0.
 * @prop {number}       max        — Valor máximo. Default 100.
 * @prop {string}       unit       — Unidad a mostrar ("%", "GB", "MB/s"). Default "".
 * @prop {ProgressTone} tone       — default · accent · info · error. Default default.
 * @prop {ProgressSize} size       — xs · sm · md · lg · xl. Default sm.
 * @prop {boolean}      show-value — Muestra "value / max unit" junto a la etiqueta.
 *
 * @example — lista de métricas de sistema
 * <lib-metric-bar label="CPU"  value="45"   unit="%" show-value></lib-metric-bar>
 * <lib-metric-bar label="RAM"  value="12.4" max="32" unit="GB" show-value tone="accent"></lib-metric-bar>
 * <lib-metric-bar label="Disco" value="380" max="512" unit="GB" show-value></lib-metric-bar>
 */
@customElement('lib-metric-bar')
export class LibMetricBar extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(componentCss)}`,
  ];

  /** Nombre de la métrica mostrado como etiqueta. */
  @property({ type: String })
  label = '';

  /** Valor actual (0–max). */
  @property({ type: Number })
  value = 0;

  /** Valor máximo. Default 100. */
  @property({ type: Number })
  max = 100;

  /** Unidad a mostrar junto al valor ("%", "GB", "MB/s"). */
  @property({ type: String })
  unit = '';

  /** Tono del fill: default · kaki · celadon · error. */
  @property({ type: String, reflect: true })
  tone: ProgressTone = 'default';

  /** Altura de la barra: xs · sm · md · lg · xl. */
  @property({ type: String, reflect: true })
  size: ProgressSize = 'sm';

  /** Muestra "value / max unit" como texto junto a la etiqueta. */
  @property({ type: Boolean, attribute: 'show-value' })
  showValue = false;

  override render(): TemplateResult {
    return metricBarTemplate({
      label:     this.label,
      value:     this.value,
      max:       this.max,
      unit:      this.unit,
      tone:      this.tone,
      size:      this.size,
      showValue: this.showValue,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-metric-bar': LibMetricBar;
  }
}
