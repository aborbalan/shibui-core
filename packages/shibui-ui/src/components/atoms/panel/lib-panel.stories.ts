import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-panel.component';
import '../button/lib-button.component';
import '../eyebrow/lib-eyebrow.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';
import type { LibPanelVariant, LibPanelPadding } from './lib-panel.types';

type LibPanelArgs = {
  variant: LibPanelVariant;
  padding: LibPanelPadding;
  heading: string;
};

const meta: Meta<LibPanelArgs> = {
  title: 'Universal/Layout/Panel',
  tags: ['autodocs'],
  component: 'lib-panel',
  argTypes: {
    variant: {
      control: 'select',
      options: ['surface', 'elevated', 'outline'],
      description: 'Tratamiento visual de la superficie.',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Padding interno del panel.',
    },
    heading: {
      control: 'text',
      description: 'Título opcional en la cabecera.',
    },
  },
  args: {
    variant: 'surface',
    padding: 'md',
    heading: 'Panel',
  },
  render: (args): TemplateResult => html`
    <div style="max-width:420px;">
      <lib-panel variant="${args.variant}" padding="${args.padding}" heading="${args.heading}">
        <p style="color:var(--text-secondary);">
          Superficie contenedora que consume tokens semánticos y hereda el katachi
          del ancestro automáticamente.
        </p>
      </lib-panel>
    </div>
  `,
};

export default meta;
type Story = StoryObj<LibPanelArgs>;

/* ── 1. Playground ──────────────────────────────────────── */

export const Playground: Story = {};

/* ── 2. API stories ─────────────────────────────────────── */

/** Las tres variantes de superficie. */
export const Variants: Story = {
  render: (): TemplateResult => html`
    <div style="display:flex;flex-direction:column;gap:var(--lib-space-lg);max-width:420px;">
      ${(['surface', 'elevated', 'outline'] as const).map(
        (v) => html`
          <lib-panel variant="${v}" heading="${v}">
            <p style="color:var(--text-secondary);">Variante <code>${v}</code>.</p>
          </lib-panel>
        `,
      )}
    </div>
  `,
};

/** Escala de padding interno. */
export const Padding: Story = {
  render: (): TemplateResult => html`
    <div style="display:flex;flex-direction:column;gap:var(--lib-space-lg);max-width:420px;">
      ${(['none', 'sm', 'md', 'lg'] as const).map(
        (p) => html`
          <lib-panel variant="outline" padding="${p}">
            <div style="background:var(--bg-elevated);color:var(--text-muted);font-family:var(--lib-font-mono);font-size:var(--text-xs);padding:var(--lib-space-xs);">
              padding="${p}"
            </div>
          </lib-panel>
        `,
      )}
    </div>
  `,
};

/** Cabecera con acciones y pie con botones. */
export const Composition: Story = {
  render: (): TemplateResult => html`
    <div style="max-width:420px;">
      <lib-panel variant="elevated" heading="Ajustes de cuenta">
        <lib-eyebrow slot="header" size="sm" tone="muted">v2</lib-eyebrow>
        <p style="color:var(--text-secondary);">
          El slot <code>header</code> convive con el <code>heading</code>; el slot
          <code>footer</code> aparece solo si tiene contenido.
        </p>
        <div slot="footer" style="display:flex;gap:var(--lib-space-sm);">
          <lib-button variant="ghost" size="sm">Cancelar</lib-button>
          <lib-button size="sm">Guardar</lib-button>
        </div>
      </lib-panel>
    </div>
  `,
};

/* ── 3. Katachi · 形 ────────────────────────────────────── */

const _katachi = createKatachiStories<LibPanelArgs>(() => html`
  <div style="display:flex;flex-direction:column;gap:var(--lib-space-md);max-width:360px;width:100%;">
    <lib-panel variant="surface" heading="Surface">
      <p style="color:var(--text-secondary);">Tokens semánticos por katachi.</p>
    </lib-panel>
    <lib-panel variant="elevated" heading="Elevated">
      <p style="color:var(--text-secondary);">Sombra / brutal según contexto.</p>
    </lib-panel>
    <lib-panel variant="outline" heading="Outline">
      <p style="color:var(--text-secondary);">Solo borde.</p>
    </lib-panel>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;

/* ── 4. Tests ───────────────────────────────────────────── */

export const TestHeaderFooterToggle: Story = {
  name: 'Test · cabecera y pie aparecen solo con contenido',
  tags: ['test'],
  render: (): TemplateResult => html`
    <lib-panel heading="Con título">
      <p>Cuerpo</p>
      <div slot="footer">Pie</div>
    </lib-panel>
    <lib-panel id="bare">
      <p>Solo cuerpo</p>
    </lib-panel>
  `,
  play: async ({ canvasElement }): Promise<void> => {
    const panels = canvasElement.querySelectorAll('lib-panel');
    const withParts = panels[0];
    const bare = canvasElement.querySelector('#bare');
    if (!withParts || !bare) throw new Error('paneles no renderizados');

    // hasHeaderSlot/hasFooterSlot se fijan en slotchange → esperar asentado.
    await (withParts as unknown as { updateComplete: Promise<boolean> }).updateComplete;
    await (bare as unknown as { updateComplete: Promise<boolean> }).updateComplete;

    const header = withParts.shadowRoot?.querySelector('.panel__header');
    const footer = withParts.shadowRoot?.querySelector('.panel__footer');
    if (!header || header.hasAttribute('hidden')) throw new Error('la cabecera debería mostrarse con heading');
    if (!footer || footer.hasAttribute('hidden')) throw new Error('el pie debería mostrarse con slot footer');

    const bareHeader = bare.shadowRoot?.querySelector('.panel__header');
    const bareFooter = bare.shadowRoot?.querySelector('.panel__footer');
    if (!bareHeader?.hasAttribute('hidden')) throw new Error('sin heading ni slot, la cabecera debe estar oculta');
    if (!bareFooter?.hasAttribute('hidden')) throw new Error('sin slot footer, el pie debe estar oculto');
  },
};
