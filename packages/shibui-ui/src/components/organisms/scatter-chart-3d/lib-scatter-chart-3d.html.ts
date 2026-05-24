import { html, svg, nothing, TemplateResult } from 'lit';
import type {
  ScatterChart3dTemplateProps,
  ScatterPoint3d,
  ScatterSeries3d,
  ScatterTooltip3d,
  ProjectionConfig,
} from './lib-scatter-chart-3d.types';

/* ─── Layout ─────────────────────────────────────────────── */

const M          = { top: 50, right: 50, bottom: 60, left: 60 } as const;
const TICK_COUNT = 5;

/* ─── Proyección ortográfica ──────────────────────────────
   Rotación Z (azimut θ) → rotación X (elevación φ) → proyecto sobre XZ.
   Punto normalizado (nx, ny, nz) ∈ [0,1]³ centrado en [-0.5, 0.5]³.
   ─────────────────────────────────────────────────────── */

function project(
  nx: number, ny: number, nz: number,
  cfg: ProjectionConfig,
): [number, number] {
  const cx = nx - 0.5;
  const cy = ny - 0.5;
  const cz = nz - 0.5;

  const ca = Math.cos(cfg.azimuth);
  const sa = Math.sin(cfg.azimuth);
  const se = Math.sin(cfg.elevation);
  const ce = Math.cos(cfg.elevation);

  // Rotación alrededor del eje Z
  const rx = cx * ca - cy * sa;
  const ry = cx * sa + cy * ca;
  const rz = cz;

  // Rotación alrededor del eje X (elevación)
  const finalX =  rx;
  const finalZ =  ry * se + rz * ce;

  return [
    cfg.ox + finalX * cfg.scale,
    cfg.oy - finalZ * cfg.scale,
  ];
}

/** Profundidad de un punto para depth sorting (mayor = más lejos del visor). */
function getDepth(nx: number, ny: number, nz: number, az: number, el: number): number {
  const cx = nx - 0.5;
  const cy = ny - 0.5;
  const cz = nz - 0.5;

  const ca = Math.cos(az);
  const sa = Math.sin(az);
  const ce = Math.cos(el);

  // Componente Y tras rotación Z luego rotación X (la profundidad de proyección)
  const ry    = cx * sa + cy * ca;
  const finalY = ry * ce - cz * Math.sin(el);

  return finalY;
}

/* ─── Nice ticks ──────────────────────────────────────────── */

interface AxisInfo { domain: [number, number]; ticks: number[] }

