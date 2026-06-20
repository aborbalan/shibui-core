import { LitElement, css, unsafeCSS, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import sharedTokens          from '../../../styles/shared/tokens.css?inline';
import skeletonCss           from '../../../shared/charts/chart-skeleton.css?inline';
import componentCss          from './lib-bar-chart.css?inline';
import { barChartTemplate }  from './lib-bar-chart.html';
import { SERIES_COLORS, seriesColor, ChartResizeController, tooltipAnchor } from '../../../shared/charts';
import type { ChartTooltip } from '../../../../models/ui/charts';
import type { BarSeries, BarChartMode } from './lib-bar-chart.types';

/**
 * @element lib-bar-chart
 *
 * Organismo de visualización: gráfica de barras SVG nativa.
 * Soporta múltiples series en modo agrupado o apilado, con tooltip
 * interactivo y leyenda.
 * Katachi-aware — ejes, rejilla y etiquetas usan tokens semánticos.
 *
 * @prop {BarSeries[]}    series      — Datos de cada serie. Usar binding `.series=${...}`.
 * @prop {string[]}       categories  — Etiquetas del eje X. Usar binding `.categories=${...}`.
 * @prop {string}         x-label    — Título del eje X.
 * @prop {string}         y-label    — Título del eje Y.
 * @prop {boolean}        show-grid  — Muestra la rejilla horizontal.
 * @prop {boolean}        show-legend — Muestra la leyenda cuando hay más de una serie.
 * @prop {BarChartMode}   mode       — 'grouped' (default) | 'stacked'.
 * @prop {number}         height     — Altura en px del gráfico. Default 320.
 *
 * @example
 * <lib-bar-chart
 *   .series=${[
 *     { name: '2023', values: [40, 65, 30, 80] },
 *     { name: '2024', values: [55, 45, 70, 60] },
 *   ]}
 *   .categories=${['Q1', 'Q2', 'Q3', 'Q4']}
 *   x-label="Trimestre"
 *   y-label="Ventas (k€)"
 *   show-grid
 *   show-legend
 * ></lib-bar-chart>
 */
@customElement('lib-bar-chart')
export class LibBarChart extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(skeletonCss)}`,
    css`${unsafeCSS(componentCss)}`,
  ];

  @property({ type: Array })
  series: BarSeries[] = [];

  @property({ type: Array })
  categories: string[] = [];

  @property({ type: String, attribute: 'x-label' })
  xLabel = '';

  @property({ type: String, attribute: 'y-label' })
  yLabel = '';

  @property({ type: Boolean, attribute: 'show-grid', reflect: true })
  showGrid = true;

  @property({ type: Boolean, attribute: 'show-legend', reflect: true })
  showLegend = true;

  @property({ type: String, reflect: true })
  mode: BarChartMode = 'grouped';

  @property({ type: Number })
  height = 320;

  @state() private _tooltip: ChartTooltip | null = null;

  private readonly _resize = new ChartResizeController(this);

  private _handleBarEnter(
    e: MouseEvent,
    seriesIndex: number,
    categoryIndex: number,
    value: number,
  ): void {
    const wrapper = this.shadowRoot?.querySelector('.chart-wrapper') as HTMLElement | null;
    const anchor  = tooltipAnchor(wrapper, e.currentTarget as SVGRectElement);
    if (!anchor) return;

    const category   = this.categories[categoryIndex] ?? `#${categoryIndex}`;
    const seriesName = this.series[seriesIndex]?.name ?? `Serie ${seriesIndex}`;

    this._tooltip = {
      ...anchor,
      content: `${category} · ${seriesName}: ${value}`,
      color:   seriesColor(seriesIndex),
    };
  }

  private _handleBarLeave(): void {
    this._tooltip = null;
  }

  override render(): TemplateResult {
    return barChartTemplate({
      series:     this.series,
      categories: this.categories,
      colors:     SERIES_COLORS,
      xLabel:     this.xLabel,
      yLabel:     this.yLabel,
      showGrid:   this.showGrid,
      showLegend: this.showLegend,
      mode:       this.mode,
      height:     this.height,
      svgWidth:   this._resize.width,
      tooltip:    this._tooltip,
      onBarEnter: (e, si, ci, v) => { this._handleBarEnter(e, si, ci, v); },
      onBarLeave: () => { this._handleBarLeave(); },
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-bar-chart': LibBarChart;
  }
}
