import { LitElement, html, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import alertStyles from './lib-alert.css?inline';

@customElement('lib-alert')
export class LibAlert extends LitElement {
  static override styles = [css`${unsafeCSS(alertStyles)}` || []];

  @property({ type: String, reflect: true }) type: 'info' | 'success' | 'warning' | 'error' = 'info';
  @property({ type: String, reflect: true }) position: 'inline' | 'top-right' = 'inline';
  @property({ type: Boolean, reflect: true }) glass = false;
  @property({ type: Number }) duration = 5000; // 5 segundos por defecto
  @property({ type: String }) message = '';

  @state() private _isClosing = false;

  // Iniciamos el temporizador si es un toast (top-right)
  protected override firstUpdated():void {
    if (this.position === 'top-right' && this.duration > 0) {
      setTimeout(() => this.close(), this.duration);
    }
  }

  public close():void {
    this._isClosing = true;
    // Esperamos a que termine la animación de salida (300ms) antes de eliminar del DOM
    setTimeout(() => {
      this.dispatchEvent(new CustomEvent('alert-closed', { bubbles: true, composed: true }));
      this.remove();
    }, 300);
  }

  private _getIconName(): string {
    const map = { success: 'check', error: 'x', warning: 'warning', info: 'info' };
    return map[this.type] || 'info';
  }

  override render():TemplateResult {
    return html`
      <div class="alert-container ${this._isClosing ? 'closing' : ''}">
        <div class="alert-icon-wrapper">
          <lib-icon name="${this._getIconName()}"></lib-icon>
        </div>
        <div class="alert-content">
          <slot>${this.message}</slot>
        </div>
        <button class="close-button" @click=${this.close} aria-label="Cerrar alerta">
          <lib-icon name="x"></lib-icon>
        </button>
      </div>
    `;
  }
}