import { html, TemplateResult } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import "./lib-background.component";
import type { LibBackgroundVariant } from "./lib-background.types";

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
  title: "Components/Atoms/Background",
  tags:['autodocs'],
  component: "lib-background",
  parameters: {
    docs: {
      description: {
        component: `
**lib-background** — 52 fondos decorativos derivados de los tokens Shibui.

Úsalo como contenedor de sección, hero, card o panel. El contenido se proyecta en el \`slot\` por defecto.

**Categorías:**
- **Light (15)** — papeles y textiles japoneses: seigaiha, tatami, kagome, shoji, shibori…
- **Dark (15)** — tinta sumi: kintsugi, ash-grid, forge, obsidian, void…
- **Gradient (8)** — mesh radial: aurora-light, sakura, twilight, jade-deep…
- **Animated CSS (8)** — sin JS: breathing, pulse, fog, static…
- **Canvas (6)** — generativo: particles, fireflies, ink-wash, constellation…

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
  name: "Playground.",
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
  name: "Light — Washi (15)",
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
    ]),
};

/* ── Dark ── */
export const Dark: Story = {
  name: "Dark — Sumi (15)",
  render: (): TemplateResult =>
    bgGrid([
      { variant: "sumi", label: "16 · 墨 sumi", dark: true },
      { variant: "sumi-grain", label: "17 · sumi grain", dark: true },
      { variant: "kintsugi", label: "18 · 金継 kintsugi", dark: true },
      { variant: "ash-grid", label: "19 · 灰 ash grid", dark: true },
      { variant: "ink-dot", label: "20 · 点 ink dot", dark: true },
      { variant: "mokume", label: "21 · 木目 mokume", dark: true },
      { variant: "kumo", label: "22 · 雲 kumo", dark: true },
      { variant: "temari", label: "23 · 手鞠 temari", dark: true },
      { variant: "dusk", label: "24 · 宵 dusk", dark: true },
      { variant: "embers", label: "25 · 炎 embers", dark: true },
      { variant: "obsidian", label: "26 · 黒曜石 obsidian", dark: true },
      { variant: "forge", label: "27 · 鍛冶 forge", dark: true },
      { variant: "void", label: "28 · 虚空 void", dark: true },
      { variant: "yami", label: "29 · 闇 yami", dark: true },
      { variant: "midnight", label: "30 · 深夜 midnight", dark: true },
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

/* ── Animated ── */
export const Animated: Story = {
  name: "Animated — CSS puro (8)",
  render: (): TemplateResult => html`
    <div
      style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;padding:24px;background:#F2EDE6;"
    >
      ${(
        [
          { variant: "breathing", label: "39 · breathing · 6s", dark: false },
          {
            variant: "aurora-drift",
            label: "40 · aurora drift · 12s",
            dark: true,
          },
          { variant: "scan", label: "41 · scan · 5s", dark: true },
          { variant: "ink-drop", label: "42 · ink drop · 4s", dark: false },
          { variant: "shimmer", label: "43 · shimmer · 4s", dark: false },
          { variant: "pulse", label: "44 · pulse · 4s", dark: true },
          { variant: "fog", label: "45 · fog · 10s", dark: true },
          { variant: "static", label: "46 · static · CRT", dark: true },
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
            >蛍 · 52 · backgrounds</span
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
