import { html, TemplateResult } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import "./lib-background.component";
import type { LibBackgroundVariant } from "./lib-background.types";
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

/* ── Helpers de presentación ── */
const DEMO_LIGHT = html`
  <div
    style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:8px;"
  >
    <span
      style="font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:300;letter-spacing:-0.02em;color:#221C16;"
      >渋い</span
    >
    <span
      style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#B8A99A;"
      >shibui</span
    >
  </div>
`;

const DEMO_DARK = html`
  <div
    style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:8px;"
  >
    <span
      style="font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:300;letter-spacing:-0.02em;color:rgba(250,247,244,0.65);"
      >渋い</span
    >
    <span
      style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(250,247,244,0.2);"
      >shibui</span
    >
  </div>
`;

function bgGrid(
  items: Array<{
    variant: LibBackgroundVariant;
    label: string;
    dark?: boolean;
  }>,
  cols = 3,
): TemplateResult {
  return html`
    <div
      style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:12px;padding:24px;background:#F2EDE6;"
    >
      ${items.map(
        ({ variant, label, dark }) => html`
          <div style="display:flex;flex-direction:column;gap:4px;">
            <lib-background
              variant="${variant}"
              style="height:180px;border-radius:2px;display:block;"
            >
              ${dark ? DEMO_DARK : DEMO_LIGHT}
            </lib-background>
            <span
              style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#9A8878;"
              >${label}</span
            >
          </div>
        `,
      )}
    </div>
  `;
}

/* ── Meta ── */
const meta: Meta = {
  title: "Universal/Utilities/Background",
  tags:['autodocs'],
  component: "lib-background",
  parameters: {
    docs: {
      description: {
        component: `
**lib-background** — 55 fondos decorativos derivados de los tokens Shibui.

Úsalo como contenedor de sección, hero, card o panel. El contenido se proyecta en el \`slot\` por defecto.

**Categorías:**
- **Light (16)** — papeles y textiles japoneses: seigaiha, tatami, kagome, shoji, celadon-wash…
- **Dark (16)** — tinta sumi: kintsugi, ash-grid, forge, obsidian, celadon…
- **Gradient (8)** — mesh radial: aurora-light, sakura, twilight, jade-deep…
- **Animated CSS (9)** — sin JS: breathing, pulse, fog, static, glitch…
- **Canvas (6)** — generativo: particles, fireflies, ink-wash, constellation…
- **Celadon (4)** — familia jade completa: celadon-wash, celadon-mist, celadon, jade-deep…

\`\`\`html
<lib-background variant="fireflies" style="height: 400px;">
  <h1>Tu contenido aquí</h1>
</lib-background>
\`\`\`
        `,
      },
    },
    backgrounds: { default: "surface" },
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        /* Light */
        "washi",
        "washi-grain",
        "washi-weave",
        "seigaiha",
        "tatami",
        "asanoha",
        "sashiko",
        "komon",
        "kasuri",
        "nishiki",
        "kagome",
        "shoji",
        "shibori",
        "ori",
        "chirimen",
        "celadon-wash",
        /* Dark */
        "sumi",
        "sumi-grain",
        "kintsugi",
        "ash-grid",
        "ink-dot",
        "mokume",
        "kumo",
        "temari",
        "dusk",
        "embers",
        "obsidian",
        "forge",
        "void",
        "yami",
        "midnight",
        "celadon",
        /* Gradient */
        "aurora-light",
        "kaki-glow",
        "celadon-mist",
        "noctiluca",
        "horizon",
        "sakura",
        "twilight",
        "jade-deep",
        /* Animated */
        "breathing",
        "aurora-drift",
        "scan",
        "ink-drop",
        "shimmer",
        "pulse",
        "fog",
        "static",
        "glitch",
        /* Canvas */
        "particles",
        "rain",
        "wave-mesh",
        "constellation",
        "fireflies",
        "ink-wash",
      ] satisfies LibBackgroundVariant[],
    },
    paused: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj;

