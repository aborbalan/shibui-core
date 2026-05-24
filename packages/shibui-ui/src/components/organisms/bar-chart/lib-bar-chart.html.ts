import { html, svg, nothing, TemplateResult } from 'lit';
import type { BarChartTemplateProps, BarSeries, BarTooltip } from './lib-bar-chart.types';

/* ─── Layout ─────────────────────────────────────────────── */
const M          = { top: 20, right: 20, bottom: 60, left: 56 } as const;
const TICK_COUNT = 5;
const BAR_RX     = 2; /* radio de esquinas */

/* ─── Helpers ─────────────────────────────────────────────── */

interface YAxisInfo {
  yMax:  number;
  ticks: number[];
}

/** Calcula el yMax y los ticks del eje Y con escala "redonda". */
function computeYAxis(rawMax: number): YAxisInfo {
  if (rawMax <= 0) return { yMax: 10, ticks: [0, 2, 4, 6, 8, 10] };

  const rawStep  = rawMax / TICK_COUNT;
  const mag      = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm     = rawStep / mag;
  const niceNorm = norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10;
  const step     = niceNorm * mag;
  const yMax     = Math.ceil(rawMax / step) * step;

  const ticks: number[] = [];
  for (let t = 0; t <= yMax + step * 0.001; t += step) {
    ticks.push(parseFloat(t.toPrecision(10)));
  }
  return { yMax, ticks };
}

function formatTick(v: number): string {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000)     return `${(v / 1_000).toFixed(1)}k`;
  return Number.isInteger(v) ? String(v) : v.toPrecision(3);
}

/** Trunca una etiqueta larga para el eje X. */
function truncate(label: string, max = 10): string {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}

/** Valor máximo agrupado (el mayor valor individual de todas las series). */
function computeGroupedMax(series: BarSeries[]): number {
  return Math.max(0, ...series.flatMap(s => s.values));
}

/** Valor máximo apilado (la mayor suma de valores por categoría). */
function computeStackedMax(series: BarSeries[], numCategories: number): number {
  let max = 0;
  for (let ci = 0; ci < numCategories; ci++) {
    const sum = series.reduce((acc, s) => acc + (s.values[ci] ?? 0), 0);
    if (sum > max) max = sum;
  }
  return max;
}

/* ─── Sub-templates SVG ───────────────────────────────────── */

function renderGrid(
  ticks:  number[],
  yMax:   number,
  innerW: number,
  innerH: number,
  scaleY: (v: number) => number,
): TemplateResult {
  return svg`
    <g class="grid">
      ${ticks.filter(t => t > 0).map(t => svg`
        <line
          x1=${M.left}            x2=${M.left + innerW}
          y1=${scaleY(t / yMax)}  y2=${scaleY(t / yMax)}
          class="grid-line"
        />
      `)}
    </g>
  `;
}

