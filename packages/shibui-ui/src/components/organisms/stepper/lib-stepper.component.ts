import { LitElement, css, unsafeCSS, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import type { LibStepperOrientation, LibStepperVariant, LibStepperSize } from './lib-stepper.html';
import { stepperTemplate } from './lib-stepper.html';
import stepperCss from './lib-stepper.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import type { LibStep } from '../../atoms/step/lib-step.component';

/**
 * @element lib-stepper
 *
 * Contenedor que coordina un flujo de pasos `<lib-step>`.
 * Calcula y propaga automáticamente a cada hijo:
 *   - index       : posición ordinal (1-based)
 *   - status      : pending | active | completed (derivado de `current`)
 *   - last        : true en el último paso
 *   - orientation : refleja la prop del stepper
 *   - variant     : refleja la prop del stepper
 *   - size        : refleja la prop del stepper
 *
 * El estado `error` no se gestiona automáticamente — se asigna desde fuera
 * con `stepEl.status = 'error'` cuando el formulario valida.
 *
 * @fires ui-lib-step-change — Emitido al cambiar `current` con `{ current: number, total: number }`
 *
 * @example — horizontal default
 * <lib-stepper current="2">
 *   <lib-step label="Información" sub="Datos personales"></lib-step>
 *   <lib-step label="Pago"        sub="Método de pago"></lib-step>
 *   <lib-step label="Confirmación"></lib-step>
 * </lib-stepper>
 *
 * @example — vertical
 * <lib-stepper orientation="vertical" current="1">
 *   <lib-step label="Crea tu cuenta">
 *     Registro completado. Tu correo ha sido verificado.
 *   </lib-step>
 *   <lib-step label="Elige un plan">
 *     Selecciona el plan que mejor se adapte a tus necesidades.
 *   </lib-step>
 * </lib-stepper>
 *
 * @example — minimal kaki
 * <lib-stepper variant="minimal" current="3">...</lib-stepper>
 *
 * @example — kintsugi oscuro
 * <lib-stepper variant="kintsugi" current="2">...</lib-stepper>
 */
@customElement('lib-stepper')
export class LibStepper extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(stepperCss)}`,
  ];

  /**
   * Paso activo actual (1-based).
   * Los pasos anteriores quedan como `completed`, los posteriores como `pending`.
   */
  @property({ type: Number, reflect: true })
  current = 1;

  /**
   * Dirección del flujo.
   * - horizontal : barra horizontal con conectores (default)
   * - vertical   : lista vertical con contenido expandido por paso
   */
  @property({ type: String, reflect: true })
  orientation: LibStepperOrientation = 'horizontal';

  /**
   * Variante visual. Se propaga a todos los lib-step hijos.
   * - default  : nodo circular washi
   * - minimal  : nodo cuadrado, acento kaki
   * - kintsugi : venas doradas, pensado para superficies oscuras
   */
  @property({ type: String, reflect: true })
  variant: LibStepperVariant = 'default';

  /**
   * Tamaño de los nodos. Se propaga a todos los lib-step hijos.
   * - sm : 24px · md : 32px (default) · lg : 40px
   */
  @property({ type: String, reflect: true })
  size: LibStepperSize = 'md';

  @queryAssignedElements({ selector: 'lib-step' })
  private _steps!: Array<LibStep>;

  override updated(changed: PropertyValues<this>): void {
    if (
      changed.has('current') ||
      changed.has('orientation') ||
      changed.has('variant') ||
      changed.has('size')
    ) {
      this._syncSteps();
    }
  }

  /**
   * Propaga index, status, last, orientation, variant y size a cada lib-step hijo.
   * Llamado en slotchange y cada vez que cambian las props relevantes.
   */
  private _syncSteps(): void {
    const steps = this._steps;
    if (!steps?.length) return;

    steps.forEach((step, i) => {
      const pos = i + 1;
      step.index       = pos;
      step.orientation = this.orientation;
      step.variant     = this.variant;
      step.size        = this.size;
      step.last        = pos === steps.length;

      // No sobreescribir 'error' si ya fue asignado externamente
      if (step.status !== 'error') {
        if (pos < this.current)      step.status = 'completed';
        else if (pos === this.current) step.status = 'active';
        else                          step.status = 'pending';
      }
    });
  }

  private _handleSlotChange(): void {
    this._syncSteps();
  }

  override render(): TemplateResult {
    return stepperTemplate({
      orientation:     this.orientation,
      handleSlotChange: this._handleSlotChange.bind(this),
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-stepper': LibStepper;
  }
}