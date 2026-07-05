import { html, nothing, type TemplateResult } from 'lit';
import type { LibPanel } from './lib-panel.component';

export function renderPanel(ctx: LibPanel): TemplateResult {
  const showHeader = !!ctx.heading || ctx.hasHeaderSlot;

  return html`
    <section class="panel" part="panel">
      <header class="panel__header" part="header" ?hidden=${!showHeader}>
        ${ctx.heading
          ? html`<h3 class="panel__title" part="title">${ctx.heading}</h3>`
          : nothing}
        <slot name="header" @slotchange=${(): void => ctx.onHeaderSlotChange()}></slot>
      </header>

      <div class="panel__body" part="body">
        <slot></slot>
      </div>

      <footer class="panel__footer" part="footer" ?hidden=${!ctx.hasFooterSlot}>
        <slot name="footer" @slotchange=${(): void => ctx.onFooterSlotChange()}></slot>
      </footer>
    </section>
  `;
}
