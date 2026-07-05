import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-card-grid.component';
import '../lib-card.component';
import { createKatachiStories } from '../../../../stories/katachi-stories.helper';

type LibComponentGridArgs = {
  transparent: boolean;
};

const meta: Meta<LibComponentGridArgs> = {
  title: 'Universal/Layout/Component Grid',
  tags: ['autodocs'],
  component: 'lib-component-grid',
  argTypes: {
    transparent: {
      control: 'boolean',
      description: 'Elimina el fondo y borde del grid (útil sobre fondos con imagen o color propio).',
    },
  },
  args: {
    transparent: false,
  },
  parameters: {
    docs: {
      description: {
        component: `
**lib-component-grid** · Atom · Layout

Grid contenedor de \`<lib-card>\` con separación hairline entre celdas. Gestiona el
layout CSS Grid (\`repeat(auto-fill, minmax(280px, 1fr))\` por defecto) y respeta el
\`grid-column: span 2\` de las cards destacadas. Los tokens \`--cg-cols\`, \`--cg-gap\`,
\`--cg-bg\` y \`--cg-border\` permiten ajustar columnas, gap y superficie.
        `,
      },
    },
  },
  render: (args): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);background:var(--bg-base);">
      <lib-component-grid ?transparent="${args.transparent}">
        <lib-card kanji="渋">
          <span slot="tag">01 · Celda</span>
          <h2 slot="title">Primera card</h2>
          <p>El grid gestiona el layout y el gap hairline entre celdas.</p>
          <div slot="footer"><span>Atom</span></div>
        </lib-card>
        <lib-card kanji="美">
          <span slot="tag">02 · Celda</span>
          <h2 slot="title">Segunda card</h2>
          <p>Las columnas se rellenan con <code>auto-fill</code>.</p>
          <div slot="footer"><span>Atom</span></div>
        </lib-card>
        <lib-card kanji="形">
          <span slot="tag">03 · Celda</span>
          <h2 slot="title">Tercera card</h2>
          <p>Ajusta el ancho del contenedor para ver el reflow.</p>
          <div slot="footer"><span>Atom</span></div>
        </lib-card>
      </lib-component-grid>
    </div>
  `,
};

export default meta;
type Story = StoryObj<LibComponentGridArgs>;

/* ── 1. Playground ──────────────────────────────────────── */

export const Playground: Story = {};

/* ── 2. API stories ─────────────────────────────────────── */

/** Card destacada ocupando dos columnas (`grid-column: span 2`). */
export const Featured: Story = {
  name: 'Featured · span 2',
  render: (): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);background:var(--bg-base);">
      <lib-component-grid>
        <lib-card variant="featured" style="grid-column:span 2;" kanji="渋">
          <span slot="tag">✦ Destacado</span>
          <h2 slot="title">Card destacada a dos columnas</h2>
          <p>El grid respeta el <code>grid-column: span 2</code> de la card featured.</p>
          <div slot="footer"><span>featured</span></div>
        </lib-card>
        <lib-card kanji="美">
          <span slot="tag">Estándar</span>
          <h2 slot="title">Card normal</h2>
          <p>Ocupa una sola columna.</p>
          <div slot="footer"><span>Atom</span></div>
        </lib-card>
        <lib-card kanji="形">
          <span slot="tag">Estándar</span>
          <h2 slot="title">Otra card</h2>
          <p>Ocupa una sola columna.</p>
          <div slot="footer"><span>Atom</span></div>
        </lib-card>
      </lib-component-grid>
    </div>
  `,
};

/** Sin fondo ni borde de grid — las cards flotan sobre el fondo del contenedor. */
export const Transparent: Story = {
  render: (): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);background:linear-gradient(135deg, var(--color-kaki-300, #c97a3a) 0%, var(--color-celadon-300, #6aab9e) 100%);">
      <lib-component-grid transparent>
        <lib-card kanji="渋">
          <span slot="tag">01 · Transparente</span>
          <h2 slot="title">Sin fondo de grid</h2>
          <p>El gap no muestra ningún color: las cards flotan sobre el fondo.</p>
          <div slot="footer"><span>transparent</span></div>
        </lib-card>
        <lib-card kanji="美">
          <span slot="tag">02 · Transparente</span>
          <h2 slot="title">Segunda card</h2>
          <p>Útil sobre imágenes o gradientes.</p>
          <div slot="footer"><span>transparent</span></div>
        </lib-card>
      </lib-component-grid>
    </div>
  `,
};

/* ── 3. Katachi · 形 ────────────────────────────────────── */

const _katachi = createKatachiStories<LibComponentGridArgs>(() => html`
  <lib-component-grid>
    <lib-card variant="featured" style="grid-column:span 2;" kanji="金">
      <span slot="tag">✦ Destacado</span>
      <h2 slot="title">Grid en contexto</h2>
      <p>La superficie del grid resuelve por katachi vía tokens semánticos.</p>
      <div slot="footer"><span>featured</span></div>
    </lib-card>
    <lib-card kanji="渋">
      <span slot="tag">Estándar</span>
      <h2 slot="title">Card A</h2>
      <p>Una columna.</p>
      <div slot="footer"><span>Atom</span></div>
    </lib-card>
    <lib-card kanji="形">
      <span slot="tag">Estándar</span>
      <h2 slot="title">Card B</h2>
      <p>Una columna.</p>
      <div slot="footer"><span>Atom</span></div>
    </lib-card>
  </lib-component-grid>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;

/* ── 4. Tests ───────────────────────────────────────────── */

export const TestRendersGrid: Story = {
  name: 'Test · renderiza el grid y proyecta las cards',
  tags: ['test'],
  play: async ({ canvasElement }): Promise<void> => {
    const grid = canvasElement.querySelector('lib-component-grid');
    if (!grid) throw new Error('lib-component-grid no se renderizó');
    const gridPart = grid.shadowRoot?.querySelector('.grid');
    if (!gridPart) throw new Error('El part .grid no está presente en el Shadow DOM');
    const cards = grid.querySelectorAll('lib-card');
    if (cards.length === 0) throw new Error('El grid no proyecta ninguna lib-card en el slot');
  },
};
