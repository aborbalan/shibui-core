import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-input.component';
import '../../atoms/glass-card/lib-glass-card.component';
// Suponiendo que tienes un átomo de icono para los slots
// import '../../atoms/icon/lib-icon.component'; 

const meta: Meta = {
  title: 'Forms/Input',
  component: 'lib-input',
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    required: { control: 'boolean' }
  }
};

export default meta;

export const Default: StoryObj = {
  args: {
    label: 'Nombre de usuario',
    placeholder: 'Ej: john_doe',
    required: true
  },
  render: (args): TemplateResult => html`
    <div style="max-width: 320px; padding: 20px;">
      <lib-input 
        .label=${args.label} 
        .placeholder=${args.placeholder} 
        ?required=${args.required}>
      </lib-input>
    </div>
  `
};

export const WithIcons: StoryObj = {
  render: (): TemplateResult => html`
    <div style="max-width: 320px; padding: 20px; display: flex; flex-direction: column; gap: 20px;">
      <lib-input label="Email" placeholder="correo@ejemplo.com">
        <span slot="prefix">📧</span>
      </lib-input>

      <lib-input label="Contraseña" type="password" placeholder="••••••••">
        <span slot="prefix">🔒</span>
        <span slot="suffix" style="cursor: pointer;">👁️</span>
      </lib-input>
    </div>
  `
};

export const GlassVariant: StoryObj = {
  render: (): TemplateResult => html`
    <div style="
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
      padding: 60px; 
      display: flex; 
      justify-content: center;
    ">
      <lib-glass-card intensity="md" style="width: 350px;">
        <h3 style="color: white; margin-bottom: 20px;">Acceso Privado</h3>
        <lib-input 
          label="Token de acceso" 
          placeholder="Introduce tu clave..." 
          style="--lib-input-bg: rgba(255,255,255,0.1); --lib-color-text: white; --lib-input-border: rgba(255,255,255,0.2);">
        </lib-input>
        <button style="
          margin-top: 20px; 
          width: 100%; 
          padding: 10px; 
          border-radius: 8px; 
          border: none; 
          background: white; 
          font-weight: bold; 
          cursor: pointer;">
          Entrar
        </button>
      </lib-glass-card>
    </div>
  `
};

export const ErrorState: StoryObj = {
    args: {
      label: 'Email',
      placeholder: 'ejemplo@correo.com',
      error: true,
      errorMessage: 'El formato del correo no es válido'
    },
    render: (args) => html`
      <div style="max-width: 320px; padding: 20px;">
        <lib-input 
          .label=${args.label} 
          .placeholder=${args.placeholder}
          ?error=${args.error}
          .errorMessage=${args.errorMessage}>
        </lib-input>
      </div>
    `
  };

  export const InteractiveTest: StoryObj = {
    args: {
      error: false,
      errorMessage: 'Este campo tiene un error'
    },
    render: (args): TemplateResult => html`
      <div style="max-width: 320px; padding: 20px; font-family: sans-serif;">
        <lib-input 
          label="Escribe algo"
          placeholder="Prueba la X o el error..."
          ?error=${args.error}
          .errorMessage=${args.errorMessage}
          @lib-input=${(e: CustomEvent):void => {
            const display = document.getElementById('value-display');
            if (display) display.innerText = e.detail.value;
          }}>
        </lib-input>
  
        <div style="margin-top: 16px; padding: 12px; background: #f1f5f9; border-radius: 8px; border: 1px dashed #cbd5e1;">
          <p style="margin: 0; font-size: 0.8rem; color: #64748b;">
            Valor detectado por el padre:
          </p>
          <span id="value-display" style="font-weight: bold; color: #6366f1;"></span>
        </div>
      </div>
    `
  };

  export const GlassEffect: StoryObj = {
    render: () => html`
      <div style="background: linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%); padding: 40px; border-radius: 15px;">
        <lib-input 
          label="Input de Cristal" 
          placeholder="Mira el fondo a través de mí..." 
          glass>
        </lib-input>
      </div>
    `
  };