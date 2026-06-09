import { LitElement, css, unsafeCSS, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import sharedTokens            from '../../../styles/shared/tokens.css?inline';
import skeletonCss             from '../../../shared/charts/chart-skeleton.css?inline';
import componentCss            from './lib-funnel-chart.css?inline';
import { funnelChartTemplate } from './lib-funnel-chart.html';
import { SERIES_COLORS, seriesColor, ChartResizeController, tooltipAnchor } from '../../../shared/charts';
import type { ChartTooltip } from '../../../../models/ui/charts';
import type { FunnelStage } from './lib-funnel-chart.types';

/**
 * @element lib-funnel-chart
 *
 * Organismo de visualización: embudo (funnel) vertical SVG. Cada etapa es un
 * trapecio centrado cuya anchura es proporcional a su valor; al estrecharse
 * hacia abajo muestra la conversión entre etapas. Tooltip con valor y % sobre
 * la primera etapa. Katachi-aware.
 *
 * @prop {FunnelStage[]} stages      — Etapas { label, value, color? }. `.stages=${...}`.
 * @prop {boolean}       show-values — Muestra valor y % dentro de cada banda. Default true.
 * @prop {number}        height      — Altura en px. Default 320.
 *
 * @example
 * <lib-funnel-chart
 *   .stages=${[
 *     { label: 'Visitas',  value: 12000 },
 *     { label: 'Registros', value: 4200 },
 *     { label: 'Pago',     value: 980 },
 *   ]}
 * ></lib-funnel-chart>
 */
@customElement('lib-funnel-chart')
export class LibFunnelChart extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(skeletonCss)}`,
    css`${unsafeCSS(componentCss)}`,
  ];

  @property({ type: Array })
  stages: FunnelStage[] = [];

  @property({ type: Boolean, attribute: 'show-values', reflect: true })
  showValues = true;

  @property({ type: Number })
  height = 320;

  @state() private _tooltip: ChartTooltip | null = null;

  private readonly _resize = new ChartResizeController(this);

  private _handleStageEnter(e: MouseEvent, index: number): void {
    const wrapper = this.shadowRoot?.querySelector('.chart-wrapper') as HTMLElement | null;
    const anchor  = tooltipAnchor(wrapper, e.currentTarget as SVGPathElement);
    if (!anchor) return;

    const stage = this.stages[index];
    if (!stage) return;

    const top   = this.stages[0]?.value ?? 0;
    const ratio = top > 0 ? (stage.value / top) * 100 : 0;
    const pctStr = ratio >= 10 ? ratio.toFixed(0) : ratio.toFixed(1);

    this._tooltip = {
      ...anchor,
      content: `${stage.label}: ${stage.value} (${pctStr}%)`,
      color:   stage.color ?? seriesColor(index),
    };
  }

  private _handleStageLeave(): void {
    this._tooltip = null;
  }

  override render(): TemplateResult {
    return funnelChartTemplate({
      stages:       this.stages,
      colors:       SERIES_COLORS,
      showValues:   this.showValues,
      height:       this.height,
      svgWidth:     this._resize.width,
      tooltip:      this._tooltip,
      onStageEnter: (e, i) => { this._handleStageEnter(e, i); },
      onStageLeave: () => { this._handleStageLeave(); },
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-funnel-chart': LibFunnelChart;
  }
}
