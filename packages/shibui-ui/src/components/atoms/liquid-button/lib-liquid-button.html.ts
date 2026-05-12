import { html, svg, nothing, TemplateResult } from 'lit';
import type { LibButtonLiquid } from './lib-liquid-button.component';

/* ── Spinner SVG ── */
const spinnerSvg: TemplateResult = svg`
  <svg class="spinner" viewBox="0 0 16 16" fill="none"
    stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <path d="M8 2a6 6 0 1 0 6 6" opacity="0.3"/>
    <path d="M14 8a6 6 0 0 0-6-6"/>
  </svg>`;

/* ── Main template ── */
export function buttonLiquidTemplate(ctx: LibButtonLiquid): TemplateResult {
  const { loading, disabled } = ctx;

  return html`
    <button
      class="btn"
      part="button"
      ?disabled="${disabled || loading}"
      aria-disabled="${disabled || loading}"
      aria-busy="${loading ? 'true' : nothing}"
      @mouseenter="${(e: MouseEvent): void => ctx._onMouseEnter(e)}"
      @mouseleave="${(): void => ctx._onMouseLeave()}"
      @mousedown="${(e: MouseEvent): void => ctx._onMouseDown(e)}"
    >
      <!-- Canvas inyectado por el componente en firstUpdated -->

      <span class="btn-inner" part="inner">
        ${loading ? spinnerSvg : nothing}
        <slot name="prefix"></slot>
        <slot></slot>
        <slot name="suffix"></slot>
      </span>
    </button>
  `;
}