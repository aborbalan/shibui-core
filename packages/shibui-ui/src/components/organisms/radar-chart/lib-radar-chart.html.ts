import { html, svg, nothing, type TemplateResult } from 'lit';
import type { ChartMargin } from '../../../../models/ui/charts';
import type { RadarChartTemplateProps } from './lib-radar-chart.types';
import { renderEmptyState, renderTooltip, renderLegend } from '../../../shared/charts';

/* ─── Layout ─────────────────────────────────────────────── */
const PAD = 30;  /* margen para etiquetas de eje */
const ZERO_MARGIN: ChartMargin = { top: 0, right: 0, bottom: 0, left: 0 };

interface Pt { x: number; y: number; }

/** Ángulo del eje `i` de `n`, empezando arriba y girando en sentido horario. */
function axisAngle(i: number, n: number): number {
  return -Math.PI / 2 + (i / n) * Math.PI * 2;
}

function polar(cx: number, cy: number, r: number, a: number): Pt {
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function polygon(points: Pt[]): string {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
}

/* ─── Template principal ──────────────────────────────────── */

export function radarChartTemplate(props: RadarChartTemplateProps): TemplateResult {
  const {
    axes, series, colors, max, levels, showLegend, showDots, fillOpacity,
    height, svgWidth, tooltip, onVertexEnter, onVertexLeave,
  } = props;

  const n       = axes.length;
  const isEmpty = n < 3 || series.length === 0;

  const cx = svgWidth / 2;
  const cy = height / 2;
  const R  = Math.max(Math.min(svgWidth, height) / 2 - PAD, 1);
  const dom = max || 1;

  const pointAt = (value: number, i: number): Pt =>
    polar(cx, cy, R * Math.min(Math.max(value / dom, 0), 1), axisAngle(i, n));

  /* ─── Rejilla: anillos concéntricos ─── */
  const rings = svg`
    ${Array.from({ length: levels }, (_v, l) => {
      const f = (l + 1) / levels;
      const pts = axes.map((_a, i) => polar(cx, cy, R * f, axisAngle(i, n)));
      return svg`<path class="radar-ring" d=${polygon(pts)} />`;
    })}
  `;

  /* ─── Rejilla: radios + etiquetas ─── */
  const spokes = svg`
    ${axes.map((axis, i) => {
      const outer = polar(cx, cy, R, axisAngle(i, n));
      const lab   = polar(cx, cy, R + 14, axisAngle(i, n));
      const cos   = Math.cos(axisAngle(i, n));
      const anchor = cos > 0.3 ? 'start' : cos < -0.3 ? 'end' : 'middle';
      return svg`
        <line class="radar-spoke" x1=${cx} y1=${cy} x2=${outer.x} y2=${outer.y} />
        <text class="radar-axis-label" x=${lab.x} y=${lab.y} text-anchor=${anchor} dominant-baseline="middle">${axis}</text>
      `;
    })}
  `;

  /* ─── Polígonos de serie ─── */
  const polys = svg`
    ${series.map((s, si) => {
      const color = colors[si % colors.length]!;
      const pts   = axes.map((_a, i) => pointAt(s.values[i] ?? 0, i));
      return svg`
        <path
          class="radar-area"
          d=${polygon(pts)}
          style="stroke:${color};fill:${color};fill-opacity:${fillOpacity}"
        />
        ${showDots
          ? pts.map((p, i) => svg`
              <circle
                class="radar-vertex"
                cx=${p.x} cy=${p.y} r="3"
                style="fill:${color}"
                @mouseenter=${(): void => {
                  onVertexEnter(p.x, p.y, `${axes[i]} · ${s.name}: ${s.values[i] ?? 0}`, color);
                }}
                @mouseleave=${(): void => { onVertexLeave(); }}
              />
            `)
          : nothing}
      `;
    })}
  `;

  return html`
    <div class="chart-wrapper">
      <svg
        class="chart-svg"
        width=${svgWidth}
        height=${height}
        role="img"
        aria-label="Radar chart"
      >
        ${isEmpty
          ? renderEmptyState(ZERO_MARGIN, svgWidth, height)
          : svg`${rings}${spokes}${polys}`}
      </svg>
      ${renderTooltip(tooltip)}
      ${renderLegend(series.map(s => s.name), colors, showLegend, 'dot')}
    </div>
  `;
}
