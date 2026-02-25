import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './lib-glass-card.component';

const meta: Meta = {
  title: 'Surfaces/Glass Card',
  component: 'lib-glass-card',
  argTypes: {
    intensity: {
      control: 'select',
      options: ['low', 'md', 'high'],
      description: 'Define el nivel de desenfoque y opacidad del cristal'
    }
  },
  parameters: {
    layout: 'fullscreen',
  }
};

export default meta;

export const Showcase: StoryObj = {
  args: {
    intensity: 'md'
  },
  render: (args) => html`
    <div style="
      position: relative;
      min-height: 100vh;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0f172a;
      overflow: hidden;
      font-family: sans-serif;
    ">
      <div style="position: absolute; top: 20%; left: 30%; width: 300px; height: 300px; background: #3b82f6; filter: blur(80px); border-radius: 50%; opacity: 0.6;"></div>
      <div style="position: absolute; bottom: 20%; right: 30%; width: 250px; height: 250px; background: #db2777; filter: blur(80px); border-radius: 50%; opacity: 0.5;"></div>
      <div style="position: absolute; top: 50%; left: 50%; width: 200px; height: 200px; background: #fbbf24; filter: blur(80px); border-radius: 50%; opacity: 0.4;"></div>

      <lib-glass-card .intensity=${args.intensity} style="width: 400px;">
        <div style="color: white;">
          <h2 style="margin: 0 0 16px 0; font-size: 1.5rem; font-weight: 700;">Glassmorphism v1.0</h2>
          <p style="line-height: 1.6; color: rgba(255, 255, 255, 0.8); margin-bottom: 24px;">
            Este componente utiliza <strong>backdrop-filter</strong> para refractar la luz del fondo. 
            Es ideal para paneles de control modernos y overlays que no quieren perder el contexto visual del fondo.
          </p>
          
          <div style="display: flex; gap: 12px; align-items: center; padding: 12px; background: rgba(255,255,255,0.1); border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="width: 40px; height: 40px; background: #6366f1; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              ✨
            </div>
            <div>
              <div style="font-size: 0.875rem; font-weight: 600;">Efecto Activo</div>
              <div style="font-size: 0.75rem; opacity: 0.7;">Intensidad: ${args.intensity}</div>
            </div>
          </div>

          <button style="
            margin-top: 24px;
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 8px;
            background: white;
            color: #0f172a;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
          " 
           @mousedown=${(e: MouseEvent):void => {
                const target = e.currentTarget as HTMLElement;
                      target.style.transform = 'scale(0.98)';
                }}
  @mouseup=${(e: MouseEvent):void => {
    const target = e.currentTarget as HTMLElement;
    target.style.transform = 'scale(1)';
  }}>
            Explorar Componente
          </button>
        </div>
      </lib-glass-card>
    </div>
  `
};

export const IntensityComparison: StoryObj = {
  render: () => html`
    <div style="
      background: url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000') center/cover;
      padding: 60px;
      display: flex;
      gap: 30px;
      justify-content: center;
      flex-wrap: wrap;
      min-height: 100vh;
    ">
      <lib-glass-card intensity="low" style="width: 250px;">
        <h4 style="color: white; margin-top: 0;">Low Intensity</h4>
        <p style="color: white; font-size: 0.9rem;">Sutil y muy transparente.</p>
      </lib-glass-card>

      <lib-glass-card intensity="md" style="width: 250px;">
        <h4 style="color: white; margin-top: 0;">Medium Intensity</h4>
        <p style="color: white; font-size: 0.9rem;">El equilibrio perfecto.</p>
      </lib-glass-card>

      <lib-glass-card intensity="high" style="width: 250px;">
        <h4 style="color: white; margin-top: 0;">High Intensity</h4>
        <p style="color: white; font-size: 0.9rem;">Máximo desenfoque (estilo esmerilado).</p>
      </lib-glass-card>
    </div>
  `
};