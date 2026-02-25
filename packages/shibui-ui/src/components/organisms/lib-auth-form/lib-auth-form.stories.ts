import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './lib-auth-form.component';

interface AuthFormProps {
  glass: boolean;
  title: string;
  loading: boolean;
}

const meta: Meta<AuthFormProps> = {
  title: 'Forms/Auth Form',
  component: 'lib-auth-form',
  argTypes: {
    glass: { control: 'boolean' },
    loading: { control: 'boolean' },
    title: { control: 'text' },
  },
  // Esto captura el evento que definimos en el componente
  parameters: {
    actions: {
      handles: ['lib-auth-submit'],
    },
  },
};

export default meta;

type Story = StoryObj<AuthFormProps>;

export const Login: Story = {
  args: {
    glass: false,
    title: 'Área de Clientes',
    loading: false,
  },
  render: (args) => html`
    <div style="
      background: linear-gradient(45deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: sans-serif;
    ">
      <lib-auth-form 
        ?glass=${args.glass} 
        title=${args.title}
        ?loading=${args.loading}>
        
        <div slot="footer" style="display: flex; justify-content: space-between; font-size: 12px; margin-top: 10px;">
          <a href="#" style="color: ${args.glass ? 'white' : '#007bff'}; text-decoration: none;">Crear cuenta</a>
          <a href="#" style="color: ${args.glass ? 'white' : '#666'}; text-decoration: none;">¿Olvidaste tu clave?</a>
        </div>

      </lib-auth-form>
    </div>
  `
};