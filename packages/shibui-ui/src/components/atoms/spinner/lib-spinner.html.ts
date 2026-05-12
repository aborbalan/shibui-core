import { html, svg, TemplateResult } from 'lit';
import type { SpinnerVariant, SpinnerSize, SpinnerTone } from './lib-spinner.component';

export interface SpinnerTemplateProps {
  variant: SpinnerVariant;
  size:    SpinnerSize;
  tone:    SpinnerTone;
  dark:    boolean;
  label:   string;
}

/* ── Stroke configs per tone+dark ──────────────────────────── */
type StrokeConfig = {
  blur:  string;  /* blur circle stroke color */
  main:  string;  /* main circle stroke color */
  bopacity: number; /* blur circle opacity */
};

function ensoStroke(tone: SpinnerTone, dark: boolean): StrokeConfig {
  if (dark) {
    if (tone === 'kaki') {
      return { blur: 'oklch(70% 0.14 60)', main: 'oklch(68% 0.13 60)', bopacity: 0.30 };
    }
    /* ink / celadon → paper on dark */
    return { blur: 'oklch(88% 0.01 60)', main: 'oklch(88% 0.01 60)', bopacity: 0.20 };
  }
  if (tone === 'kaki')    return { blur: 'oklch(55% 0.08 45)', main: 'oklch(50% 0.07 45)', bopacity: 0.25 };
  if (tone === 'celadon') return { blur: 'oklch(50% 0.06 180)', main: 'oklch(48% 0.06 180)', bopacity: 0.25 };
  /* default: ink */
  return { blur: 'oklch(25% 0.02 45)', main: 'oklch(25% 0.02 45)', bopacity: 0.25 };
}

type StrokeWidth = { blur: number; main: number; feStd: number; };
function ensoWidths(size: SpinnerSize): StrokeWidth {
  if (size === 'sm') return { blur: 2.5, main: 2,   feStd: 1.5 };
  if (size === 'lg') return { blur: 3.5, main: 3,   feStd: 2.0 };
  return              { blur: 3,   main: 2.5, feStd: 1.5 }; /* md */
}

/* ── Enso ───────────────────────────────────────────────────── */
function ensoTemplate(props: SpinnerTemplateProps): TemplateResult {
  const stroke = ensoStroke(props.tone, props.dark);
  const w      = ensoWidths(props.size);
  /* Each shadow DOM is isolated → filter IDs are collision-free */
  const fid    = 'sp-enso-blur';

  return html`
    ${svg`
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
        <defs>
          <filter id="${fid}">
            <feGaussianBlur stdDeviation="${w.feStd}" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <!-- blur halo layer -->
        <circle
          cx="24" cy="24" r="18"
          stroke="${stroke.blur}"
          stroke-width="${w.blur}"
          stroke-linecap="round"
          stroke-dasharray="95 18"
          fill="none"
          opacity="${stroke.bopacity}"
          filter="url(#${fid})"
        />
        <!-- crisp layer -->
        <circle
          cx="24" cy="24" r="18"
          stroke="${stroke.main}"
          stroke-width="${w.main}"
          stroke-linecap="round"
          stroke-dasharray="95 18"
          fill="none"
        />
      </svg>
    `}
  `;
}

/* ── Sumi ───────────────────────────────────────────────────── */
function sumiTemplate(): TemplateResult {
  return html`
    <div class="sp-sumi-wrap">
      <div class="sp-sumi"></div>
    </div>
  `;
}

/* ── Kintsugi ───────────────────────────────────────────────── */
function kintsugiTemplate(): TemplateResult {
  return html`<div class="sp-kintsugi"></div>`;
}

/* ── Shizuku ────────────────────────────────────────────────── */
function shizukuTemplate(size: SpinnerSize): TemplateResult {
  const cls = `sp-shizuku sp-shizuku--${size}`;
  return html`
    <div class="${cls}">
      <span></span><span></span><span></span>
      <span></span><span></span><span></span>
    </div>
  `;
}

/* ── Root ───────────────────────────────────────────────────── */
export function spinnerTemplate(props: SpinnerTemplateProps): TemplateResult {
  const inner: TemplateResult =
    props.variant === 'sumi'     ? sumiTemplate() :
    props.variant === 'kintsugi' ? kintsugiTemplate() :
    props.variant === 'shizuku'  ? shizukuTemplate(props.size) :
    ensoTemplate(props);

  return html`
    <div
      role="status"
      aria-label="${props.label}"
      aria-live="polite"
    >
      ${inner}
      <!-- Visually hidden label for screen readers -->
      <span style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;">${props.label}</span>
    </div>
  `;
}