import { html, TemplateResult } from 'lit';
import { LibSelect } from './lib-select.component';

export function template(this: LibSelect): TemplateResult {
  return html`
    <div class="select-wrapper">
      ${this.label ? html`<label class="select-label">${this.label}</label>` : ''}
      
      <div 
        class="select-trigger" 
        @click="${this._toggleOpen}"
        aria-expanded="${this.open}"
      >
    <span class="selected-text">
        ${this._selectedLabel || this.placeholder}
    </span>
        <div class="arrow-icon ${this.open ? 'rotated' : ''}">
           ▼
        </div>
      </div>

      <div class="select-dropdown ${this.open ? 'is-open' : ''}">
        <slot></slot>
      </div>
    </div>
  `;
}