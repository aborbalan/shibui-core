import { LitElement, css, unsafeCSS, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import sharedTokens           from '../../../styles/shared/tokens.css?inline';
import skeletonCss            from '../../../shared/charts/chart-skeleton.css?inline';
import componentCss           from './lib-radar-chart.css?inline';
import { radarChartTemplate } from './lib-radar-chart.html';
import { SERIES_COLORS, ChartResizeController, niceAxis, groupedMax } from '../../../shared/charts';
import type { ChartSeries, ChartTooltip } from '../../../../models/ui/charts';

/**
 * @element lib-radar-chart
 *
 * Organismo de visualización: gráfica radar / spider SVG nativa. Compara
 * varias series sobre ejes radiales compartidos (skills, perfiles, scores).
 * Rejilla de anillos concéntricos, polígonos con relleno, vértices con
 * tooltip y leyenda. Katachi-aware — rejilla y ejes usan tokens semánticos.
 *
 * @prop {string[]}     axes        — Etiquetas de los ejes. Usar binding `.axes=${...}`.
 * @prop {ChartSeries[]} series     — Series { name, values }. `.series=${...}`.
 * @prop {number}       max         — Máximo radial. 0 = auto (nice sobre los datos).
 * @prop {number}       levels      — Anillos concéntricos. Default 4.
 * @prop {boolean}      show-legend — Leyenda con más de una serie. Default true.
 * @prop {boolean}      show-dots   — Vértices con tooltip. Default true.
 * @prop {number}       fill-opacity— Opacidad de relleno de cada polígono. Default 0.15.
 * @prop {number}       height      — Altura en px. Default 320.
 *
 * @example
 * <lib-radar-chart
 *   .axes=${['Velocidad','Potencia','Alcance','Defensa','Magia']}
 *   .series=${[{ name: 'Héroe', values: [8, 6, 7, 5, 9] }]}
 * ></lib-radar-chart>
 */
@customElement('lib-radar-chart')
export class LibRadarChart extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(skeletonCss)}`,
    css`${unsafeCSS(componentCss)}`,
  ];

  @property({ type: Array })
  axes: string[] = [];

  @property({ type: Array })
  series: ChartSeries[] = [];

  @property({ type: Number })
  max = 0;

  @property({ type: Number })
  levels = 4;

  @property({ type: Boolean, attribute: 'show-legend', reflect: true })
  showLegend = true;

  @property({ type: Boolean, attribute: 'show-dots', reflect: true })
  showDots = true;

  @property({ type: Number, attribute: 'fill-opacity' })
  fillOpacity = 0.15;

  @property({ type: Number })
  height = 320;

  @state() private _tooltip: ChartTooltip | null = null;

  private readonly _resize = new ChartResizeController(this);

  private get _domainMax(): number {
    if (this.max > 0) return this.max;
    return niceAxis(0, groupedMax(this.series), { zeroAnchored: true }).domain[1] || 1;
  }

  private _handleVertexEnter(x: number, y: number, content: string, color: string): void {
    this._tooltip = { x, y, content, color };
  }

  private _handleVertexLeave(): void {
    this._tooltip = null;
  }

  override render(): TemplateResult {
    return radarChartTemplate({
      axes:          this.axes,
      series:        this.series,
      colors:        SERIES_COLORS,
      max:           this._domainMax,
      levels:        Math.max(this.levels, 1),
      showLegend:    this.showLegend,
      showDots:      this.showDots,
      fillOpacity:   this.fillOpacity,
      height:        this.height,
      svgWidth:      this._resize.width,
      tooltip:       this._tooltip,
      onVertexEnter: (x, y, content, color) => { this._handleVertexEnter(x, y, content, color); },
      onVertexLeave: () => { this._handleVertexLeave(); },
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-radar-chart': LibRadarChart;
  }
}
