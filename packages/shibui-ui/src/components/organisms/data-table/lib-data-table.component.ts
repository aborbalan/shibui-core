import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type {
  TableColumn,
  TableRowData,
  TableVariant,
  TableSize,
  TableSortEventDetail,
  TableFilterEventDetail,
  TableSelectEventDetail,
  TableRowActionEventDetail,
} from './lib-data-table.types';
import tableCss      from './lib-data-table.css?inline';
import sharedTokens  from '../../../styles/shared/tokens.css?inline';
import { dataTableTemplate } from './lib-data-table.html';

/**
 * @element lib-data-table
 *
 * Tabla de datos completa: sort, filtro, selección por checkbox,
 * paginación integrada, skeleton de carga, estado vacío, dark mode.
 *
 * @prop {TableColumn[]} columns        - Definición de columnas
 * @prop {TableRowData[]} data          - Dataset de filas
 * @prop {TableVariant}  variant        - lines | grid | striped | borderless
 * @prop {TableSize}     size           - sm | md | lg
 * @prop {boolean}       dark           - Superficie oscura
 * @prop {boolean}       loading        - Muestra skeleton de carga
 * @prop {boolean}       selectable     - Columna de checkboxes
 * @prop {boolean}       sticky-head    - Cabecera sticky (max-height 380px)
 * @prop {string}        caption        - Título accesible de la tabla
 * @prop {string}        empty-title    - Título del estado vacío
 * @prop {string}        empty-desc     - Descripción del estado vacío
 * @prop {boolean}       toolbar        - Muestra barra de herramientas
 * @prop {string}        toolbar-title  - Título de la toolbar
 * @prop {number}        page-size      - Filas por página (0 = sin paginación)
 * @prop {number}        page           - Página activa (1-indexed, reflected)
 * @prop {number}        skeleton-rows  - Número de filas skeleton (default: 3)
 *
 * @slot toolbar-actions  - Botones/acciones extra en la toolbar
 * @slot pagination       - Paginación externa (si no se usa page-size)
 *
 * @fires ui-lib-table-sort       - { key, dir }
 * @fires ui-lib-table-filter     - { query }
 * @fires ui-lib-table-select     - { indices, rows }
 * @fires ui-lib-table-row-action - { row, index }
 */
