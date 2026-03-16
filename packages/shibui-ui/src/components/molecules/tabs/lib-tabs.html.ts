import { html, TemplateResult, nothing } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import type { LibTabs } from './lib-tabs.component';
import type { TabItem, TabsVariant } from './lib-tabs.types';

/* ── Badge ── */
function renderBadge(item: TabItem): TemplateResult | typeof nothing {
  return item.badge != null
    ? html`<span class="tb-badge">${item.badge}</span>`
    : nothing;
}

/* ── Tab button ── */
function renderTab(item: TabItem, context: LibTabs): TemplateResult {
  const isActive   = context.active === item.id;
  const isDisabled = item.disabled === true;

  return html`
    ${item.group
      ? html`<div class="tb-label">${item.group}</div>`
      : nothing}
    <button
      id="tab-${item.id}"
      class="tb-tab ${isActive ? 'is-active' : ''} ${isDisabled ? 'is-disabled' : ''}"
      role="tab"
      aria-selected="${isActive}"
      aria-controls="panel-${item.id}"
      tabindex="${isActive ? '0' : '-1'}"
      data-id="${item.id}"
      data-label="${item.label}"
      ?disabled="${isDisabled}"
      @click="${(e:Event):void=> context._handleClick(e as CustomEvent)}"
    >
      ${item.icon ? html`${unsafeHTML(item.icon)}` : nothing}
      ${item.label}
      ${renderBadge(item)}
    </button>
  `;
}

/* ── Panel ── */
function renderPanel(item: TabItem, context: LibTabs): TemplateResult {
  const isActive = context.active === item.id;
  return html`
    <div
      class="tb-panel ${isActive ? 'is-active' : ''}"
      role="tabpanel"
      id="panel-${item.id}"
      aria-labelledby="tab-${item.id}"
    >
      <slot name="${item.id}"></slot>
    </div>
  `;
}

/* ── Main template ── */
export function tabsTemplate(context: LibTabs): TemplateResult {
  const tabs = (context.items ?? []) as TabItem[];

  /* La ink bar solo aplica en underline (y sus modificadores kintsugi/glitch) */
  const showInk = !(['pill', 'card', 'outline', 'vertical'] as TabsVariant[]).includes(context.variant);

  return html`
    <div class="tb" part="root">

      <!-- Tab list -->
      <div
        class="tb-list"
        part="list"
        role="tablist"
        aria-label="${context.ariaLabel || nothing}"
        
        @keydown="${(e: KeyboardEvent): void => context._handleKey(e)}"
      >
        ${tabs.map(item => renderTab(item, context))}
      </div>

      <!-- Ink bar (posicionada por JS, solo para variantes underline) -->
      ${showInk
        ? html`<div class="tb-ink" part="ink" style="left:${context._inkLeft}px;width:${context._inkWidth}px;"></div>`
        : nothing}

      <!-- Panels -->
      <div class="tb-panels" part="panels">
        ${tabs.map(item => renderPanel(item, context))}
      </div>

    </div>
  `;
}