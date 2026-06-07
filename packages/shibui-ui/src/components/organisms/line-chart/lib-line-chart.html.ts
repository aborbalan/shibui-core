import { html, svg, nothing, type TemplateResult } from 'lit';
import type {
  AxisInfo, ChartMargin, ChartPointSeries, ChartSeries,
} from '../../../../models/ui/charts';
import type { LineChartMode, LineChartTemplateProps } from './lib-line-chart.types';
import {
  niceAxis, linearScale, bandScale,
  groupedMax, stackedMax,
  renderAxes, renderGrid, renderYTicks, renderXTicks, renderBandLabels,
  renderAxisTitles, renderEmptyState, renderTooltip, renderLegend,
} from '../../../shared/charts';

/* ─── Layout ─────────────────────────────────────────────── */
const M: ChartMargin = { top: 20, right: 20, bottom: 60, left: 56 };
const DOT_R = 3.5;

const FALLBACK_AXIS: AxisInfo = { domain: [0, 1], ticks: [0, 0.25, 0.5, 0.75, 1] };

/* ─── Tipos internos ──────────────────────────────────────── */
interface Mark { cx: number; cy: number; content: string; }

/* ─── Path builders ───────────────────────────────────────── */

/** Polilínea, o curva suave (Catmull-Rom → Bézier) si `smooth`. */
function buildLinePath(pts: Mark[], smooth: boolean): string {
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

/** Área entre la línea y una baseline horizontal. */
function buildAreaPath(pts: Mark[], baselineY: number, smooth: boolean): string {
  if (pts.length === 0) return '';
  const last = pts[pts.length - 1]!;
  return `${buildLinePath(pts, smooth)} L ${last.cx} ${baselineY} L ${pts[0]!.cx} ${baselineY} Z`;
}

/** Área entre dos contornos (apilada): borde superior `top` + inferior `bot` invertido.
 *  El borde inferior se traza con el mismo suavizado para que coincida sin costuras
 *  con el borde superior de la capa inferior (Catmull-Rom es simétrico al invertir). */
function buildAreaBetween(top: Mark[], bot: Mark[], smooth: boolean): string {
  if (top.length === 0) return '';
  const topPath = buildLinePath(top, smooth);
  const botPath = `L${buildLinePath([...bot].reverse(), smooth).slice(1)}`; /* 'M…' → 'L…' */
  return `${topPath} ${botPath} Z`;
}

/* ─── Marca por serie (área + línea + puntos) ─────────────── */

function renderSeriesMarks(
  seriesIndex: number,
  color:       string,
  top:         Mark[],
  bottom:      Mark[] | null,
  baselineY:   number,
  mode:        LineChartMode,
  smooth:      boolean,
  showDots:    boolean,
  onEnter:     (e: MouseEvent, si: number, content: string) => void,
  onLeave:     () => void,
): TemplateResult {
  const areaPath =
    mode === 'stacked-area' && bottom
      ? buildAreaBetween(top, bottom, smooth)
      : mode === 'area'
        ? buildAreaPath(top, baselineY, smooth)
        : '';

  return svg`
    <g class="series">
      ${areaPath
        ? svg`<path d=${areaPath} class="area-path" style="fill: ${color}" />`
        : nothing}
      <path d=${buildLinePath(top, smooth)} class="line-path" style="stroke: ${color}" />
      ${showDots
        ? top.map(p => svg`
            <circle
              cx=${p.cx}
              cy=${p.cy}
              r=${DOT_R}
              class="dot"
              style="fill: ${color}"
              @mouseenter=${(e: MouseEvent): void => { onEnter(e, seriesIndex, p.content); }}
              @mouseleave=${(): void => { onLeave(); }}
            />
          `)
        : nothing}
    </g>
  `;
}

/* ─── Builders por modo de eje ────────────────────────────── */

interface BandResult {
  marks: TemplateResult;
  ticks: number[];
  scaleY: (v: number) => number;
  center: (i: number) => number;
}

function buildBandMarks(
  series:     ChartSeries[],
  categories: string[],
  colors:     readonly string[],
  mode:       LineChartMode,
  smooth:     boolean,
  showDots:   boolean,
  innerW:     number,
  innerH:     number,
  onEnter:    (e: MouseEvent, si: number, content: string) => void,
  onLeave:    () => void,
): BandResult {
  const isStacked = mode === 'stacked-area';
  const rawMax    = isStacked ? stackedMax(series, categories.length) : groupedMax(series);
  const { domain, ticks } = niceAxis(0, rawMax, { zeroAnchored: true });

  const band      = bandScale(categories.length, [M.left, M.left + innerW]);
  const scaleY    = linearScale(domain, [M.top + innerH, M.top]);
  const baselineY = M.top + innerH;

  /* cumulativos para stacked-area */
  const cum = categories.map(() => 0);

  const marks = svg`
    ${series.map((s, si) => {
      const top: Mark[] = [];
      const bottom: Mark[] = [];
      categories.forEach((cat, ci) => {
        const value = s.values[ci] ?? 0;
        const yTop  = isStacked ? cum[ci]! + value : value;
        const yBot  = isStacked ? cum[ci]! : 0;
        const cx    = band.center(ci);
        top.push({ cx, cy: scaleY(yTop), content: `${cat} · ${s.name}: ${value}` });
        bottom.push({ cx, cy: scaleY(yBot), content: '' });
        if (isStacked) cum[ci] = yTop;
      });
      return renderSeriesMarks(
        si, colors[si % colors.length]!, top, isStacked ? bottom : null,
        baselineY, mode, smooth, showDots, onEnter, onLeave,
      );
    })}
  `;

  return { marks, ticks, scaleY, center: band.center };
}

interface LinearResult {
  marks:   TemplateResult;
  yTicks:  number[];
  xTicks:  number[];
  scaleX:  (v: number) => number;
  scaleY:  (v: number) => number;
}

function buildLinearMarks(
  pointSeries: ChartPointSeries[],
  colors:      readonly string[],
  mode:        LineChartMode,
  smooth:      boolean,
  showDots:    boolean,
  innerW:      number,
  innerH:      number,
  onEnter:     (e: MouseEvent, si: number, content: string) => void,
  onLeave:     () => void,
): LinearResult {
  const xs = pointSeries.flatMap(s => s.points.map(p => p.x));
  const ys = pointSeries.flatMap(s => s.points.map(p => p.y));
  const xInfo = xs.length ? niceAxis(Math.min(...xs), Math.max(...xs)) : FALLBACK_AXIS;
  const yInfo = ys.length ? niceAxis(Math.min(...ys), Math.max(...ys)) : FALLBACK_AXIS;

  const scaleX = linearScale(xInfo.domain, [M.left, M.left + innerW]);
  const scaleY = linearScale(yInfo.domain, [M.top + innerH, M.top]);

  const [yLo, yHi] = yInfo.domain;
  const baselineY  = scaleY(yLo <= 0 && yHi >= 0 ? 0 : yLo);
  /* stacked-area no tiene sentido con X numérico → degrada a area */
  const effMode: LineChartMode = mode === 'stacked-area' ? 'area' : mode;

  const marks = svg`
    ${pointSeries.map((s, si) => {
      const top: Mark[] = [...s.points]
        .sort((a, b) => a.x - b.x)
        .map(p => ({
          cx: scaleX(p.x),
          cy: scaleY(p.y),
          content: [p.label, `${s.name}`, `(${p.x}, ${p.y})`].filter(Boolean).join(' · '),
        }));
      return renderSeriesMarks(
        si, colors[si % colors.length]!, top, null,
        baselineY, effMode, smooth, showDots, onEnter, onLeave,
      );
    })}
  `;

  return { marks, yTicks: yInfo.ticks, xTicks: xInfo.ticks, scaleX, scaleY };
}

/* ─── Template principal ──────────────────────────────────── */

export function lineChartTemplate(props: LineChartTemplateProps): TemplateResult {
  const {
    series, categories, pointSeries, colors, xLabel, yLabel,
    showGrid, showLegend, showDots, smooth, mode, height, svgWidth,
    tooltip, onDotEnter, onDotLeave,
  } = props;

  const innerW   = Math.max(svgWidth - M.left - M.right, 0);
  const innerH   = Math.max(height   - M.top  - M.bottom, 0);
  const isLinear = pointSeries.length > 0;

  const isEmpty = isLinear
    ? pointSeries.every(s => s.points.length === 0)
    : series.length === 0 || categories.length === 0;

  const names = (isLinear ? pointSeries : series).map(s => s.name);

  /* Cuerpo del gráfico (ejes + marcas) según el modo de eje. */
  const body = isEmpty
    ? svg`
        ${renderAxes(M, innerW, innerH)}
        ${renderEmptyState(M, innerW, innerH)}
      `
    : isLinear
      ? ((): TemplateResult => {
          const r = buildLinearMarks(pointSeries, colors, mode, smooth, showDots, innerW, innerH, onDotEnter, onDotLeave);
          return svg`
            ${showGrid ? renderGrid({ m: M, innerW, innerH, yTicks: r.yTicks, scaleY: r.scaleY, xTicks: r.xTicks, scaleX: r.scaleX }) : nothing}
            ${renderAxes(M, innerW, innerH)}
            ${renderXTicks(M, r.xTicks, r.scaleX, innerH)}
            ${renderYTicks(M, r.yTicks, r.scaleY)}
            ${renderAxisTitles(M, xLabel, yLabel, innerW, innerH, height)}
            ${r.marks}
          `;
        })()
      : ((): TemplateResult => {
          const r = buildBandMarks(series, categories, colors, mode, smooth, showDots, innerW, innerH, onDotEnter, onDotLeave);
          return svg`
            ${showGrid ? renderGrid({ m: M, innerW, innerH, yTicks: r.ticks.filter(t => t > 0), scaleY: r.scaleY }) : nothing}
            ${renderAxes(M, innerW, innerH)}
            ${renderYTicks(M, r.ticks, r.scaleY)}
            ${renderBandLabels(M, categories, r.center, innerH)}
            ${renderAxisTitles(M, xLabel, yLabel, innerW, innerH, height)}
            ${r.marks}
          `;
        })();

  return html`
    <div class="chart-wrapper">
      <svg
        class="chart-svg"
        width=${svgWidth}
        height=${height}
        role="img"
        aria-label="Line chart"
      >
        ${body}
      </svg>
      ${renderTooltip(tooltip)}
      ${renderLegend(names, colors, showLegend, 'dot')}
    </div>
  `;
}
