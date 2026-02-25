import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import dropdownStyles from './lib-dropdown.css?inline';

@customElement('lib-dropdown')
export class LibDropdown extends LitElement {
  static override styles = [css`${unsafeCSS(dropdownStyles)}` || []];

  @property({ type: String }) label = 'Opciones';
  @property({ type: Boolean, reflect: true }) open = false;

  constructor() {
    super();
    // Cerrar al hacer clic fuera
    this._handleOutsideClick = this._handleOutsideClick.bind(this);
  }

  private _toggle():void {
    this.open = !this.open;
  }

  private _handleOutsideClick(e: Event):void {
    if (this.open && !e.composedPath().includes(this)) {
      this.open = false;
    }
  }

  override connectedCallback():void {
    super.connectedCallback();
    window.addEventListener('click', this._handleOutsideClick);
  }

  override disconnectedCallback():void {
    window.removeEventListener('click', this._handleOutsideClick);
    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    return html`
      <div class="dropdown">
        <button 
          class="trigger" 
          @click=${this._toggle} 
          aria-haspopup="true" 
          aria-expanded="${this.open}"
        >
          <slot name="trigger">${this.label}</slot>
          <span class="arrow ${this.open ? 'up' : ''}">▼</span>
        </button>

        <div class="menu" ?data-open=${this.open} role="menu">
          <slot></slot>
        </div>
      </div>
    `;
  }
}