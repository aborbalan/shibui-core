import { LitElement, css, unsafeCSS, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import sharedTokens            from '../../../styles/shared/tokens.css?inline';
import skeletonCss             from '../../../shared/charts/chart-skeleton.css?inline';
import componentCss            from './lib-bubble-chart.css?inline';
import { bubbleChartTemplate } from './lib-bubble-chart.html';
import { SERIES_COLORS, seriesColor, ChartResizeController, tooltipAnchor } from '../../../shared/charts';
import type { ChartTooltip } from '../../../../models/ui/charts';
import type { BubblePoint, BubbleSeries } from './lib-bubble-chart.types';

/**
 * @element lib-bubble-chart
 *
 * Organismo de visualización: gráfica de burbujas SVG (scatter + 3ª dimensión).
 * Cada punto tiene `x`, `y` y `size`; el tamaño se mapea al **área** del círculo
 * (escala sqrt, perceptualmente correcta). Tooltip, leyenda y ejes compartidos
 * con el resto del módulo. Katachi-aware.
 *
 * @prop {BubbleSeries[]} series      — Series con puntos { x, y, size, label? }. `.series=${...}`.
 * @prop {string}         x-label     — Etiqueta del eje X.
 * @prop {string}         y-label     — Etiqueta del eje Y.
 * @prop {boolean}        show-grid   — Rejilla de fondo. Default true.
 * @prop {boolean}        show-legend — Leyenda con más de una serie. Default true.
 * @prop {number}         min-radius  — Radio mínimo en px. Default 4.
 * @prop {number}         max-radius  — Radio máximo en px. Default 28.
 * @prop {number}         height      — Altura en px. Default 360.
 *
 * @example
 * <lib-bubble-chart
 *   .series=${[{ name: 'Países', points: [{ x: 12, y: 80, size: 320, label: 'ES' }] }]}
 *   x-label="PIB per cápita"
 *   y-label="Esperanza de vida"
 * ></lib-bubble-chart>
 */
@customElement('lib-bubble-chart')
export class LibBubbleChart extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(skeletonCss)}`,
    css`${unsafeCSS(componentCss)}`,
  ];

  @property({ type: Array })
  series: BubbleSeries[] = [];

  @property({ type: String, attribute: 'x-label' })
  xLabel = '';

  @property({ type: String, attribute: 'y-label' })
  yLabel = '';

  @property({ type: Boolean, attribute: 'show-grid', reflect: true })
  showGrid = true;

  @property({ type: Boolean, attribute: 'show-legend', reflect: true })
  showLegend = true;

  @property({ type: Number, attribute: 'min-radius' })
  minRadius = 4;

  @property({ type: Number, attribute: 'max-radius' })
  maxRadius = 28;

  @property({ type: Number })
  height = 360;

  @state() private _tooltip: ChartTooltip | null = null;

  private readonly _resize = new ChartResizeController(this);

  private _handleDotEnter(e: MouseEvent, point: BubblePoint, seriesIndex: number): void {
    const wrapper = this.shadowRoot?.querySelector('.chart-wrapper') as HTMLElement | null;
    const anchor  = tooltipAnchor(wrapper, e.currentTarget as SVGCircleElement);
    if (!anchor) return;

    const parts = [point.label ?? null, `x: ${point.x}`, `y: ${point.y}`, `size: ${point.size}`].filter(Boolean);
    this._tooltip = { ...anchor, content: parts.join(' · '), color: seriesColor(seriesIndex) };
  }

  private _handleDotLeave(): void {
    this._tooltip = null;
  }

  override render(): TemplateResult {
    return bubbleChartTemplate({
      series:     this.series,
      colors:     SERIES_COLORS,
      xLabel:     this.xLabel,
      yLabel:     this.yLabel,
      showGrid:   this.showGrid,
      showLegend: this.showLegend,
      minRadius:  this.minRadius,
      maxRadius:  this.maxRadius,
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
    'lib-bubble-chart': LibBubbleChart;
  }
}
