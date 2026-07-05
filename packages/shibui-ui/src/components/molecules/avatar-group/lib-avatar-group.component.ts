import { LitElement, css, unsafeCSS, type TemplateResult } from 'lit';
import { customElement, property, state, queryAssignedElements } from 'lit/decorators.js';
import { renderAvatarGroup } from './lib-avatar-group.html';
import type { LibAvatarGroupSpacing } from './lib-avatar-group.types';
import type { LibAvatarSize } from '../../../types';
import componentCss from './lib-avatar-group.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

/** Diámetro en px de cada escala de avatar (espejo de lib-avatar.css). */
const SIZE_PX: Record<LibAvatarSize, number> = {
  xs: 24, sm: 32, md: 40, lg: 56, xl: 72, '2xl': 96,
};

/** Fracción del diámetro que se solapa según `spacing`. */
const SPACING_FACTOR: Record<LibAvatarGroupSpacing, number> = {
  tight: 0.42, normal: 0.30, loose: 0.18,
};

/**
 * `<lib-avatar-group>` — Pila de `<lib-avatar>` solapados con overflow "+N".
 *
 * Agrupa avatares con solape y anillo de separación. Unifica el tamaño de los
 * avatares hijos al `size` del grupo. Con `max` limita cuántos se muestran y
 * colapsa el resto en un contador "+N".
 *
 * @tag lib-avatar-group
 *
 * @attr {'xs'|'sm'|'md'|'lg'|'xl'|'2xl'} size  Tamaño aplicado a todos los avatares. Default `'md'`.
 * @attr {number} max      Máximo de avatares visibles (0 = todos). Default `0`.
 * @attr {number} total    Total real para el "+N" cuando no todos están en el DOM (0 = usar los del slot).
 * @attr {'tight'|'normal'|'loose'} spacing  Grado de solape. Default `'normal'`.
 *
 * @slot - Uno o más `<lib-avatar>`.
 *
 * @csspart group    - El contenedor flex.
 * @csspart overflow - La burbuja "+N".
 *
 * @example
 * <lib-avatar-group max="3" size="md">
 *   <lib-avatar name="Ana Bel"></lib-avatar>
 *   <lib-avatar name="Ken Ito"></lib-avatar>
 *   <lib-avatar name="Mia Sol"></lib-avatar>
 *   <lib-avatar name="Leo Paz"></lib-avatar>
 *   <lib-avatar name="Nao Rin"></lib-avatar>
 * </lib-avatar-group>
 */
@customElement('lib-avatar-group')
export class LibAvatarGroup extends LitElement {

  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(componentCss)}`,
  ];

  /** Tamaño aplicado a todos los avatares del grupo. */
  @property({ type: String, reflect: true })
  size: LibAvatarSize = 'md';

  /** Máximo de avatares visibles (0 = mostrar todos). */
  @property({ type: Number, reflect: true })
  max = 0;

  /** Total real de avatares para el contador "+N" (0 = usar los del slot). */
  @property({ type: Number })
  total = 0;

  /** Grado de solape entre avatares. */
  @property({ type: String, reflect: true })
  spacing: LibAvatarGroupSpacing = 'normal';

  /** @internal Número de avatares colapsados en el "+N". */
  @state() overflow = 0;

  @queryAssignedElements({ selector: 'lib-avatar' })
  private _avatars!: HTMLElement[];

  override updated(): void {
    this._apply();
  }

  onSlotChange(): void {
    this._apply();
  }

  private _apply(): void {
    const avatars = this._avatars ?? [];
    const sizePx = SIZE_PX[this.size] ?? SIZE_PX.md;
    const overlap = -Math.round(sizePx * (SPACING_FACTOR[this.spacing] ?? SPACING_FACTOR.normal));

    this.style.setProperty('--ag-overlap', `${overlap}px`);
    this.style.setProperty('--ag-bubble-size', `${sizePx}px`);

    const limit = this.max > 0 ? this.max : avatars.length;
    avatars.forEach((avatar, i) => {
      avatar.style.display = i < limit ? '' : 'none';
      avatar.setAttribute('size', this.size);
    });

    const shown = Math.min(limit, avatars.length);
    const totalCount = this.total > 0 ? this.total : avatars.length;
    const remaining = totalCount - shown;
    this.overflow = remaining > 0 ? remaining : 0;
  }

  protected override render(): TemplateResult {
    return renderAvatarGroup(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-avatar-group': LibAvatarGroup;
  }
}
