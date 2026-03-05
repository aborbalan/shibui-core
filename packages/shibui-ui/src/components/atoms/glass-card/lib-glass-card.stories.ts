import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-glass-card.component';
import type { LibGlassCard } from './lib-glass-card.component';

type LibGlassCardStoryArgs = Pick<LibGlassCard, 'variant' | 'intensity'>;

/* Stage oscuro con orbes de fondo — imprescindible para que blur sea visible */
const stage = (content: TemplateResult): TemplateResult => html`
  <div style="
    background: linear-gradient(135deg, #0f1923 0%, #1a2535 50%, #0d1f2d 100%);
    padding: 48px;
    border-radius: 8px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    position: relative;
    overflow: hidden;
  ">
    <!-- Orbe water -->
    <div style="position:absolute; width:300px; height:300px; border-radius:50%; background:oklch(55% 0.06 210 / 0.25); top:-80px; left:-60px; filter:blur(60px); pointer-events:none;"></div>
    <!-- Orbe kaki -->
    <div style="position:absolute; width:250px; height:250px; border-radius:50%; background:oklch(45% 0.05 45 / 0.2); bottom:-60px; right:-40px; filter:blur(50px); pointer-events:none;"></div>
    ${content}
  </div>
`;

const cardContent = (label: string, title: string, body: string, tag: string): TemplateResult => html`
  <div style="padding:24px;">
    <p style="font-family:monospace; font-size:10px; letter-spacing:0.25em; text-transform:uppercase; color:oklch(90% 0 0 / 0.5); margin-bottom:12px;">${label}</p>
    <h3 style="font-family:'Cormorant Garamond',serif; font-size:24px; font-weight:300; color:oklch(98% 0.01 60); text-shadow:0 1px 3px oklch(0% 0 0 / 0.3); margin-bottom:8px;">${title}</h3>
    <p style="font-size:13px; color:oklch(90% 0 0 / 0.6); line-height:1.8;">${body}</p>
    <div style="margin-top:16px; padding-top:12px; border-top:1px solid oklch(100% 0 0 / 0.1); display:flex; justify-content:space-between; align-items:center;">
      <span style="font-family:monospace; font-size:9px; letter-spacing:0.15em; color:oklch(80% 0 0 / 0.5); text-transform:uppercase;">${tag}</span>
      <button style="display:inline-flex; align-items:center; position:relative; overflow:hidden; border-radius:6px; padding:6px 16px; backdrop-filter:blur(8px); background:oklch(100% 0 0 / 0.1); border:1px solid oklch(100% 0 0 / 0.2); color:oklch(98% 0.01 60); font-family:monospace; font-size:10px; letter-spacing:0.15em; text-transform:uppercase; cursor:pointer;">
        Ver más
      </button>
    </div>
  </div>
`;

const meta: Meta<LibGlassCardStoryArgs> = {
  title: 'Components/Atoms/GlassCard',
  component: 'lib-glass-card',

  parameters: {
    backgrounds: { default: 'dark' },
  },

  argTypes: {
    variant: {
      control: 'select',
      options: ['paper', 'water', 'kaki'],
      description: 'Tinte de color del cristal',
    },
    intensity: {
      control: 'select',
      options: ['low', 'md', 'high'],
      description: 'Intensidad del blur y la opacidad',
    },
  },

  render: (args): TemplateResult => stage(html`
    <lib-glass-card variant=${args.variant} intensity=${args.intensity} style="grid-column:1/-1; max-width:360px;">
      ${cardContent('--lib-glass-bg', `${args.variant} · ${args.intensity}`, 'Glassmorphism shibui construido sobre tokens primitivos.', `opacity · ${args.intensity}`)}
    </lib-glass-card>
  `),
};

export default meta;
type Story = StoryObj<LibGlassCardStoryArgs>;

/* ── Playground ── */
export const Playground: Story = {
  args: {
    variant: 'paper',
    intensity: 'md',
  },
};

/* ── Las tres variantes de color ── */
export const Variants: Story = {
  name: 'Color Variants',
  render: (): TemplateResult => stage(html`
    <lib-glass-card variant="paper">
      ${cardContent('--lib-glass-bg', 'Paper Glass', 'Variante neutra. Surface paper al 15% sobre cualquier fondo oscuro.', 'opacity · 0.15')}
    </lib-glass-card>

    <lib-glass-card variant="water">
      ${cardContent('--lib-glass-bg-water', 'Water Glass', 'Tinte azul sereno. Para componentes primary o acciones de confirmación.', 'oklch 55% 0.06 210')}
    </lib-glass-card>

    <lib-glass-card variant="kaki">
      ${cardContent('--lib-glass-bg-kaki', 'Kaki Glass', 'Tinte orgánico cálido. Para acciones de acento o estados destacados.', 'oklch 45% 0.05 45')}
    </lib-glass-card>
  `),
};

/* ── Intensidades ── */
export const Intensities: Story = {
  render: (): TemplateResult => stage(html`
    <lib-glass-card intensity="low">
      ${cardContent('blur-low · opacity-low', 'Low', 'blur(4px) · opacity 0.10. Sutil, casi imperceptible. Para overlays livianos.', 'blur · 4px')}
    </lib-glass-card>

    <lib-glass-card intensity="md">
      ${cardContent('blur-md · opacity-md', 'Medium (default)', 'blur(12px) · opacity 0.15. El equilibrio entre visibilidad y elegancia.', 'blur · 12px')}
    </lib-glass-card>

    <lib-glass-card intensity="high">
      ${cardContent('blur-high · opacity-high', 'High', 'blur(25px) · opacity 0.25. Máximo esmerilado. Para modales o drawers.', 'blur · 25px')}
    </lib-glass-card>
  `),
};

