import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-select.component';
import '../../atoms/select-option/lib-select-option.component';

// Definimos la interfaz para los controles de la molécula
interface SelectArgs {
  label: string;
  placeholder: string;
  value: string;
  open: boolean;
  disabled: boolean;
}

const meta: Meta<SelectArgs> = {
  title: 'Forms/Select',
  component: 'lib-select',
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    value: { control: 'text' },
    open: { control: 'boolean' },
    disabled: { control: 'boolean' }
  },
};

export default meta;

type Story = StoryObj<SelectArgs>;

const render = ({ label, placeholder, value, open }: SelectArgs): TemplateResult => html`
  <div style="height: 300px; padding: 20px; max-width: 400px;">
    <lib-select 
      .label="${label}" 
      .placeholder="${placeholder}" 
      .value="${value}" 
      ?open="${open}"
    >
      <lib-select-option value="apple">Manzana</lib-select-option>
      <lib-select-option value="orange">Naranja</lib-select-option>
      <lib-select-option value="banana">Plátano</lib-select-option>
      <lib-select-option value="grape" disabled>Uva (Agotada)</lib-select-option>
    </lib-select>
  </div>
`;

export const Default: Story = {
  render: render,
  args: {
    label: 'Frutas favoritas',
    placeholder: 'Selecciona una fruta...',
    value: '',
    open: false,
    disabled: false
  },
};

export const Preselected: Story = {
  render: render,
  args: {
    ...Default.args,
    value: 'banana',
    label: 'Iniciado con valor'
  },
};