/* ── Playground ── */
export const Playground: Story = {
  args: { variant: "ink-wash", paused: false },
  render: (args): TemplateResult => html`
    <lib-background
      variant="${args.variant as LibBackgroundVariant}"
      ?paused="${args.paused}"
      style="height:420px;display:block;"
    >
      <div
        style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:12px;"
      >
        <span
          style="font-family:'Cormorant Garamond',serif;font-size:3rem;font-weight:300;letter-spacing:-0.02em;"
          >渋い</span
        >
        <span
          style="font-family:'DM Mono',monospace;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;opacity:0.4;"
          >lib-background · ${args.variant}</span
        >
      </div>
    </lib-background>
  `,
};

/* ── Light ── */
export const Light: Story = {
  name: "Light — Washi (16)",
  render: (): TemplateResult =>
    bgGrid([
      { variant: "washi", label: "01 · washi" },
      { variant: "washi-grain", label: "02 · washi grain" },
      { variant: "washi-weave", label: "03 · washi weave" },
      { variant: "seigaiha", label: "04 · 青海波 seigaiha" },
      { variant: "tatami", label: "05 · 畳 tatami" },
      { variant: "asanoha", label: "06 · 麻の葉 asanoha" },
      { variant: "sashiko", label: "07 · 刺子 sashiko" },
      { variant: "komon", label: "08 · 小紋 komon" },
      { variant: "kasuri", label: "09 · 絣 kasuri" },
      { variant: "nishiki", label: "10 · 錦 nishiki" },
      { variant: "kagome", label: "11 · 籠目 kagome" },
      { variant: "shoji", label: "12 · 障子 shoji" },
      { variant: "shibori", label: "13 · 絞り shibori" },
      { variant: "ori", label: "14 · 織 ori" },
      { variant: "chirimen", label: "15 · 縮緬 chirimen" },
      { variant: "celadon-wash", label: "16 · 青磁洗い celadon wash" },
    ]),
};

/* ── Dark ── */
export const Dark: Story = {
  name: "Dark — Sumi (16)",
  render: (): TemplateResult =>
    bgGrid([
      { variant: "sumi", label: "17 · 墨 sumi", dark: true },
      { variant: "sumi-grain", label: "18 · sumi grain", dark: true },
      { variant: "kintsugi", label: "19 · 金継 kintsugi", dark: true },
      { variant: "ash-grid", label: "20 · 灰 ash grid", dark: true },
      { variant: "ink-dot", label: "21 · 点 ink dot", dark: true },
      { variant: "mokume", label: "22 · 木目 mokume", dark: true },
      { variant: "kumo", label: "23 · 雲 kumo", dark: true },
      { variant: "temari", label: "24 · 手鞠 temari", dark: true },
      { variant: "dusk", label: "25 · 宵 dusk", dark: true },
      { variant: "embers", label: "26 · 炎 embers", dark: true },
      { variant: "obsidian", label: "27 · 黒曜石 obsidian", dark: true },
      { variant: "forge", label: "28 · 鍛冶 forge", dark: true },
      { variant: "void", label: "29 · 虚空 void", dark: true },
      { variant: "yami", label: "30 · 闇 yami", dark: true },
      { variant: "midnight", label: "31 · 深夜 midnight", dark: true },
      { variant: "celadon", label: "32 · 青磁 celadon", dark: true },
    ]),
};

/* ── Gradients ── */
export const Gradients: Story = {
  name: "Gradients — Mesh (8)",
  render: (): TemplateResult => html`
    <div
      style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;padding:24px;background:#F2EDE6;"
    >
      ${(
        [
          { variant: "aurora-light", label: "31 · aurora light", dark: false },
          { variant: "kaki-glow", label: "32 · kaki glow", dark: false },
          { variant: "celadon-mist", label: "33 · celadon mist", dark: false },
          { variant: "noctiluca", label: "34 · noctiluca", dark: true },
          { variant: "horizon", label: "35 · 地平 horizon", dark: false },
          { variant: "sakura", label: "36 · 桜 sakura", dark: false },
          { variant: "twilight", label: "37 · 黄昏 twilight", dark: true },
          { variant: "jade-deep", label: "38 · 翡翠 jade deep", dark: true },
        ] as Array<{
          variant: LibBackgroundVariant;
          label: string;
          dark: boolean;
        }>
      ).map(
        ({ variant, label, dark }) => html`
          <div style="display:flex;flex-direction:column;gap:4px;">
            <lib-background
              variant="${variant}"
              style="height:220px;border-radius:2px;display:block;"
            >
              ${dark ? DEMO_DARK : DEMO_LIGHT}
            </lib-background>
            <span
              style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#9A8878;"
              >${label}</span
            >
          </div>
        `,
      )}
    </div>
  `,
};

