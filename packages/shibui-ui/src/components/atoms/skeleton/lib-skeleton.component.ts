import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { LibSkeletonShape, LibSkeletonAnimation, LibSkeletonSurface, LibSkeletonTone } from './lib-skeleton.html';
import { skeletonTemplate } from './lib-skeleton.html';
import skeletonCss from './lib-skeleton.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

/**
 * @element lib-skeleton
 *
 * Bloque de carga que replica la arquitectura del contenido real.
 * Tres animaciones, tres superficies, diez formas semánticas.
 *
 * @slot — (vacío) El componente es puramente visual, sin contenido.
 *
 * @example — línea de texto
 * <lib-skeleton shape="line" width="80%"></lib-skeleton>
 *
 * @example — avatar 40px
 * <lib-skeleton shape="avatar" width="40px" height="40px"></lib-skeleton>
 *
 * @example — dark + wave
 * <lib-skeleton shape="title" surface="dark" animation="wave" width="60%"></lib-skeleton>
 *
 * @example — accent + pulse
 * <lib-skeleton shape="img" tone="accent" animation="pulse"></lib-skeleton>
 */
@customElement('lib-skeleton')
export class LibSkeleton extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(skeletonCss)}`,
  ];

  /**
   * Forma semántica del bloque.
   * Cada shape tiene una altura por defecto en CSS:
   * - line   : 13px
   * - title  : 22px
   * - h1     : 36px
   * - avatar : border-radius full (width/height obligatorio)
   * - icon   : border-radius sm  (width/height obligatorio)
   * - btn    : 36px
   * - badge  : 20px
   * - pill   : 22px, border-radius full
   * - img    : 160px
   * - rect   : sin altura — usar `height` prop
   */
  @property({ type: String, reflect: true })
  shape: LibSkeletonShape = 'rect';

  /**
   * Tipo de animación.
   * - shimmer : barrido de luz lateral (default)
   * - wave    : barrido más lento y orgánico
   * - pulse   : opacidad, sin movimiento
   */
  @property({ type: String, reflect: true })
  animation: LibSkeletonAnimation = 'shimmer';

  /**
   * Superficie de fondo.
   * - default : washi-200 → washi-100 (fondo claro)
   * - dark    : washi-800 → washi-700
   *
   * El tinte semántico (accent/info) se controla aparte vía `tone`.
   * Bajo `data-katachi="celadon"` el shimmer adopta el jade info
   * automáticamente sin necesidad de pasar `tone`.
   */
  @property({ type: String, reflect: true })
  surface: LibSkeletonSurface = 'default';

  /**
   * Tinte semántico del shimmer.
   * - default : sin tinte (usa la superficie)
   * - accent  : kaki-200 → kaki-100
   * - info    : jade oscuro oklch(22%→32% / 175deg)
   */
  @property({ type: String, reflect: true })
  tone: LibSkeletonTone = 'default';

  /** Anchura del bloque. Default: 100% */
  @property({ type: String })
  width = '100%';

  /**
   * Altura del bloque.
   * Si no se especifica, el CSS usa la altura propia de cada `shape`.
   * Obligatorio para `avatar`, `icon` y `rect`.
   */
  @property({ type: String })
  height = '';

  override render(): TemplateResult {
    return skeletonTemplate({
      shape:     this.shape,
      animation: this.animation,
      surface:   this.surface,
      tone:      this.tone,
      width:     this.width,
      height:    this.height,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-skeleton': LibSkeleton;
  }
}