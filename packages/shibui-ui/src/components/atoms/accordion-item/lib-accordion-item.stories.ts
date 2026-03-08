import { html, TemplateResult } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-accordion-item.component';

interface AccordionItemArgs {
  label: string;
  open: boolean;
  slotContent: string;
}

const meta: Meta<AccordionItemArgs> = {
  title: 'Components/Atoms/AccordionItem', // Organización funcional para el menú
  component: 'lib-accordion-item',
  argTypes: {
    label: { control: 'text' },
    open: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<AccordionItemArgs>;

// Función de renderizado limpia sin 'any'
const renderTemplate = (args: AccordionItemArgs): TemplateResult => html`
  <div style="max-width: 500px; margin: 2rem auto; border: 1px solid #e2e8f0; border-radius: 8px;">
    <lib-accordion-item .label=${args.label} ?open=${args.open}>
      <p>${args.slotContent}</p>
    </lib-accordion-item>
  </div>
`;

export const Default: Story = {
  args: {
    label: '¿Es esto un Átomo?',
    open: false,
    slotContent: 'Sí, en nuestra arquitectura técnica es un átomo porque es la unidad mínima de información colapsable.',
  },
  render: (args) => renderTemplate(args),
};

export const Open: Story = {
  args: {
    ...Default.args,
    open: true,
  },
  render: (args) => renderTemplate(args),
};