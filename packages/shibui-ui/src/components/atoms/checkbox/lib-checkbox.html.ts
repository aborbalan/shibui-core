import { html, TemplateResult } from 'lit';
import { LibCheckbox } from './lib-checkbox.component';
import '../../atoms/icon/lib-icon.component'; // Aseguramos que el icono esté disponible

export function template(this: LibCheckbox): TemplateResult {
    return html`
      <div class="checkbox-container">
        <input 
          type="checkbox" 
          .checked="${this.checked}"
          ?disabled="${this.disabled}"
          @change="${this._handleChange}"
        />
        <div class="checkbox-visual">
          <lib-icon name="${this.icon}" size="sm"></lib-icon>
        </div>
      </div>
      ${this.label ? html`<span class="label-text">${this.label}</span>` : html`<slot></slot>`}
    `;
  }