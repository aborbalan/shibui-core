import { html, nothing, TemplateResult } from 'lit';

export type LibCheckboxSize    = 'sm' | 'md' | 'lg';
export type LibCheckboxVariant = 'default' | 'kaki' | 'error';

export interface CheckboxTemplateProps {
  checked: boolean;
  disabled: boolean;
  indeterminate: boolean;
  label: string;
  sublabel: string;
  value: string;
  size: LibCheckboxSize;
  variant: LibCheckboxVariant;
  onChange: (e: Event) => void;
}

/** SVG check — polyline del styleguide, animado con ease-bounce */
const checkSvg = html`
  <svg class="checkbox__check" viewBox="0 0 10 10" aria-hidden="true">
    <polyline points="1.5,5 4,7.5 8.5,2"/>
  </svg>
`;

/** SVG dash — estado indeterminate */
const dashEl = html`<span class="checkbox__dash" aria-hidden="true"></span>`;

/**
 * Plantilla para lib-checkbox.
 *
 * Estructura:
 *   label.checkbox
 *     input[type=checkbox]  (capa de interaccion, invisible)
 *     span.checkbox__box    (visual: box + check/dash)
 *     span.checkbox__label  (label-text + sublabel opcional)
 */
export function checkboxTemplate(props: CheckboxTemplateProps): TemplateResult {
  return html`
    <label class="checkbox">

      <input
        class="checkbox__input"
        type="checkbox"
        .checked="${props.checked}"
        .indeterminate="${props.indeterminate}"
        ?disabled="${props.disabled}"
        value="${props.value}"
        @change="${props.onChange}"
      />

      <span class="checkbox__box">
        ${props.indeterminate ? dashEl : checkSvg}
      </span>

      ${props.label || props.sublabel
        ? html`
            <span class="checkbox__label">
              ${props.label
                ? html`<span class="checkbox__label-text">${props.label}</span>`
                : nothing}
              ${props.sublabel
                ? html`<span class="checkbox__label-sub">${props.sublabel}</span>`
                : nothing}
            </span>
          `
        : html`<slot></slot>`}

    </label>
  `;
}