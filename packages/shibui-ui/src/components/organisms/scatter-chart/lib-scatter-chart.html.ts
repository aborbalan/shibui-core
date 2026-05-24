import { html, svg, nothing, TemplateResult } from 'lit';
import type { ScatterChartTemplateProps, ScatterPoint, ScatterSeries, ScatterTooltip } from './lib-scatter-chart.types';

/* ─── Layout ─────────────────────────────────────────────── */
const M           = { top: 20, right: 20, bottom: 48, left: 56 } as const;
const TICK_COUNT  = 5;

/* ─── Helpers ─────────────────────────────────────────────── */

interface AxisInfo {
  domain: [number, number];
  ticks:  number[];
}

/** Genera ticks "redondos" para un eje y devuelve el dominio ajustado. */
function computeAxis(dataMin: number, dataMax: number): AxisInfo {
  const range = dataMax - dataMin;
  if (range === 0) {
    const center = dataMin;
    return { domain: [center - 1, center + 1], ticks: [center - 1, center, center + 1] };
  }

  const pad      = range * 0.05;
  const lo       = dataMin - pad;
  const hi       = dataMax + pad;
  const rawStep  = (hi - lo) / TICK_COUNT;
  const mag      = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm     = rawStep / mag;
  const niceNorm = norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10;
  const step     = niceNorm * mag;
  const niceMin  = Math.floor(lo / step) * step;
  const niceMax  = Math.ceil(hi  / step) * step;

  const ticks: number[] = [];
  for (let t = niceMin; t <= niceMax + step * 0.001; t += step) {
    ticks.push(parseFloat(t.toPrecision(10)));
  }
  return { domain: [niceMin, niceMax], ticks };
}

function formatTick(v: number): string {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000)     return `${(v / 1_000).toFixed(1)}k`;
  return Number.isInteger(v) ? String(v) : v.toPrecision(3);
}

