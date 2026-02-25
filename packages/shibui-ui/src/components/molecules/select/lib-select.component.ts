import { LitElement, css, unsafeCSS, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { template } from './lib-select.html';
import cssStyles from './lib-select.css?inline';
import { LibSelectOption } from '../../atoms/select-option/lib-select-option.component';

@customElement('lib-select')
export class LibSelect extends LitElement {
  static override styles = css`${unsafeCSS(cssStyles)}`;

  @property({ type: String }) label = '';
  @property({ type: String }) placeholder = 'Selecciona una opción';
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: String }) value = '';

  @state() protected _selectedLabel = '';

  /** Controla la apertura/cierre */
  protected _toggleOpen(e: Event): void {
    e.stopPropagation(); 
    this.open = !this.open;
  }

  private _handleOutsideClick = (e: MouseEvent): void => {
    if (this.open && !e.composedPath().includes(this)) {
      this.open = false;
    }
  };

  private _handleSelection(e: Event): void {
    const customEvent = e as CustomEvent<{ value: string; label: string }>;
    const { value, label } = customEvent.detail;
    this.value = value;
    this._selectedLabel = label;
    this.open = false;
    
    this.dispatchEvent(new CustomEvent('change', { detail: { value } }));
  }

  protected override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);
    
    if (changedProperties.has('value')) {
      const options = Array.from(this.querySelectorAll('lib-select-option')) as LibSelectOption[];
      const selectedOption = options.find(opt => opt.value === this.value);
  
      if (selectedOption) {
        this._selectedLabel = selectedOption.innerText;
        options.forEach(opt => opt.selected = opt === selectedOption);
      }
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('click', this._handleOutsideClick);
    
    this.addEventListener('option-selected', this._handleSelection as EventListener);
  
    // this.addEventListener('option-selected', (e: Event) => this._handleSelection(e as CustomEvent));
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('click', this._handleOutsideClick);
  }

  protected override render(): TemplateResult {
    return template.call(this);
  }
}