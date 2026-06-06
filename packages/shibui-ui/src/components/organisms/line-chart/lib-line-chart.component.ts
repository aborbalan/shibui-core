import { LitElement, css, unsafeCSS, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import sharedTokens         from '../../../styles/shared/tokens.css?inline';
import skeletonCss          from '../../../shared/charts/chart-skeleton.css?inline';
import componentCss         from './lib-line-chart.css?inline';
import { lineChartTemplate } from './lib-line-chart.html';
import { SERIES_COLORS, seriesColor, ChartResizeController, tooltipAnchor } from '../../../shared/charts';
import type { ChartPointSeries, ChartSeries, ChartTooltip } from '../../../../models/ui/charts';
import type { LineChartMode } from './lib-line-chart.types';

/**
 * @element lib-line-chart
 *
 * Organismo de visualización: gráfica de líneas / áreas SVG nativa.
 * Soporta dos modos de eje X:
 *  - **banda** → `.series` + `.categories` (series temporales discretas).
 *  - **lineal** → `.pointSeries` (puntos {x,y} con eje X numérico).
 * `pointSeries` tiene prioridad sobre `series` cuando ambos se aportan.
 *
 * Modos de trazado: `line` · `area` · `stacked-area` (este último solo en banda).
 * Katachi-aware — ejes, rejilla y etiquetas consumen tokens semánticos.
 *
 * @prop {ChartSeries[]}      series      — Series categóricas. Usar binding `.series=${...}`.
 * @prop {string[]}           categories  — Etiquetas del eje X (modo banda).
 * @prop {ChartPointSeries[]} pointSeries — Series cartesianas (modo lineal). Usar `.pointSeries=${...}`.
 * @prop {string}             x-label    — Título del eje X.
 * @prop {string}             y-label    — Título del eje Y.
 * @prop {boolean}            show-grid  — Muestra la rejilla.
 * @prop {boolean}            show-legend — Muestra la leyenda con más de una serie.
 * @prop {boolean}            show-dots  — Muestra los puntos sobre la línea.
 * @prop {boolean}            smooth     — Suaviza la línea con curvas.
 * @prop {LineChartMode}      mode       — 'line' (default) | 'area' | 'stacked-area'.
 * @prop {number}             height     — Altura en px del gráfico. Default 320.
 *
 * @example
 * <lib-line-chart
 *   .series=${[{ name: 'Ventas', values: [40, 65, 30, 80] }]}
 *   .categories=${['Q1', 'Q2', 'Q3', 'Q4']}
 *   mode="area"
 *   smooth
 *   show-dots
 * ></lib-line-chart>
 */
@customElement('lib-line-chart')
export class LibLineChart extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(skeletonCss)}`,
    css`${unsafeCSS(componentCss)}`,
  ];

  @property({ type: Array })
  series: ChartSeries[] = [];

  @property({ type: Array })
  categories: string[] = [];

  @property({ type: Array })
  pointSeries: ChartPointSeries[] = [];

  @property({ type: String, attribute: 'x-label' })
  xLabel = '';

  @property({ type: String, attribute: 'y-label' })
  yLabel = '';

  @property({ type: Boolean, attribute: 'show-grid', reflect: true })
  showGrid = true;

  @property({ type: Boolean, attribute: 'show-legend', reflect: true })
  showLegend = true;

  @property({ type: Boolean, attribute: 'show-dots', reflect: true })
  showDots = true;

  @property({ type: Boolean, reflect: true })
  smooth = false;

  @property({ type: String, reflect: true })
  mode: LineChartMode = 'line';

  @property({ type: Number })
  height = 320;

  @state() private _tooltip: ChartTooltip | null = null;

  private readonly _resize = new ChartResizeController(this);

  private _handleDotEnter(e: MouseEvent, seriesIndex: number, content: string): void {
    const wrapper = this.shadowRoot?.querySelector('.chart-wrapper') as HTMLElement | null;
    const anchor  = tooltipAnchor(wrapper, e.currentTarget as SVGCircleElement);
    if (!anchor) return;

    this._tooltip = { ...anchor, content, color: seriesColor(seriesIndex) };
  }

  private _handleDotLeave(): void {
    this._tooltip = null;
  }

  override render(): TemplateResult {
    return lineChartTemplate({
      series:      this.series,
      categories:  this.categories,
      pointSeries: this.pointSeries,
      colors:      SERIES_COLORS,
      xLabel:      this.xLabel,
      yLabel:      this.yLabel,
      showGrid:    this.showGrid,
      showLegend:  this.showLegend,
      showDots:    this.showDots,
      smooth:      this.smooth,
      mode:        this.mode,
      height:      this.height,
      svgWidth:    this._resize.width,
      tooltip:     this._tooltip,
      onDotEnter:  (e, si, content) => { this._handleDotEnter(e, si, content); },
      onDotLeave:  () => { this._handleDotLeave(); },
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-line-chart': LibLineChart;
  }
}