/* ── Celadon ── */
export const Celadon: Story = {
  name: "Celadon — Familia jade (4)",
  render: (): TemplateResult => html`
    <div
      style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;padding:24px;background:#F2EDE6;"
    >
      ${(
        [
          { variant: "celadon-wash", label: "celadon-wash · light · papel jade", dark: false },
          { variant: "celadon-mist", label: "celadon-mist · gradient · niebla jade", dark: false },
          { variant: "celadon",      label: "celadon · dark · superficie jade", dark: true },
          { variant: "jade-deep",   label: "jade-deep · gradient · profundidad jade", dark: true },
        ] as Array<{ variant: LibBackgroundVariant; label: string; dark: boolean }>
      ).map(
        ({ variant, label, dark }) => html`
          <div style="display:flex;flex-direction:column;gap:4px;">
            <lib-background
              variant="${variant}"
              style="height:240px;border-radius:2px;display:block;"
            >
              ${dark ? DEMO_DARK : DEMO_LIGHT}
            </lib-background>
            <span
              style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#9A8878;"
              >${label}</span
            >
          </div>
        `,
      )}
    </div>
  `,
};

/* ── Animated ── */
export const Animated: Story = {
  name: "Animated — CSS puro (9)",
  render: (): TemplateResult => html`
    <div
      style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;padding:24px;background:#F2EDE6;"
    >
      ${(
        [
          { variant: "breathing", label: "42 · breathing · 6s", dark: false },
          {
            variant: "aurora-drift",
            label: "43 · aurora drift · 12s",
            dark: true,
          },
          { variant: "scan", label: "44 · scan · 5s", dark: true },
          { variant: "ink-drop", label: "45 · ink drop · 4s", dark: false },
          { variant: "shimmer", label: "46 · shimmer · 4s", dark: false },
          { variant: "pulse", label: "47 · pulse · 4s", dark: true },
          { variant: "fog", label: "48 · fog · 10s", dark: true },
          { variant: "static", label: "49 · static · CRT", dark: true },
          { variant: "glitch", label: "50 · glitch · CRT 6s", dark: true },
        ] as Array<{
          variant: LibBackgroundVariant;
          label: string;
          dark: boolean;
        }>
      ).map(
        ({ variant, label, dark }) => html`
          <div style="display:flex;flex-direction:column;gap:4px;">
            <lib-background
              variant="${variant}"
              style="height:220px;border-radius:2px;display:block;"
            >
              ${dark ? DEMO_DARK : DEMO_LIGHT}
            </lib-background>
            <span
              style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#9A8878;"
              >${label}</span
            >
          </div>
        `,
      )}
    </div>
  `,
};

/* ── Canvas ── */
export const Canvas: Story = {
  name: "Canvas — Generativo (6)",
  render: (): TemplateResult => html`
    <div
      style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;padding:24px;background:#F2EDE6;"
    >
      ${(
        [
          { variant: "particles", label: "47 · particle field", dark: true },
          { variant: "rain", label: "48 · rain lines", dark: true },
          { variant: "wave-mesh", label: "49 · wave mesh", dark: false },
          { variant: "constellation", label: "50 · constellation", dark: true },
          { variant: "fireflies", label: "51 · fireflies", dark: true },
          { variant: "ink-wash", label: "52 · ink wash", dark: false },
        ] as Array<{
          variant: LibBackgroundVariant;
          label: string;
          dark: boolean;
        }>
      ).map(
        ({ variant, label, dark }) => html`
          <div style="display:flex;flex-direction:column;gap:4px;">
            <lib-background
              variant="${variant}"
              style="height:260px;border-radius:2px;display:block;"
            >
              ${dark ? DEMO_DARK : DEMO_LIGHT}
            </lib-background>
            <span
              style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#9A8878;"
              >${label}</span
            >
          </div>
        `,
      )}
    </div>
  `,
};

