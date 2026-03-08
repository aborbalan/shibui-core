import { html, nothing, TemplateResult } from 'lit';
import type {
  TableColumn,
  TableRowData,
  TableVariant,
  TableSize,
  TableBadgeTone,
} from './lib-data-table.types';

/* ── Template Props ─────────────────────────────────────── */
export interface DataTableTemplateProps {
  columns:       TableColumn[];
  data:          TableRowData[];
  filteredTotal: number;
  totalRows:     number;
  variant:       TableVariant;
  size:          TableSize;
  dark:          boolean;
  loading:       boolean;
  selectable:    boolean;
  stickyHead:    boolean;
  caption:       string;
  emptyTitle:    string;
  emptyDesc:     string;
  toolbar:       boolean;
  toolbarTitle:  string;
  skeletonRows:  number;
  sortKey:       string;
  sortDir:       'asc' | 'desc';
  query:         string;
  selected:      Set<number>;
  allSelected:   boolean;
  someSelected:  boolean;
  page:          number;
  pageSize:      number;
  totalPages:    number;
  onSort:        (key: string) => void;
  onSearch:      (q: string) => void;
  onSelectAll:   (checked: boolean, total: number) => void;
  onSelectRow:   (idx: number, checked: boolean) => void;
  onRowAction:   (row: TableRowData, idx: number) => void;
  onPageChange:  (p: number) => void;
}

/* ── Helpers: Cell renderers ───────────────────────────── */

function renderBadge(value: unknown, tone: string): TemplateResult {
  const label = String(value ?? '');
  return html`<span class="cell-badge tone-${tone}">${label}</span>`;
}

function renderProgress(value: unknown, tone: 'kaki' | 'celadon' | ''): TemplateResult {
  const pct = Math.min(100, Math.max(0, Number(value) || 0));
  const toneClass = tone ? `tone-${tone}` : '';
  return html`
    <div class="cell-progress">
      <div class="progress-bar">
        <div class="progress-fill ${toneClass}" style="width:${pct}%"></div>
      </div>
      <span class="progress-val">${pct}%</span>
    </div>
  `;
}

function renderAvatar(row: TableRowData, col: TableColumn): TemplateResult {
  const name     = String(row[col.key] ?? '');
  const initials = col.initialsKey
    ? String(row[col.initialsKey] ?? '').slice(0, 2).toUpperCase()
    : name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const hint = col.hintKey ? String(row[col.hintKey] ?? '') : '';

  return html`
    <div class="cell-avatar">
      <div class="avatar-circle">${initials}</div>
      <div class="avatar-text">
        <span class="avatar-name">${name}</span>
        ${hint ? html`<span class="avatar-hint">${hint}</span>` : nothing}
      </div>
    </div>
  `;
}

function renderActionsBtn(row: TableRowData, idx: number, onRowAction: (r: TableRowData, i: number) => void): TemplateResult {
  return html`
    <button class="actions-btn"
      aria-label="Acciones"
      @click="${(e: Event):void => { e.stopPropagation(); onRowAction(row, idx); }}"
    >⋯</button>
  `;
}

function renderCell(col: TableColumn, row: TableRowData, idx: number, onRowAction: (r: TableRowData, i: number) => void): TemplateResult {
  const value = row[col.key];

  switch (col.type) {
    case 'badge': {
      const tone = col.toneKey
        ? String(row[col.toneKey] ?? 'inactive')
        : (col.badgeTone ?? 'inactive');
      return renderBadge(value, tone as TableBadgeTone);
    }
    case 'progress':
      return renderProgress(value, col.progressTone ?? '');
    case 'avatar':
      return renderAvatar(row, col);
    case 'actions':
      return renderActionsBtn(row, idx, onRowAction);
    case 'mono':
      return html`<span class="cell-mono">${value ?? '—'}</span>`;
    default:
      return html`${value ?? '—'}`;
  }
}

/* ── Helpers: Structural ───────────────────────────────── */

