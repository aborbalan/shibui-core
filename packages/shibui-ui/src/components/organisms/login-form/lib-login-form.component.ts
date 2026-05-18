import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import loginFormCss from './lib-login-form.css?inline';
import { loginFormTemplate } from './lib-login-form.html';
import type { LoginSubmitDetail } from './lib-login-form.types';
import type { LibInputEventDetail } from '../../molecules/input/lib-input.component';
import '../../molecules/input/lib-input.component';
import '../../molecules/lib-alert/lib-alert.component';
import '../../atoms/button/lib-button.component';

/**
 * @element lib-login-form
 *
 * Formulario de autenticación — UI shell sin lógica de negocio.
 * Valida localmente (formato de correo, campos obligatorios, mínimo
 * de caracteres) y delega la autenticación al consumidor vía evento.
 *
 * @prop {boolean} loading      — Deshabilita campos y muestra estado de espera
 * @prop {string}  errorMessage — Error de servidor a mostrar como alerta
 *
 * @slot header   — Override del título (por defecto: "Iniciar sesión")
 * @slot subtitle — Override del subtítulo descriptivo
 * @slot footer   — Contenido extra bajo el botón (ej. enlace "¿Olvidaste la contraseña?")
 *
 * @fires ui-lib-login-submit — { email, password } — cuando la validación local pasa
 */
@customElement('lib-login-form')
export class LibLoginForm extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(loginFormCss)}`,
  ];

  @property({ type: Boolean, reflect: true }) loading = false;
  @property({ type: String })                errorMessage = '';

  @state() private _email = '';
  @state() private _password = '';
  @state() private _emailError = '';
  @state() private _passwordError = '';

  protected override render(): TemplateResult {
    return loginFormTemplate({
      email:           this._email,
      password:        this._password,
      loading:         this.loading,
      errorMessage:    this.errorMessage,
      emailError:      this._emailError,
      passwordError:   this._passwordError,
      onEmailInput:    this._handleEmailInput.bind(this),
      onPasswordInput: this._handlePasswordInput.bind(this),
      onSubmit:        this._handleSubmit.bind(this),
    });
  }

  private _handleEmailInput(e: Event): void {
    this._email = (e as CustomEvent<LibInputEventDetail>).detail.value;
    this._emailError = '';
  }

  private _handlePasswordInput(e: Event): void {
    this._password = (e as CustomEvent<LibInputEventDetail>).detail.value;
    this._passwordError = '';
  }

  private _handleSubmit(): void {
    if (!this._validate()) return;

    this.dispatchEvent(
      new CustomEvent<LoginSubmitDetail>('ui-lib-login-submit', {
        detail:   { email: this._email, password: this._password },
        bubbles:  true,
        composed: true,
      })
    );
  }

  private _validate(): boolean {
    let valid = true;

    if (!this._email) {
      this._emailError = 'El correo es obligatorio';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this._email)) {
      this._emailError = 'Introduce un correo válido';
      valid = false;
    }

    if (!this._password) {
      this._passwordError = 'La contraseña es obligatoria';
      valid = false;
    } else if (this._password.length < 8) {
      this._passwordError = 'Mínimo 8 caracteres';
      valid = false;
    }

    return valid;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-login-form': LibLoginForm;
  }
}