function computeAxis(dataMin: number, dataMax: number): AxisInfo {
  const range = dataMax - dataMin;
  if (range === 0) {
    const c = dataMin;
    return { domain: [c - 1, c + 1], ticks: [c - 1, c, c + 1] };
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

/* ─── Extents ─────────────────────────────────────────────── */

interface Extents {
  xMin: number; xMax: number;
  yMin: number; yMax: number;
  zMin: number; zMax: number;
}

function getDataExtents(series: ScatterSeries3d[]): Extents | null {
  const xs = series.flatMap(s => s.points.map(p => p.x));
  const ys = series.flatMap(s => s.points.map(p => p.y));
  const zs = series.flatMap(s => s.points.map(p => p.z));
  if (xs.length === 0) return null;
  return {
    xMin: Math.min(...xs), xMax: Math.max(...xs),
    yMin: Math.min(...ys), yMax: Math.max(...ys),
    zMin: Math.min(...zs), zMax: Math.max(...zs),
  };
}

/** Normaliza un valor de datos a [0, 1]. */
function norm(v: number, lo: number, hi: number): number {
  return lo === hi ? 0.5 : (v - lo) / (hi - lo);
}

/* ─── Sub-templates SVG ───────────────────────────────────── */

/** Cuadrícula sobre el plano Z = 0 (suelo). */
function renderFloorGrid(
  xTicks: number[],
  yTicks: number[],
  xInfo:  AxisInfo,
  yInfo:  AxisInfo,
  cfg:    ProjectionConfig,
): TemplateResult {
  const [xLo, xHi] = xInfo.domain;
  const [yLo, yHi] = yInfo.domain;

  return svg`
    <g class="grid">
      ${xTicks.map(xv => {
        const nx = norm(xv, xLo, xHi);
        const [x1, y1] = project(nx, 0, 0, cfg);
        const [x2, y2] = project(nx, 1, 0, cfg);
        return svg`<line x1=${x1} y1=${y1} x2=${x2} y2=${y2} class="grid-line" />`;
      })}
      ${yTicks.map(yv => {
        const ny = norm(yv, yLo, yHi);
        const [x1, y1] = project(0, ny, 0, cfg);
        const [x2, y2] = project(1, ny, 0, cfg);
        return svg`<line x1=${x1} y1=${y1} x2=${x2} y2=${y2} class="grid-line" />`;
      })}
    </g>
  `;
}

/** Tres ejes con flechas, ticks y etiquetas. */
function renderAxes(
  xInfo:  AxisInfo,
  yInfo:  AxisInfo,
  zInfo:  AxisInfo,
  cfg:    ProjectionConfig,
  xLabel: string,
  yLabel: string,
  zLabel: string,
): TemplateResult {
  const [xLo, xHi] = xInfo.domain;
  const [yLo, yHi] = yInfo.domain;
  const [zLo, zHi] = zInfo.domain;

  const [ox,  oy ] = project(0, 0, 0, cfg);
  const [xEx, yEx] = project(1, 0, 0, cfg);  // extremo eje X
  const [yExx, yExy] = project(0, 1, 0, cfg); // extremo eje Y
  const [zEx, zEy] = project(0, 0, 1, cfg);  // extremo eje Z

  const TICK_LEN = 5;

  return svg`
    <g class="axes">
      <!-- Eje X -->
      <line x1=${ox} y1=${oy} x2=${xEx} y2=${yEx} class="axis-line" />
      <!-- Eje Y -->
      <line x1=${ox} y1=${oy} x2=${yExx} y2=${yExy} class="axis-line" />
      <!-- Eje Z -->
      <line x1=${ox} y1=${oy} x2=${zEx} y2=${zEy} class="axis-line" />

      <!-- Ticks eje X -->
      ${xInfo.ticks.map(xv => {
        const nx = norm(xv, xLo, xHi);
        const [tx, ty] = project(nx, 0, 0, cfg);
        // tick perpendicular: hacia abajo respecto al eje visual
        return svg`
          <g>
            <line x1=${tx} y1=${ty} x2=${tx} y2=${ty + TICK_LEN} class="tick-line" />
            <text x=${tx} y=${ty + TICK_LEN + 12} text-anchor="middle" class="tick-label">
              ${formatTick(xv)}
            </text>
          </g>
        `;
      })}

      <!-- Ticks eje Y -->
      ${yInfo.ticks.map(yv => {
        const ny = norm(yv, yLo, yHi);
        const [tx, ty] = project(0, ny, 0, cfg);
        return svg`
          <g>
            <line x1=${tx} y1=${ty} x2=${tx} y2=${ty + TICK_LEN} class="tick-line" />
            <text x=${tx} y=${ty + TICK_LEN + 12} text-anchor="middle" class="tick-label">
              ${formatTick(yv)}
            </text>
          </g>
        `;
      })}

      <!-- Ticks eje Z -->
      ${zInfo.ticks.map(zv => {
        const nz = norm(zv, zLo, zHi);
        const [tx, ty] = project(0, 0, nz, cfg);
        return svg`
          <g>
            <line x1=${tx} y1=${ty} x2=${tx - TICK_LEN} y2=${ty} class="tick-line" />
            <text x=${tx - TICK_LEN - 4} y=${ty + 4} text-anchor="end" class="tick-label">
              ${formatTick(zv)}
            </text>
          </g>
        `;
      })}

      <!-- Etiquetas de eje -->
      ${xLabel ? svg`
        <text
          x=${(ox + xEx) / 2}
          y=${Math.max(oy, yEx) + 32}
          text-anchor="middle"
          class="axis-label"
        >${xLabel}</text>
      ` : nothing}

      ${yLabel ? svg`
        <text
          x=${(ox + yExx) / 2}
          y=${Math.max(oy, yExy) + 32}
          text-anchor="middle"
          class="axis-label"
        >${yLabel}</text>
      ` : nothing}

      ${zLabel ? svg`
        <text
          x=${zEx - 14}
          y=${zEy}
          text-anchor="end"
          class="axis-label"
        >${zLabel}</text>
      ` : nothing}
    </g>
  `;
}

/** Puntos de todas las series, ordenados por profundidad (painter's algorithm). */
function renderDots(
  series:   ScatterSeries3d[],
  colors:   readonly string[],
  xInfo:    AxisInfo,
  yInfo:    AxisInfo,
  zInfo:    AxisInfo,
  cfg:      ProjectionConfig,
  radius:   number,
  onEnter:  (e: MouseEvent, p: ScatterPoint3d, si: number, color: string) => void,
  onLeave:  () => void,
): TemplateResult {
  const [xLo, xHi] = xInfo.domain;
  const [yLo, yHi] = yInfo.domain;
  const [zLo, zHi] = zInfo.domain;

  // Aplanar con referencia al índice de serie y ordenar por profundidad
  const flat = series.flatMap((s, si) =>
    s.points.map(p => ({ p, si }))
  );

  flat.sort((a, b) => {
    const da = getDepth(norm(a.p.x, xLo, xHi), norm(a.p.y, yLo, yHi), norm(a.p.z, zLo, zHi), cfg.azimuth, cfg.elevation);
    const db = getDepth(norm(b.p.x, xLo, xHi), norm(b.p.y, yLo, yHi), norm(b.p.z, zLo, zHi), cfg.azimuth, cfg.elevation);
    return db - da; // los más lejanos primero
  });

  return svg`
    <g class="dots">
      ${flat.map(({ p, si }) => {
        const nx = norm(p.x, xLo, xHi);
        const ny = norm(p.y, yLo, yHi);
        const nz = norm(p.z, zLo, zHi);
        const [cx, cy] = project(nx, ny, nz, cfg);
        const color    = colors[si % colors.length] as string;

        return svg`
          <circle
            cx=${cx}
            cy=${cy}
            r=${radius}
            class="dot"
            style="fill: ${color}"
            @mouseenter=${(e: MouseEvent): void => { onEnter(e, p, si, color); }}
            @mouseleave=${(): void => { onLeave(); }}
          >${p.label
            ? svg`<title>${p.label}: (${p.x}, ${p.y}, ${p.z})</title>`
            : svg`<title>(${p.x}, ${p.y}, ${p.z})</title>`
          }</circle>
        `;
      })}
    </g>
  `;
}

/* ─── HTML sub-templates ──────────────────────────────────── */

function renderTooltip(tooltip: ScatterTooltip3d | null): TemplateResult {
  if (!tooltip) return html`${nothing}`;
  return html`
    <div
      class="scatter3d-tooltip"
      style="left: ${tooltip.svgX}px; top: ${tooltip.svgY}px;"
    >
      <span class="tooltip-dot" style="background: ${tooltip.color}"></span>
      <span class="tooltip-content">${tooltip.content}</span>
    </div>
  `;
}

function renderLegend(
  series: ScatterSeries3d[],
  colors: readonly string[],
  show:   boolean,
): TemplateResult {
  if (!show || series.length < 2) return html`${nothing}`;
  return html`
    <div class="scatter3d-legend">
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

export function scatterChart3dTemplate(props: ScatterChart3dTemplateProps): TemplateResult {
  const {
    series, colors, xLabel, yLabel, zLabel,
    showGrid, showLegend, dotRadius,
    height, svgWidth, tooltip,
    azimuth, elevation, isDragging,
    onMouseDown, onDotEnter, onDotLeave,
  } = props;

  const extents  = getDataExtents(series);
  const isEmpty  = extents === null;

  const fallback: AxisInfo = { domain: [0, 1], ticks: [0, 0.25, 0.5, 0.75, 1] };

  const xInfo = isEmpty ? fallback : computeAxis(extents.xMin, extents.xMax);
  const yInfo = isEmpty ? fallback : computeAxis(extents.yMin, extents.yMax);
  const zInfo = isEmpty ? fallback : computeAxis(extents.zMin, extents.zMax);

  // Calcular scale para que el cubo proyectado quepa en el área disponible
  const drawW = Math.max(svgWidth - M.left - M.right, 1);
  const drawH = Math.max(height   - M.top  - M.bottom, 1);

  // El cubo unitario proyectado ocupa ≈ 2·|cos45°·sin30°| + 2·|cos45°·sin30°| en X
  // y ≈ cos(elevation) + ... en Y. Aproximamos con un factor conservador.
  const scale = Math.min(drawW / 1.7, drawH / 1.3);

  // Origen del sistema 3D: centro horizontal, desplazado hacia abajo para dejar margen al eje Z
  const cfg: ProjectionConfig = {
    ox:        M.left + drawW / 2,
    oy:        M.top  + drawH * 0.65,
    scale,
    azimuth,
    elevation,
  };

  return html`
    <div class="scatter3d-wrapper">
      <svg
        class="scatter3d-svg ${isDragging ? 'is-dragging' : ''}"
        width=${svgWidth}
        height=${height}
        role="img"
        aria-label="3D scatter chart"
        style="cursor: ${isDragging ? 'grabbing' : 'grab'}"
        @mousedown=${onMouseDown}
      >
        ${showGrid && !isEmpty
          ? renderFloorGrid(xInfo.ticks, yInfo.ticks, xInfo, yInfo, cfg)
          : nothing
        }
        ${renderAxes(xInfo, yInfo, zInfo, cfg, xLabel, yLabel, zLabel)}
        ${isEmpty
          ? svg`
              <text
                x=${cfg.ox}
                y=${cfg.oy}
                text-anchor="middle"
                class="empty-label"
              >Sin datos</text>
            `
          : renderDots(series, colors, xInfo, yInfo, zInfo, cfg, dotRadius, onDotEnter, onDotLeave)
        }
      </svg>
      ${renderTooltip(tooltip)}
      ${renderLegend(series, colors, showLegend)}
      <span class="drag-hint">Arrastra para rotar · Scroll para ajustar elevación</span>
    </div>
  `;
}

