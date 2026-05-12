import { html, TemplateResult } from 'lit';
import type { LibDropdown } from './lib-dropdown.component';

/* Chevron SVG inline — no depende de Phosphor ni ninguna lib */
const chevronSvg: TemplateResult = html`
  <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80a8,8,0,0,1,11.32-11.32L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/>
  </svg>`;

export function dropdownTemplate(ctx: LibDropdown): TemplateResult {
  return html`
    <div class="dd" part="root">

      <!-- ── Trigger ── -->
      <button
        class="dd-trigger"
        part="trigger"
        aria-haspopup="true"
        aria-expanded="${ctx.open}"
        aria-label="${ctx.ariaLabel || ctx.label}"
        @click="${(): void => ctx._toggle()}"
        @keydown="${(e: KeyboardEvent): void => ctx._handleTriggerKey(e)}"
      >
        <slot name="trigger">${ctx.label}</slot>
        <span class="dd-chevron" part="chevron">${chevronSvg}</span>
      </button>

      <!-- ── Panel ── -->
      <div
        class="dd-menu"
        part="menu"
        role="menu"
        style="${ctx.minWidth ? `--dd-min-width:${ctx.minWidth}` : ''}"
        @keydown="${(e: KeyboardEvent): void => ctx._handleMenuKey(e)}"
      >
        <!-- Header opcional (búsqueda, título) -->
        <div class="dd-header-wrap" part="header-wrap"
          style="${ctx._hasSlot('header') ? '' : 'display:none'}">
          <slot name="header"></slot>
        </div>

        <!-- Contenido: items, separadores, grupos -->
        <slot></slot>

        <!-- Footer opcional (acciones, confirmación) -->
        <div class="dd-footer-wrap" part="footer-wrap"
          style="${ctx._hasSlot('footer') ? '' : 'display:none'}">
          <slot name="footer"></slot>
        </div>
      </div>

    </div>
  `;
}