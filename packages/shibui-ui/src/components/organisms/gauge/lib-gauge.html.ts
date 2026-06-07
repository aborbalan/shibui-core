import { html, svg, nothing, type TemplateResult } from 'lit';
import { formatTick } from '../../../shared/charts';
import type { GaugeTemplateProps, GaugeTone } from './lib-gauge.types';

/* ─── Layout ─────────────────────────────────────────────── */
const PAD       = 12;
const LABEL_GAP = 26;   /* espacio reservado bajo la base para min/max */

/** Mapeo de tono → token semántico de color (katachi-aware). */
const TONE_VAR: Record<GaugeTone, string> = {
  default: 'var(--text-primary)',
  accent:  'var(--text-accent)',
  info:    'var(--text-info)',
  success: 'var(--text-success)',
  warning: 'var(--text-warning)',
  error:   'var(--text-error)',
};

interface Pt { x: number; y: number; }

function polar(cx: number, cy: number, r: number, a: number): Pt {
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(Math.max(v, lo), hi);
}

/** Arco como trazo (no relleno) entre dos ángulos crecientes. */
function arcStroke(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const p0 = polar(cx, cy, r, a0);
  const p1 = polar(cx, cy, r, a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${p0.x} ${p0.y} A ${r} ${r} 0 ${large} 1 ${p1.x} ${p1.y}`;
}

/* ─── Template principal ──────────────────────────────────── */

export function gaugeTemplate(props: GaugeTemplateProps): TemplateResult {
  const { value, min, max, tone, zones, showValue, unit, label, height, svgWidth } = props;

  const span = (max - min) || 1;
  const t    = clamp((value - min) / span, 0, 1);

  /* Semicírculo superior: ángulo de π (izquierda) a 2π (derecha). */
  const A0 = Math.PI;
  const angleAt = (frac: number): number => A0 + clamp(frac, 0, 1) * Math.PI;

  const cx = svgWidth / 2;
  const r  = Math.max(Math.min(svgWidth / 2 - PAD, height - PAD - LABEL_GAP), 1);
  const cy = PAD + r;                 /* base del arco (diámetro) */
  const arcW = Math.max(r * 0.16, 6);

  const hasZones = zones.length > 0;
  const av       = angleAt(t);

  /* Tono activo según la zona que contiene el valor (modo zonas). */
  const activeTone: GaugeTone = hasZones
    ? (zones.find(z => value >= z.from && value <= z.to)?.tone ?? 'default')
    : tone;

  const stroke = (color: string): string => `stroke:${color};stroke-width:${arcW}px`;

  /* ─── Bandas de zona (modo zonas) ─── */
  const bands = hasZones
    ? zones.map(z => {
        const tf = clamp((z.from - min) / span, 0, 1);
        const tt = clamp((z.to   - min) / span, 0, 1);
        if (tt <= tf) return nothing;
        return svg`<path class="gauge-band" d=${arcStroke(cx, cy, r, angleAt(tf), angleAt(tt))} style=${stroke(TONE_VAR[z.tone])} />`;
      })
    : nothing;

  /* ─── Arco de valor (modo simple) ─── */
  const valueArc = !hasZones
    ? svg`<path class="gauge-value" d=${arcStroke(cx, cy, r, A0, av)} style=${stroke(TONE_VAR[tone])} />`
    : nothing;

  /* ─── Aguja (modo zonas) ─── */
  const tip    = polar(cx, cy, r - arcW * 0.35, av);
  const needle = hasZones
    ? svg`
        <line class="gauge-needle" x1=${cx} y1=${cy} x2=${tip.x} y2=${tip.y} style="stroke:${TONE_VAR[activeTone]}" />
        <circle class="gauge-hub" cx=${cx} cy=${cy} r="4" style="fill:${TONE_VAR[activeTone]}" />
      `
    : nothing;

  /* ─── Valor + caption ─── */
  const valueText = showValue
    ? svg`
        <text class="gauge-value-text" x=${cx} y=${cy - r * 0.30} text-anchor="middle">${formatTick(value)}${unit}</text>
        ${label ? svg`<text class="gauge-caption" x=${cx} y=${cy - r * 0.30 + 16} text-anchor="middle">${label}</text>` : nothing}
      `
    : nothing;

  /* ─── Etiquetas de extremos ─── */
  const ends = svg`
    <text class="gauge-end" x=${cx - r} y=${cy + 16} text-anchor="middle">${formatTick(min)}</text>
    <text class="gauge-end" x=${cx + r} y=${cy + 16} text-anchor="middle">${formatTick(max)}</text>
  `;

  return html`
    <div class="gauge-wrapper">
      <svg
        class="gauge-svg"
        width=${svgWidth}
        height=${height}
        role="img"
        aria-label=${`Gauge: ${formatTick(value)}${unit}`}
      >
        <path class="gauge-track" d=${arcStroke(cx, cy, r, A0, Math.PI * 2)} style=${`stroke-width:${arcW}px`} />
        ${bands}
        ${valueArc}
        ${ends}
        ${needle}
        ${valueText}
      </svg>
    </div>
  `;
}
