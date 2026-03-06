import { html, TemplateResult } from 'lit';

export type LibStepperOrientation = 'horizontal' | 'vertical';
export type LibStepperVariant     = 'default' | 'minimal' | 'kintsugi';
export type LibStepperSize        = 'sm' | 'md' | 'lg';

export interface StepperTemplateProps {
  orientation: LibStepperOrientation;
  handleSlotChange: (e: Event) => void;
}

/**
 * El stepper es únicamente el contenedor flex + slot.
 * Toda la lógica de estados y el dibujado visual vive en lib-step.
 * @layer components gestiona flex-direction vía :host([orientation="vertical"]).
 */
export function stepperTemplate(props: StepperTemplateProps): TemplateResult {
  return html`
    <div class="stepper-track" role="list" aria-label="Pasos del proceso">
      <slot @slotchange=${props.handleSlotChange}></slot>
    </div>
  `;
}