/* ── Katachi coverage ── */
export const KatachiCoverage: Story = {
  name: "Katachi — Guía de contextos",
  render: (): TemplateResult => html`
    <div style="display:flex;flex-direction:column;gap:2px;padding:24px;background:#F2EDE6;">
      <p style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#9A8878;margin:0 0 20px;">
        variante recomendada por contexto katachi
      </p>
      ${(
        [
          { katachi: "wabi · 侘び",     variants: ["washi", "washi-grain", "tatami"],                          dark: false },
          { katachi: "kintsugi · 金継ぎ", variants: ["kintsugi"],                                               dark: true  },
          { katachi: "sabi · 寂び",     variants: ["sumi", "ash-grid", "ink-dot"],                             dark: true  },
          { katachi: "terminal",        variants: ["glitch", "scan", "static"],                                dark: true  },
          { katachi: "shizen · 自然",   variants: ["particles", "rain", "constellation", "fireflies"],         dark: true  },
          { katachi: "celadon · 青磁",  variants: ["celadon-wash", "celadon-mist", "celadon", "jade-deep"],   dark: false },
        ] as Array<{ katachi: string; variants: LibBackgroundVariant[]; dark: boolean }>
      ).map(
        ({ katachi, variants, dark }) => html`
          <div style="margin-bottom:20px;">
            <p style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#7A6A5C;margin:0 0 6px;">
              ${katachi}
            </p>
            <div style="display:grid;grid-template-columns:repeat(${variants.length},1fr);gap:8px;">
              ${variants.map(
                (variant) => html`
                  <div style="display:flex;flex-direction:column;gap:4px;">
                    <lib-background
                      variant="${variant}"
                      style="height:120px;border-radius:2px;display:block;"
                    >
                      ${dark ? DEMO_DARK : DEMO_LIGHT}
                    </lib-background>
                    <span style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:#9A8878;">
                      ${variant}
                    </span>
                  </div>
                `,
              )}
            </div>
          </div>
        `,
      )}
    </div>
  `,
};

/* ── Hero real ── */
export const HeroExample: Story = {
  name: "Uso real — Hero",
  render: (): TemplateResult => html`
    <div style="display:flex;flex-direction:column;gap:2px;">
      <lib-background variant="ink-wash" style="height:360px;display:block;">
        <div
          style="display:flex;flex-direction:column;justify-content:center;height:100%;padding:64px;"
        >
          <span
            style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:#B8A99A;margin-bottom:16px;"
            >渋い · Design System</span
          >
          <h2
            style="font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,5vw,4rem);font-weight:300;letter-spacing:-0.02em;line-height:1.15;color:#221C16;margin:0 0 16px;"
          >
            Materia que<br /><em style="font-style:italic;color:#B85A1E;"
              >respira</em
            >
          </h2>
          <p
            style="font-family:'Shippori Mincho',serif;font-size:0.9375rem;color:#7A6A5C;max-width:380px;line-height:1.8;margin:0;"
          >
            Sistema de diseño construido sobre papel washi, tinta sumi y la
            filosofía de la imperfección.
          </p>
        </div>
      </lib-background>

      <lib-background variant="fireflies" style="height:360px;display:block;">
        <div
          style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100%;text-align:center;gap:16px;"
        >
          <span
            style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(250,247,244,0.2);"
            >蛍 · 55 · backgrounds</span
          >
          <h2
            style="font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,5vw,3.5rem);font-weight:300;letter-spacing:-0.02em;color:rgba(250,247,244,0.55);margin:0;"
          >
            Sistema de <em style="font-style:italic;color:#D97234;">fondos</em>
          </h2>
        </div>
      </lib-background>

      <lib-background variant="forge" style="height:280px;display:block;">
        <div
          style="display:flex;flex-direction:column;justify-content:flex-end;height:100%;padding:40px 64px;"
        >
          <span
            style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(250,247,244,0.18);margin-bottom:12px;"
            >鍛冶 · forge</span
          >
          <h3
            style="font-family:'Cormorant Garamond',serif;font-size:2.5rem;font-weight:300;letter-spacing:-0.02em;color:rgba(250,247,244,0.5);margin:0;"
          >
            El calor
            <em style="font-style:italic;color:#D97234;">como forma</em>
          </h3>
        </div>
      </lib-background>
    </div>
  `,
};

