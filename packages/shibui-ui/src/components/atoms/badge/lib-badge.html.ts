import { html, TemplateResult } from 'lit';
import { LibBadge } from './lib-badge.component';

export function template(this: LibBadge): TemplateResult {
  return html`
    ${this.icon ? html`<lib-icon name="${this.icon}" size="sm"></lib-icon>` : ''}
    
    <slot></slot>

    ${this.removable ? html`
      <span class="remove-btn" @click="${this._handleRemove}">
        <lib-icon name="close" size="sm"></lib-icon>
      </span>
    ` : ''}
  `;
}