import { html, TemplateResult } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-dropdown.component';

interface DropdownArgs {
  label: string;
  open: boolean;
}

const meta: Meta<DropdownArgs> = {
  title: 'Navigation/Dropdown',
  component: 'lib-dropdown',
  argTypes: {
    label: { control: 'text' },
    open: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<DropdownArgs>;

const renderTemplate = (args: DropdownArgs): TemplateResult => html`
  <div style="height: 200px; display: flex; justify-content: center; padding-top: 20px;">
    <lib-dropdown .label=${args.label} ?open=${args.open}>
      <button @click=${():void => console.log('Edit')}>Editar perfil</button>
      <button @click=${():void => console.log('Settings')}>Configuración</button>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 4px 0;">
      <button style="color: #e53e3e;" @click=${():void => console.log('Delete')}>Eliminar cuenta</button>
    </lib-dropdown>
  </div>
`;

export const Default: Story = {
  args: {
    label: 'Mi Cuenta',
    open: false,
  },
  render: (args) => renderTemplate(args),
};