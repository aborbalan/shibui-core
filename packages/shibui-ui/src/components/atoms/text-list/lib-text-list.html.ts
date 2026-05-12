import { html, nothing, TemplateResult } from 'lit';
import { map } from 'lit/directives/map.js';
import type {
  TextListTemplateProps,
  ContentItem,
  UiItem,
  UiRow,
  UiSectionHeader,
  DlItem,
} from './lib-text-list.types';

/* ================================================================
   HELPERS — Content List
   ================================================================ */

function renderContentItem(
  item: ContentItem,
  marker: TextListTemplateProps['marker'],
): TemplateResult {
  return html`
    <li class="lst-item">
      ${marker === 'check'
        ? html`
            <span class="lst-check-icon" style="${item.checked === false ? 'color:var(--color-washi-300)' : ''}">
              <lib-icon
                name="${item.checked === false ? 'circle' : 'check-circle'}"
                weight="${item.checked === false ? 'regular' : 'fill'}"
                size="sm"
              ></lib-icon>
            </span>`
        : nothing}

      <span class="lst-item-text">${item.label}</span>

      ${item.children && item.children.length
        ? html`
            <ul class="lst">
              ${map(item.children, (child: ContentItem) =>
                renderContentItem(child, marker)
              )}
            </ul>`
        : nothing}
    </li>
  `;
}

/* ================================================================
   HELPERS — UI List
   ================================================================ */

function renderUiItem(
  item: UiItem,
  interactive: boolean,
  onRowClick: (r: UiRow) => void,
  onToggle: (r: UiRow, v: boolean) => void,
): TemplateResult {
  /* Separator */
  if (item.type === 'separator') {
    return html`<li class="lst-sep" role="separator"></li>`;
  }

  /* Section header */
  if (item.type === 'header') {
    const h = item as UiSectionHeader;
    return html`<li class="lst-section-header">${h.label}</li>`;
  }

  /* Row */
  const row = item as UiRow;
  const rowCls = [
    'lst-row',
    row.selected ? 'is-selected' : '',
    row.disabled ? 'is-disabled' : '',
    row.danger   ? 'is-danger'   : '',
  ].filter(Boolean).join(' ');

  return html`
    <li
      class="${rowCls}"
      role="${interactive ? 'button' : 'listitem'}"
      tabindex="${interactive && !row.disabled ? '0' : '-1'}"
      aria-selected="${row.selected ?? false}"
      aria-disabled="${row.disabled ?? false}"
      @click="${(): void => { if (!row.disabled) onRowClick(row); }}"
      @keydown="${(e: KeyboardEvent): void => {
        if ((e.key === 'Enter' || e.key === ' ') && !row.disabled) {
          e.preventDefault();
          onRowClick(row);
        }
      }}"
    >
      <!-- Icon o Avatar -->
      ${row.avatar
        ? html`<div class="lst-row-avatar">${row.avatar}</div>`
        : row.icon
          ? html`
              <div class="lst-row-icon ${row.iconVariant ? `icon-${row.iconVariant}` : ''}">
                <lib-icon name="${row.icon}" size="sm"></lib-icon>
              </div>`
          : nothing}

      <!-- Body -->
      <div class="lst-row-body">
        <span class="lst-row-label">${row.label}</span>
        ${row.desc ? html`<span class="lst-row-desc">${row.desc}</span>` : nothing}
      </div>

      <!-- Meta -->
      ${row.meta ? html`<span class="lst-row-meta">${row.meta}</span>` : nothing}

      <!-- Badge -->
      ${row.badge
        ? html`
            <span class="lst-badge lst-badge-${row.badge.variant ?? 'default'}">
              ${row.badge.label}
            </span>`
        : nothing}

      <!-- Toggle -->
      ${row.toggle != null
        ? html`
            <input
              type="checkbox"
              class="lst-row-toggle"
              .checked="${row.toggle}"
              @click="${(e: Event): void => {
                e.stopPropagation();
                const target = e.currentTarget as HTMLInputElement;
                onToggle(row, target.checked);
              }}"
              aria-label="${row.label}"
            />`
        : nothing}

      <!-- Chevron -->
      ${row.chevron
        ? html`
            <span class="lst-row-action">
              <lib-icon name="caret-right" size="sm"></lib-icon>
            </span>`
        : nothing}
    </li>
  `;
}

/* ================================================================
   HELPERS — Description List
   ================================================================ */

function renderDlItem(item: DlItem): TemplateResult {
  return html`
    <dt class="lst-dt">${item.term}</dt>
    <dd class="lst-dd ${item.mono ? 'lst-dd-mono' : ''}">${item.description}</dd>
  `;
}

/* ================================================================
   TEMPLATE PRINCIPAL
   ================================================================ */

export function textListTemplate(props: TextListTemplateProps): TemplateResult {
  const {
    family, contentItems, marker, counter, size,
    uiItems, divided, bordered, inset, interactive, dark,
    dlItems, dlLayout, dlDivided,
    onRowClick, onToggle,
  } = props;

  /* ── CONTENT LIST ── */
  if (family === 'ul' || family === 'ol') {
    const trackCls = [
      'lst',
      size !== 'md'   ? `lst-${size}`            : '',
      marker === 'kaki'    ? 'lst-kaki'    : '',
      marker === 'dash'    ? 'lst-dash'    : '',
      marker === 'check'   ? 'lst-checked' : '',
      family === 'ol' && counter === 'roman' ? 'lst-ordered-roman' : '',
      family === 'ol' && counter === 'alpha' ? 'lst-ordered-alpha' : '',
    ].filter(Boolean).join(' ');

    const items = html`
      ${map(contentItems, (item: ContentItem) => renderContentItem(item, marker))}
    `;

    return family === 'ol'
      ? html`<ol class="${trackCls}">${items}</ol>`
      : html`<ul class="${trackCls}">${items}</ul>`;
  }

  /* ── UI LIST ── */
  if (family === 'ui') {
    const trackCls = [
      'lst-ui',
      divided     ? 'lst-divided'     : '',
      bordered    ? 'lst-bordered'    : '',
      inset       ? 'lst-inset'       : '',
      interactive ? 'lst-interactive' : '',
      dark        ? 'lst-dark'        : '',
    ].filter(Boolean).join(' ');

    return html`
      <ul
        class="${trackCls}"
        role="${interactive ? 'listbox' : 'list'}"
      >
        ${map(uiItems, (item: UiItem) =>
          renderUiItem(item, interactive, onRowClick, onToggle)
        )}
      </ul>
    `;
  }

  /* ── DESCRIPTION LIST ── */
  const dlCls = [
    'lst-dl',
    dlLayout === 'wide'  ? 'lst-dl-wide'    : '',
    dlLayout === 'stack' ? 'lst-dl-stack'   : '',
    dlDivided            ? 'lst-dl-divided' : '',
    dark                 ? 'lst-dark'       : '',
  ].filter(Boolean).join(' ');

  return html`
    <dl class="${dlCls}">
      ${map(dlItems, (item: DlItem) => renderDlItem(item))}
    </dl>
  `;
}