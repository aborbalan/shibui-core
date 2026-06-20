import { html, nothing, TemplateResult } from 'lit';
import type { LoginFormTemplateProps } from './lib-login-form.types';

export function loginFormTemplate(props: LoginFormTemplateProps): TemplateResult {
  return html`
    <div class="login-form">

      <header class="login-form-header">
        <slot name="header">
          <h2 class="login-form-title">Iniciar sesión</h2>
        </slot>
        <slot name="subtitle">
          <p class="login-form-subtitle">Accede con tu correo y contraseña.</p>
        </slot>
      </header>

      ${props.errorMessage ? html`
        <lib-alert type="error" heading="Autenticación fallida">
          ${props.errorMessage}
        </lib-alert>
      ` : nothing}

      <div class="login-form-fields">
        <lib-input
          label="Correo electrónico"
          type="email"
          .value="${props.email}"
          ?required="${true}"
          ?disabled="${props.loading}"
          ?error="${!!props.emailError}"
          .errorMessage="${props.emailError}"
          @ui-lib-input="${props.onEmailInput}"
        ></lib-input>

        <lib-input
          label="Contraseña"
          type="password"
          .value="${props.password}"
          ?required="${true}"
          ?disabled="${props.loading}"
          ?error="${!!props.passwordError}"
          .errorMessage="${props.passwordError}"
          @ui-lib-input="${props.onPasswordInput}"
        ></lib-input>
      </div>

      <div class="login-form-actions">
        <lib-button
          variant="solid"
          ?disabled="${props.loading}"
          @ui-lib-click="${(): void => props.onSubmit()}"
        >
          ${props.loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
        </lib-button>

        <slot name="footer"></slot>
      </div>

    </div>
  `;
}
