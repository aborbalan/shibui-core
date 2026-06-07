import { html, svg, nothing, type TemplateResult } from 'lit';
import { linearScale } from '../../../shared/charts/scales';
import type { SparklineTemplateProps } from './lib-sparkline.types';

/* ─── Layout ─────────────────────────────────────────────── */
const PAD_Y    = 3;    /* respiro vertical para que el trazo no se recorte */
const PAD_X    = 2;
const END_DOT  = 2.4;  /* radio del punto final */

interface Pt { x: number; y: number; }

/* ─── Path builders ───────────────────────────────────────── */

function linePath(pts: Pt[], smooth: boolean): string {
  if (pts.length === 0) return '';
  if (!smooth || pts.length < 3) {
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }
  let d = `M ${pts[0]!.x} ${pts[0]!.y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]!;
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

/* ─── Template principal ──────────────────────────────────── */

export function sparklineTemplate(props: SparklineTemplateProps): TemplateResult {
  const { values, type, width, height, smooth, showEndDot, min, max } = props;

  const empty = svg`${nothing}`;
  const n = values.length;

  const svgEl = (body: ReturnType<typeof svg>): TemplateResult => html`
    <svg
      class="spark"
      width=${width}
      height=${height}
      viewBox=${`0 0 ${width} ${height}`}
      role="img"
      aria-label="Sparkline"
    >${body}</svg>
  `;

  if (n === 0) return svgEl(empty);

  const lo = min ?? Math.min(...values);
  const hiRaw = max ?? Math.max(...values);
  const hi = hiRaw === lo ? lo + 1 : hiRaw;  /* evita división por cero (serie plana) */

  const innerW   = Math.max(width - PAD_X * 2, 1);
  const scaleY   = linearScale([lo, hi], [height - PAD_Y, PAD_Y]);
  const stepX    = n > 1 ? innerW / (n - 1) : 0;
  const xAt      = (i: number): number => PAD_X + (n > 1 ? i * stepX : innerW / 2);

  /* ─── Barras ─── */
  if (type === 'bar') {
    const slot     = innerW / n;
    const barW     = Math.max(slot * 0.7, 1);
    const baseline = height - PAD_Y;
    return svgEl(svg`
      ${values.map((v, i) => {
        const top = scaleY(v);
        return svg`
          <rect
            class="spark-bar"
            x=${PAD_X + i * slot + (slot - barW) / 2}
            y=${top}
            width=${barW}
            height=${Math.max(baseline - top, 0.5)}
            rx="0.5"
          />
        `;
      })}
    `);
  }

  /* ─── Línea / Área ─── */
  const pts: Pt[] = values.map((v, i) => ({ x: xAt(i), y: scaleY(v) }));
  const d         = linePath(pts, smooth);
  const last      = pts[pts.length - 1]!;
  const baseline  = height - PAD_Y;
  const areaD     = `${d} L ${last.x} ${baseline} L ${pts[0]!.x} ${baseline} Z`;

  return svgEl(svg`
    ${type === 'area' ? svg`<path class="spark-area" d=${areaD} />` : nothing}
    <path class="spark-line" d=${d} />
    ${showEndDot ? svg`<circle class="spark-dot" cx=${last.x} cy=${last.y} r=${END_DOT} />` : nothing}
  `);
}
