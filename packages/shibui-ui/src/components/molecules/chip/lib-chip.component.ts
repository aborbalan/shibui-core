import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import chipStyles from './lib-chip.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

@customElement('lib-chip')
export class LibChip extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(chipStyles)}`,
  ];  
  @property({ type: String }) label: string = '';
  @property({ type: Boolean, reflect: true }) removable: boolean = false;
  @property({ type: Boolean, reflect: true }) selectable: boolean = false;
  @property({ type: Boolean, reflect: true }) active: boolean = false;

  private _handleRemove(e: Event): void {
    e.stopPropagation();
    // Animación de salida opcional antes de disparar el evento
    this.style.opacity = '0';
    this.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
      this.dispatchEvent(new CustomEvent('chip-remove', {
        detail: { label: this.label },
        bubbles: true,
        composed: true
      }));
    }, 200);
  }

  private _handleClick(): void {
    if (this.selectable) {
      this.active = !this.active;
      this.dispatchEvent(new CustomEvent('chip-toggle', {
        detail: { active: this.active, label: this.label },
        bubbles: true,
        composed: true
      }));
    }
  }

  protected override render(): TemplateResult {
    return html`
      <div 
        class="chip" 
        tabindex="0" 
        @click=${this._handleClick}
        role=${this.selectable ? 'button' : 'listitem'}
        aria-pressed=${this.active}
      >
        <span class="label">${this.label}</span>

        ${this.removable ? html`
          <button class="remove-btn" @click=${this._handleRemove} aria-label="Eliminar ${this.label}">
            <svg viewBox="0 0 256 256" fill="currentColor">
               <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
            </svg>
          </button>
        ` : ''}
      </div>
    `;
  }
}