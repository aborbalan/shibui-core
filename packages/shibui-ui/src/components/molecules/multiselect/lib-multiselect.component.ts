import { LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { template } from './lib-multiselect.html';
// No necesitamos casi CSS propio porque lo hereda del Select!

export interface MultiSelectOption {
  label: string;
  value: string;
}

@customElement('lib-multiselect')
export class LibMultiselect extends LitElement {
  @property({ type: String }) label = '';
  @property({ type: String }) placeholder = 'Selecciona opciones';
  @property({ type: Array }) options: MultiSelectOption[] = [];
  @property({ type: Array }) value: string[] = [];
  
  @state() open = false;

  // Evitamos que el comportamiento por defecto del Select cierre el dropdown al clicar un checkbox
  protected _handleSelectClick():void {
    // Aquí puedes gestionar si quieres sincronizar el estado 'open'
    // aunque lib-select ya gestiona su propia apertura internamente
  }

  handleOptionToggle(optionValue: string):void {
    const newValue = this.value.includes(optionValue)
      ? this.value.filter(v => v !== optionValue)
      : [...this.value, optionValue];

    this.value = newValue;
    
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  protected override render(): TemplateResult {
    return template.call(this);
  }
}