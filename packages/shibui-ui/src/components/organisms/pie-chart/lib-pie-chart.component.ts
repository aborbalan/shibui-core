import { LitElement, css, unsafeCSS, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import sharedTokens        from '../../../styles/shared/tokens.css?inline';
import skeletonCss         from '../../../shared/charts/chart-skeleton.css?inline';
import componentCss        from './lib-pie-chart.css?inline';
import { pieChartTemplate } from './lib-pie-chart.html';
import { SERIES_COLORS, ChartResizeController } from '../../../shared/charts';
import type { ChartTooltip, PieSlice } from '../../../../models/ui/charts';

/**
 * @element lib-pie-chart
 *
 * Organismo de visualización: gráfica circular (tarta / donut) SVG nativa.
 * Una serie de porciones proporcionales, con tooltip, leyenda y etiquetas
 * de porcentaje opcionales. Con `inner-ratio > 0` se convierte en donut y el
 * hueco central admite un `center-label` o contenido vía slot `center`.
 * Katachi-aware — consume tokens semánticos.
 *
 * @prop {PieSlice[]} slices       — Porciones { label, value, color? }. Usar `.slices=${...}`.
 * @prop {number}     inner-ratio  — 0 = tarta; 0.5–0.7 = donut. Default 0.
 * @prop {boolean}    show-legend  — Muestra la leyenda. Default true.
 * @prop {boolean}    show-labels  — Muestra el % sobre cada porción. Default false.
 * @prop {string}     center-label — Texto en el hueco del donut.
 * @prop {number}     height       — Altura en px. Default 320.
 *
 * @slot center — Contenido del hueco del donut (tiene prioridad sobre center-label).
 *
 * @example
 * <lib-pie-chart
 *   .slices=${[
 *     { label: 'Chrome', value: 64 },
 *     { label: 'Safari', value: 19 },
 *     { label: 'Edge',   value: 9  },
 *   ]}
 *   inner-ratio="0.6"
 *   center-label="92%"
 *   show-legend
 * ></lib-pie-chart>
 */
@customElement('lib-pie-chart')
export class LibPieChart extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(skeletonCss)}`,
    css`${unsafeCSS(componentCss)}`,
  ];

  @property({ type: Array })
  slices: PieSlice[] = [];

  @property({ type: Number, attribute: 'inner-ratio', reflect: true })
  innerRatio = 0;

  @property({ type: Boolean, attribute: 'show-legend', reflect: true })
  showLegend = true;

  @property({ type: Boolean, attribute: 'show-labels', reflect: true })
  showLabels = false;

  @property({ type: String, attribute: 'center-label' })
  centerLabel = '';

  @property({ type: Number })
  height = 320;

  @state() private _tooltip: ChartTooltip | null = null;

  private readonly _resize = new ChartResizeController(this);

  private _handleSliceEnter(x: number, y: number, content: string, color: string): void {
    this._tooltip = { x, y, content, color };
  }

  private _handleSliceLeave(): void {
    this._tooltip = null;
  }

  override render(): TemplateResult {
    return pieChartTemplate({
      slices:       this.slices,
      colors:       SERIES_COLORS,
      innerRatio:   this.innerRatio,
      showLegend:   this.showLegend,
      showLabels:   this.showLabels,
      centerLabel:  this.centerLabel,
      height:       this.height,
      svgWidth:     this._resize.width,
      tooltip:      this._tooltip,
      onSliceEnter: (x, y, content, color) => { this._handleSliceEnter(x, y, content, color); },
      onSliceLeave: () => { this._handleSliceLeave(); },
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-pie-chart': LibPieChart;
  }
}
