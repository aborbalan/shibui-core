import { html, TemplateResult } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-accordion.component';
import '../../atoms/accordion-item/lib-accordion-item.component';

interface AccordionArgs {
  exclusive: boolean;
}

const meta: Meta<AccordionArgs> = {
  title: 'Display/Accordion',
  component: 'lib-accordion',
  argTypes: {
    exclusive: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<AccordionArgs>;

const renderTemplate = (args: AccordionArgs): TemplateResult => html`
  <div style="max-width: 600px; margin: 2rem auto;">
    <lib-accordion ?exclusive=${args.exclusive}>
      <lib-accordion-item label="Sección 1: Arquitectura">
        <p>Estamos utilizando Atomic Design para separar la lógica de los componentes.</p>
      </lib-accordion-item>
      <lib-accordion-item label="Sección 2: Lit & TypeScript">
        <p>Lit proporciona una base ligera y eficiente para nuestros Web Components.</p>
      </lib-accordion-item>
      <lib-accordion-item label="Sección 3: Storybook">
        <p>Storybook nos permite documentar y probar los componentes de forma aislada.</p>
      </lib-accordion-item>
    </lib-accordion>
  </div>
`;

export const Default: Story = {
  args: {
    exclusive: false,
  },
  render: (args) => renderTemplate(args),
};

export const Exclusive: Story = {
  args: {
    exclusive: true,
  },
  render: (args) => renderTemplate(args),
};