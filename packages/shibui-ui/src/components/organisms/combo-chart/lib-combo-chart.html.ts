import { html, svg, nothing, type TemplateResult } from 'lit';
import type { ChartMargin, ChartSeries, LegendShape } from '../../../../models/ui/charts';
import type { ComboChartTemplateProps } from './lib-combo-chart.types';
import {
  niceAxis, linearScale, bandScale, groupedMax, formatTick,
  renderAxes, renderGrid, renderYTicks, renderBandLabels,
  renderAxisTitles, renderEmptyState, renderTooltip,
} from '../../../shared/charts';

/* ─── Layout ─────────────────────────────────────────────── */
const BAR_RX = 2;

interface Mark { cx: number; cy: number; }

/* ─── Path builder (línea recta o suave) ─────────────────── */
function linePath(pts: Mark[], smooth: boolean): string {
  if (pts.length === 0) return '';
  if (!smooth || pts.length < 3) {
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.cx} ${p.cy}`).join(' ');
  }
  let d = `M ${pts[0]!.cx} ${pts[0]!.cy}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]!;
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.cx + (p2.cx - p0.cx) / 6;
    const c1y = p1.cy + (p2.cy - p0.cy) / 6;
    const c2x = p2.cx - (p3.cx - p1.cx) / 6;
    const c2y = p2.cy - (p3.cy - p1.cy) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.cx} ${p2.cy}`;
  }
  return d;
}

/* ─── Eje Y derecho (solo dualAxis) ───────────────────────── */
function renderRightYTicks(
  m:      ChartMargin,
  innerW: number,
  ticks:  number[],
  scaleY: (v: number) => number,
): TemplateResult {
  const xRight = m.left + innerW;
  return svg`
    <g class="y-ticks">
      ${ticks.map(t => svg`
        <g transform="translate(${xRight}, ${scaleY(t)})">
          <line x1="0" x2="5" y1="0" y2="0" class="tick-line" />
          <text x="9" y="4" text-anchor="start" class="tick-label">${formatTick(t)}</text>
        </g>
      `)}
    </g>
  `;
}

/* ─── Marcas ──────────────────────────────────────────────── */

function renderBars(
  barSeries:  ChartSeries[],
  categories: string[],
  colorAt:    (i: number) => string,
  groupStart: (ci: number) => number,
  groupWidth: number,
  scaleY:     (v: number) => number,
  baselineY:  number,
  onEnter:    (e: MouseEvent, content: string, color: string) => void,
  onLeave:    () => void,
): TemplateResult {
  const numSeries  = barSeries.length;
  const groupPad   = groupWidth * 0.15;
  const barGroupW  = groupWidth - groupPad * 2;
  const barSlotW   = numSeries > 0 ? barGroupW / numSeries : barGroupW;
  const barSpacing = barSlotW * 0.08;
  const barW       = Math.max(barSlotW - barSpacing, 1);

  return svg`
    ${barSeries.map((s, si) => svg`
      <g class="series-group">
        ${categories.map((cat, ci) => {
          const value  = s.values[ci] ?? 0;
          const barTop = scaleY(value);
          const barH   = Math.max(baselineY - barTop, 0);
          const x      = groupStart(ci) + groupPad + si * barSlotW + barSpacing / 2;
          const color  = colorAt(si);
          return svg`
            <rect
              x=${x} y=${barTop} width=${barW} height=${barH} rx=${BAR_RX}
              class="bar"
              style="fill: ${color}"
              @mouseenter=${(e: MouseEvent): void => { onEnter(e, `${cat} · ${s.name}: ${value}`, color); }}
              @mouseleave=${(): void => { onLeave(); }}
            />
          `;
        })}
      </g>
    `)}
  `;
}

function renderLines(
  lineSeries: ChartSeries[],
  categories: string[],
  colorAt:    (j: number) => string,
  center:     (ci: number) => number,
  scaleY:     (v: number) => number,
  smooth:     boolean,
  onEnter:    (e: MouseEvent, content: string, color: string) => void,
  onLeave:    () => void,
): TemplateResult {
  return svg`
    ${lineSeries.map((s, j) => {
      const color = colorAt(j);
      const pts   = categories.map((_c, ci) => ({ cx: center(ci), cy: scaleY(s.values[ci] ?? 0) }));
      return svg`
        <g class="series">
          <path class="combo-line" d=${linePath(pts, smooth)} style="stroke: ${color}" />
          ${pts.map((p, ci) => svg`
            <circle
              class="combo-dot" cx=${p.cx} cy=${p.cy} r="3.5"
              style="fill: ${color}"
              @mouseenter=${(e: MouseEvent): void => { onEnter(e, `${categories[ci]} · ${s.name}: ${s.values[ci] ?? 0}`, color); }}
              @mouseleave=${(): void => { onLeave(); }}
            />
          `)}
        </g>
      `;
    })}
  `;
}

/* ─── Leyenda combinada (barras cuadradas + líneas redondas) ─ */
function legendItem(name: string, color: string, shape: LegendShape): TemplateResult {
  return html`
    <span class="legend-item">
      <span class="legend-dot ${shape === 'square' ? 'square' : ''}" style="background: ${color}"></span>
      <span class="legend-name">${name}</span>
    </span>
  `;
}

/* ─── Template principal ──────────────────────────────────── */

export function comboChartTemplate(props: ComboChartTemplateProps): TemplateResult {
  const {
    categories, barSeries, lineSeries, colors, xLabel, yLabel, yLabelRight,
    showGrid, showLegend, dualAxis, smooth, height, svgWidth,
    tooltip, onPointEnter, onPointLeave,
  } = props;

  /* Layout: margen derecho mayor si hay eje Y derecho */
  const M: ChartMargin = { top: 20, right: dualAxis ? 56 : 20, bottom: 60, left: 56 };
  const innerW = Math.max(svgWidth - M.left - M.right, 0);
  const innerH = Math.max(height   - M.top  - M.bottom, 0);

  const isEmpty = categories.length === 0 || (barSeries.length === 0 && lineSeries.length === 0);

  const barMax  = groupedMax(barSeries);
  const lineMax = groupedMax(lineSeries);

  const leftInfo  = niceAxis(0, dualAxis ? barMax : Math.max(barMax, lineMax), { zeroAnchored: true });
  const rightInfo = niceAxis(0, lineMax, { zeroAnchored: true });

  const band      = bandScale(categories.length, [M.left, M.left + innerW]);
  const scaleLeft = linearScale(leftInfo.domain, [M.top + innerH, M.top]);
  const scaleRight = dualAxis ? linearScale(rightInfo.domain, [M.top + innerH, M.top]) : scaleLeft;
  const baselineY = M.top + innerH;

  /* Paleta: barras 0..B-1, líneas continúan después */
  const barColor  = (i: number): string => colors[i % colors.length]!;
  const lineColor = (j: number): string => colors[(barSeries.length + j) % colors.length]!;

  return html`
    <div class="chart-wrapper">
      <svg
        class="chart-svg"
        width=${svgWidth}
        height=${height}
        role="img"
        aria-label="Combo chart"
      >
        ${showGrid && !isEmpty
          ? renderGrid({ m: M, innerW, innerH, yTicks: leftInfo.ticks.filter(t => t > 0), scaleY: scaleLeft })
          : nothing}
        ${renderAxes(M, innerW, innerH)}
        ${renderYTicks(M, leftInfo.ticks, scaleLeft)}
        ${renderBandLabels(M, categories, band.center, innerH)}
        ${renderAxisTitles(M, xLabel, yLabel, innerW, innerH, height)}
        ${dualAxis && !isEmpty ? renderRightYTicks(M, innerW, rightInfo.ticks, scaleRight) : nothing}
        ${dualAxis && yLabelRight
          ? svg`<text transform="rotate(90)" x=${M.top + innerH / 2} y=${-(svgWidth - 14)} text-anchor="middle" class="axis-label">${yLabelRight}</text>`
          : nothing}
        ${isEmpty
          ? renderEmptyState(M, innerW, innerH)
          : svg`
              ${renderBars(barSeries, categories, barColor, band.start, band.bandWidth, scaleLeft, baselineY, onPointEnter, onPointLeave)}
              ${renderLines(lineSeries, categories, lineColor, band.center, scaleRight, smooth, onPointEnter, onPointLeave)}
            `}
      </svg>
      ${renderTooltip(tooltip)}
      ${showLegend && !isEmpty
        ? html`
            <div class="chart-legend">
              ${barSeries.map((s, i) => legendItem(s.name, barColor(i), 'square'))}
              ${lineSeries.map((s, j) => legendItem(s.name, lineColor(j), 'dot'))}
            </div>
          `
        : nothing}
    </div>
  `;
}
