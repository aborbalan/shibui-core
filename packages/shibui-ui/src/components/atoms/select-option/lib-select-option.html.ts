import { html, TemplateResult } from 'lit';
import type { SelectOptionTemplateProps } from './lib-select-option.types';

export function selectOptionTemplate(props: SelectOptionTemplateProps): TemplateResult {
  return html`
    <div
      class="option"
      role="option"
      aria-selected="${props.selected}"
      aria-disabled="${props.disabled}"
      @click="${props.handleClick}"
    >
      <span class="option-label">
        <slot></slot>
      </span>
      <span class="option-check" aria-hidden="true"></span>
    </div>
  `;
}