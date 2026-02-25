import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import chipStyles from './lib-chip.css?inline';

@customElement('lib-chip')
export class LibChip extends LitElement {
  static override styles = [css`${unsafeCSS(chipStyles)}` || []];

  @property({ type: String }) label = '';
  @property({ type: String }) avatar = '';
  @property({ type: Boolean, reflect: true }) removable = false;
  @property({ type: Boolean, reflect: true }) selectable = false;
  @property({ type: Boolean, reflect: true }) active = false;

  private _handleRemove(e: Event):void {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('chip-remove', {
      detail: { label: this.label },
      bubbles: true,
      composed: true
    }));
  }

  private _handleClick():void {
    if (this.selectable) {
      this.active = !this.active;
    }
  }

  override render(): TemplateResult {
    return html`
      <div 
        class="chip" 
        tabindex="0" 
        @click=${this._handleClick}
        role=${this.selectable ? 'button' : 'listitem'}
      >
        ${this.avatar ? html`<img class="avatar" src="${this.avatar}" alt="${this.label}">` : ''}
        
        <span class="label">${this.label}</span>

        ${this.removable ? html`
          <button class="remove-btn" @click=${this._handleRemove} aria-label="Remove ${this.label}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
        ` : ''}
      </div>
    `;
  }
}