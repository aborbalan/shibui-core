import { html, nothing, TemplateResult } from 'lit';
import { map } from 'lit/directives/map.js';
import type {
  TreeNode,
  TreeNodeState,
  TreeSelectTemplateProps,
  RenderNodeCtx,
} from './lib-tree-node.types';

/* ──────────────────────────────────────────────────────────────
   HELPERS
────────────────────────────────────────────────────────────── */

function nodeMatchesSearch(node: TreeNode, term: string): boolean {
  if (!term) return true;
  const t = term.toLowerCase();
  if (node.label.toLowerCase().includes(t)) return true;
  return node.children?.some(c => nodeMatchesSearch(c, term)) ?? false;
}

function highlightLabel(label: string, term: string): TemplateResult {
  if (!term) return html`${label}`;
  const idx = label.toLowerCase().indexOf(term.toLowerCase());
  if (idx === -1) return html`${label}`;
  return html`${label.slice(0, idx)}<mark>${label.slice(idx, idx + term.length)}</mark>${label.slice(idx + term.length)}`;
}

/* ──────────────────────────────────────────────────────────────
   RENDERIZADO RECURSIVO DE NODO
────────────────────────────────────────────────────────────── */

function renderNode(
  node: TreeNode,
  ctx: RenderNodeCtx,
  depth: number,
  ancestorIsLast: boolean[],
  isLast: boolean,
): TemplateResult | typeof nothing {

  if (ctx.searchValue && !nodeMatchesSearch(node, ctx.searchValue)) return nothing;

  const st: TreeNodeState = ctx.nodeStates.get(node.id)
    ?? { selected: false, indeterminate: false, expanded: false };

  const hasKids    = (node.children?.length ?? 0) > 0;
  const isExpanded = ctx.searchValue ? hasKids : st.expanded;

  /* ── Líneas de indentación (estética bambú) ── */
  const indent: TemplateResult | typeof nothing = depth > 0
    ? html`<div class="ts-indent">${
        Array.from({ length: depth }, (_, i) => {
          const isLastUnit      = i === depth - 1;
          const ancestorWasLast = ancestorIsLast[i] ?? false;
          const cls = [
            'ts-indent-unit',
            ancestorWasLast              ? 'ts-indent-no-line'   : '',
            isLastUnit                   ? 'ts-indent-last'       : '',
            isLastUnit && isLast         ? 'ts-indent-last-child' : '',
          ].filter(Boolean).join(' ');
          return html`<div class="${cls}"></div>`;
        })
      }</div>`
    : nothing;

  /* ── Toggle expand/collapse ── */
  const toggle: TemplateResult = hasKids
    ? html`
      <div
        class="ts-toggle"
        @click="${(e: Event): void => { e.stopPropagation(); ctx.onToggle(node.id); }}"
        aria-label="${isExpanded ? 'Colapsar' : 'Expandir'}"
      >
        <svg class="ts-toggle-icon" viewBox="0 0 8 8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <path d="M2 1.5l3 2.5-3 2.5"/>
        </svg>
      </div>`
    : html`<div class="ts-toggle-spacer"></div>`;

  /* ── Checkbox (solo en modo multi) ── */
  const checkbox: TemplateResult | typeof nothing = ctx.multi
    ? html`
      <div class="ts-checkbox">
        <svg class="ts-checkbox-check" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1.5 5l2.5 2.5L8.5 2"/>
        </svg>
        <div class="ts-checkbox-dash"></div>
      </div>`
    : nothing;

  /* ── Row classes ── */
  const rowCls = [
    'ts-node-row',
    st.selected && !st.indeterminate ? 'is-selected'     : '',
    st.indeterminate                  ? 'is-indeterminate' : '',
  ].filter(Boolean).join(' ');

  /* ── Badge (número de hijos directos) ── */
  const badge: TemplateResult | typeof nothing = hasKids
    ? html`<span class="ts-node-badge">${node.children!.length}</span>`
    : nothing;

  /* ── Hijos (siempre en DOM, animados con grid-template-rows) ── */
  const childAncestors = [...ancestorIsLast, isLast];
  const children: TemplateResult | typeof nothing = hasKids
    ? html`
      <div class="ts-children">
        <div class="ts-children-inner">
          ${map(node.children!, (child, ci) =>
            renderNode(child, ctx, depth + 1, childAncestors, ci === node.children!.length - 1)
          )}
        </div>
      </div>`
    : nothing;

  return html`
    <div class="ts-node ${isExpanded ? 'is-expanded' : ''}">
      <div class="${rowCls}" @click="${(): void => ctx.onSelect(node)}">
        ${indent}
        ${toggle}
        ${checkbox}
        <span class="ts-node-label">${highlightLabel(node.label, ctx.searchValue)}</span>
        ${badge}
      </div>
      ${children}
    </div>
  `;
}

