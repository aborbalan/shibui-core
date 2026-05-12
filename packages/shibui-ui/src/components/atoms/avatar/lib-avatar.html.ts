import { html, nothing, TemplateResult } from 'lit';

export type LibAvatarSize  = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type LibAvatarShape = 'circle' | 'squircle' | 'square';
export type LibAvatarColor = 'washi' | 'kaki' | 'celadon' | 'dark';

export interface AvatarTemplateProps {
  src: string;
  name: string;
  size: LibAvatarSize;
  shape: LibAvatarShape;
  color: LibAvatarColor;
  showImage: boolean;
  initials: string;
  onError: () => void;
}

/** SVG de usuario por defecto cuando no hay imagen ni iniciales */
const defaultIconSvg = html`
  <svg
    class="avatar__icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
`;

/**
 * Plantilla para lib-avatar.
 *
 * Jerarquia de contenido:
 *  1. src + sin error -> imagen
 *  2. name            -> iniciales
 *  3. slot default    -> icono custom o SVG fallback
 *
 * avatar__status vive fuera del overflow:hidden para que
 * lib-status-dot no quede recortado.
 */
export function avatarTemplate(props: AvatarTemplateProps): TemplateResult {
  return html`
    <div
      class="avatar__wrapper"
      role="img"
      aria-label="${props.name || 'avatar'}"
    >
      <div class="avatar__face">

        ${props.showImage
          ? html`<img
              class="avatar__img"
              src="${props.src}"
              alt="${props.name}"
              @error=${props.onError}
            />`
          : nothing}

        ${!props.showImage && props.initials
          ? html`<span class="avatar__initials">${props.initials}</span>`
          : nothing}

        ${!props.showImage && !props.initials
          ? html`<slot>${defaultIconSvg}</slot>`
          : nothing}

      </div>

      <div class="avatar__status">
        <slot name="status"></slot>
      </div>
    </div>
  `;
}