import { LitElement, css, unsafeCSS, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import sharedTokens      from '../../../styles/shared/tokens.css?inline';
import componentCss      from './lib-gauge.css?inline';
import { gaugeTemplate } from './lib-gauge.html';
import { ChartResizeController } from '../../../shared/charts';
import type { GaugeTone, GaugeZone } from './lib-gauge.types';

/**
 * @element lib-gauge
 *
 * Organismo de visualización: indicador radial (gauge) SVG en semicírculo
 * 180° para un KPI 0–N. En modo simple pinta el arco de valor en un `tone`;
 * si se pasan `zones`, dibuja bandas de color por umbrales y una aguja que
 * apunta al valor (el color de la aguja refleja la zona activa).
 * Katachi-aware — los tonos consumen tokens semánticos --text-*.
 *
 * @prop {number}       value       — Valor actual.
 * @prop {number}       min         — Mínimo del dominio. Default 0.
 * @prop {number}       max         — Máximo del dominio. Default 100.
 * @prop {GaugeTone}    tone        — Color del arco en modo simple. Default 'info'.
 * @prop {GaugeZone[]}  zones       — Tramos { from, to, tone }. Si hay → modo zonas.
 * @prop {boolean}      show-value  — Muestra el número central. Default true.
 * @prop {string}       unit        — Sufijo del valor (p.ej. '%').
 * @prop {string}       label       — Caption bajo el valor.
 * @prop {number}       height      — Altura en px. Default 180.
 *
 * @example
 * <lib-gauge .value=${72} unit="%" tone="success" label="Uptime"></lib-gauge>
 *
 * @example — con zonas (SLA)
 * <lib-gauge
 *   .value=${88}
 *   unit="%"
 *   .zones=${[
 *     { from: 0,  to: 60, tone: 'success' },
 *     { from: 60, to: 85, tone: 'warning' },
 *     { from: 85, to: 100, tone: 'error' },
 *   ]}
 * ></lib-gauge>
 */
@customElement('lib-gauge')
export class LibGauge extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(componentCss)}`,
  ];

  @property({ type: Number })
  value = 0;

  @property({ type: Number })
  min = 0;

  @property({ type: Number })
  max = 100;

  @property({ type: String, reflect: true })
  tone: GaugeTone = 'info';

  @property({ type: Array })
  zones: GaugeZone[] = [];

  @property({ type: Boolean, attribute: 'show-value', reflect: true })
  showValue = true;

  @property({ type: String })
  unit = '';

  @property({ type: String })
  label = '';

  @property({ type: Number })
  height = 180;

  private readonly _resize = new ChartResizeController(this);

  override render(): TemplateResult {
    return gaugeTemplate({
      value:     this.value,
      min:       this.min,
      max:       this.max,
      tone:      this.tone,
      zones:     this.zones,
      showValue: this.showValue,
      unit:      this.unit,
      label:     this.label,
      height:    this.height,
      svgWidth:  this._resize.width,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-gauge': LibGauge;
  }
}