/* ── Paused a11y ── */
export const Paused: Story = {
  name: "Paused — reduce motion",
  render: (): TemplateResult => html`
    <div
      style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:24px;background:#F2EDE6;"
    >
      <div style="display:flex;flex-direction:column;gap:4px;">
        <lib-background variant="pulse" style="height:200px;display:block;"
          >${DEMO_DARK}</lib-background
        >
        <span
          style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#9A8878;"
          >animado</span
        >
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;">
        <lib-background
          variant="pulse"
          paused
          style="height:200px;display:block;"
          >${DEMO_DARK}</lib-background
        >
        <span
          style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#9A8878;"
          >paused</span
        >
      </div>
    </div>
  `,
};


/* ═══════════════════════════════════════════════════════════════
   KATACHI · 形 · Las 6 historias estándar
   lib-background renderiza patrones decorativos propios;
   el contenido del slot sí hereda los tokens semánticos
   del katachi activo (text-primary, text-muted, bg-base…).
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<object>(() => html`
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--lib-space-sm);width:100%;max-width:480px;">
    <lib-background variant="washi" style="height:100px;display:block;border-radius:2px;overflow:hidden;">
      <div style="display:flex;align-items:center;justify-content:center;height:100%;"><span style="font-family:var(--lib-font-mono);font-size:9px;color:var(--color-washi-600,#7A6A5C);letter-spacing:.1em;">washi</span></div>
    </lib-background>
    <lib-background variant="ink-wash" style="height:100px;display:block;border-radius:2px;overflow:hidden;">
      <div style="display:flex;align-items:center;justify-content:center;height:100%;"><span style="font-family:var(--lib-font-mono);font-size:9px;color:rgba(250,247,244,.4);letter-spacing:.1em;">ink-wash</span></div>
    </lib-background>
    <lib-background variant="fireflies" style="height:100px;display:block;border-radius:2px;overflow:hidden;">
      <div style="display:flex;align-items:center;justify-content:center;height:100%;"><span style="font-family:var(--lib-font-mono);font-size:9px;color:rgba(250,247,244,.4);letter-spacing:.1em;">fireflies</span></div>
    </lib-background>
    <lib-background variant="kintsugi" style="height:100px;display:block;border-radius:2px;overflow:hidden;">
      <div style="display:flex;align-items:center;justify-content:center;height:100%;"><span style="font-family:var(--lib-font-mono);font-size:9px;color:rgba(250,247,244,.4);letter-spacing:.1em;">kintsugi</span></div>
    </lib-background>
    <lib-background variant="celadon-wash" style="height:100px;display:block;border-radius:2px;overflow:hidden;">
      <div style="display:flex;align-items:center;justify-content:center;height:100%;"><span style="font-family:var(--lib-font-mono);font-size:9px;color:var(--color-washi-600,#7A6A5C);letter-spacing:.1em;">celadon-wash</span></div>
    </lib-background>
    <lib-background variant="aurora-light" style="height:100px;display:block;border-radius:2px;overflow:hidden;">
      <div style="display:flex;align-items:center;justify-content:center;height:100%;"><span style="font-family:var(--lib-font-mono);font-size:9px;color:var(--color-washi-600,#7A6A5C);letter-spacing:.1em;">aurora-light</span></div>
    </lib-background>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;
