import { html, svg, TemplateResult } from 'lit';
import type { SpinnerTheme, SpinnerSize, SpinnerTone } from './lib-spinner.component';

export interface SpinnerTemplateProps {
  theme:   SpinnerTheme;
  size:    SpinnerSize;
  tone:    SpinnerTone;
  dark:    boolean;
  label:   string;
}

/* ── Stroke configs per tone+dark ──────────────────────────── */
/* Color is now driven by CSS `color` / `--_sp-color` tokens so
   the enso adapts automatically to any katachi context.
   Only bopacity (blur-halo opacity) stays TS-computed.         */
type StrokeConfig = {
  bopacity: number; /* blur halo opacity */
};

function ensoStroke(tone: SpinnerTone, dark: boolean): StrokeConfig {
  if (dark && tone === 'accent') return { bopacity: 0.30 };
  if (dark)                      return { bopacity: 0.20 };
  return                         { bopacity: 0.25 };
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
        <!-- blur halo layer — color via CSS currentColor -->
        <circle
          cx="24" cy="24" r="18"
          stroke="currentColor"
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
          stroke="currentColor"
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

/* ── Kin (金) — anillo dorado ───────────────────────────────── */
function kinTemplate(): TemplateResult {
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
    props.theme === 'sumi'    ? sumiTemplate() :
    props.theme === 'kin'     ? kinTemplate() :
    props.theme === 'shizuku' ? shizukuTemplate(props.size) :
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