/* ── Combinaciones variant × intensity ── */
export const Matrix: Story = {
  render: (): TemplateResult => stage(html`
    ${(['paper', 'water', 'kaki'] as const).flatMap(v =>
      (['low', 'md', 'high'] as const).map(i => html`
        <lib-glass-card variant=${v} intensity=${i}>
          <div style="padding:16px;">
            <p style="font-family:monospace; font-size:9px; color:oklch(90% 0 0 / 0.4); margin-bottom:6px; text-transform:uppercase; letter-spacing:0.25em;">${v} · ${i}</p>
            <p style="font-size:11px; color:oklch(90% 0 0 / 0.55); line-height:1.6;">Glass card combinando tinte y blur.</p>
          </div>
        </lib-glass-card>
      `)
    )}
  `),
};

/* ── Context: modal / overlay ── */
export const ContextModal: Story = {
  name: 'Context — Modal overlay',
  render: (): TemplateResult => html`
    <div style="
      background: linear-gradient(135deg, #0f1923 0%, #1a2535 100%);
      padding: 64px 48px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 320px;
      position: relative;
      overflow: hidden;
    ">
      <div style="position:absolute; width:400px; height:400px; border-radius:50%; background:oklch(55% 0.06 210 / 0.2); top:-100px; right:-100px; filter:blur(80px);"></div>

      <lib-glass-card variant="water" intensity="high" style="max-width:400px; width:100%;">
        <div style="padding:32px;">
          <p style="font-family:monospace; font-size:10px; color:oklch(90% 0 0 / 0.4); text-transform:uppercase; letter-spacing:0.25em; margin-bottom:16px;">Confirmar acción</p>
          <h3 style="font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:300; color:oklch(98% 0.01 60); text-shadow:0 1px 3px oklch(0% 0 0 / 0.3); margin-bottom:12px;">¿Estás seguro?</h3>
          <p style="font-size:13px; color:oklch(90% 0 0 / 0.6); line-height:1.8; margin-bottom:24px;">Esta acción no se puede deshacer. Se eliminará permanentemente el componente seleccionado del sistema.</p>
          <div style="display:flex; gap:12px;">
            <button style="flex:1; padding:10px; background:oklch(100% 0 0 / 0.08); border:1px solid oklch(100% 0 0 / 0.15); color:oklch(90% 0 0 / 0.7); font-family:monospace; font-size:10px; letter-spacing:0.15em; text-transform:uppercase; cursor:pointer; border-radius:4px;">Cancelar</button>
            <button style="flex:1; padding:10px; background:oklch(100% 0 0 / 0.18); border:1px solid oklch(100% 0 0 / 0.3); color:oklch(98% 0.01 60); font-family:monospace; font-size:10px; letter-spacing:0.15em; text-transform:uppercase; cursor:pointer; border-radius:4px;">Confirmar</button>
          </div>
        </div>
      </lib-glass-card>
    </div>
  `,
};

/* ── Context: dashboard de métricas ── */
export const ContextDashboard: Story = {
  name: 'Context — Dashboard',
  render: (): TemplateResult => html`
    <div style="
      background: linear-gradient(160deg, #0f1923 0%, #1a2535 60%, #0d1520 100%);
      padding: 48px;
      border-radius: 8px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      position: relative;
      overflow: hidden;
    ">
      <div style="position:absolute; width:350px; height:350px; border-radius:50%; background:oklch(55% 0.06 210 / 0.15); top:-80px; left:20%; filter:blur(70px);"></div>

      <lib-glass-card variant="paper" intensity="low">
        <div style="padding:20px;">
          <p style="font-family:monospace; font-size:9px; color:oklch(70% 0 0 / 0.5); text-transform:uppercase; letter-spacing:0.25em; margin-bottom:8px;">Componentes</p>
          <p style="font-family:'Cormorant Garamond',serif; font-size:40px; font-weight:300; color:oklch(95% 0.01 60); line-height:1;">16</p>
        </div>
      </lib-glass-card>

      <lib-glass-card variant="water" intensity="md">
        <div style="padding:20px;">
          <p style="font-family:monospace; font-size:9px; color:oklch(70% 0 0 / 0.5); text-transform:uppercase; letter-spacing:0.25em; margin-bottom:8px;">Completados</p>
          <p style="font-family:'Cormorant Garamond',serif; font-size:40px; font-weight:300; color:oklch(95% 0.01 60); line-height:1;">12</p>
        </div>
      </lib-glass-card>

      <lib-glass-card variant="kaki" intensity="md">
        <div style="padding:20px;">
          <p style="font-family:monospace; font-size:9px; color:oklch(70% 0 0 / 0.5); text-transform:uppercase; letter-spacing:0.25em; margin-bottom:8px;">En progreso</p>
          <p style="font-family:'Cormorant Garamond',serif; font-size:40px; font-weight:300; color:oklch(95% 0.01 60); line-height:1;">4</p>
        </div>
      </lib-glass-card>
    </div>
  `,
};