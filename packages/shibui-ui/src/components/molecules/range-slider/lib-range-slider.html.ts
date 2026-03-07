import { html, nothing, TemplateResult } from 'lit';
import type { RsSize, RsTone, RsMark } from './lib-range-slider.component';

export interface RangeSliderTemplateProps {
  /* sizing / modes */
  size:     RsSize;
  tone:     RsTone;
  dual:     boolean;
  vertical: boolean;
  disabled: boolean;
  tooltip:  boolean;

  /* range attrs */
  min:  number;
  max:  number;
  step: number;

  /* values */
  value:    number;   // single mode
  valueMin: number;   // dual low
  valueMax: number;   // dual high

  /* computed pcts (0–100) */
  pct:    number;     // single fill
  minPct: number;     // dual fill left
  maxPct: number;     // dual fill right

  /* display */
  label:        string;
  unit:         string;
  showLimits:   boolean;
  limitMinText: string;
  limitMaxText: string;
  marks:        RsMark[];

  /* handlers */
  onInput:    (e: Event) => void;
  onInputMin: (e: Event) => void;
  onInputMax: (e: Event) => void;
}

/* ── Value display ───────────────────────────────────────── */
function renderValue(v: number | string, unit: string): TemplateResult {
  return html`${v}${unit ? html`<span class="rs-value-unit">${unit}</span>` : nothing}`;
}

/* ── Marks ───────────────────────────────────────────────── */
function renderMarks(marks: RsMark[], pct: number): TemplateResult {
  if (!marks.length) return html``;
  return html`
    <div class="rs-marks">
      ${marks.map(m => html`
        <div
          class="rs-mark ${m.pct <= pct ? 'is-filled' : ''}"
          style="left: ${m.pct}%"
        >
          ${m.label ? html`<span class="rs-mark-label">${m.label}</span>` : nothing}
        </div>
      `)}
    </div>
  `;
}

/* ── Limits ──────────────────────────────────────────────── */
function renderLimits(show: boolean, low: string, high: string): TemplateResult {
  if (!show) return html``;
  return html`
    <div class="rs-limits">
      <span class="rs-limit">${low}</span>
      <span class="rs-limit">${high}</span>
    </div>
  `;
}

/* ── Tooltip ─────────────────────────────────────────────── */
function renderTooltip(show: boolean, pct: number, value: number, unit: string): TemplateResult {
  if (!show) return html``;
  return html`
    <div class="rs-tooltip-wrap" style="left: ${pct}%">
      <span class="rs-tooltip-bubble">${value}${unit}</span>
    </div>
  `;
}

/* ── Track content ───────────────────────────────────────── */
function renderTrack(p: RangeSliderTemplateProps): TemplateResult {
  if (p.dual) {
    return html`
      <div class="rs-track-wrap">
        <div class="rs-track">
          <div
            class="rs-fill-dual"
            style="left: ${p.minPct}%; right: ${100 - p.maxPct}%"
          ></div>
        </div>
        <input
          type="range"
          class="rs-input-min"
          min=${p.min} max=${p.max} step=${p.step}
          .value=${String(p.valueMin)}
          ?disabled=${p.disabled}
          aria-label="Mínimo"
          @input=${p.onInputMin}
        >
        <input
          type="range"
          class="rs-input-max"
          min=${p.min} max=${p.max} step=${p.step}
          .value=${String(p.valueMax)}
          ?disabled=${p.disabled}
          aria-label="Máximo"
          @input=${p.onInputMax}
        >
      </div>
    `;
  }

  if (p.vertical) {
    return html`
      <div class="rs-vert-wrap">
        <div class="rs-track-wrap">
          <div class="rs-track">
            <div class="rs-fill" style="width: ${p.pct}%"></div>
          </div>
          <input
            type="range"
            min=${p.min} max=${p.max} step=${p.step}
            .value=${String(p.value)}
            ?disabled=${p.disabled}
            @input=${p.onInput}
          >
        </div>
      </div>
    `;
  }

  /* single horizontal */
  return html`
    <div class="rs-track-wrap">
      <div class="rs-track">
        <div class="rs-fill" style="width: ${p.pct}%"></div>
      </div>
      <input
        type="range"
        min=${p.min} max=${p.max} step=${p.step}
        .value=${String(p.value)}
        ?disabled=${p.disabled}
        @input=${p.onInput}
      >
      ${renderTooltip(p.tooltip, p.pct, p.value, p.unit)}
    </div>
  `;
}

/**
 * Template principal de lib-range-slider.
 */
export function rangeSliderTemplate(p: RangeSliderTemplateProps): TemplateResult {
  /* Dual value display: "120 — 480 €" */
  const valueDisplay = p.dual
    ? html`<span class="rs-value">
        ${p.valueMin} — ${p.valueMax}
        ${p.unit ? html`<span class="rs-value-unit">${p.unit}</span>` : nothing}
      </span>`
    : html`<span class="rs-value">${renderValue(p.value, p.unit)}</span>`;

  return html`
    <div class="rs">

      ${!p.vertical && (p.label || p.dual) ? html`
        <div class="rs-label-row">
          ${p.label ? html`<span class="rs-label">${p.label}</span>` : nothing}
          ${valueDisplay}
        </div>
      ` : nothing}

      ${renderTrack(p)}

      ${p.vertical ? html`
        <div class="rs-label-row">
          ${p.label ? html`<span class="rs-label">${p.label}</span>` : nothing}
          ${valueDisplay}
        </div>
      ` : nothing}

      ${renderMarks(p.marks, p.pct)}

      ${renderLimits(p.showLimits, p.limitMinText, p.limitMaxText)}

    </div>
  `;
}