import { html, nothing, svg, TemplateResult } from 'lit';
import { ReadingProgressVariant } from './lib-reading-progress.component';

export interface ReadingProgressTemplateProps {
  variant:    ReadingProgressVariant;
  progress:   number;   /* 0 – 100 */
  dotsCount:  number;
  ringSize:   number;
}

/* ── DOTS ──────────────────────────────────────────────── */
function renderDots(p: ReadingProgressTemplateProps): TemplateResult {
  const current = Math.round((p.progress / 100) * p.dotsCount);
  return html`
    ${Array.from({ length: p.dotsCount }, (_, i) => {
      const done = i < current - 1;
      const active = i === current - 1;
      return html`
        <span
          class="rp-dot ${done ? 'is-done' : ''} ${active ? 'is-current' : ''}"
          aria-hidden="true"
        ></span>
      `;
    })}
  `;
}

/* ── RING ──────────────────────────────────────────────── */
function renderRing(p: ReadingProgressTemplateProps): TemplateResult {
  const r            = (p.ringSize / 2) - 3;   /* margen para stroke-width:2 */
  const circumference = 2 * Math.PI * r;
  const offset        = circumference * (1 - p.progress / 100);

  return html`
    ${svg`
      <svg
        class="rp-ring-svg"
        width="${p.ringSize}"
        height="${p.ringSize}"
        viewBox="0 0 ${p.ringSize} ${p.ringSize}"
        role="img"
        aria-label="Progreso de lectura: ${p.progress}%"
      >
        <circle
          class="rp-ring-track"
          cx="${p.ringSize / 2}"
          cy="${p.ringSize / 2}"
          r="${r}"
        />
        <circle
          class="rp-ring-fill"
          cx="${p.ringSize / 2}"
          cy="${p.ringSize / 2}"
          r="${r}"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${offset}"
        />
      </svg>
    `}
  `;
}

/* ── Template principal ─────────────────────────────────── */
export function readingProgressTemplate(
  p: ReadingProgressTemplateProps,
): TemplateResult {
  /* bar + line + vertical → el host ES el elemento visual (CSS en :host)
     Solo necesitamos el aria progressbar */
  if (p.variant === 'bar' || p.variant === 'line' || p.variant === 'vertical') {
    return html`
      <span
        role="progressbar"
        aria-label="Progreso de lectura"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="${p.progress}"
        style="display:none"
      ></span>
    `;
  }

  if (p.variant === 'dots') {
    return html`
      <span role="progressbar" aria-label="Progreso de lectura" aria-valuenow="${p.progress}" aria-valuemin="0" aria-valuemax="100" style="display:contents">
        ${renderDots(p)}
      </span>
    `;
  }

  if (p.variant === 'ring') {
    return html`
      <span role="progressbar" aria-label="Progreso de lectura" aria-valuenow="${p.progress}" aria-valuemin="0" aria-valuemax="100" style="display:contents">
        ${renderRing(p)}
      </span>
    `;
  }

  return nothing as unknown as TemplateResult;
}