import { html, TemplateResult } from 'lit';
import { LibSelectOption } from './lib-select-option.component';

export function template(this: LibSelectOption): TemplateResult {
  return html`
    <div 
      class="option-container"
      role="option"
      aria-selected="${this.selected}"
      aria-disabled="${this.disabled}"
      tabindex="${this.disabled ? '-1' : '0'}"
      @click="${this._handleOptionClick}"
    >
      <div class="content">
        <slot></slot> 
    </div>
      
      ${this.selected ? html`
        <div class="check-icon">
          <lib-icon name="check" size="sm"></lib-icon>
        </div>
      ` : ''}
    </div>
  `;
}