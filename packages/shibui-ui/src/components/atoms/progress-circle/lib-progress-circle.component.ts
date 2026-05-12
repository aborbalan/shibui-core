import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { LibProgressCircleSize, LibProgressCircleVariant } from './lib-progress-circle.component.html';
import { progressCircleTemplate } from './lib-progress-circle.component.html';
import progressCss from './lib-progress-circle.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

/**
 * @element lib-progress-circle
 *
 * Indicador de progreso circular basado en SVG stroke-dashoffset.
 * Cinco tamaños semánticos, cuatro colores, variante indeterminate.
 *
 * @example — uso básico
 * <lib-progress-circle value="72"></lib-progress-circle>
 *
 * @example — kaki con subtítulo
 * <lib-progress-circle value="61" variant="kaki" sub="61 GB"></lib-progress-circle>
 *
 * @example — celadon completado con icono
 * <lib-progress-circle value="100" variant="celadon" icon="check" size="lg"></lib-progress-circle>
 *
 * @example — indeterminate
 * <lib-progress-circle indeterminate variant="kaki"></lib-progress-circle>
 *
 * @example — sin label (bare)
 * <lib-progress-circle value="38" size="xs" bare></lib-progress-circle>
 */
@customElement('lib-progress-circle')
export class LibProgressCircle extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(progressCss)}`,
  ];

  /** Valor actual */
  @property({ type: Number })
  value = 0;

  /** Valor máximo */
  @property({ type: Number })
  max = 100;

  /**
   * Tamaño semántico del círculo.
   * Mapea a dimensiones fijas con strokeWidth proporcional:
   * - xs : 40px  · stroke 3  (sin label)
   * - sm : 64px  · stroke 4
   * - md : 96px  · stroke 6  (default)
   * - lg : 128px · stroke 7
   * - xl : 176px · stroke 6
   */
  @property({ type: String, reflect: true })
  size: LibProgressCircleSize = 'md';

  /**
   * Sobreescribe el strokeWidth por defecto del tamaño.
   * null → usa el valor canónico del tamaño seleccionado.
   */
  @property({ type: Number, attribute: 'stroke-width' })
  strokeWidth: number | null = null;

  /**
   * Paleta de color del arco.
   * El track toma automáticamente el tono -100 de cada variante.
   * - default : washi-900 (tinta)
   * - kaki    : persimmon orgánico
   * - celadon : jade sereno
   * - error   : estado crítico
   */
  @property({ type: String, reflect: true })
  variant: LibProgressCircleVariant = 'default';

  /**
   * Modo de carga de duración desconocida.
   * El arco es un segmento corto que rota continuamente.
   * Ignora `value`, `bare`, `sub` e `icon`.
   */
  @property({ type: Boolean, reflect: true })
  indeterminate = false;

  /** Oculta el label central (solo muestra el arco) */
  @property({ type: Boolean, reflect: true })
  bare = false;

  /** Subtítulo bajo el valor numérico. Oculto en xs. */
  @property({ type: String })
  sub = '';

  /**
   * Icono SVG en el centro en lugar del texto numérico.
   * - 'check' : polyline checkmark en color de la variante
   * - null    : muestra el valor (default)
   */
  @property({ type: String })
  icon: 'check' | null = null;

  override render(): TemplateResult {
    return progressCircleTemplate({
      value:         this.value,
      max:           this.max,
      size:          this.size,
      strokeWidth:   this.strokeWidth,
      variant:       this.variant,
      indeterminate: this.indeterminate,
      bare:          this.bare,
      sub:           this.sub,
      icon:          this.icon,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-progress-circle': LibProgressCircle;
  }
}