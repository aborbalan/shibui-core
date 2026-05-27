import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import '../../components/atoms/canvas/lib-canvas.component';
import '../../components/atoms/card/lib-card.component';
import '../../components/atoms/button/lib-button.component';
import '../../components/atoms/badge/lib-badge.component';
import '../../components/atoms/divider/lib-divider.component';
import '../../components/molecules/chip/lib-chip.component';
import '../../components/molecules/tabs/lib-tabs.component';
import '../../components/atoms/reading-progress/lib-reading-progress.component';
import type { KatachiId } from '../../../models/ui/common';

type KatachiSystemArgs = Record<string, never>;

const KATACHI: Array<{
  id: KatachiId;
  kanji: string;
  label: string;
  family: 'dark' | 'light';
  surface: string;
  effect: string;
  tagline: string;
}> = [
  { id: 'wabi',     kanji: '侘び',   label: 'Wabi',     family: 'dark',  surface: 'dark',     effect: 'glass atmosférico',     tagline: 'Austeridad brumosa. Dark con glassmorphism reforzado.' },
  { id: 'kintsugi', kanji: '金継ぎ', label: 'Kintsugi', family: 'dark',  surface: 'kintsugi', effect: 'spotlight + borde dorado', tagline: 'Belleza en la rotura. Oro sobre oscuridad.' },
  { id: 'sabi',     kanji: '寂び',   label: 'Sabi',     family: 'light', surface: 'washi',    effect: 'shadow brutal',           tagline: 'Papel cálido y tinta seca. Light con shadow-brutal.' },
  { id: 'terminal', kanji: '_',      label: 'Terminal', family: 'dark',  surface: 'glitch',   effect: 'shadow brutal (CRT)',     tagline: 'Pantalla CRT. Digital sin ornamento.' },
  { id: 'shizen',   kanji: '自然',   label: 'Shizen',   family: 'light', surface: 'light',    effect: 'ninguno (base)',          tagline: 'Lo natural sin adorno. El contexto por defecto.' },
  { id: 'celadon',  kanji: '青磁',   label: 'Celadon',  family: 'dark',  surface: 'celadon',  effect: 'spotlight water',         tagline: 'Cerámica jade. Frío sereno y spotlight acuático.' },
];

const sampleContent = (k: (typeof KATACHI)[number]): TemplateResult => html`
  <lib-card style="display:block; padding:24px; min-height:140px;">
    <div style="display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:16px;">
      <div>
        <p style="font-family:monospace; font-size:9px; letter-spacing:0.3em; text-transform:uppercase; margin:0 0 4px; opacity:0.55;">
          ${k.family} · ${k.surface}
        </p>
        <h3 style="font-family:'Cormorant Garamond',serif; font-weight:300; font-size:22px; margin:0;">
          ${k.label}
        </h3>
      </div>
      <span style="font-family:'Shippori Mincho',serif; font-size:36px; line-height:1; opacity:0.35;">${k.kanji}</span>
    </div>
    <p style="font-family:'Shippori Mincho',serif; font-size:13px; line-height:1.65; margin:0 0 16px; opacity:0.8;">
      ${k.tagline}
    </p>
    <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
      <lib-button size="sm">Acción</lib-button>
      <lib-badge>${k.effect}</lib-badge>
    </div>
  </lib-card>
`;

