import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type {
  LibStepStatus,
  LibStepOrientation,
  LibStepVariant,
  LibStepSize,
} from './lib-step.html';
import { stepTemplate } from './lib-step.html';
import stepCss from './lib-step.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

/**
 * @element lib-step
 *
 * Paso individual del stepper. Diseñado para usarse dentro de `<lib-stepper>`,
 * que inyecta automáticamente `index`, `status`, `last`, `orientation`,
 * `variant` y `size`. El usuario solo necesita declarar `label` y, opcionalmente, `sub`.
 *
 * En modo vertical acepta contenido descriptivo en el slot por defecto.
 *
 * @example — dentro de lib-stepper (uso recomendado)
 * <lib-stepper current="2">
 *   <lib-step label="Información" sub="Datos personales"></lib-step>
 *   <lib-step label="Pago" sub="Método de pago"></lib-step>
 *   <lib-step label="Confirmación"></lib-step>
 * </lib-stepper>
 *
 * @example — vertical con contenido en slot
 * <lib-stepper orientation="vertical">
 *   <lib-step label="Crea tu cuenta">
 *     Registro completado. Tu correo ha sido verificado.
 *   </lib-step>
 * </lib-stepper>
 */
@customElement('lib-step')
export class LibStep extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(stepCss)}`,
  ];

  /** Texto principal del paso (requerido por el usuario). */
  @property({ type: String })
  label = '';

  /** Texto secundario corto (opcional). */
  @property({ type: String })
  sub = '';

  /**
   * Número ordinal del paso.
   * Inyectado automáticamente por lib-stepper.
   */
  @property({ type: Number, reflect: true })
  index = 1;

  /**
   * Estado visual del nodo.
   * Inyectado automáticamente por lib-stepper.
   * - pending   : por defecto — nodo vacío
   * - active    : paso en curso — fondo oscuro + halo
   * - completed : paso superado — checkmark
   * - error     : fallo — icono de exclamación
   */
  @property({ type: String, reflect: true })
  status: LibStepStatus = 'pending';

  /**
   * Marca el último paso del stepper (no renderiza conector).
   * Inyectado automáticamente por lib-stepper.
   */
  @property({ type: Boolean, reflect: true })
  last = false;

  /**
   * Dirección del flujo. Inyectado por lib-stepper.
   */
  @property({ type: String, reflect: true })
  orientation: LibStepOrientation = 'horizontal';

  /**
   * Variante visual. Inyectada por lib-stepper.
   * - default  : nodo circular washi
   * - minimal  : nodo cuadrado kaki
   * - kintsugi : venas doradas sobre superficie oscura
   */
  @property({ type: String, reflect: true })
  variant: LibStepVariant = 'default';

  /**
   * Tamaño del nodo. Inyectado por lib-stepper.
   * - sm : 24px
   * - md : 32px (default)
   * - lg : 40px
   */
  @property({ type: String, reflect: true })
  size: LibStepSize = 'md';

  override render(): TemplateResult {
    return stepTemplate({
      index:       this.index,
      status:      this.status,
      label:       this.label,
      sub:         this.sub,
      last:        this.last,
      orientation: this.orientation,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-step': LibStep;
  }
}