function renderAxes(innerW: number, innerH: number): TemplateResult {
  return svg`
    <g class="axes">
      <line
        x1=${M.left}           x2=${M.left + innerW}
        y1=${M.top + innerH}   y2=${M.top + innerH}
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

function renderYTicks(
  ticks:  number[],
  yMax:   number,
  scaleY: (v: number) => number,
): TemplateResult {
  return svg`
    <g class="y-ticks">
      ${ticks.map(t => svg`
        <g transform="translate(${M.left}, ${scaleY(t / yMax)})">
          <line x1="0" x2="-5" y1="0" y2="0" class="tick-line" />
          <text x="-9" y="4" text-anchor="end" class="tick-label">${formatTick(t)}</text>
        </g>
      `)}
    </g>
  `;
}

function renderXLabels(
  categories: string[],
  groupWidth: number,
  innerH:     number,
): TemplateResult {
  return svg`
    <g class="x-labels">
      ${categories.map((cat, ci) => svg`
        <text
          x=${M.left + ci * groupWidth + groupWidth / 2}
          y=${M.top + innerH + 18}
          text-anchor="middle"
          class="tick-label x-label"
        >${truncate(cat)}</text>
      `)}
    </g>
  `;
}

function renderAxisTitles(
  xLabel: string,
  yLabel: string,
  innerW: number,
  innerH: number,
  height: number,
): TemplateResult {
  return svg`
    ${xLabel ? svg`
      <text
        x=${M.left + innerW / 2}
        y=${height - 8}
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

function renderGroupedBars(
  series:     BarSeries[],
  categories: string[],
  colors:     readonly string[],
  yMax:       number,
  groupWidth: number,
  innerH:     number,
  scaleY:     (ratio: number) => number,
  onEnter:    (e: MouseEvent, si: number, ci: number, v: number) => void,
  onLeave:    () => void,
): TemplateResult {
  const numSeries   = series.length;
  const groupPad    = groupWidth * 0.15;
  const barGroupW   = groupWidth - groupPad * 2;
  const barSlotW    = numSeries > 0 ? barGroupW / numSeries : barGroupW;
  const barSpacing  = barSlotW * 0.08;
  const barW        = Math.max(barSlotW - barSpacing, 1);
  const axisY       = M.top + innerH;

  return svg`
    ${series.map((s, si) => svg`
      <g class="series-group">
        ${categories.map((_cat, ci) => {
          const value  = s.values[ci] ?? 0;
          const ratio  = yMax > 0 ? value / yMax : 0;
          const barTop = scaleY(ratio);
          const barH   = Math.max(axisY - barTop, 0);
          const x      = M.left + ci * groupWidth + groupPad + si * barSlotW + barSpacing / 2;

          return svg`
            <rect
              x=${x}
              y=${barTop}
              width=${barW}
              height=${barH}
              rx=${BAR_RX}
              class="bar"
              style="fill: ${colors[si % colors.length]}"
              @mouseenter=${(e: MouseEvent): void => { onEnter(e, si, ci, value); }}
              @mouseleave=${(): void => { onLeave(); }}
            />
          `;
        })}
      </g>
    `)}
  `;
}

function renderStackedBars(
  series:     BarSeries[],
  categories: string[],
  colors:     readonly string[],
  yMax:       number,
  groupWidth: number,
  innerH:     number,
  scaleY:     (ratio: number) => number,
  onEnter:    (e: MouseEvent, si: number, ci: number, v: number) => void,
  onLeave:    () => void,
): TemplateResult {
  const groupPad = groupWidth * 0.2;
  const barW     = Math.max(groupWidth - groupPad * 2, 1);
  const barX     = (ci: number): number => M.left + ci * groupWidth + groupPad;
  const axisY    = M.top + innerH;

  return svg`
    ${categories.map((_cat, ci) => {
      let cumulative = 0;
      return svg`
        <g class="stack-group">
          ${series.map((s, si) => {
            const value    = s.values[ci] ?? 0;
            const base     = cumulative;
            cumulative    += value;
            const barTop   = scaleY(cumulative / (yMax || 1));
            const baseY    = Math.min(scaleY(base / (yMax || 1)), axisY);
            const barH     = Math.max(baseY - barTop, 0);

            return svg`
              <rect
                x=${barX(ci)}
                y=${barTop}
                width=${barW}
                height=${barH}
                rx=${si === series.length - 1 ? BAR_RX : 0}
                class="bar"
                style="fill: ${colors[si % colors.length]}"
                @mouseenter=${(e: MouseEvent): void => { onEnter(e, si, ci, value); }}
                @mouseleave=${(): void => { onLeave(); }}
              />
            `;
          })}
        </g>
      `;
    })}
  `;
}

/* ─── HTML sub-templates ──────────────────────────────────── */

function renderTooltip(tooltip: BarTooltip | null): TemplateResult {
  if (!tooltip) return html`${nothing}`;
  return html`
    <div
      class="bar-tooltip"
      style="left: ${tooltip.x}px; top: ${tooltip.y}px;"
    >
      <span class="tooltip-dot" style="background: ${tooltip.color}"></span>
      <span class="tooltip-content">${tooltip.content}</span>
    </div>
  `;
}

function renderLegend(
  series: BarSeries[],
  colors: readonly string[],
  show:   boolean,
): TemplateResult {
  if (!show || series.length < 2) return html`${nothing}`;
  return html`
    <div class="bar-legend">
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

export function barChartTemplate(props: BarChartTemplateProps): TemplateResult {
  const {
    series, categories, colors, xLabel, yLabel,
    showGrid, showLegend, mode, height, svgWidth,
    tooltip, onBarEnter, onBarLeave,
  } = props;

  const innerW    = Math.max(svgWidth - M.left - M.right, 0);
  const innerH    = Math.max(height   - M.top  - M.bottom, 0);
  const isEmpty   = series.length === 0 || categories.length === 0;
  const numCats   = Math.max(categories.length, 1);
  const groupW    = innerW / numCats;

  const rawMax    = mode === 'stacked'
    ? computeStackedMax(series, categories.length)
    : computeGroupedMax(series);

  const { yMax, ticks } = computeYAxis(rawMax);

  /* Escala Y: recibe ratio 0..1, devuelve coordenada SVG (arriba = 0, abajo = M.top+innerH) */
  const scaleY = (ratio: number): number => M.top + (1 - ratio) * innerH;

  return html`
    <div class="bar-chart-wrapper">
      <svg
        class="bar-chart-svg"
        width=${svgWidth}
        height=${height}
        role="img"
        aria-label="Bar chart"
      >
        ${showGrid && !isEmpty ? renderGrid(ticks, yMax, innerW, innerH, scaleY) : nothing}
        ${renderAxes(innerW, innerH)}
        ${renderYTicks(ticks, yMax, scaleY)}
        ${renderXLabels(categories, groupW, innerH)}
        ${renderAxisTitles(xLabel, yLabel, innerW, innerH, height)}
        ${isEmpty
          ? svg`
              <text
                x=${M.left + innerW / 2}
                y=${M.top  + innerH / 2}
                text-anchor="middle"
                class="empty-label"
              >Sin datos</text>
            `
          : mode === 'stacked'
            ? renderStackedBars(series, categories, colors, yMax, groupW, innerH, scaleY, onBarEnter, onBarLeave)
            : renderGroupedBars(series, categories, colors, yMax, groupW, innerH, scaleY, onBarEnter, onBarLeave)
        }
      </svg>
      ${renderTooltip(tooltip)}
      ${renderLegend(series, colors, showLegend)}
    </div>
  `;
}
