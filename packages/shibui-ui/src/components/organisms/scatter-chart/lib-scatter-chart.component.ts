import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import sharedTokens             from '../../../styles/shared/tokens.css?inline';
import componentCss             from './lib-scatter-chart.css?inline';
import { scatterChartTemplate } from './lib-scatter-chart.html';
import type { ScatterSeries, ScatterPoint, ScatterTooltip } from './lib-scatter-chart.types';

/** Paleta de colores para las series — visualmente distintos en claro y oscuro. */
const SERIES_COLORS: readonly string[] = [
  'oklch(45.54% 0.059 173.23deg)',  /* celadon-500 */
  'oklch(51.65% 0.134  46.13deg)',  /* kaki-500    */
  'oklch(65%    0.15  300deg)',
  'oklch(55%    0.18  240deg)',
  'oklch(65%    0.12   60deg)',
  'oklch(60%    0.14    0deg)',
];

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

  @state() private _svgWidth = 600;
  @state() private _tooltip: ScatterTooltip | null = null;

  private _ro: ResizeObserver | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this._ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w !== undefined && Math.round(w) !== Math.round(this._svgWidth)) {
        this._svgWidth = w;
      }
    });
    this._ro.observe(this);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._ro?.disconnect();
    this._ro = null;
  }

  override firstUpdated(): void {
    this._svgWidth = this.clientWidth || 600;
  }

  private _handleDotEnter(e: MouseEvent, point: ScatterPoint, seriesIndex: number): void {
    const wrapper  = this.shadowRoot?.querySelector('.scatter-chart-wrapper') as HTMLElement | null;
    const dot      = e.currentTarget as SVGCircleElement;
    const wrapRect = wrapper?.getBoundingClientRect();
    const dotRect  = dot.getBoundingClientRect();

    if (!wrapRect) return;

    const color   = SERIES_COLORS[seriesIndex % SERIES_COLORS.length] ?? SERIES_COLORS[0]!;
    const parts   = [
      point.label ?? null,
      `x: ${point.x}`,
      `y: ${point.y}`,
    ].filter(Boolean);

    this._tooltip = {
      x:       dotRect.left - wrapRect.left + dotRect.width  / 2,
      y:       dotRect.top  - wrapRect.top,
      content: parts.join(' · '),
      color,
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
      svgWidth:   this._svgWidth,
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
