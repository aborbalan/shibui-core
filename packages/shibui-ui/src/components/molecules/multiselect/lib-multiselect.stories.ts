import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-multiselect.component';
import '../../atoms/checkbox/lib-checkbox.component'; // Asegúrate de que la ruta es correcta

interface MultiselectArgs {
  label: string;
  placeholder: string;
  options: Array<{ label: string; value: string }>;
  value: string[];
}

const meta: Meta<MultiselectArgs> = {
  title: 'Forms/Multiselect',
  component: 'lib-multiselect',
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    value: { control: 'object' },
    options: { control: 'object' }
  },
};

export default meta;

type Story = StoryObj<MultiselectArgs>;

const render = ({ label, placeholder, options, value }: MultiselectArgs): TemplateResult => html`
  <div style="height: 400px; padding: 20px; max-width: 400px;">
    <lib-multiselect 
      .label="${label}" 
      .placeholder="${placeholder}" 
      .options="${options}"
      .value="${value}"
      @change="${(e: CustomEvent):void => console.log('Selección multiselect:', e.detail.value)}"
    >
    </lib-multiselect>
  </div>
`;

export const Default: Story = {
  render: render,
  args: {
    label: 'Países preferidos',
    placeholder: 'Selecciona tus destinos...',
    value: [],
    options: [
      { label: 'España 🇪🇸', value: 'es' },
      { label: 'Francia 🇫🇷', value: 'fr' },
      { label: 'Italia 🇮🇹', value: 'it' },
      { label: 'Portugal 🇵🇹', value: 'pt' },
      { label: 'Alemania 🇩🇪', value: 'de' }
    ]
  },
};

export const Preselected: Story = {
  render: render,
  args: {
    ...Default.args,
    label: 'Edición (Valores preseleccionados)',
    value: ['es', 'it'],
  },
};