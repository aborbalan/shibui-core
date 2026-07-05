import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-avatar-group.component';
import '../../atoms/avatar/lib-avatar.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';
import type { LibAvatarGroupSpacing } from './lib-avatar-group.types';
import type { LibAvatarSize } from '../../../types';

type LibAvatarGroupArgs = {
  size: LibAvatarSize;
  max: number;
  spacing: LibAvatarGroupSpacing;
  total: number;
};

const people = ['Ana Bel', 'Ken Ito', 'Mia Sol', 'Leo Paz', 'Nao Rin', 'Ivo Mar'];

const avatars = (n: number = people.length): TemplateResult => html`
  ${people.slice(0, n).map((name) => html`<lib-avatar name="${name}"></lib-avatar>`)}
`;

const meta: Meta<LibAvatarGroupArgs> = {
  title: 'Universal/Content/Avatar Group',
  tags: ['autodocs'],
  component: 'lib-avatar-group',
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Tamaño aplicado a todos los avatares.',
    },
    max: {
      control: { type: 'number', min: 0 },
      description: 'Máximo de avatares visibles (0 = todos).',
    },
    total: {
      control: { type: 'number', min: 0 },
      description: 'Total real para el "+N" (0 = usar los del slot).',
    },
    spacing: {
      control: 'select',
      options: ['tight', 'normal', 'loose'],
      description: 'Grado de solape.',
    },
  },
  args: {
    size: 'md',
    max: 4,
    spacing: 'normal',
    total: 0,
  },
  render: (args): TemplateResult => html`
    <lib-avatar-group
      size="${args.size}"
      max="${args.max}"
      spacing="${args.spacing}"
      total="${args.total}"
    >
      ${avatars()}
    </lib-avatar-group>
  `,
};

export default meta;
type Story = StoryObj<LibAvatarGroupArgs>;

/* ── 1. Playground ──────────────────────────────────────── */

export const Playground: Story = {};

/* ── 2. API stories ─────────────────────────────────────── */

/** Todas las escalas de tamaño. */
export const Sizes: Story = {
  render: (): TemplateResult => html`
    <div style="display:flex;flex-direction:column;gap:var(--lib-space-lg);align-items:flex-start;">
      ${(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(
        (s) => html`
          <lib-avatar-group size="${s}" max="4">${avatars()}</lib-avatar-group>
        `,
      )}
    </div>
  `,
};

/** `max` limita los visibles y colapsa el resto en "+N". */
export const Overflow: Story = {
  render: (): TemplateResult => html`
    <div style="display:flex;flex-direction:column;gap:var(--lib-space-lg);align-items:flex-start;">
      <lib-avatar-group max="3">${avatars()}</lib-avatar-group>
      <lib-avatar-group max="4">${avatars()}</lib-avatar-group>
      <lib-avatar-group max="3" total="128">${avatars()}</lib-avatar-group>
    </div>
  `,
};

/** Grados de solape. */
export const Spacing: Story = {
  render: (): TemplateResult => html`
    <div style="display:flex;flex-direction:column;gap:var(--lib-space-lg);align-items:flex-start;">
      ${(['tight', 'normal', 'loose'] as const).map(
        (sp) => html`
          <lib-avatar-group spacing="${sp}" max="5">${avatars()}</lib-avatar-group>
        `,
      )}
    </div>
  `,
};

/* ── 3. Katachi · 形 ────────────────────────────────────── */

const _katachi = createKatachiStories<LibAvatarGroupArgs>(() => html`
  <lib-avatar-group size="lg" max="4" total="42">
    ${avatars()}
  </lib-avatar-group>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;

/* ── 4. Tests ───────────────────────────────────────────── */

export const TestOverflowCount: Story = {
  name: 'Test · max colapsa el resto en +N',
  tags: ['test'],
  render: (): TemplateResult => html`
    <lib-avatar-group id="grp" max="3">${avatars(6)}</lib-avatar-group>
  `,
  play: async ({ canvasElement }): Promise<void> => {
    const grp = canvasElement.querySelector('#grp') as (HTMLElement & { overflow: number }) | null;
    if (!grp) throw new Error('lib-avatar-group no se renderizó');

    // _apply() se ejecuta en updated() y reajusta `overflow`, encolando otro
    // ciclo: esperar a que updateComplete resuelva `true` (estado asentado).
    const el = grp as unknown as { updateComplete: Promise<boolean> };
    let settled = false;
    for (let i = 0; i < 5 && !settled; i++) settled = await el.updateComplete;

    if (grp.overflow !== 3) {
      throw new Error(`overflow esperado 3 (6 avatares, max 3), recibido ${grp.overflow}`);
    }
    const bubble = grp.shadowRoot?.querySelector('.ag-more');
    if (!bubble) throw new Error('la burbuja +N debería renderizarse');
    if (bubble.textContent?.trim() !== '+3') {
      throw new Error(`texto de burbuja esperado "+3", recibido "${bubble.textContent?.trim()}"`);
    }

    const hidden = Array.from(grp.querySelectorAll('lib-avatar')).filter(
      (a) => (a as HTMLElement).style.display === 'none',
    );
    if (hidden.length !== 3) {
      throw new Error(`deberían ocultarse 3 avatares, ocultos ${hidden.length}`);
    }
  },
};
