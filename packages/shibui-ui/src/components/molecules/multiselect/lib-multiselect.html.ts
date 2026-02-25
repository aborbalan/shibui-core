import { html, TemplateResult } from 'lit';
import { LibMultiselect } from './lib-multiselect.component';

export function template(this: LibMultiselect): TemplateResult {
  return html`
    <lib-select 
      .label="${this.label}" 
      .placeholder="${this.value.length > 0 ? `${this.value.length} seleccionados` : this.placeholder}"
      ?open="${this.open}"
      @click="${this._handleSelectClick}"
    >
      <div class="options-list">
        ${this.options.map(option => html`
          <div class="option-item" @click="${(e: Event):void => e.stopPropagation()}">
            <lib-checkbox
              label="${option.label}"
              .checked="${this.value.includes(option.value)}"
              @change="${():void => this.handleOptionToggle(option.value)}"
            ></lib-checkbox>
          </div>
        `)}
      </div>
    </lib-select>
  `;
}