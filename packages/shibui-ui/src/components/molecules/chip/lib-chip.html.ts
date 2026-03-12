import { html, TemplateResult } from 'lit';
import type { LibChip } from './lib-chip.component';

/* SVG × para el botón de eliminar */
const removeSvg: TemplateResult = html`
  <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/>
  </svg>`;

/* ── Familia STATIC ── */
function staticChip(/*ctx: LibChip*/): TemplateResult {
  return html`
    <span class="chip" part="chip" role="note" tabindex="-1">
      <slot name="icon"></slot>
      <slot></slot>
    </span>`;
}

/* ── Familia TOGGLE ── */
function toggleChip(ctx: LibChip): TemplateResult {
  return html`
    <button
      class="chip-toggle"
      part="chip"
      role="checkbox"
      aria-checked="${ctx.selected}"
      aria-label="${ctx.ariaLabel}"
      @click="${(): void => ctx._handleToggle()}"
      @keydown="${(e: KeyboardEvent): void => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          ctx._handleToggle();
        }
      }}"
    >
      <slot name="icon"></slot>
      <slot></slot>
    </button>`;
}

/* ── Familia INPUT (removable) ── */
function inputChip(ctx: LibChip): TemplateResult {
  return html`
    <span class="chip-input" part="chip">
      <slot name="avatar"></slot>
      <slot name="icon"></slot>
      <slot></slot>
      <button
        class="chip-remove"
        part="remove"
        type="button"
        aria-label="Eliminar ${ctx.ariaLabel || ''}"
        @click="${(e: MouseEvent): void => ctx._handleRemove(e)}"
      >
        ${removeSvg}
      </button>
    </span>`;
}

export function chipTemplate(ctx: LibChip): TemplateResult {
  if (ctx.kind === 'toggle') return toggleChip(ctx);
  if (ctx.kind === 'input')  return inputChip(ctx);
  return staticChip(/*ctx*/);
}