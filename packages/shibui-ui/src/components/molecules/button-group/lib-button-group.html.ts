import { html, svg, TemplateResult } from 'lit';
import type { LibVariant, LibSize } from '../../../types';
import type { SplitMenuItem } from './lib-button-group.types';

/* ── Caret SVG (va dentro del slot del lib-button flecha) ── */
const CARET = svg`
  <svg width="9" height="9" viewBox="0 0 10 10" fill="none"
    stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="2,3 5,7 8,3"/>
  </svg>`;

/* ────────────────────────────────────────────
   Group template
   ──────────────────────────────────────────── */
export function buttonGroupTemplate(): TemplateResult {
  return html`
    <div class="bg-wrap" part="group">
      <slot></slot>
    </div>
  `;
}

/* ────────────────────────────────────────────
   Split template — compone dos lib-button
   ──────────────────────────────────────────── */
export interface SplitTemplateProps {
  label:       string;
  variant:     LibVariant;
  size:        LibSize;
  dark:        boolean;
  disabled:    boolean;
  menuOpen:    boolean;
  items:       SplitMenuItem[];
  onMainClick: (e: Event) => void;
  onArrowClick:(e: Event) => void;
}

export function buttonSplitTemplate(p: SplitTemplateProps): TemplateResult {
  const { label, variant, size, dark, disabled, menuOpen, items } = p;

  /* Kintsugi en el arrow solo para variantes sólidas (accent/primary) */
  const arrowKintsugi = variant === 'accent' || variant === 'primary';

  const menuItems: TemplateResult = items.length > 0
    ? html`${items.map(item => html`
        <button
          class="split-menu-item"
          ?disabled="${item.disabled ?? false}"
          data-value="${item.value}"
        >${item.label}</button>
      `)}`
    : html`<slot name="menu"></slot>`;

  return html`
    <div class="split-wrap" part="split">

      <!-- Acción principal: lib-button posición "first" -->
      <lib-button
        part="main"
        variant="${variant}"
        size="${size}"
        ?dark="${dark}"
        ?disabled="${disabled}"
        group-pos="first"
        group-shape="rounded"
        @click="${p.onMainClick}"
      >
        <slot slot="prefix" name="prefix"></slot>
        ${label}
        <slot slot="suffix" name="suffix"></slot>
      </lib-button>

      <!-- Flecha: lib-button posición "last", icon-only -->
      <lib-button
        part="arrow"
        variant="${variant}"
        size="${size}"
        ?dark="${dark}"
        ?disabled="${disabled}"
        group-pos="last"
        group-shape="rounded"
        icon-only
        ?kintsugi="${arrowKintsugi}"
        aria-label="Más opciones"
        aria-haspopup="true"
        aria-expanded="${menuOpen ? 'true' : 'false'}"
        @click="${p.onArrowClick}"
      >${CARET}</lib-button>

      <!-- Menú desplegable -->
      <div
        class="split-menu ${menuOpen ? 'is-open' : ''}"
        part="menu"
        style="${menuOpen ? 'display:block' : 'display:none'}"
        role="menu"
      >
        ${menuItems}
      </div>

    </div>
  `;
}