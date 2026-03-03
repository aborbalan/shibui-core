import { html, TemplateResult } from 'lit';
import { LibRadio } from './lib-radio.component';
import { ifDefined } from 'lit/directives/if-defined.js';

export const radioTemplate = (context: LibRadio): TemplateResult => {
  return html`
    <label class="radio-wrapper" for="${context.id}">
      <div class="radio-container">
        <input
          type="radio"
          id="${context.id}"
          name="${ifDefined(context.name)}"
          value="${ifDefined(context.value)}"
          ?checked="${context.checked}"
          ?disabled="${context.disabled}"
          @change="${context.handleChange}"
          aria-checked="${context.checked}"
        />
        <span class="radio-control"></span>
      </div>
      <span class="radio-label">
        <slot></slot>
      </span>
    </label>
  `;
};