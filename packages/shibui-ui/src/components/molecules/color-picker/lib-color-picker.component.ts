import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import pickerStyles from './lib-color-picker.css?inline';

@customElement('lib-color-picker')
export class LibColorPicker extends LitElement {
  static override styles = [css`${unsafeCSS(pickerStyles)}` || []];

  @property({ type: String }) value = '#3b82f6';
  @property({ type: String }) label = 'Seleccionar color';
  @property({ type: Boolean, reflect: true }) disabled = false;

  private _handleInput(e: Event):void {
    const input = e.target as HTMLInputElement;
    this.value = input.value;
    
    this.dispatchEvent(new CustomEvent('ui-lib-change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  override render(): TemplateResult {
    return html`
      <div class="color-picker-container">
        <label class="label">${this.label}</label>
        
        <div class="picker-wrapper">
          <input 
            type="color" 
            id="native-picker" 
            .value=${this.value} 
            ?disabled=${this.disabled}
            @input=${this._handleInput}
          >
          
          <div 
            class="custom-trigger" 
            @click=${():void => this.shadowRoot?.querySelector<HTMLInputElement>('#native-picker')?.click()}
          >
            <div class="color-preview" style="background-color: ${this.value}"></div>
            <span class="color-hex">${this.value.toUpperCase()}</span>
            <lib-icon name="edit" size="sm"></lib-icon>
          </div>
        </div>
      </div>
    `;
  }
}