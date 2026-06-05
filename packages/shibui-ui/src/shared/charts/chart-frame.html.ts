/* ============================================================
   CHARTS · chart-frame — esqueleto SVG/HTML reutilizable
   Ejes, rejilla, ticks, títulos, leyenda, tooltip y estado
   vacío. Compartido por bar / scatter / line. Las "marcas"
   (rect, circle, path) las aporta cada componente.
   ============================================================ */

import { html, svg, nothing, type TemplateResult } from 'lit';
import type { ChartMargin, ChartTooltip, LegendShape } from '../../../models/ui/charts';
import { formatTick, truncate } from './format';

/* ─── Ejes ────────────────────────────────────────────────── */

/** Las dos líneas de eje (X inferior, Y izquierda). */
export function renderAxes(m: ChartMargin, innerW: number, innerH: number): TemplateResult {
  return svg`
    <g class="axes">
      <line
        x1=${m.left}          x2=${m.left + innerW}
        y1=${m.top + innerH}  y2=${m.top + innerH}
        class="axis-line"
      />
      <line
        x1=${m.left}  x2=${m.left}
        y1=${m.top}   y2=${m.top + innerH}
        class="axis-line"
      />
    </g>
  `;
}

/* ─── Rejilla ─────────────────────────────────────────────── */

export interface GridOptions {
  m:       ChartMargin;
  innerW:  number;
  innerH:  number;
  yTicks?: number[];
  scaleY?: (v: number) => number;
  xTicks?: number[];
  scaleX?: (v: number) => number;
}

/** Rejilla de fondo: horizontales desde `yTicks`, verticales desde `xTicks`. */
export function renderGrid(opts: GridOptions): TemplateResult {
  const { m, innerW, innerH, yTicks, scaleY, xTicks, scaleX } = opts;
  return svg`
    <g class="grid">
      ${yTicks && scaleY
        ? yTicks.map(t => svg`
            <line
              x1=${m.left}      x2=${m.left + innerW}
              y1=${scaleY(t)}   y2=${scaleY(t)}
              class="grid-line"
            />
          `)
        : nothing}
      ${xTicks && scaleX
        ? xTicks.map(t => svg`
            <line
              x1=${scaleX(t)}  x2=${scaleX(t)}
              y1=${m.top}      y2=${m.top + innerH}
              class="grid-line"
            />
          `)
        : nothing}
    </g>
  `;
}

/* ─── Ticks ───────────────────────────────────────────────── */

/** Ticks del eje Y (numérico). `scaleY` recibe el valor del tick. */
export function renderYTicks(
  m:      ChartMargin,
  ticks:  number[],
  scaleY: (v: number) => number,
): TemplateResult {
  return svg`
    <g class="y-ticks">
      ${ticks.map(t => svg`
        <g transform="translate(${m.left}, ${scaleY(t)})">
          <line x1="0" x2="-5" y1="0" y2="0" class="tick-line" />
          <text x="-9" y="4" text-anchor="end" class="tick-label">${formatTick(t)}</text>
        </g>
      `)}
    </g>
  `;
}

/** Ticks del eje X numérico (scatter, line lineal). */
export function renderXTicks(
  m:      ChartMargin,
  ticks:  number[],
  scaleX: (v: number) => number,
  innerH: number,
): TemplateResult {
  return svg`
    <g class="x-ticks">
      ${ticks.map(t => svg`
        <g transform="translate(${scaleX(t)}, ${m.top + innerH})">
          <line x1="0" x2="0" y1="0" y2="5" class="tick-line" />
          <text x="0" y="18" text-anchor="middle" class="tick-label">${formatTick(t)}</text>
        </g>
      `)}
    </g>
  `;
}

/** Etiquetas del eje X categórico (bar, line de banda), centradas por banda. */
export function renderBandLabels(
  m:          ChartMargin,
  categories: string[],
  center:     (i: number) => number,
  innerH:     number,
): TemplateResult {
  return svg`
    <g class="x-labels">
      ${categories.map((cat, ci) => svg`
        <text
          x=${center(ci)}
          y=${m.top + innerH + 18}
          text-anchor="middle"
          class="tick-label x-label"
        >${truncate(cat)}</text>
      `)}
    </g>
  `;
}

/* ─── Títulos de eje ──────────────────────────────────────── */

/** Títulos opcionales de los ejes (X centrado abajo, Y rotado a la izquierda). */
export function renderAxisTitles(
  m:      ChartMargin,
  xLabel: string,
  yLabel: string,
  innerW: number,
  innerH: number,
  height: number,
): TemplateResult {
  return svg`
    ${xLabel ? svg`
      <text
        x=${m.left + innerW / 2}
        y=${height - 8}
        text-anchor="middle"
        class="axis-label"
      >${xLabel}</text>
    ` : nothing}
    ${yLabel ? svg`
      <text
        transform="rotate(-90)"
        x=${-(m.top + innerH / 2)}
        y="14"
        text-anchor="middle"
        class="axis-label"
      >${yLabel}</text>
    ` : nothing}
  `;
}

/* ─── Estado vacío ────────────────────────────────────────── */

export function renderEmptyState(m: ChartMargin, innerW: number, innerH: number): TemplateResult {
  return svg`
    <text
      x=${m.left + innerW / 2}
      y=${m.top  + innerH / 2}
      text-anchor="middle"
      class="empty-label"
    >Sin datos</text>
  `;
}

/* ─── Tooltip (HTML overlay) ──────────────────────────────── */

export function renderTooltip(tooltip: ChartTooltip | null): TemplateResult {
  if (!tooltip) return html`${nothing}`;
  return html`
    <div class="chart-tooltip" style="left: ${tooltip.x}px; top: ${tooltip.y}px;">
      <span class="tooltip-dot" style="background: ${tooltip.color}"></span>
      <span class="tooltip-content">${tooltip.content}</span>
    </div>
  `;
}

/* ─── Leyenda (HTML) ──────────────────────────────────────── */

/** Leyenda de series. Se oculta con una sola serie. `shape` controla el marcador. */
export function renderLegend(
  names:  string[],
  colors: readonly string[],
  show:   boolean,
  shape:  LegendShape = 'dot',
): TemplateResult {
  if (!show || names.length < 2) return html`${nothing}`;
  return html`
    <div class="chart-legend">
      ${names.map((name, si) => html`
        <span class="legend-item">
          <span
            class="legend-dot ${shape === 'square' ? 'square' : ''}"
            style="background: ${colors[si % colors.length]}"
          ></span>
          <span class="legend-name">${name}</span>
        </span>
      `)}
    </div>
  `;
}
