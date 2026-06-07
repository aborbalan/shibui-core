import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import sharedTokens               from '../../../styles/shared/tokens.css?inline';
import componentCss               from './lib-scatter-chart-3d.css?inline';
import { scatterChart3dTemplate } from './lib-scatter-chart-3d.html';
import type { ScatterSeries3d, ScatterPoint3d, ScatterTooltip3d } from './lib-scatter-chart-3d.types';

const SERIES_COLORS: readonly string[] = [
  'oklch(45.54% 0.059 173.23deg)',  /* celadon-500 */
  'oklch(51.65% 0.134  46.13deg)',  /* kaki-500    */
  'oklch(65%    0.15  300deg)',
  'oklch(55%    0.18  240deg)',
  'oklch(65%    0.12   60deg)',
  'oklch(60%    0.14    0deg)',
];

interface DragStart {
  x:  number;
  y:  number;
  az: number;
  el: number;
}

/**
 * @element lib-scatter-chart-3d
 *
 * Organismo de visualización: gráfica de puntos en 3 ejes (X, Y, Z).
 * Proyección ortográfica rotable mediante arrastre con el mouse.
 * Katachi-aware — tokens semánticos heredados del contexto ancestro.
 *
 * @prop {ScatterSeries3d[]} series     — Series de datos 3D. Usar `.series=${...}`.
 * @prop {string}  x-label             — Etiqueta del eje X.
 * @prop {string}  y-label             — Etiqueta del eje Y.
 * @prop {string}  z-label             — Etiqueta del eje Z.
 * @prop {boolean} show-grid           — Muestra rejilla en el plano Z=0.
 * @prop {boolean} show-legend         — Muestra leyenda con las series.
 * @prop {number}  dot-radius          — Radio de cada punto en px. Default 5.
 * @prop {number}  height              — Altura del SVG en px. Default 420.
 *
 * @example
 * <lib-scatter-chart-3d
 *   .series=${[{ name: 'A', points: [{ x: 1, y: 2, z: 3 }] }]}
 *   x-label="Temperatura"
 *   y-label="Presión"
 *   z-label="Densidad"
 *   show-grid
 * ></lib-scatter-chart-3d>
 */
@customElement('lib-scatter-chart-3d')
export class LibScatterChart3d extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(componentCss)}`,
  ];

  @property({ type: Array })
  series: ScatterSeries3d[] = [];

  @property({ type: String, attribute: 'x-label' })
  xLabel = 'X';

  @property({ type: String, attribute: 'y-label' })
  yLabel = 'Y';

  @property({ type: String, attribute: 'z-label' })
  zLabel = 'Z';

  @property({ type: Boolean, attribute: 'show-grid', reflect: true })
  showGrid = true;

  @property({ type: Boolean, attribute: 'show-legend', reflect: true })
  showLegend = true;

  @property({ type: Number, attribute: 'dot-radius' })
  dotRadius = 5;

  @property({ type: Number })
  height = 420;

  @state() private _svgWidth  = 600;
  @state() private _tooltip: ScatterTooltip3d | null = null;
  @state() private _azimuth   = Math.PI / 4;   // 45°
  @state() private _elevation = Math.PI / 6;   // 30°
  @state() private _dragging  = false;

  private _dragStart: DragStart | null = null;
  private _ro: ResizeObserver | null   = null;

  private readonly _onMouseMove = (e: MouseEvent): void => { this._handleMouseMove(e); };
  private readonly _onMouseUp   = (): void            => { this._handleMouseUp(); };

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
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseup', this._onMouseUp);
  }

  override firstUpdated(): void {
    this._svgWidth = this.clientWidth || 600;
  }

  /* ─── Rotación por arrastre ──────────────────────────── */

  private _handleMouseDown(e: MouseEvent): void {
    e.preventDefault();
    this._dragging  = true;
    this._dragStart = { x: e.clientX, y: e.clientY, az: this._azimuth, el: this._elevation };
    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('mouseup', this._onMouseUp);
  }

  private _handleMouseMove(e: MouseEvent): void {
    if (!this._dragStart) return;
    const SENS  = 0.005;
    const dAz   = (e.clientX - this._dragStart.x) * SENS;
    const dEl   = (e.clientY - this._dragStart.y) * SENS;
    this._azimuth   = this._dragStart.az + dAz;
    this._elevation = Math.max(
      -Math.PI / 2 + 0.02,
      Math.min(Math.PI / 2 - 0.02, this._dragStart.el - dEl),
    );
  }

  private _handleMouseUp(): void {
    this._dragging  = false;
    this._dragStart = null;
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseup', this._onMouseUp);
  }

  /* ─── Tooltip ────────────────────────────────────────── */

  private _handleDotEnter(
    e: MouseEvent,
    point: ScatterPoint3d,
    seriesIndex: number,
    color: string,
  ): void {
    const wrapper  = this.shadowRoot?.querySelector('.scatter3d-wrapper') as HTMLElement | null;
    const dot      = e.currentTarget as SVGCircleElement;
    const wrapRect = wrapper?.getBoundingClientRect();
    const dotRect  = dot.getBoundingClientRect();

    if (!wrapRect) return;

    const sName = this.series[seriesIndex]?.name ?? '';
    const parts = [
      sName || null,
      point.label ?? null,
      `x: ${point.x}`,
      `y: ${point.y}`,
      `z: ${point.z}`,
    ].filter(Boolean);

    this._tooltip = {
      svgX:    dotRect.left - wrapRect.left + dotRect.width / 2,
      svgY:    dotRect.top  - wrapRect.top,
      content: parts.join(' · '),
      color,
    };
  }

  private _handleDotLeave(): void {
    this._tooltip = null;
  }

  override render(): TemplateResult {
    return scatterChart3dTemplate({
      series:      this.series,
      colors:      SERIES_COLORS,
      xLabel:      this.xLabel,
      yLabel:      this.yLabel,
      zLabel:      this.zLabel,
      showGrid:    this.showGrid,
      showLegend:  this.showLegend,
      dotRadius:   this.dotRadius,
      height:      this.height,
      svgWidth:    this._svgWidth,
      tooltip:     this._tooltip,
      azimuth:     this._azimuth,
      elevation:   this._elevation,
      isDragging:  this._dragging,
      onMouseDown: (e) => { this._handleMouseDown(e); },
      onDotEnter:  (e, p, si, c) => { this._handleDotEnter(e, p, si, c); },
      onDotLeave:  () => { this._handleDotLeave(); },
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-scatter-chart-3d': LibScatterChart3d;
  }
}
