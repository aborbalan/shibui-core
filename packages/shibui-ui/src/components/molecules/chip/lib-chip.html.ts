import { html, TemplateResult } from 'lit';
import type { LibChip } from './lib-chip.component';


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
      <lib-close-button
        class="chip-remove"
        part="remove"
        size="xs"
        variant="ghost"
        aria-label="Eliminar ${ctx.ariaLabel || ''}"
        @click="${(e: Event): void => e.stopPropagation()}"
        @lib-close="${(e: Event): void => ctx._handleRemove(e)}"
      ></lib-close-button>
    </span>`;
}

export function chipTemplate(ctx: LibChip): TemplateResult {
  if (ctx.kind === 'toggle') return toggleChip(ctx);
  if (ctx.kind === 'input')  return inputChip(ctx);
  return staticChip(/*ctx*/);
}