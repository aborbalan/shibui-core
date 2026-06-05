import { html, svg, nothing, type TemplateResult } from 'lit';
import type { AxisInfo, ChartMargin, ChartPoint, ChartPointSeries } from '../../../../models/ui/charts';
import type { ScatterChartTemplateProps } from './lib-scatter-chart.types';
import {
  niceAxis, linearScale,
  renderAxes, renderGrid, renderXTicks, renderYTicks,
  renderAxisTitles, renderEmptyState, renderTooltip, renderLegend,
} from '../../../shared/charts';

/* ─── Layout ─────────────────────────────────────────────── */
const M: ChartMargin = { top: 20, right: 20, bottom: 48, left: 56 };

const FALLBACK_AXIS: AxisInfo = {
  domain: [0, 1],
  ticks:  [0, 0.25, 0.5, 0.75, 1],
};

/* ─── Helpers ─────────────────────────────────────────────── */

function getDataExtents(
  series: ChartPointSeries[],
): { xMin: number; xMax: number; yMin: number; yMax: number } | null {
  const xs = series.flatMap(s => s.points.map(p => p.x));
  const ys = series.flatMap(s => s.points.map(p => p.y));
  if (xs.length === 0) return null;
  return {
    xMin: Math.min(...xs),
    xMax: Math.max(...xs),
    yMin: Math.min(...ys),
    yMax: Math.max(...ys),
  };
}

/* ─── Marcas (puntos) ─────────────────────────────────────── */

function renderDots(
  series:    ChartPointSeries[],
  colors:    readonly string[],
  dotRadius: number,
  scaleX:    (v: number) => number,
  scaleY:    (v: number) => number,
  onEnter:   (e: MouseEvent, p: ChartPoint, si: number) => void,
  onLeave:   () => void,
): TemplateResult {
  return svg`
    ${series.map((s, si) => svg`
      <g class="series">
        ${s.points.map(p => svg`
          <circle
            cx=${scaleX(p.x)}
            cy=${scaleY(p.y)}
            r=${dotRadius}
            class="dot"
            style="fill: ${colors[si % colors.length]}"
            @mouseenter=${(e: MouseEvent): void => { onEnter(e, p, si); }}
            @mouseleave=${(): void => { onLeave(); }}
          >${p.label ? svg`<title>${p.label}: (${p.x}, ${p.y})</title>` : nothing}</circle>
        `)}
      </g>
    `)}
  `;
}

/* ─── Template principal ──────────────────────────────────── */

export function scatterChartTemplate(props: ScatterChartTemplateProps): TemplateResult {
  const {
    series, colors, xLabel, yLabel, showGrid, showLegend,
    dotRadius, height, svgWidth, tooltip, onDotEnter, onDotLeave,
  } = props;

  const innerW  = Math.max(svgWidth - M.left - M.right, 0);
  const innerH  = Math.max(height   - M.top  - M.bottom, 0);
  const extents = getDataExtents(series);
  const isEmpty = extents === null;

  const xInfo  = isEmpty ? FALLBACK_AXIS : niceAxis(extents.xMin, extents.xMax);
  const yInfo  = isEmpty ? FALLBACK_AXIS : niceAxis(extents.yMin, extents.yMax);

  const scaleX = linearScale(xInfo.domain, [M.left, M.left + innerW]);
  const scaleY = linearScale(yInfo.domain, [M.top + innerH, M.top]);

  return html`
    <div class="chart-wrapper">
      <svg
        class="chart-svg"
        width=${svgWidth}
        height=${height}
        role="img"
        aria-label="Scatter chart"
      >
        ${showGrid
          ? renderGrid({ m: M, innerW, innerH, yTicks: yInfo.ticks, scaleY, xTicks: xInfo.ticks, scaleX })
          : nothing}
        ${renderAxes(M, innerW, innerH)}
        ${renderXTicks(M, xInfo.ticks, scaleX, innerH)}
        ${renderYTicks(M, yInfo.ticks, scaleY)}
        ${renderAxisTitles(M, xLabel, yLabel, innerW, innerH, height)}
        ${isEmpty
          ? renderEmptyState(M, innerW, innerH)
          : renderDots(series, colors, dotRadius, scaleX, scaleY, onDotEnter, onDotLeave)}
      </svg>
      ${renderTooltip(tooltip)}
      ${renderLegend(series.map(s => s.name), colors, showLegend, 'dot')}
    </div>
  `;
}