function thClasses(col: TableColumn, sortKey: string, sortDir: 'asc' | 'desc'): string {
  const parts: string[] = [];
  if (col.type === 'num')     parts.push('cell-num', 'is-num');
  if (col.sticky)             parts.push('col-sticky');
  if (col.sortable) {
    parts.push('is-sortable');
    if (sortKey === col.key)  parts.push(sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
  }
  return parts.join(' ');
}

function tdClasses(col: TableColumn): string {
  const parts: string[] = [];
  if (col.type === 'num')      parts.push('cell-num');
  if (col.type === 'actions')  parts.push('cell-actions');
  if (col.sticky)              parts.push('col-sticky');
  if (col.truncate)            parts.push('cell-truncate');
  return parts.join(' ');
}

function rowClass(row: TableRowData, idx: number, selected: Set<number>): string {
  const state = row._state;
  const isSelected = selected.has(idx) || state === 'selected';
  const parts: string[] = [];
  if (isSelected)           parts.push('is-selected');
  else if (state)           parts.push(`is-${state}`);
  return parts.join(' ');
}

/* ── Skeleton rows ───────────────────────────────────────── */
const WIDTHS = ['w-80', 'w-60', 'w-40', 'w-60', 'w-80'] as const;

function renderSkeletonCell(col: TableColumn, idx: number): TemplateResult {
  const w = WIDTHS[idx % WIDTHS.length] ?? 'w-60';
  if (col.type === 'avatar') return html`
    <div class="skel-cell">
      <div class="skel-avatar"></div>
      <div style="flex:1;display:flex;flex-direction:column;gap:4px;">
        <div class="skel-line ${w}"></div>
        <div class="skel-line w-40" style="height:7px;"></div>
      </div>
    </div>`;
  if (col.type === 'badge')  return html`<div class="skel-badge"></div>`;
  if (col.type === 'num')    return html`<div class="skel-line ${w}" style="margin-left:auto;"></div>`;
  return html`<div class="skel-line ${w}"></div>`;
}

function renderSkeleton(count: number, cols: TableColumn[], selectable: boolean): TemplateResult {
  return html`${Array.from({ length: count }, (_, r) => html`
    <tr class="tbl-tr">
      ${selectable ? html`<td class="cell-check"></td>` : nothing}
      ${cols.map((col, c) => html`
        <td class="${tdClasses(col)}" style="${col.type === 'actions' ? '' : ''}">
          ${renderSkeletonCell(col, r + c)}
        </td>
      `)}
    </tr>
  `)}`;
}

/* ── Empty state ─────────────────────────────────────────── */
function renderEmpty(title: string, desc: string, colSpan: number): TemplateResult {
  return html`
    <tr class="empty-row">
      <td colspan="${colSpan}">
        <span class="empty-icon">◯</span>
        <span class="empty-title">${title}</span>
        <span class="empty-desc">${desc}</span>
      </td>
    </tr>
  `;
}

/* ── Toolbar ─────────────────────────────────────────────── */
function renderToolbar(p: DataTableTemplateProps): TemplateResult {
  const countLabel = p.query
    ? `${p.filteredTotal} de ${p.totalRows}`
    : `${p.totalRows} registros`;

  return html`
    <div class="tbl-toolbar">
      ${p.toolbarTitle ? html`<span class="tbl-toolbar-title">${p.toolbarTitle}</span>` : nothing}
      <span class="tbl-toolbar-count">${countLabel}</span>
      <input
        class="tbl-toolbar-search"
        type="search"
        placeholder="Buscar…"
        .value="${p.query}"
        @input="${(e: Event):void => p.onSearch((e.target as HTMLInputElement).value)}"
      >
      <slot name="toolbar-actions"></slot>
    </div>
  `;
}

/* ── Built-in pagination bar ─────────────────────────────── */
function buildPageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | '…')[] = [1];
  if (current > 3) pages.push('…');
  const lo = Math.max(2, current - 1);
  const hi = Math.min(total - 1, current + 1);
  for (let i = lo; i <= hi; i++) pages.push(i);
  if (current < total - 2) pages.push('…');
  pages.push(total);
  return pages;
}

function renderPagination(p: DataTableTemplateProps): TemplateResult {
  if (p.pageSize <= 0 || p.totalPages <= 1) return html``;
  const start  = (p.page - 1) * p.pageSize + 1;
  const end    = Math.min(p.page * p.pageSize, p.filteredTotal);
  const pages  = buildPageNumbers(p.page, p.totalPages);

  return html`
    <div class="tbl-pagination">
      <span class="pag-info">${start}–${end} de ${p.filteredTotal}</span>

      <button class="pag-btn" ?disabled="${p.page <= 1}"
        @click="${():void => p.onPageChange(p.page - 1)}">‹</button>

      ${pages.map(pg => pg === '…'
        ? html`<span class="pag-sep">…</span>`
        : html`
          <button class="pag-btn ${p.page === pg ? 'is-active' : ''}"
            @click="${():void => p.onPageChange(pg as number)}">${pg}</button>
        `)}

      <button class="pag-btn" ?disabled="${p.page >= p.totalPages}"
        @click="${():void => p.onPageChange(p.page + 1)}">›</button>
    </div>
  `;
}

/* ── Main template ────────────────────────────────────────── */
export function dataTableTemplate(p: DataTableTemplateProps): TemplateResult {
  const colSpan  = p.columns.length + (p.selectable ? 1 : 0);
  const wrapCls  = `tbl-wrap${p.stickyHead ? ' tbl-sticky-head' : ''}`;

  return html`
    ${p.toolbar ? renderToolbar(p) : nothing}

    <div class="${wrapCls}">
      <table>
        ${p.caption ? html`<caption>${p.caption}</caption>` : nothing}

        <!-- THEAD -->
        <thead>
          <tr>
            ${p.selectable ? html`
              <th class="cell-check">
                <input type="checkbox"
                  .indeterminate="${p.someSelected}"
                  .checked="${p.allSelected}"
                  @change="${(e: Event):void =>
                    p.onSelectAll((e.target as HTMLInputElement).checked, p.data.length)}">
              </th>
            ` : nothing}

            ${p.columns.map(col => html`
              <th class="${thClasses(col, p.sortKey, p.sortDir)}"
                @click="${col.sortable ? ():void => p.onSort(col.key) : nothing}">
                ${col.header}
              </th>
            `)}
          </tr>
        </thead>

        <!-- TBODY -->
        <tbody>
          ${p.loading
            ? renderSkeleton(p.skeletonRows, p.columns, p.selectable)
            : p.data.length === 0
              ? renderEmpty(p.emptyTitle, p.emptyDesc, colSpan)
              : p.data.map((row, idx) => {
                  const globalIdx = (p.page - 1) * (p.pageSize || 0) + idx;
                  return html`
                    <tr class="${rowClass(row, globalIdx, p.selected)}">
                      ${p.selectable ? html`
                        <td class="cell-check">
                          <input type="checkbox"
                            .checked="${p.selected.has(globalIdx)}"
                            @change="${(e: Event):void =>
                              p.onSelectRow(globalIdx, (e.target as HTMLInputElement).checked)}">
                        </td>
                      ` : nothing}

                      ${p.columns.map(col => html`
                        <td class="${tdClasses(col)}">
                          ${renderCell(col, row, globalIdx, p.onRowAction)}
                        </td>
                      `)}
                    </tr>
                  `;
                })
          }
        </tbody>
      </table>
    </div>

    ${renderPagination(p)}
    <slot name="pagination"></slot>
  `;
}