@customElement('lib-data-table')
export class LibDataTable extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(tableCss)}`,
  ];

  /* ── Props ── */
  @property({ type: Array })  columns:      TableColumn[]  = [];
  @property({ type: Array })  data:         TableRowData[] = [];
  @property({ type: String, reflect: true }) variant:      TableVariant = 'lines';
  @property({ type: String, reflect: true }) size:         TableSize    = 'md';
  @property({ type: Boolean, reflect: true }) dark         = false;
  @property({ type: Boolean, reflect: true }) loading      = false;
  @property({ type: Boolean }) selectable   = false;
  @property({ type: Boolean, attribute: 'sticky-head' }) stickyHead = false;
  @property({ type: String }) caption       = '';
  @property({ type: String, attribute: 'empty-title' }) emptyTitle = 'Sin resultados';
  @property({ type: String, attribute: 'empty-desc'  }) emptyDesc  = 'Ningún elemento coincide con los filtros activos';
  @property({ type: Boolean }) toolbar      = false;
  @property({ type: String, attribute: 'toolbar-title' }) toolbarTitle = '';
  @property({ type: Number, attribute: 'page-size' }) pageSize = 0;
  @property({ type: Number, reflect: true }) page = 1;
  @property({ type: Number, attribute: 'skeleton-rows' }) skeletonRows = 3;

  /* ── Internal state ── */
  @state() private _sortKey  = '';
  @state() private _sortDir: 'asc' | 'desc' = 'asc';
  @state() private _query    = '';
  @state() private _selected = new Set<number>();

  /* ── Data pipeline ── */
  private _getProcessed(): TableRowData[] {
    let rows = [...this.data];

    // Filter
    if (this._query) {
      const q = this._query;
      rows = rows.filter(row =>
        Object.values(row).some(v => String(v).toLowerCase().includes(q))
      );
    }

    // Sort
    if (this._sortKey) {
      const key = this._sortKey;
      rows.sort((a, b) => {
        const va = a[key];
        const vb = b[key];
        if (typeof va === 'string' && typeof vb === 'string') {
          const r = va.localeCompare(vb, 'es');
          return this._sortDir === 'asc' ? r : -r;
        }
        const ac = va as string | number | boolean;
        const bc = vb as string | number | boolean;
        if (ac === bc) return 0;
        const ord = this._sortDir === 'asc' ? 1 : -1;
        return ac > bc ? ord : -ord;
      });
    }

    return rows;
  }

  private _getPaged(rows: TableRowData[]): TableRowData[] {
    if (!this.pageSize) return rows;
    const start = (this.page - 1) * this.pageSize;
    return rows.slice(start, start + this.pageSize);
  }

  /* ── Event handlers (exposed to template) ── */
  _handleSort(key: string): void {
    if (this._sortKey === key) {
      this._sortDir = this._sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this._sortKey = key;
      this._sortDir = 'asc';
    }
    this.dispatchEvent(new CustomEvent<TableSortEventDetail>('ui-lib-table-sort', {
      detail: { key, dir: this._sortDir },
      bubbles: true, composed: true,
    }));
  }

  _handleSearch(query: string): void {
    this._query = query.toLowerCase().trim();
    this.page   = 1;
    this.dispatchEvent(new CustomEvent<TableFilterEventDetail>('ui-lib-table-filter', {
      detail: { query },
      bubbles: true, composed: true,
    }));
  }

  _handleSelectAll(checked: boolean, total: number): void {
    const updated = new Set<number>(this._selected);
    const offset  = (this.page - 1) * (this.pageSize || 0);
    for (let i = 0; i < total; i++) {
      const gi = offset + i;
      if (checked) updated.add(gi);
      else         updated.delete(gi);
    }
    this._selected = updated;
    this._emitSelect();
  }

  _handleSelectRow(idx: number, checked: boolean): void {
    const updated = new Set<number>(this._selected);
    if (checked) updated.add(idx);
    else         updated.delete(idx);
    this._selected = updated;
    this._emitSelect();
  }

  _handleRowAction(row: TableRowData, idx: number): void {
    this.dispatchEvent(new CustomEvent<TableRowActionEventDetail>('ui-lib-table-row-action', {
      detail: { row, index: idx },
      bubbles: true, composed: true,
    }));
  }

  _handlePageChange(p: number): void {
    this.page = p;
  }

  private _emitSelect(): void {
    const indices = [...this._selected];
    this.dispatchEvent(new CustomEvent<TableSelectEventDetail>('ui-lib-table-select', {
      detail: {
        indices,
        rows: indices.map(i => this.data[i]).filter((r): r is TableRowData => r !== undefined),
      },
      bubbles: true, composed: true,
    }));
  }

  /* ── Render ── */
  override render(): TemplateResult {
    const filtered    = this._getProcessed();
    const paged       = this._getPaged(filtered);
    const totalPages  = this.pageSize ? Math.ceil(filtered.length / this.pageSize) : 0;
    const offset      = (this.page - 1) * (this.pageSize || 0);
    const allSelected = paged.length > 0 &&
      paged.every((_, i) => this._selected.has(offset + i));
    const someSelected = !allSelected &&
      paged.some((_, i) => this._selected.has(offset + i));

    return dataTableTemplate({
      columns:       this.columns,
      data:          paged,
      filteredTotal: filtered.length,
      totalRows:     this.data.length,
      variant:       this.variant,
      size:          this.size,
      dark:          this.dark,
      loading:       this.loading,
      selectable:    this.selectable,
      stickyHead:    this.stickyHead,
      caption:       this.caption,
      emptyTitle:    this.emptyTitle,
      emptyDesc:     this.emptyDesc,
      toolbar:       this.toolbar,
      toolbarTitle:  this.toolbarTitle,
      skeletonRows:  this.skeletonRows,
      sortKey:       this._sortKey,
      sortDir:       this._sortDir,
      query:         this._query,
      selected:      this._selected,
      allSelected,
      someSelected,
      page:          this.page,
      pageSize:      this.pageSize,
      totalPages,
      onSort:        this._handleSort.bind(this),
      onSearch:      this._handleSearch.bind(this),
      onSelectAll:   this._handleSelectAll.bind(this),
      onSelectRow:   this._handleSelectRow.bind(this),
      onRowAction:   this._handleRowAction.bind(this),
      onPageChange:  this._handlePageChange.bind(this),
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-data-table': LibDataTable;
  }
}