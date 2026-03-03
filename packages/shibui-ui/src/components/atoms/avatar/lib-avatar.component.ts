import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { LibAvatarSize, LibAvatarShape, LibAvatarColor } from './lib-avatar.html';
import { avatarTemplate } from './lib-avatar.html';
import avatarCss from './lib-avatar.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

/**
 * @element lib-avatar
 *
 * Avatar con tres modos de contenido: imagen, iniciales e icono.
 * Jerarquia: si src falla -> iniciales -> slot default (icono).
 *
 * @slot          - Icono de fallback cuando no hay imagen ni iniciales
 * @slot status   - Indicador de estado (lib-status-dot)
 *
 * @example
 * <lib-avatar src="..." name="Ana Bel" size="lg" color="kaki"></lib-avatar>
 * <lib-avatar name="Ana Bel" shape="squircle">
 *   <lib-status-dot slot="status" variant="success" pulse></lib-status-dot>
 * </lib-avatar>
 */
@customElement('lib-avatar')
export class LibAvatar extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(avatarCss)}`,
  ];

  /** URL de la imagen */
  @property({ type: String })
  src = '';

  /** Nombre completo — genera las iniciales automáticamente */
  @property({ type: String })
  name = '';

  /** Escala de tamaño */
  @property({ type: String, reflect: true })
  size: LibAvatarSize = 'md';

  /** Forma del avatar */
  @property({ type: String, reflect: true })
  shape: LibAvatarShape = 'circle';

  /** Paleta de color para el fondo de iniciales/icono */
  @property({ type: String, reflect: true })
  color: LibAvatarColor = 'washi';

  @state() private _hasError = false;

  private _getInitials(name: string): string {
    if (!name.trim()) return '';
    return name
      .split(' ')
      .map(p => p[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  override render(): TemplateResult {
    const initials  = this._getInitials(this.name);
    const showImage = !!this.src && !this._hasError;

    return avatarTemplate({
      src: this.src,
      name: this.name,
      size: this.size,
      shape: this.shape,
      color: this.color,
      showImage,
      initials,
      onError: () => { this._hasError = true; },
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-avatar': LibAvatar;
  }
}