const meta: Meta<KatachiSystemArgs> = {
  title: 'Universal/Foundations/Katachi · System',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<KatachiSystemArgs>;

/* ── Overview: los 6 katachi ────────────────────────────────── */
export const Overview: Story = {
  name: 'Overview · 6 contextos',
  render: (): TemplateResult => html`
    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; padding:16px; background:#0c0c0c; min-height:100dvh; box-sizing:border-box;">
      ${KATACHI.map((k) => html`
        <lib-canvas katachi=${k.id} display="block" pad="lg">
          ${sampleContent(k)}
        </lib-canvas>
      `)}
    </div>
  `,
  parameters: { layout: 'fullscreen' },
};

/* ── Wabi ───────────────────────────────────────────────────── */
export const Wabi: Story = {
  name: 'Wabi · 侘び',
  render: (): TemplateResult => html`
    <lib-canvas katachi="wabi" display="block" pad="2xl" min-h="screen">
      ${sampleContent(KATACHI[0]!)}
    </lib-canvas>
  `,
  parameters: { layout: 'fullscreen' },
};

/* ── Kintsugi ───────────────────────────────────────────────── */
export const Kintsugi: Story = {
  name: 'Kintsugi · 金継ぎ',
  render: (): TemplateResult => html`
    <lib-canvas katachi="kintsugi" display="block" pad="2xl" min-h="screen">
      ${sampleContent(KATACHI[1]!)}
    </lib-canvas>
  `,
  parameters: { layout: 'fullscreen' },
};

/* ── Sabi ───────────────────────────────────────────────────── */
export const Sabi: Story = {
  name: 'Sabi · 寂び',
  render: (): TemplateResult => html`
    <lib-canvas katachi="sabi" display="block" pad="2xl" min-h="screen">
      ${sampleContent(KATACHI[2]!)}
    </lib-canvas>
  `,
  parameters: { layout: 'fullscreen' },
};

/* ── Terminal ───────────────────────────────────────────────── */
export const Terminal: Story = {
  name: 'Terminal · _',
  render: (): TemplateResult => html`
    <lib-canvas katachi="terminal" display="block" pad="2xl" min-h="screen">
      ${sampleContent(KATACHI[3]!)}
    </lib-canvas>
  `,
  parameters: { layout: 'fullscreen' },
};

/* ── Shizen ─────────────────────────────────────────────────── */
export const Shizen: Story = {
  name: 'Shizen · 自然',
  render: (): TemplateResult => html`
    <lib-canvas katachi="shizen" display="block" pad="2xl" min-h="screen">
      ${sampleContent(KATACHI[4]!)}
    </lib-canvas>
  `,
  parameters: { layout: 'fullscreen' },
};

/* ── Celadon ────────────────────────────────────────────────── */
export const Celadon: Story = {
  name: 'Celadon · 青磁',
  render: (): TemplateResult => html`
    <lib-canvas katachi="celadon" display="block" pad="2xl" min-h="screen">
      <div style="display:flex;flex-direction:column;gap:32px;max-width:640px;margin:0 auto;">

        <!-- Tarjeta semántica — adapta vía katachi -->
        ${sampleContent(KATACHI[5]!)}

        <!-- Componentes nativos celadon (Tier A) -->
        <div style="display:flex;flex-direction:column;gap:12px;">
          <p style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.22em;text-transform:uppercase;opacity:.45;margin:0;">
            componentes · tier A — celadon nativo
          </p>
          <div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px;">
            <lib-chip color="celadon">青磁</lib-chip>
            <lib-chip color="celadon">Sistema activo</lib-chip>
            <lib-chip color="celadon">Latencia 42ms</lib-chip>
            <lib-badge variant="celadon">celadon-400</lib-badge>
          </div>
        </div>

        <!-- Tabs con color celadon -->
        <div style="display:flex;flex-direction:column;gap:12px;">
          <p style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.22em;text-transform:uppercase;opacity:.45;margin:0;">
            lib-tabs · color="celadon" + dark
          </p>
          <lib-tabs
            color="celadon"
            ?dark=${true}
            active="overview"
            .items="${[
              { id: 'overview',   label: 'Overview'    },
              { id: 'components', label: 'Componentes' },
              { id: 'tokens',     label: 'Tokens'      },
            ]}"
          >
            <div slot="overview"   style="padding:12px 0;font-size:13px;opacity:.65;">Vista general del sistema celadon.</div>
            <div slot="components" style="padding:12px 0;font-size:13px;opacity:.65;">77 componentes — 13 Tier A nativos jade.</div>
            <div slot="tokens"     style="padding:12px 0;font-size:13px;opacity:.65;">celadon-400 · oklch(15% 0.02 180deg)</div>
          </lib-tabs>
        </div>

        <!-- Reading progress celadon -->
        <div style="display:flex;flex-direction:column;gap:12px;">
          <p style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.22em;text-transform:uppercase;opacity:.45;margin:0;">
            lib-reading-progress · tone="celadon"
          </p>
          <lib-reading-progress tone="celadon" variant="bar" style="position:static;width:100%;"></lib-reading-progress>
        </div>

        <lib-divider></lib-divider>

        <!-- Botones bajo katachi celadon -->
        <div style="display:flex;flex-direction:column;gap:12px;">
          <p style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.22em;text-transform:uppercase;opacity:.45;margin:0;">
            lib-button · semantic override via katachi
          </p>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            <lib-button>Primary</lib-button>
            <lib-button variant="secondary">Secondary</lib-button>
            <lib-button variant="ghost">Ghost</lib-button>
            <lib-button variant="accent">Accent</lib-button>
          </div>
        </div>

      </div>
    </lib-canvas>
  `,
  parameters: { layout: 'fullscreen' },
};
