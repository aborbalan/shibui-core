import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import paginationStyles from './lib-pagination.css?inline';

@customElement('lib-pagination')
export class LibPagination extends LitElement {
  static override styles = [css`${unsafeCSS(paginationStyles)}` || []];

  @property({ type: Number }) totalItems = 0;
  @property({ type: Number }) itemsPerPage = 10;
  @property({ type: Number }) currentPage = 1;

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage) || 1;
  }

  private _changePage(page: number):void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    
    this.currentPage = page;
    this.dispatchEvent(new CustomEvent('ui-lib-page-change', {
      detail: { page: this.currentPage },
      bubbles: true,
      composed: true
    }));
  }

  private _renderPageButtons(): TemplateResult[] {
    const buttons: TemplateResult[] = [];
    const delta = 2; // Páginas a mostrar alrededor de la actual

    for (let i = 1; i <= this.totalPages; i++) {
      if (
        i === 1 || 
        i === this.totalPages || 
        (i >= this.currentPage - delta && i <= this.currentPage + delta)
      ) {
        buttons.push(html`
          <lib-button 
            variant="${this.currentPage === i ? 'primary' : 'neutral'}"
            size="sm"
            @ui-lib-click=${():void => this._changePage(i)}
          >
            ${i}
          </lib-button>
        `);
      } else if (
        i === this.currentPage - delta - 1 || 
        i === this.currentPage + delta + 1
      ) {
        buttons.push(html`<span class="ellipsis">...</span>`);
      }
    }
    return buttons;
  }

  override render(): TemplateResult {
    return html`
      <nav class="pagination-container" aria-label="Paginación">
        <lib-button 
          variant="neutral" 
          size="sm" 
          ?disabled=${this.currentPage === 1}
          @ui-lib-click=${():void => this._changePage(this.currentPage - 1)}
        >
          <lib-icon slot="prefix" name="chevron-left" size="sm"></lib-icon>
          Anterior
        </lib-button>

        <div class="page-numbers">
          ${this._renderPageButtons()}
        </div>

        <lib-button 
          variant="neutral" 
          size="sm" 
          ?disabled=${this.currentPage === this.totalPages}
          @ui-lib-click=${():void => this._changePage(this.currentPage + 1)}
        >
          Siguiente
          <lib-icon slot="suffix" name="chevron-right" size="sm"></lib-icon>
        </lib-button>
      </nav>
    `;
  }
}