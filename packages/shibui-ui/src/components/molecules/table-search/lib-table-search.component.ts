import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import searchStyles from './lib-table-search.css?inline';

@customElement('lib-table-search')
export class LibTableSearch extends LitElement {
  static override styles = [css`${unsafeCSS(searchStyles)}` || []];

  @property({ type: String }) value = '';
  @property({ type: String }) placeholder = 'Buscar...';

  private _onInput(e: CustomEvent): void {
    // Capturamos el valor del evento de tu lib-input
    const target = e.target as HTMLInputElement;
    const query = target.value || '';
    
    this.value = query;

    // Emitimos un evento semántico para que cualquier padre lo escuche
    this.dispatchEvent(new CustomEvent('ui-lib-search', {
      detail: { query: this.value.toLowerCase() },
      bubbles: true,
      composed: true
    }));
  }

  override render(): TemplateResult {
    return html`
      <div class="search-container">
        <lib-input 
          .value="${this.value}"
          placeholder="${this.placeholder}"
          @ui-lib-input="${this._onInput}"
        >
          <lib-icon slot="prefix" name="search" size="sm"></lib-icon>
        </lib-input>
      </div>
    `;
  }
}