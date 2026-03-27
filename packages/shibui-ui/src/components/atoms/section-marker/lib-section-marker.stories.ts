import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './lib-section-marker.component'
/**
 * Section Marker (Eyebrow Label)
 * * Componente atómico utilizado como marcador de sección o "eyebrow" 
 * para categorizar contenido antes de un titular principal.
 */
const meta: Meta = {
  title: 'Atoms/Section Marker',
  component: 'lib-section-marker',
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Texto principal del marcador',
      table: { category: 'Properties' }
    },
    lineColor: {
      control: 'color',
      description: 'Color de la línea vertical (vía CSS Variable)',
      table: { category: 'Styling' }
    }
  },
  render: (args) => html`
    <lib-section-marker 
      .label=${args.label}
      style="${args.lineColor ? `--line-color: ${args.lineColor}` : ''}"
    ></lib-section-marker>
  `
};

export default meta;
type Story = StoryObj;

// --- Historias ---

/**
 * Estado por defecto: El uso más común para secciones de marketing o UI.
 */
export const Default: Story = {
  args: {
    label: 'Features',
  },
};

/**
 * Variante Kintsugi: Usando un color de acento personalizado para resaltar la marca.
 */
export const AccentColor: Story = {
  args: {
    label: 'Premium Service',
    lineColor: 'oklch(65% 0.25 260)', // Un azul Shibui profundo
  },
};

/**
 * Uso mediante Slot: Demuestra que podemos inyectar HTML complejo 
 * dentro del marcador si la prop 'label' no es suficiente.
 */
export const SlottedContent: Story = {
  render: () => html`
    <lib-section-marker>
      <strong>New</strong> Release v2.0
    </lib-section-marker>
  `,
};

/**
 * Composición Editorial: Muestra el componente en su contexto real
 * actuando como "Eyebrow" de un encabezado.
 */
export const EditorialContext: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lib-space-xs);">
      <lib-section-marker label="Case Study"></lib-section-marker>
      <h2 style="font-family: var(--font-family-base); font-size: var(--text-2xl); margin: 0; color: var(--bg-inverse);">
        The Art of Minimalism in Web Components
      </h2>
      <p style="font-family: var(--font-family-base); color: var(--color-washi-500); max-width: 400px;">
        Exploration of how the Shibui philosophy influences interface speed and clarity.
      </p>
    </div>
  `,
};