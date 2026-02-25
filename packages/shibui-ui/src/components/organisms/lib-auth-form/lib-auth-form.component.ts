import { LitElement, TemplateResult, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import './../../atoms/lib-panel/lib-panel.component'; 
import './../../molecules/input/lib-input.component';

// Importamos los estilos externos
import authStyles from './lib-auth-form.css?inline';

@customElement('lib-auth-form')
export class LibAuthForm extends LitElement {
  static override styles = unsafeCSS(authStyles);


  @property({ type: Boolean, reflect: true }) glass = false;
  @property({ type: String }) override title = 'Bienvenido';
  @property({ type: Boolean }) loading = false;
  @state() private _errorMessage = '';

  private _handleFormSubmit(e: Event):void {
    e.preventDefault();
    this._errorMessage = '';
    
    // Emitimos el evento con los datos (en un caso real usaríamos FormData)
    this.dispatchEvent(new CustomEvent('lib-auth-submit', {
      detail: { timestamp: new Date().toISOString() },
      bubbles: true,
      composed: true
    }));
  }

  override render():TemplateResult {
    return html`
      <lib-panel ?glass=${this.glass}>
        <h2 slot="header">${this.title}</h2>
        
        <form @submit=${this._handleFormSubmit} class="form-container">
          ${this._errorMessage 
            ? html`<div class="error-message">${this._errorMessage}</div>` 
            : ''}
          
          <lib-input 
            label="Correo electrónico" 
            type="email" 
            glass=${this.glass}
            required>
          </lib-input>

          <lib-input 
            label="Contraseña" 
            type="password" 
            glass=${this.glass}
            required>
          </lib-input>

          <div class="form-actions">
            <button 
              type="submit" 
              class="submit-btn" 
              ?disabled=${this.loading}>
              ${this.loading ? 'Cargando...' : 'Entrar'}
            </button>
            <slot name="footer"></slot>
          </div>
        </form>
      </lib-panel>
    `;
  }
}