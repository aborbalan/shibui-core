import { LitElement, html, css, TemplateResult, unsafeCSS, PropertyValues } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import stepperStyles from './lib-stepper.css?inline';
import { LibStep } from '../../atoms/step/lib-step.component';

@customElement('lib-stepper')
export class LibStepper extends LitElement {
  static override styles = [css`${unsafeCSS(stepperStyles)}` || []];

  @property({ type: Number }) currentStep = 1;

  @queryAssignedElements({ slot: '', selector: 'lib-step' })
  _steps!: Array<LibStep>;

  // Cada vez que cambia el paso actual, actualizamos los hijos
  override updated(changedProperties: PropertyValues<this>):void {
    if (changedProperties.has('currentStep')) {
      this._updateSteps();
    }
  }

  private _updateSteps():void {
    this._steps.forEach((step, idx) => {
      const stepNum = idx + 1;
      step.index = stepNum;
      if (stepNum < this.currentStep) step.status = 'completed';
      else if (stepNum === this.currentStep) step.status = 'active';
      else step.status = 'inactive';
    });
  }

  override render(): TemplateResult {
    return html`
      <div class="stepper-container">
        <slot @slotchange=${this._updateSteps}></slot>
      </div>
    `;
  }
}