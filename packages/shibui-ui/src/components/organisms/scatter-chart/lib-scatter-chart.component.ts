import { LitElement, css, unsafeCSS, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import sharedTokens             from '../../../styles/shared/tokens.css?inline';
import skeletonCss              from '../../../shared/charts/chart-skeleton.css?inline';
import componentCss             from './lib-scatter-chart.css?inline';
import { scatterChartTemplate } from './lib-scatter-chart.html';
import { SERIES_COLORS, seriesColor, ChartResizeController, tooltipAnchor } from '../../../shared/charts';
import type { ChartPoint, ChartTooltip } from '../../../../models/ui/charts';
import type { ScatterSeries } from './lib-scatter-chart.types';

/**
 * @element lib-scatter-chart
 *
 * Organismo de visualización: gráfica de puntos (scatter plot) SVG nativa.
 * Soporta múltiples series, tooltip interactivo y leyenda.
 * Katachi-aware — ejes, rejilla y etiquetas consumen tokens semánticos.
 *
 * @prop {ScatterSeries[]} series      — Array de series de datos. Usar binding `.series=${...}`.
 * @prop {string}          x-label    — Etiqueta del eje X.
 * @prop {string}          y-label    — Etiqueta del eje Y.
 * @prop {boolean}         show-grid  — Muestra la rejilla de fondo.
 * @prop {boolean}         show-legend — Muestra la leyenda cuando hay más de una serie.
 * @prop {number}          dot-radius — Radio en px de cada punto. Default 5.
 * @prop {number}          height     — Altura en px del gráfico. Default 320.
 *
 * @example
 * <lib-scatter-chart
 *   .series=${[
 *     { name: 'Grupo A', points: [{ x: 1, y: 2 }, { x: 3, y: 4 }] },
 *     { name: 'Grupo B', points: [{ x: 2, y: 5 }, { x: 4, y: 1 }] },
 *   ]}
 *   x-label="Temperatura"
 *   y-label="Presión"
 *   show-grid
 *   show-legend
 * ></lib-scatter-chart>
 */
@customElement('lib-scatter-chart')
export class LibScatterChart extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(skeletonCss)}`,
    css`${unsafeCSS(componentCss)}`,
  ];

  @property({ type: Array })
  series: ScatterSeries[] = [];

  @property({ type: String, attribute: 'x-label' })
  xLabel = '';

  @property({ type: String, attribute: 'y-label' })
  yLabel = '';

  @property({ type: Boolean, attribute: 'show-grid', reflect: true })
  showGrid = true;

  @property({ type: Boolean, attribute: 'show-legend', reflect: true })
  showLegend = true;

  @property({ type: Number, attribute: 'dot-radius' })
  dotRadius = 5;

  @property({ type: Number })
  height = 320;

  @state() private _tooltip: ChartTooltip | null = null;

  private readonly _resize = new ChartResizeController(this);

  private _handleDotEnter(e: MouseEvent, point: ChartPoint, seriesIndex: number): void {
    const wrapper = this.shadowRoot?.querySelector('.chart-wrapper') as HTMLElement | null;
    const anchor  = tooltipAnchor(wrapper, e.currentTarget as SVGCircleElement);
    if (!anchor) return;

    const parts = [point.label ?? null, `x: ${point.x}`, `y: ${point.y}`].filter(Boolean);

    this._tooltip = {
      ...anchor,
      content: parts.join(' · '),
      color:   seriesColor(seriesIndex),
    };
  }

  private _handleDotLeave(): void {
    this._tooltip = null;
  }

  override render(): TemplateResult {
    return scatterChartTemplate({
      series:     this.series,
      colors:     SERIES_COLORS,
      xLabel:     this.xLabel,
      yLabel:     this.yLabel,
      showGrid:   this.showGrid,
      showLegend: this.showLegend,
      dotRadius:  this.dotRadius,
      height:     this.height,
      svgWidth:   this._resize.width,
      tooltip:    this._tooltip,
      onDotEnter: (e, point, si) => { this._handleDotEnter(e, point, si); },
      onDotLeave: () => { this._handleDotLeave(); },
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-scatter-chart': LibScatterChart;
  }
}
