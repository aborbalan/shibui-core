import { html, nothing, TemplateResult } from 'lit';
import type { ProgressTemplateProps, ProgressSegment, ProgressSegmentTone } from './lib-progress.types';

/* ── Tone → CSS class for segments ── */
const SEGMENT_TONE_CLASS: Record<ProgressSegmentTone, string> = {
  default: 'seg-default',
  kaki:    'seg-kaki',
  celadon: 'seg-celadon',
  error:   'seg-error',
  muted:   'seg-muted',
};

/* ── Tone → CSS variable for legend dot ── */
const SEGMENT_TONE_VAR: Record<ProgressSegmentTone, string> = {
  default: 'var(--color-washi-900)',
  kaki:    'var(--color-kaki-500)',
  celadon: 'var(--color-celadon-500)',
  error:   'var(--color-error)',
  muted:   'var(--color-washi-300)',
};

function segmentColor(seg: ProgressSegment): string {
  if (seg.color) return seg.color;
  const tone = seg.tone ?? 'default';
  return SEGMENT_TONE_VAR[tone];
}

function segmentClass(seg: ProgressSegment): string {
  if (seg.color) return '';
  return SEGMENT_TONE_CLASS[seg.tone ?? 'default'];
}

/* ── Multi-segment bar ── */
function multiBarTpl(props: ProgressTemplateProps): TemplateResult {
  const hasLegend = props.segments.some(s => s.label);

  return html`
    <div class="pb-multi">
      ${props.segments.map(seg => html`
        <div
          class="pb-segment ${segmentClass(seg)}"
          style="
            width: ${seg.percent}%;
            ${seg.color ? `background: ${seg.color};` : ''}
          "
        ></div>
      `)}
    </div>

    ${hasLegend ? html`
      <div class="pb-legend">
        ${props.segments.filter(s => s.label).map(seg => html`
          <div class="pb-legend-item">
            <div
              class="pb-legend-dot"
              style="background: ${segmentColor(seg)};"
            ></div>
            <span class="pb-legend-text">${seg.label}</span>
          </div>
        `)}
      </div>` : nothing}
  `;
}

/* ── Single bar ── */
function singleBarTpl(props: ProgressTemplateProps): TemplateResult {
  const showInnerValue = props.size === 'xl' && props.showValue && !props.indeterminate;

  return html`
    <div
      class="pb"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="${props.max}"
      aria-valuenow="${props.indeterminate ? nothing : props.rawValue}"
      aria-label="${props.ariaLabel || nothing}"
    >
      <div class="pb-fill" style="width: ${props.indeterminate ? 100 : props.percent}%">
        ${showInnerValue
          ? html`<span class="pb-inner-value">${Math.round(props.percent)}%</span>`
          : nothing}
      </div>
    </div>
  `;
}

/**
 * Template para lib-progress.
 * Renderiza la barra con o sin meta (label/value/sub).
 * Si segments.length > 0 → modo multi-segmento.
 */
export function progressTemplate(props: ProgressTemplateProps): TemplateResult {
  const isMulti     = props.segments.length > 0;
  const hasMeta     = !!(props.label || props.valueLabel);
  const showPercent = !isMulti && props.showValue && !props.indeterminate && props.size !== 'xl';

  const displayValue = props.valueLabel
    ? props.valueLabel
    : showPercent
      ? `${Math.round(props.percent)}%`
      : nothing;

  const barTpl = isMulti ? multiBarTpl(props) : singleBarTpl(props);

  /* With meta wrapper */
  if (hasMeta) {
    return html`
      <div class="pb-wrap">
        <div class="pb-header">
          <span class="pb-label">${props.label}</span>
          ${displayValue !== nothing
            ? html`<span class="pb-value">${displayValue}</span>`
            : nothing}
        </div>
        ${barTpl}
        ${props.sub ? html`<span class="pb-sub">${props.sub}</span>` : nothing}
      </div>
    `;
  }

  /* Plain bar */
  return html`${barTpl}`;
}