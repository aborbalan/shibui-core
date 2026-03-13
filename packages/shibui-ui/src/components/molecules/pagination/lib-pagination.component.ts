import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { paginationTemplate } from './lib-pagination.html';
import paginationCss from './lib-pagination.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import type { PaginationSize, PaginationVariant } from './lib-pagination.types';

/**
 * lib-pagination — Paginación Shibui
 *
 * @prop total-items    — Total de registros
 * @prop items-per-page — Registros por página (default 10)
 * @prop current-page   — Página activa (1-indexed, default 1)
 * @prop siblings       — Páginas visibles a cada lado de la actual (default 1)
 * @prop size           — 'sm' | 'md' | 'lg' (default 'md')
 * @prop variant        — 'default' | 'outline' | 'ghost'
 * @prop dark           — Tema oscuro
 * @prop show-info      — Muestra "X–Y de Z resultados"
 * @prop aria-label     — Etiqueta accesible del nav (default 'Paginación')
 *
 * @fires ui-lib-page-change — { detail: { page: number, prev: number } }
 *
 * @readonly totalPages — Número total de páginas calculado
 */
@customElement('lib-pagination')
export class LibPagination extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(paginationCss)}`,
  ];

  @property({ type: Number, attribute: 'total-items' })
  totalItems = 0;

  @property({ type: Number, attribute: 'items-per-page' })
  itemsPerPage = 10;

  @property({ type: Number, attribute: 'current-page', reflect: true })
  currentPage = 1;

  /** Páginas visibles a cada lado de la página actual antes de los ellipsis */
  @property({ type: Number })
  siblings = 1;

  @property({ type: String, reflect: true })
  size: PaginationSize = 'md';

  @property({ type: String, reflect: true })
  variant: PaginationVariant = 'default';

  @property({ type: Boolean, reflect: true })
  dark = false;

  @property({ type: Boolean, attribute: 'show-info' })
  showInfo = false;

  @property({ type: String, attribute: 'aria-label' })
  override ariaLabel = 'Paginación';

  /* ── Computed ── */
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.itemsPerPage));
  }

  /* ── Cambio de página ── */
  _changePage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    const prev = this.currentPage;
    this.currentPage = page;
    this.dispatchEvent(new CustomEvent('ui-lib-page-change', {
      detail: { page: this.currentPage, prev },
      bubbles: true,
      composed: true,
    }));
  }

  /* ── Teclado en el nav ── */
  private _onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); this._changePage(this.currentPage - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); this._changePage(this.currentPage + 1); }
    if (e.key === 'Home')       { e.preventDefault(); this._changePage(1); }
    if (e.key === 'End')        { e.preventDefault(); this._changePage(this.totalPages); }
  };

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('keydown', this._onKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._onKeyDown);
  }

  protected override render(): TemplateResult {
    return paginationTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-pagination': LibPagination;
  }
}