import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-card.component';
import '../../atoms/button/lib-button.component';

type LibCardArgs = {
  variant: 'default' | 'inverse' | 'accent';
  accentColor: string;
};

const meta: Meta<LibCardArgs> = {
  title: 'Components/Molecules/Card',
  component: 'lib-card',
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'inverse', 'accent'],
      description: 'Variante visual de la card',
    },
    accentColor: {
      control: 'color',
      description: 'Color del borde accent (solo variante accent)',
    },
  },
  render: (args): TemplateResult => html`
    <div style="width: 320px; padding: var(--lib-space-xl);">
      <lib-card variant="${args.variant}" accentColor="${args.accentColor}">
        <span slot="tag">Etiqueta</span>
        <h2 slot="title">Título de la card</h2>
        <p>Contenido de ejemplo para visualizar el componente con texto representativo.</p>
        <div slot="footer">
          <span>Metadata</span>
          <lib-button variant="ghost" size="sm">Acción</lib-button>
        </div>
      </lib-card>
    </div>
  `,
};

export default meta;
type Story = StoryObj<LibCardArgs>;

/* ── Playground ── */
export const Playground: Story = {
  args: {
    variant: 'default',
    accentColor: '',
  },
};

/* ── Todas las variantes ── */
export const AllVariants: Story = {
  name: 'All Variants',
  render: (): TemplateResult => html`
    <div style="
      display: grid;
      grid-template-columns: repeat(3, 320px);
      gap: var(--lib-space-xl);
      padding: var(--lib-space-xl);
    ">
      <lib-card variant="default">
        <span slot="tag">Component</span>
        <h2 slot="title">Default Card</h2>
        <p>A simple surface for grouping related content with subtle elevation on hover.</p>
        <div slot="footer">
          <span>v1.0</span>
          <lib-button variant="ghost" size="sm">Learn more</lib-button>
        </div>
      </lib-card>

      <lib-card variant="accent">
        <span slot="tag">Accent variant</span>
        <h2 slot="title">Kaki Accent</h2>
        <p>Left border in persimmon kaki. Used for highlighted or featured items.</p>
        <div slot="footer">
          <span>Featured</span>
          <lib-button variant="primary" size="sm">Explore</lib-button>
        </div>
      </lib-card>

      <lib-card variant="inverse">
        <span slot="tag">Inverse variant</span>
        <h2 slot="title">Dark Card</h2>
        <p>Inverse surface using the deepest washi tone. For contrast sections.</p>
        <div slot="footer">
          <span>Inverse</span>
          <lib-button variant="secondary" size="sm">View</lib-button>
        </div>
      </lib-card>
    </div>
  `,
};

/* ── Accent con color custom ── */
export const CustomAccent: Story = {
  name: 'Custom Accent Color',
  render: (): TemplateResult => html`
    <div style="
      display: grid;
      grid-template-columns: repeat(3, 280px);
      gap: var(--lib-space-xl);
      padding: var(--lib-space-xl);
    ">
      <lib-card variant="accent" accentColor="var(--color-kaki-400)">
        <span slot="tag">Kaki</span>
        <h2 slot="title">Persimón</h2>
        <p>El acento por defecto del sistema Shibui.</p>
        <div slot="footer">
          <span>Highlight</span>
          <lib-button variant="ghost" size="sm">Ver más</lib-button>
        </div>
      </lib-card>

      <lib-card variant="accent" accentColor="var(--color-celadon-400)">
        <span slot="tag">Celadón</span>
        <h2 slot="title">Jade</h2>
        <p>El segundo acento del sistema, más sereno.</p>
        <div slot="footer">
          <span>Sereno</span>
          <lib-button variant="ghost" size="sm">Ver más</lib-button>
        </div>
      </lib-card>

      <lib-card variant="accent" accentColor="var(--color-washi-500)">
        <span slot="tag">Washi</span>
        <h2 slot="title">Neutro</h2>
        <p>Acento sutil para contenido sin jerarquía especial.</p>
        <div slot="footer">
          <span>Neutro</span>
          <lib-button variant="ghost" size="sm">Ver más</lib-button>
        </div>
      </lib-card>
    </div>
  `,
};