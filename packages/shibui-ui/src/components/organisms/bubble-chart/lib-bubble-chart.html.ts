import { html, svg, nothing, type TemplateResult } from 'lit';
import type { AxisInfo, ChartMargin } from '../../../../models/ui/charts';
import type { BubbleChartTemplateProps, BubblePoint, BubbleSeries } from './lib-bubble-chart.types';
import {
  niceAxis, linearScale,
  renderAxes, renderGrid, renderXTicks, renderYTicks,
  renderAxisTitles, renderEmptyState, renderTooltip, renderLegend,
} from '../../../shared/charts';

/* ─── Layout ─────────────────────────────────────────────── */
const M: ChartMargin = { top: 20, right: 20, bottom: 48, left: 56 };
const FALLBACK_AXIS: AxisInfo = { domain: [0, 1], ticks: [0, 0.25, 0.5, 0.75, 1] };

/* ─── Helpers ─────────────────────────────────────────────── */

interface Extents { xMin: number; xMax: number; yMin: number; yMax: number; sMin: number; sMax: number; }

function getExtents(series: BubbleSeries[]): Extents | null {
  const pts = series.flatMap(s => s.points);
  if (pts.length === 0) return null;
  return {
    xMin: Math.min(...pts.map(p => p.x)),
    xMax: Math.max(...pts.map(p => p.x)),
    yMin: Math.min(...pts.map(p => p.y)),
    yMax: Math.max(...pts.map(p => p.y)),
    sMin: Math.min(...pts.map(p => p.size)),
    sMax: Math.max(...pts.map(p => p.size)),
  };
}

/** Escala sqrt: el área del círculo (no el radio) es proporcional al valor. */
function radiusScale(sMin: number, sMax: number, minR: number, maxR: number): (s: number) => number {
  const span = sMax - sMin;
  return (s: number): number =>
    span <= 0 ? (minR + maxR) / 2 : minR + (maxR - minR) * Math.sqrt(Math.max(s - sMin, 0) / span);
}

/* ─── Marcas (burbujas) ───────────────────────────────────── */

function renderBubbles(
  series:  BubbleSeries[],
  colors:  readonly string[],
  rScale:  (s: number) => number,
  scaleX:  (v: number) => number,
  scaleY:  (v: number) => number,
  onEnter: (e: MouseEvent, p: BubblePoint, si: number) => void,
  onLeave: () => void,
): TemplateResult {
  /* mayor → menor para que las pequeñas queden encima y sean alcanzables */
  return svg`
    ${series.map((s, si) => svg`
      <g class="series">
        ${[...s.points].sort((a, b) => b.size - a.size).map(p => svg`
          <circle
            cx=${scaleX(p.x)}
            cy=${scaleY(p.y)}
            r=${rScale(p.size)}
            class="bubble"
            style="fill: ${colors[si % colors.length]}; stroke: ${colors[si % colors.length]}"
            @mouseenter=${(e: MouseEvent): void => { onEnter(e, p, si); }}
            @mouseleave=${(): void => { onLeave(); }}
          >${p.label ? svg`<title>${p.label}: (${p.x}, ${p.y}) · ${p.size}</title>` : nothing}</circle>
        `)}
      </g>
    `)}
  `;
}

/* ─── Template principal ──────────────────────────────────── */

export function bubbleChartTemplate(props: BubbleChartTemplateProps): TemplateResult {
  const {
    series, colors, xLabel, yLabel, showGrid, showLegend,
    minRadius, maxRadius, height, svgWidth, tooltip, onDotEnter, onDotLeave,
  } = props;

  const innerW  = Math.max(svgWidth - M.left - M.right, 0);
  const innerH  = Math.max(height   - M.top  - M.bottom, 0);
  const ext     = getExtents(series);
  const isEmpty = ext === null;

  const xInfo = isEmpty ? FALLBACK_AXIS : niceAxis(ext.xMin, ext.xMax);
  const yInfo = isEmpty ? FALLBACK_AXIS : niceAxis(ext.yMin, ext.yMax);

  const scaleX = linearScale(xInfo.domain, [M.left, M.left + innerW]);
  const scaleY = linearScale(yInfo.domain, [M.top + innerH, M.top]);
  const rScale = radiusScale(ext?.sMin ?? 0, ext?.sMax ?? 1, minRadius, maxRadius);

  return html`
    <div class="chart-wrapper">
      <svg
        class="chart-svg"
        width=${svgWidth}
        height=${height}
        role="img"
        aria-label="Bubble chart"
      >
        ${showGrid
          ? renderGrid({ m: M, innerW, innerH, yTicks: yInfo.ticks, scaleY, xTicks: xInfo.ticks, scaleX })
          : nothing}
        ${renderAxes(M, innerW, innerH)}
        ${renderXTicks(M, xInfo.ticks, scaleX, innerH)}
        ${renderYTicks(M, yInfo.ticks, scaleY)}
        ${renderAxisTitles(M, xLabel, yLabel, innerW, innerH, height, 6)}
        ${isEmpty
          ? renderEmptyState(M, innerW, innerH)
          : renderBubbles(series, colors, rScale, scaleX, scaleY, onDotEnter, onDotLeave)}
      </svg>
      ${renderTooltip(tooltip)}
      ${renderLegend(series.map(s => s.name), colors, showLegend, 'dot')}
    </div>
  `;
}
