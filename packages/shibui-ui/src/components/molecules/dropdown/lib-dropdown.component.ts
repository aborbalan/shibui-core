import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import dropdownStyles from './lib-dropdown.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

@customElement('lib-dropdown')
export class LibDropdown extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(dropdownStyles)}`,
  ];
  @property({ type: String }) label: string = 'Opciones';
  @property({ type: Boolean, reflect: true }) open: boolean = false;

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('click', this._handleOutsideClick);
  }

  override disconnectedCallback(): void {
    window.removeEventListener('click', this._handleOutsideClick);
    super.disconnectedCallback();
  }

  private _toggle(): void {
    this.open = !this.open;
    this.dispatchEvent(new CustomEvent('dd-toggle', { detail: { open: this.open } }));
  }

  private _handleOutsideClick = (e: Event): void => {
    if (this.open && !e.composedPath().includes(this)) {
      this.open = false;
    }
  };

  protected override render(): TemplateResult {
    return html`
      <div class="dropdown">
        <button 
          class="trigger" 
          @click=${this._toggle} 
          aria-haspopup="true" 
          aria-expanded="${this.open}"
        >
          <slot name="trigger">${this.label}</slot>
          <svg class="arrow" viewBox="0 0 256 256" fill="currentColor">
            <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80a8,8,0,0,1,11.32-11.32L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
          </svg>
        </button>

        <div class="menu">
          <slot></slot>
        </div>
      </div>
    `;
  }
}