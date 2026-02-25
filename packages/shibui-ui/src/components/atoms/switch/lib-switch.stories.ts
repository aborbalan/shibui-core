import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-switch.component';

interface SwitchArgs {
  checked: boolean;
  disabled: boolean;
  label: string;
}

const meta: Meta<SwitchArgs> = {
  title: 'Forms/Switch',
  component: 'lib-switch',
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<SwitchArgs>;

const render = ({ checked, disabled, label }: SwitchArgs): TemplateResult => html`
  <div style="padding: 24px; display: flex; flex-direction: column; gap: 16px;">
    <lib-switch 
      ?checked="${checked}" 
      ?disabled="${disabled}" 
      .label="${label}"
      @change="${(e: CustomEvent): void => console.log('Switch state:', e.detail.checked)}"
    >
    </lib-switch>
  </div>
`;

export const Default: Story = {
  render: render,
  args: {
    checked: false,
    disabled: false,
    label: 'Notificaciones',
  },
};

export const Active: Story = {
  render: render,
  args: {
    ...Default.args,
    checked: true,
    label: 'Modo Avión',
  },
};

export const Disabled: Story = {
  render: render,
  args: {
    ...Default.args,
    disabled: true,
    label: 'Opción bloqueada',
  },
};

export const Showcase: StoryObj = {
  render: (): TemplateResult => html`
    <div style="display: flex; flex-direction: column; gap: 20px; padding: 20px;">
      <h3 style="font-family: sans-serif;">Switch Gallery</h3>
      <lib-switch label="Desactivado"></lib-switch>
      <lib-switch .checked="${true}" label="Activado"></lib-switch>
      <lib-switch .disabled="${true}" label="Deshabilitado OFF"></lib-switch>
      <lib-switch .disabled="${true}" .checked="${true}" label="Deshabilitado ON"></lib-switch>
    </div>
  `,
};