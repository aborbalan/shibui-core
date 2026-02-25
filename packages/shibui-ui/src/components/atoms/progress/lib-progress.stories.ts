import { html, TemplateResult } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-progress.component';

/**
 * Interfaz para los argumentos del componente Progress
 */
interface ProgressArgs {
  value: number;
  max: number;
  indeterminate: boolean;
  showValue: boolean;
  label: string;
}

const meta: Meta<ProgressArgs> = {
  title: 'Feedback/Progress', 
  component: 'lib-progress',
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    indeterminate: { control: 'boolean' },
    showValue: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<ProgressArgs>;

/**
 * Función de renderizado compartida para evitar errores de undefined y tipos
 */
const renderProgress = (args: ProgressArgs): TemplateResult => html`
  <lib-progress 
    .value=${args.value} 
    .max=${args.max} 
    ?indeterminate=${args.indeterminate}
    ?showValue=${args.showValue}
    .label=${args.label}
  ></lib-progress>
`;

export const Default: Story = {
  args: {
    value: 40,
    max: 100,
    indeterminate: false,
    showValue: true,
    label: 'Cargando archivos',
  },
  render: (args) => renderProgress(args),
};

export const Indeterminate: Story = {
  args: {
    ...Default.args,
    indeterminate: true,
  },
  render: (args) => renderProgress(args),
};