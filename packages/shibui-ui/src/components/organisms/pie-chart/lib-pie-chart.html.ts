import { html, svg, nothing, type TemplateResult } from 'lit';
import type { ChartMargin, PieSlice } from '../../../../models/ui/charts';
import type { PieChartTemplateProps } from './lib-pie-chart.types';
import { renderEmptyState, renderTooltip, renderLegend } from '../../../shared/charts';

/* ─── Layout ─────────────────────────────────────────────── */
const PAD = 8;                          /* margen entre el círculo y el borde del SVG */
const LABEL_MIN_FRAC = 0.04;            /* no rotular porciones < 4% */
const FULL = Math.PI * 2;
const START = -Math.PI / 2;             /* arranca arriba (12 en punto) */
const ZERO_MARGIN: ChartMargin = { top: 0, right: 0, bottom: 0, left: 0 };

/* ─── Geometría ───────────────────────────────────────────── */

interface Pt { x: number; y: number; }

function polar(cx: number, cy: number, r: number, a: number): Pt {
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

/** Porción de anillo (o cuña si rI = 0) entre dos ángulos, en sentido horario. */
function arcPath(cx: number, cy: number, rO: number, rI: number, start: number, end: number): string {
  const largeArc = (end - start) > Math.PI ? 1 : 0;
  const p0 = polar(cx, cy, rO, start);
  const p1 = polar(cx, cy, rO, end);

  if (rI <= 0) {
    return `M ${cx} ${cy} L ${p0.x} ${p0.y} A ${rO} ${rO} 0 ${largeArc} 1 ${p1.x} ${p1.y} Z`;
  }
  const q1 = polar(cx, cy, rI, end);
  const q0 = polar(cx, cy, rI, start);
  return `M ${p0.x} ${p0.y} A ${rO} ${rO} 0 ${largeArc} 1 ${p1.x} ${p1.y} `
       + `L ${q1.x} ${q1.y} A ${rI} ${rI} 0 ${largeArc} 0 ${q0.x} ${q0.y} Z`;
}

/** Círculo completo (o anillo con fill-rule evenodd) para una única porción al 100%. */
function ringPath(cx: number, cy: number, rO: number, rI: number): string {
  const circle = (r: number, sweep: number): string =>
    `M ${cx - r} ${cy} a ${r} ${r} 0 1 ${sweep} ${2 * r} 0 a ${r} ${r} 0 1 ${sweep} ${-2 * r} 0 Z`;
  return rI <= 0 ? circle(rO, 1) : `${circle(rO, 1)} ${circle(rI, 0)}`;
}

function formatPct(frac: number): string {
  const pct = frac * 100;
  return `${pct >= 10 ? pct.toFixed(0) : pct.toFixed(1)}%`;
}

/* ─── Template principal ──────────────────────────────────── */

export function pieChartTemplate(props: PieChartTemplateProps): TemplateResult {
  const {
    slices, colors, innerRatio, showLegend, showLabels, centerLabel,
    height, svgWidth, tooltip, onSliceEnter, onSliceLeave,
  } = props;

  const total   = slices.reduce((acc, s) => acc + Math.max(0, s.value), 0);
  const isEmpty = slices.length === 0 || total <= 0;

  const cx = svgWidth / 2;
  const cy = height / 2;
  const rO = Math.max(Math.min(svgWidth, height) / 2 - PAD, 0);
  const rI = rO * Math.min(Math.max(innerRatio, 0), 0.9);
  const rLabel = rI > 0 ? (rI + rO) / 2 : rO * 0.62;

  const sliceColors = slices.map((s, i) => s.color ?? colors[i % colors.length]!);

  /* Una sola porción visible → círculo/anillo completo (un solo arco no cierra 360°). */
  const visible = slices.filter(s => s.value > 0);
  const single  = visible.length === 1;

  let angle = START;
  const wedges = slices.map((s, i) => {
    const value = Math.max(0, s.value);
    if (value <= 0) return nothing;

    const frac  = value / total;
    const start = angle;
    const end   = angle + frac * FULL;
    angle = end;

    const mid     = (start + end) / 2;
    const cen     = polar(cx, cy, rLabel, mid);
    const content = `${s.label}: ${value} (${formatPct(frac)})`;
    const d       = single ? ringPath(cx, cy, rO, rI) : arcPath(cx, cy, rO, rI, start, end);

    return svg`
      <path
        d=${d}
        class="slice"
        fill-rule="evenodd"
        style="fill: ${sliceColors[i]}"
        @mouseenter=${(): void => { onSliceEnter(cen.x, cen.y, content, sliceColors[i]!); }}
        @mouseleave=${(): void => { onSliceLeave(); }}
      ></path>
      ${showLabels && frac >= LABEL_MIN_FRAC
        ? svg`<text x=${cen.x} y=${cen.y} text-anchor="middle" dominant-baseline="central" class="slice-label">${formatPct(frac)}</text>`
        : nothing}
    `;
  });

  const showCenter = rI > 0 && !isEmpty;

  return html`
    <div class="chart-wrapper pie-wrapper">
      <svg
        class="chart-svg"
        width=${svgWidth}
        height=${height}
        role="img"
        aria-label="Pie chart"
      >
        ${isEmpty ? renderEmptyState(ZERO_MARGIN, svgWidth, height) : wedges}
      </svg>
      ${showCenter
        ? html`<div class="pie-center" style="top: ${cy}px;"><slot name="center">${centerLabel}</slot></div>`
        : nothing}
      ${renderTooltip(tooltip)}
      ${renderLegend(slices.map((s: PieSlice) => s.label), sliceColors, showLegend, 'dot')}
    </div>
  `;
}
