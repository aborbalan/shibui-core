import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-stepper.component';
import '../../atoms/step/lib-step.component';

const meta: Meta = {
  title: 'Navigation/Stepper',
  component: 'lib-stepper',
  argTypes: {
    currentStep: { control: { type: 'number', min: 1, max: 3 } }
  }
};

export default meta;

export const Default: StoryObj = {
  args: { currentStep: 1 },
  render: (args) => html`
    <lib-stepper .currentStep=${args.currentStep}>
      <lib-step label="Envío"></lib-step>
      <lib-step label="Pago"></lib-step>
      <lib-step label="Confirmación"></lib-step>
    </lib-stepper>
  `
};