import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import tableStyles from './lib-data-table.css?inline';

// 1. Forzamos que las filas sean objetos con llaves de texto
export interface TableRowData {
  [key: string]: unknown;
}

// 2. La interfaz de columna ahora extrae solo llaves de tipo string de T
export interface TableColumn<T extends TableRowData> {
  header: string;
  key: Extract<keyof T, string>; 
  sortable?: boolean;
  type?: 'text' | 'badge' | 'progress' | 'action';
}

@customElement('lib-data-table')
export class LibDataTable<T extends TableRowData> extends LitElement {
  static override styles = [css`${unsafeCSS(tableStyles)}` || []];

  @property({ type: Array }) columns: TableColumn<T>[] = [];
  @property({ type: Array }) data: T[] = [];
  @property({ type: Boolean }) loading = false;

  @state() private _sortKey: Extract<keyof T, string> | '' = '';
  @state() private _sortOrder: 'asc' | 'desc' = 'asc';
  @state() private _filterQuery = '';

  protected _handleSearch(e: CustomEvent): void {
    // Ahora el detalle viene ya formateado desde la molécula
    this._filterQuery = e.detail.query;
    this.requestUpdate();
  }

  private _getFilteredData(): T[] {
    if (!this._filterQuery) return this.data;
    
    return this.data.filter((row) => 
      Object.values(row).some((val) => 
        String(val).toLowerCase().includes(this._filterQuery)
      )
    );
  }

  private _handleSort(key: Extract<keyof T, string>): void {
    if (this._sortKey === key) {
      this._sortOrder = this._sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this._sortKey = key;
      this._sortOrder = 'asc';
    }

    this.data = [...this.data].sort((a: T, b: T): number => {
      const valA = a[key];
      const valB = b[key];

      // 1. Manejo de Strings (Seguro y sin any)
      if (typeof valA === 'string' && typeof valB === 'string') {
        const res = valA.localeCompare(valB);
        return this._sortOrder === 'asc' ? res : -res;
      }

      // 2. Comparación de otros tipos (Números, Fechas...)
      // En lugar de 'any', casteamos a un tipo comparable
      const aComp = valA as string | number | boolean;
      const bComp = valB as string | number | boolean;

      if (aComp === bComp) return 0;

      const order = this._sortOrder === 'asc' ? 1 : -1;
      return aComp > bComp ? order : -order;
    });

    this.requestUpdate();
  }

  private _renderCell(row: T, col: TableColumn<T>): TemplateResult {
    const value = row[col.key];

    switch (col.type) {
      case 'badge': {
        const variant = (row as Record<string, any>)['variant'] as string || 'neutral';
        return html`<lib-badge .variant="${variant}">${value}</lib-badge>`;
      } 

      case 'action':
        return html`
          <lib-button variant="neutral" size="sm" @ui-lib-click=${():void => console.log('Acción', row)}>
            <lib-icon name="edit" size="sm"></lib-icon>
          </lib-button>
        `;
        
      default:
        return html`<span class="cell-text">${value}</span>`;
    }
  }

  override render(): TemplateResult {
    const displayData = this._getFilteredData();

    return html`
      <div class="table-container">
        <div class="table-toolbar">
          <lib-table-search 
            placeholder="Buscar..." 
            @ui-lib-search="${this._handleSearch}">
          </lib-table-search>
        </div>

        <table>
          <thead>
            <tr>
              ${this.columns.map(col => html`
                <th 
                  @click=${col.sortable ? ():void => this._handleSort(col.key) : null} 
                  class="${col.sortable ? 'sortable' : ''}"
                >
                  <div class="header-content">
                    ${col.header}
                    ${this._sortKey === col.key 
                      ? html`<lib-icon name="${this._sortOrder === 'asc' ? 'chevron-up' : 'chevron-down'}" size="sm"></lib-icon>` 
                      : ''}
                  </div>
                </th>
              `)}
            </tr>
          </thead>
          <tbody>
            ${displayData.length > 0 
              ? displayData.map(row => html`
                  <tr>
                    ${this.columns.map(col => html`<td>${this._renderCell(row, col)}</td>`)}
                  </tr>
                `)
              : html`<tr><td colspan="${this.columns.length}" class="no-results">No se encontraron resultados</td></tr>`
            }
          </tbody>
        </table>
        
        <div class="table-footer">
          <slot name="pagination"></slot>
        </div>
      </div>
    `;
  }
}