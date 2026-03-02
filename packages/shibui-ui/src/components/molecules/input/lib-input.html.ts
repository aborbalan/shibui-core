import { html, nothing, TemplateResult } from 'lit';

export interface InputTemplateProps {
  uuid: string;
  type: 'text' | 'email' | 'password';
  label: string;
  placeholder: string;
  required: boolean;
  disabled: boolean;
  error: boolean;
  errorMessage: string;
  value: string;
  showPassword: boolean;
  handleInput: (e: InputEvent) => void;
  handleTogglePassword: () => void;
}

/**
 * Plantilla base para el componente lib-input.
 * Renderiza un campo de texto con label, slots prefix/suffix y estado de error.
 */
export function inputTemplate(props: InputTemplateProps): TemplateResult {
  const inputType = props.type === 'password' && props.showPassword ? 'text' : props.type;

  return html`
    <div class="input-group ${props.error ? 'has-error' : ''} ${props.disabled ? 'is-disabled' : ''}">

      ${props.label ? html`
        <label
          class="input-label"
          for="${props.uuid}"
        >
          ${props.label}
          ${props.required ? html`<span class="input-required" aria-hidden="true">*</span>` : nothing}
        </label>
      ` : nothing}

      <div class="input-wrapper">
        <slot name="prefix"></slot>

        <input
          id="${props.uuid}"
          type="${inputType}"
          placeholder="${props.placeholder}"
          ?required="${props.required}"
          ?disabled="${props.disabled}"
          aria-invalid="${props.error}"
          aria-describedby="${props.error && props.errorMessage ? `${props.uuid}-error` : nothing}"
          .value="${props.value}"
          @input="${props.handleInput}"
        />

        ${props.type === 'password' ? html`
          <button
            class="input-password-toggle"
            type="button"
            @click="${props.handleTogglePassword}"
            aria-label="${props.showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}"
          >
            ${props.showPassword ? html`
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ` : html`
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            `}
          </button>
        ` : nothing}

        <slot name="suffix"></slot>
      </div>

      ${props.error && props.errorMessage ? html`
        <span class="input-error-message" id="${props.uuid}-error" role="alert">
          ${props.errorMessage}
        </span>
      ` : nothing}

    </div>
  `;
}