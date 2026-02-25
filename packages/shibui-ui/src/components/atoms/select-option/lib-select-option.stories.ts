import { html, TemplateResult } from 'lit';
// Cambiamos la importación según el error de Storybook
import type { Meta, StoryObj } from '@storybook/web-components-vite'; 
import './lib-select-option.component';

// Definimos una interfaz para los argumentos de la historia para evitar el 'any'
interface SelectOptionArgs {
  value: string;
  selected: boolean;
  disabled: boolean;
  content: string;
}

const meta: Meta<SelectOptionArgs> = {
  title: 'Forms/Select Option',
  component: 'lib-select-option',
  argTypes: {
    value: { control: 'text' },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    content: { control: 'text', name: 'Slot Content' }
  },
};

export default meta;

type Story = StoryObj<SelectOptionArgs>;

// Añadimos el tipo de retorno : TemplateResult para callar el warning
const render = ({ value, selected, disabled, content }: SelectOptionArgs): TemplateResult => html`
  <div style="background: white; padding: 20px; width: 300px;">
    <lib-select-option 
      .value="${value}" 
      ?selected="${selected}" 
      ?disabled="${disabled}"
    >
      ${content}
    </lib-select-option>
  </div>
`;

export const Default: Story = {
  render: render,
  args: {
    value: 'opcion-1',
    content: 'Opción por defecto',
    selected: false,
    disabled: false,
  },
};