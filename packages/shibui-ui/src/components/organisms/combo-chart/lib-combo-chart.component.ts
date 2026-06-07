import { LitElement, css, unsafeCSS, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import sharedTokens           from '../../../styles/shared/tokens.css?inline';
import skeletonCss            from '../../../shared/charts/chart-skeleton.css?inline';
import componentCss           from './lib-combo-chart.css?inline';
import { comboChartTemplate } from './lib-combo-chart.html';
import { SERIES_COLORS, ChartResizeController, tooltipAnchor } from '../../../shared/charts';
import type { ChartSeries, ChartTooltip } from '../../../../models/ui/charts';

/**
 * @element lib-combo-chart
 *
 * Organismo de visualización: gráfica combinada barras + líneas sobre un eje
 * de banda compartido (p.ej. volumen en barras + tendencia en línea). Soporta
 * un segundo eje Y a la derecha (`dual-axis`) para escalas independientes.
 * Katachi-aware. Reutiliza las primitivas del módulo de charts.
 *
 * @prop {string[]}      categories   — Etiquetas del eje X. `.categories=${...}`.
 * @prop {ChartSeries[]} barSeries    — Series de barras (agrupadas). `.barSeries=${...}`.
 * @prop {ChartSeries[]} lineSeries   — Series de línea. `.lineSeries=${...}`.
 * @prop {string}        x-label      — Título del eje X.
 * @prop {string}        y-label      — Título del eje Y izquierdo.
 * @prop {string}        y-label-right— Título del eje Y derecho (con dual-axis).
 * @prop {boolean}       dual-axis    — Eje Y independiente para las líneas. Default false.
 * @prop {boolean}       smooth       — Suaviza las líneas.
 * @prop {boolean}       show-grid    — Rejilla de fondo. Default true.
 * @prop {boolean}       show-legend  — Leyenda. Default true.
 * @prop {number}        height       — Altura en px. Default 340.
 *
 * @example
 * <lib-combo-chart
 *   .categories=${['Ene','Feb','Mar']}
 *   .barSeries=${[{ name: 'Volumen', values: [120,145,132] }]}
 *   .lineSeries=${[{ name: 'Precio', values: [9.2,9.8,9.5] }]}
 *   dual-axis
 * ></lib-combo-chart>
 */
@customElement('lib-combo-chart')
export class LibComboChart extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(skeletonCss)}`,
    css`${unsafeCSS(componentCss)}`,
  ];

  @property({ type: Array })
  categories: string[] = [];

  @property({ type: Array })
  barSeries: ChartSeries[] = [];

  @property({ type: Array })
  lineSeries: ChartSeries[] = [];

  @property({ type: String, attribute: 'x-label' })
  xLabel = '';

  @property({ type: String, attribute: 'y-label' })
  yLabel = '';

  @property({ type: String, attribute: 'y-label-right' })
  yLabelRight = '';

  @property({ type: Boolean, attribute: 'dual-axis', reflect: true })
  dualAxis = false;

  @property({ type: Boolean, reflect: true })
  smooth = false;

  @property({ type: Boolean, attribute: 'show-grid', reflect: true })
  showGrid = true;

  @property({ type: Boolean, attribute: 'show-legend', reflect: true })
  showLegend = true;

  @property({ type: Number })
  height = 340;

  @state() private _tooltip: ChartTooltip | null = null;

  private readonly _resize = new ChartResizeController(this);

  private _handlePointEnter(e: MouseEvent, content: string, color: string): void {
    const wrapper = this.shadowRoot?.querySelector('.chart-wrapper') as HTMLElement | null;
    const anchor  = tooltipAnchor(wrapper, e.currentTarget as SVGElement);
    if (!anchor) return;
    this._tooltip = { ...anchor, content, color };
  }

  private _handlePointLeave(): void {
    this._tooltip = null;
  }

  override render(): TemplateResult {
    return comboChartTemplate({
      categories:   this.categories,
      barSeries:    this.barSeries,
      lineSeries:   this.lineSeries,
      colors:       SERIES_COLORS,
      xLabel:       this.xLabel,
      yLabel:       this.yLabel,
      yLabelRight:  this.yLabelRight,
      showGrid:     this.showGrid,
      showLegend:   this.showLegend,
      dualAxis:     this.dualAxis,
      smooth:       this.smooth,
      height:       this.height,
      svgWidth:     this._resize.width,
      tooltip:      this._tooltip,
      onPointEnter: (e, content, color) => { this._handlePointEnter(e, content, color); },
      onPointLeave: () => { this._handlePointLeave(); },
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-combo-chart': LibComboChart;
  }
}