/* ──────────────────────────────────────────────────────────────
   ÁRBOL COMPLETO
────────────────────────────────────────────────────────────── */
function renderTree(props: TreeSelectTemplateProps): TemplateResult {
  const ctx: RenderNodeCtx = {
    nodeStates:  props.nodeStates,
    multi:       props.multi,
    searchValue: props.searchValue,
    onToggle:    props.onToggle,
    onSelect:    props.onSelect,
  };

  const visibleNodes = props.nodes.filter(n =>
    !props.searchValue || nodeMatchesSearch(n, props.searchValue)
  );

  if (visibleNodes.length === 0) {
    return html`<div class="ts-empty">${props.emptyText}</div>`;
  }

  return html`${map(visibleNodes, (node, i) =>
    renderNode(node, ctx, 0, [], i === visibleNodes.length - 1)
  )}`;
}

/* ──────────────────────────────────────────────────────────────
   BÚSQUEDA
────────────────────────────────────────────────────────────── */
function renderSearch(props: TreeSelectTemplateProps): TemplateResult | typeof nothing {
  if (!props.searchable) return nothing;
  return html`
    <div class="ts-search-wrap">
      <svg class="ts-search-icon" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <circle cx="7" cy="7" r="5"/><path d="M12 12l2.5 2.5"/>
      </svg>
      <input
        class="ts-search"
        type="text"
        placeholder="Buscar…"
        .value="${props.searchValue}"
        autocomplete="off"
        @input="${(e: Event): void => props.onSearch((e.target as HTMLInputElement).value)}"
      >
    </div>
  `;
}

/* ──────────────────────────────────────────────────────────────
   FOOTER (solo en multi)
────────────────────────────────────────────────────────────── */
function renderFooter(props: TreeSelectTemplateProps): TemplateResult | typeof nothing {
  if (!props.multi) return nothing;
  return html`
    <div class="ts-footer">
      <span class="ts-footer-info">${props.footerInfo}</span>
      <div class="ts-footer-actions">
        <button class="ts-btn" @click="${props.onClear}">Limpiar</button>
        ${props.inline
          ? nothing
          : html`<button class="ts-btn ts-btn-confirm" @click="${props.onConfirm}">Aplicar</button>`}
      </div>
    </div>
  `;
}

/* ──────────────────────────────────────────────────────────────
   TAGS (multi dropdown — debajo del trigger)
────────────────────────────────────────────────────────────── */
function renderTags(props: TreeSelectTemplateProps): TemplateResult | typeof nothing {
  if (!props.multi || props.inline) return nothing;
  return html`
    <div class="ts-tags">
      ${map(props.tags, tag => html`
        <div class="ts-tag">
          ${tag.label}
          <span class="ts-tag-remove" @click="${(): void => props.onTagRemove(tag.id)}">×</span>
        </div>
      `)}
    </div>
  `;
}

/* ──────────────────────────────────────────────────────────────
   TEMPLATE PRINCIPAL
────────────────────────────────────────────────────────────── */
export function treeSelectTemplate(props: TreeSelectTemplateProps): TemplateResult {

  /* ── Modo INLINE ── */
  if (props.inline) {
    return html`
      <div class="ts-inline">
        ${renderSearch(props)}
        <div class="ts-tree">${renderTree(props)}</div>
        ${renderFooter(props)}
      </div>
    `;
  }

  /* ── Modo DROPDOWN ── */
  return html`
    <div class="ts-wrap">

      <div
        class="ts-trigger"
        @click="${props.onTriggerClick}"
        aria-haspopup="listbox"
        aria-expanded="${props.open}"
      >
        <span class="ts-trigger-label ${props.isPlaceholder ? 'is-placeholder' : ''}">
          ${props.isPlaceholder ? props.placeholder : props.triggerLabel}
        </span>

        ${props.multi && props.selectionCount > 0
          ? html`<span class="ts-trigger-count">${props.selectionCount}</span>`
          : nothing}

        <svg class="ts-trigger-chevron" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <path d="M3 6l5 5 5-5"/>
        </svg>
      </div>

      <div class="ts-dropdown" role="listbox">
        ${renderSearch(props)}
        <div class="ts-tree">${renderTree(props)}</div>
        ${renderFooter(props)}
      </div>

    </div>

    ${renderTags(props)}
  `;
}