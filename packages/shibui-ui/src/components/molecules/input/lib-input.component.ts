import { LitElement, html, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import glassStyles from '../../../styles/shared/glass.css?inline';
import inputStyles from './lib-input.css?inline';

// Importamos el átomo para que esté disponible
import '../../atoms/label/lib-label.component';

@customElement('lib-input')
export class LibInput extends LitElement {
  static override styles = [
    css`
      ${unsafeCSS(sharedTokens)}
    `,
    css`
      ${unsafeCSS(inputStyles)}
    `,
    css`${unsafeCSS(glassStyles)}`,
  ];

  @property({ type: String }) label = '';
  @property({ type: String }) placeholder = '';
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) error = false;
  @property({ type: String }) errorMessage = '';
  @property({ type: String }) value = '';

  @property({ type: Boolean, reflect: true }) glass = false;
  @property({ type: String, reflect: true }) glassIntensity: 'low' | 'high' = 'low';

  @query('input') _inputElement!: HTMLInputElement;
  // ID único para conectar la label con el input (Accesibilidad)
  private _uuid = `input-${Math.random().toString(36).slice(2, 9)}`;


  private _handleInput(e: InputEvent):void {
    const target = e.target as HTMLInputElement;
    this.value = target.value; // Sincronizamos la propiedad del componente
    
    // Emitimos un evento personalizado para que el padre se entere
    this.dispatchEvent(new CustomEvent('lib-input', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  private _handleClear():void {
    this.value = ''; // Limpiamos la propiedad de Lit
    
    // Forzamos el valor en el elemento nativo por si acaso
    if (this._inputElement) {
      this._inputElement.value = '';
      this._inputElement.focus(); // Devolvemos el foco para que el usuario siga escribiendo
    }
  
    // Avisamos al exterior de que el valor ha cambiado a vacío
    this.dispatchEvent(new CustomEvent('lib-input', {
      detail: { value: '' },
      bubbles: true,
      composed: true
    }));
  }

  protected override render(): TemplateResult {
    return html`
      <div class="input-group ${this.error ? 'has-error' : ''}"">
        ${this.label
          ? html`
              <lib-label .htmlFor="${this._uuid}" ?required="${this.required}">
                ${this.label}
              </lib-label>
            `
          : ''}

     <div class="input-wrapper ${this.glass ? 'glass-target' : ''}">
          <slot name="prefix"></slot>
          <input
            id="${this._uuid}"
            type="text"
            placeholder="${this.placeholder}"
            ?required="${this.required}"
            aria-invalid="${this.error}"
            aria-describedby="${this.error ? `${this._uuid}-error` : ''}"
            .value="${this.value}"
            @input="${this._handleInput}"
          />
          ${this.value ? html`
            <button 
              class="clear-button" 
              @click=${this._handleClear}
              aria-label="Limpiar campo"
            >
              ✕ 
            </button>
          ` : ''}
          <slot name="suffix"></slot>
        </div>
        ${this.error && this.errorMessage
          ? html`
              <span class="error-message" id="${this._uuid}-error">
                ${this.errorMessage}
              </span>
            `
          : ''}
      </div>
    `;
  }
}