function getDataExtents(
  series: ScatterSeries[],
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

/* ─── Sub-templates SVG ───────────────────────────────────── */

function renderGrid(
  xTicks:  number[],
  yTicks:  number[],
  scaleX:  (v: number) => number,
  scaleY:  (v: number) => number,
  innerH:  number,
  innerW:  number,
): TemplateResult {
  return svg`
    <g class="grid">
      ${yTicks.map(t => svg`
        <line
          x1=${M.left}           x2=${M.left + innerW}
          y1=${scaleY(t)}        y2=${scaleY(t)}
          class="grid-line"
        />
      `)}
      ${xTicks.map(t => svg`
        <line
          x1=${scaleX(t)}  x2=${scaleX(t)}
          y1=${M.top}      y2=${M.top + innerH}
          class="grid-line"
        />
      `)}
    </g>
  `;
}

function renderAxes(
  innerW: number,
  innerH: number,
): TemplateResult {
  return svg`
    <g class="axes">
      <line
        x1=${M.left}            x2=${M.left + innerW}
        y1=${M.top + innerH}    y2=${M.top + innerH}
        class="axis-line"
      />
      <line
        x1=${M.left}  x2=${M.left}
        y1=${M.top}   y2=${M.top + innerH}
        class="axis-line"
      />
    </g>
  `;
}

function renderXTicks(
  ticks:  number[],
  scaleX: (v: number) => number,
  innerH: number,
): TemplateResult {
  return svg`
    <g class="x-ticks">
      ${ticks.map(t => svg`
        <g transform="translate(${scaleX(t)}, ${M.top + innerH})">
          <line x1="0" x2="0" y1="0" y2="5" class="tick-line" />
          <text x="0" y="18" text-anchor="middle" class="tick-label">${formatTick(t)}</text>
        </g>
      `)}
    </g>
  `;
}

function renderYTicks(
  ticks:  number[],
  scaleY: (v: number) => number,
): TemplateResult {
  return svg`
    <g class="y-ticks">
      ${ticks.map(t => svg`
        <g transform="translate(${M.left}, ${scaleY(t)})">
          <line x1="0" x2="-5" y1="0" y2="0" class="tick-line" />
          <text x="-9" y="4" text-anchor="end" class="tick-label">${formatTick(t)}</text>
        </g>
      `)}
    </g>
  `;
}

function renderAxisLabels(
  xLabel:  string,
  yLabel:  string,
  innerW:  number,
  innerH:  number,
  height:  number,
): TemplateResult {
  return svg`
    ${xLabel ? svg`
      <text
        x=${M.left + innerW / 2}
        y=${height - 6}
        text-anchor="middle"
        class="axis-label"
      >${xLabel}</text>
    ` : nothing}
    ${yLabel ? svg`
      <text
        transform="rotate(-90)"
        x=${-(M.top + innerH / 2)}
        y="14"
        text-anchor="middle"
        class="axis-label"
      >${yLabel}</text>
    ` : nothing}
  `;
}

function renderDots(
  series:     ScatterSeries[],
  colors:     readonly string[],
  dotRadius:  number,
  scaleX:     (v: number) => number,
  scaleY:     (v: number) => number,
  onEnter:    (e: MouseEvent, p: ScatterPoint, si: number) => void,
  onLeave:    () => void,
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

/* ─── HTML sub-templates ──────────────────────────────────── */

function renderTooltip(tooltip: ScatterTooltip | null): TemplateResult {
  if (!tooltip) return html`${nothing}`;
  return html`
    <div
      class="scatter-tooltip"
      style="left: ${tooltip.x}px; top: ${tooltip.y}px;"
    >
      <span class="tooltip-dot" style="background: ${tooltip.color}"></span>
      <span class="tooltip-content">${tooltip.content}</span>
    </div>
  `;
}

function renderLegend(
  series: ScatterSeries[],
  colors: readonly string[],
  show:   boolean,
): TemplateResult {
  if (!show || series.length < 2) return html`${nothing}`;
  return html`
    <div class="scatter-legend">
      ${series.map((s, si) => html`
        <span class="legend-item">
          <span class="legend-dot" style="background: ${colors[si % colors.length]}"></span>
          <span class="legend-name">${s.name}</span>
        </span>
      `)}
    </div>
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

  const fallbackAxis: AxisInfo = {
    domain: [0, 1],
    ticks:  [0, 0.25, 0.5, 0.75, 1],
  };

  const xInfo  = isEmpty ? fallbackAxis : computeAxis(extents.xMin, extents.xMax);
  const yInfo  = isEmpty ? fallbackAxis : computeAxis(extents.yMin, extents.yMax);
  const [xLo, xHi] = xInfo.domain;
  const [yLo, yHi] = yInfo.domain;

  const scaleX = (x: number): number =>
    M.left + ((x - xLo) / (xHi - xLo)) * innerW;

  const scaleY = (y: number): number =>
    M.top + (1 - (y - yLo) / (yHi - yLo)) * innerH;

  return html`
    <div class="scatter-chart-wrapper">
      <svg
        class="scatter-chart-svg"
        width=${svgWidth}
        height=${height}
        role="img"
        aria-label="Scatter chart"
      >
        ${showGrid ? renderGrid(xInfo.ticks, yInfo.ticks, scaleX, scaleY, innerH, innerW) : nothing}
        ${renderAxes(innerW, innerH)}
        ${renderXTicks(xInfo.ticks, scaleX, innerH)}
        ${renderYTicks(yInfo.ticks, scaleY)}
        ${renderAxisLabels(xLabel, yLabel, innerW, innerH, height)}
        ${isEmpty
          ? svg`
              <text
                x=${M.left + innerW / 2}
                y=${M.top  + innerH / 2}
                text-anchor="middle"
                class="empty-label"
              >Sin datos</text>
            `
          : renderDots(series, colors, dotRadius, scaleX, scaleY, onDotEnter, onDotLeave)
        }
      </svg>
      ${renderTooltip(tooltip)}
      ${renderLegend(series, colors, showLegend)}
    </div>
  `;
}
