import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html, TemplateResult } from "lit";
import "./lib-eyebrow.component";
import type { LibEyebrow } from "./lib-eyebrow.component";
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

const block = (
  eyebrow: ReturnType<typeof html>,
  title: string,
  subtitle = "",
): TemplateResult => html`
  <div>
    ${eyebrow}
    <div
      style="font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:300;letter-spacing:-.02em;color:var(--color-washi-800,#3D332A);margin-top:.75rem;"
    >
      ${title}
    </div>
    ${subtitle
      ? html`<p
          style="font-size:.8125rem;color:var(--color-washi-500,#9A8878);line-height:1.8;margin-top:.75rem;max-width:480px;"
        >
          ${subtitle}
        </p>`
      : html``}
  </div>
`;

const blockDark = (
  eyebrow: ReturnType<typeof html>,
  title: string,
): TemplateResult => html`
  <div>
    ${eyebrow}
    <div
      style="font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:300;letter-spacing:-.02em;color:rgba(250,247,244,.6);margin-top:.75rem;"
    >
      ${title}
    </div>
  </div>
`;

/* Wrappers de stage */
const stageLight = (content: ReturnType<typeof html>): TemplateResult => html`
  <div
    style="padding:2.5rem 2rem;background:#fff;border:1px solid var(--color-washi-200,#E5DDD3);display:flex;flex-direction:column;gap:2rem;"
  >
    ${content}
  </div>
`;

const stageDark = (content: ReturnType<typeof html>): TemplateResult => html`
  <div
    style="padding:2.5rem 2rem;background:var(--color-washi-950,#120E0A);border:1px solid rgba(255,255,255,.06);display:flex;flex-direction:column;gap:2rem;"
  >
    ${content}
  </div>
`;

const stageWashi = (content: ReturnType<typeof html>): TemplateResult => html`
  <div
    style="padding:2.5rem 2rem;background:var(--color-washi-100,#F2EDE6);border:1px solid var(--color-washi-200,#E5DDD3);display:flex;flex-direction:column;gap:2rem;"
  >
    ${content}
  </div>
`;

/* ── Meta ── */
const meta: Meta<LibEyebrow> = {
  title: "Universal/Foundations/Typography/Eyebrow",
  component: "lib-eyebrow",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
**\`<lib-eyebrow>\`** — Etiqueta introductoria previa a un titular.

\`DM Mono\` en \`.65rem\` con \`letter-spacing:.24em\`. Línea decorativa con gradiente kaki→transparente.
Unifica los patrones \`.sg-section-label\`, \`.hero-eyebrow\` y \`.section-label\` en un único componente.

### Atributos

| Atributo | Tipo | Default | Descripción |
|---|---|---|---|
| \`tone\` | \`'default'\\|'accent'\\|'muted'\` | \`'accent'\` | Rol semántico del color |
| \`surface\` | \`'default'\\|'inverse'\\|'on-dark'\` | \`'default'\` | Contexto de superficie (fondos oscuros) |
| \`line\` | \`'left'\\|'right'\\|'both'\\|'none'\` | \`'left'\` | Posición de la línea decorativa |
| \`size\` | \`'sm'\\|'md'\\|'lg'\` | \`'md'\` | Tamaño tipográfico |
| \`dot\` | \`boolean\` | \`false\` | Sustituye la línea por un punto |
| \`num\` | \`string\` | \`''\` | Badge numérico sufijo |

### Uso en contexto
\`\`\`html
<!-- Separación recomendada: margin-bottom: 0.75rem sobre el titular -->
<lib-eyebrow style="margin-bottom:.75rem">Design System · v0.1.0</lib-eyebrow>
<h2>El componente más pequeño</h2>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["default", "accent", "muted"],
      description: "Rol semántico del color — el katachi activo determina el acento exacto",
    },
    line: { control: "select", options: ["left", "right", "both", "none"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    dot: { control: "boolean" },
    num: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<LibEyebrow>;

/* ══════════════════════════════════════════
   Playground (controls)
   ══════════════════════════════════════════ */
export const Playground: Story = {
  name: "⚙ Playground",
  args: {
    tone: "accent",
    line: "left",
    size: "md",
    dot: false,
    num: "",
  },
  render: (args) => html`
    <div
      style="padding:3rem;display:flex;flex-direction:column;gap:1rem;background:#fff;"
    >
      <lib-eyebrow
        tone=${args.tone}
        line=${args.line}
        size=${args.size}
        ?dot=${args.dot}
        num=${args.num}
        >Design System · v0.1.0 · Zaragoza</lib-eyebrow
      >
      <div
        style="font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:300;letter-spacing:-.02em;color:var(--color-washi-800,#3D332A);"
      >
        El componente
        <em style="font-style:italic;color:var(--color-kaki-500,#B85A1E);"
          >más pequeño</em
        >
      </div>
    </div>
  `,
  parameters: { backgrounds: { default: "paper" } },
};

/* ══════════════════════════════════════════
   01 · Base
   ══════════════════════════════════════════ */
export const Base: Story = {
  name: "01 · Base · kaki + línea izq",
  render: () =>
    stageLight(html`
      ${block(
        html`<lib-eyebrow style="margin-bottom:.75rem"
          >67 · Eyebrow</lib-eyebrow
        >`,
        "El componente más pequeño",
        "Un elemento que lleva en cada style guide desde el componente 1, sin nombre propio. El eyebrow introduce, contextualiza y da ritmo visual antes del título.",
      )}
      ${block(
        html`<lib-eyebrow style="margin-bottom:.75rem"
          >Design System · Style Guide</lib-eyebrow
        >`,
        "Shibui 渋い",
        "Sistema de diseño japonés. Belleza en la austeridad.",
      )}
      ${block(
        html`<lib-eyebrow style="margin-bottom:.75rem"
          >Componentes · v0.1.0</lib-eyebrow
        >`,
        "66 piezas, cero dependencias",
      )}
    `),
  parameters: { backgrounds: { default: "paper" } },
};

/* ══════════════════════════════════════════
   02 · Líneas
   ══════════════════════════════════════════ */
export const Lines: Story = {
  name: "02 · Líneas",
  render: () =>
    stageLight(html`
      ${block(
        html`<lib-eyebrow line="left" style="margin-bottom:.75rem"
          >Línea izquierda · left</lib-eyebrow
        >`,
        "Arquitectura hexagonal",
      )}
      ${block(
        html`<lib-eyebrow line="right" style="margin-bottom:.75rem"
          >Línea derecha · right</lib-eyebrow
        >`,
        "Monorepo escalable",
      )}
      ${block(
        html`<lib-eyebrow line="both" style="margin-bottom:.75rem"
          >Línea en ambos · both</lib-eyebrow
        >`,
        "Composición simétrica",
      )}
      ${block(
        html`<lib-eyebrow line="none" style="margin-bottom:.75rem"
          >Sin línea · none</lib-eyebrow
        >`,
        "Minimalismo total",
      )}
    `),
  parameters: { backgrounds: { default: "paper" } },
};

/* ══════════════════════════════════════════
   03 · Tonos semánticos
   ══════════════════════════════════════════ */
export const Tones: Story = {
  name: "03 · Tonos semánticos",
  render: () =>
    stageWashi(html`
      ${block(
        html`<lib-eyebrow tone="accent" style="margin-bottom:.75rem"
          >Accent · acento del katachi activo</lib-eyebrow
        >`,
        "Arquitectura",
      )}
      ${block(
        html`<lib-eyebrow tone="default" style="margin-bottom:.75rem"
          >Neutral · cálido-washi</lib-eyebrow
        >`,
        "Componentes",
      )}
      ${block(
        html`<lib-eyebrow surface="inverse" style="margin-bottom:.75rem"
          >Inverse · para superficies oscuras</lib-eyebrow
        >`,
        "Contraste",
      )}
      ${block(
        html`<lib-eyebrow tone="muted" style="margin-bottom:.75rem"
          >Muted · ultra atenuado</lib-eyebrow
        >`,
        "Metadatos",
      )}
    `),
  parameters: { backgrounds: { default: "paper" } },
};

/* ══════════════════════════════════════════
   04 · Tonos sobre superficies oscuras
   ══════════════════════════════════════════ */
export const TonesDark: Story = {
  name: "04 · Tonos · sobre oscuro",
  render: () =>
    stageDark(html`
      ${blockDark(
        html`<lib-eyebrow style="margin-bottom:.75rem"
          >Accent · adapta al contexto</lib-eyebrow
        >`,
        "Componentes activos",
      )}
      ${blockDark(
        html`<lib-eyebrow surface="inverse" style="margin-bottom:.75rem"
          >Inverse · contraste claro</lib-eyebrow
        >`,
        "Runtime activo",
      )}
      ${blockDark(
        html`<lib-eyebrow tone="muted" style="margin-bottom:.75rem"
          >Muted · ultra tenue</lib-eyebrow
        >`,
        "Metadatos secundarios",
      )}
      ${blockDark(
        html`<lib-eyebrow tone="default" style="margin-bottom:.75rem"
          >Neutral · washi cálido</lib-eyebrow
        >`,
        "Sistema operativo",
      )}
    `),
  parameters: { backgrounds: { default: "dark" } },
};

/* ══════════════════════════════════════════
   05 · Tamaños
   ══════════════════════════════════════════ */
export const Sizes: Story = {
  name: "05 · Tamaños",
  render: () =>
    stageLight(html`
      ${block(
        html`<lib-eyebrow size="sm" style="margin-bottom:.5rem"
          >Small · 0.58rem</lib-eyebrow
        >`,
        "Tarjeta de componente",
      )}
      ${block(
        html`<lib-eyebrow size="md" style="margin-bottom:.75rem"
          >Base · 0.65rem</lib-eyebrow
        >`,
        "Sección de contenido",
      )}
      ${block(
        html`<lib-eyebrow size="lg" style="margin-bottom:.75rem"
          >Large · 0.75rem</lib-eyebrow
        >`,
        "Hero de landing",
      )}
    `),
  parameters: { backgrounds: { default: "paper" } },
};

/* ══════════════════════════════════════════
   06 · Dot
   ══════════════════════════════════════════ */
export const Dot: Story = {
  name: "06 · Dot prefix",
  render: () => html`
    <div
      style="display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--color-washi-200,#E5DDD3);"
    >
      ${stageLight(html`
        ${block(
          html`<lib-eyebrow dot style="margin-bottom:.5rem"
            >Sistema online</lib-eyebrow
          >`,
          "Monitor",
        )}
        ${block(
          html`<lib-eyebrow
            dot
            size="sm"
            style="margin-bottom:.5rem"
            >Latencia 42ms</lib-eyebrow
          >`,
          "Rendimiento",
        )}
        ${block(
          html`<lib-eyebrow dot tone="default" style="margin-bottom:.5rem"
            >Neutral dot</lib-eyebrow
          >`,
          "Metadatos",
        )}
      `)}
      ${stageDark(html`
        ${blockDark(
          html`<lib-eyebrow
            dot
            size="sm"
            style="margin-bottom:.5rem"
            >Sistema online</lib-eyebrow
          >`,
          "Monitor activo",
        )}
        ${blockDark(
          html`<lib-eyebrow dot surface="inverse" style="margin-bottom:.5rem"
            >Módulo cargado</lib-eyebrow
          >`,
          "Runtime",
        )}
      `)}
    </div>
  `,
};

/* ══════════════════════════════════════════
   07 · Numbered badge
   ══════════════════════════════════════════ */
export const Numbered: Story = {
  name: "07 · Numbered badge",
  render: () =>
    stageDark(html`
      ${blockDark(
        html`<lib-eyebrow num="41" size="sm" style="margin-bottom:.5rem"
          >Motion</lib-eyebrow
        >`,
        "Liquid Button",
      )}
      ${blockDark(
        html`<lib-eyebrow
          num="59"
          size="sm"
          style="margin-bottom:.5rem"
          >Overlay</lib-eyebrow
        >`,
        "Drawer",
      )}
      ${blockDark(
        html`<lib-eyebrow
          num="67"
          size="sm"
          style="margin-bottom:.5rem"
          >Featured</lib-eyebrow
        >`,
        "Tour",
      )}
    `),
  parameters: { backgrounds: { default: "dark" } },
};

/* ══════════════════════════════════════════
   08 · Kintsugi context
   ══════════════════════════════════════════ */
export const KintsugiContext: Story = {
  name: "08 · Kintsugi context ✦",
  render: () => html`
    <div data-katachi="kintsugi" style="background:var(--bg-base);">
      <div
        style="display:grid;grid-template-columns:1fr 1fr;gap:1px;background:oklch(45% 0.05 45deg / 0.15);"
      >
        <div style="padding:2.5rem 2rem;display:flex;flex-direction:column;gap:2rem;">
          ${block(
            html`<lib-eyebrow style="margin-bottom:.75rem"
              >✦ Design System · v0.1.0</lib-eyebrow
            >`,
            "La belleza de lo austero",
          )}
          ${block(
            html`<lib-eyebrow line="both" style="margin-bottom:.75rem"
              >✦ Featured</lib-eyebrow
            >`,
            "Tour",
          )}
        </div>
        <div style="padding:2.5rem 2rem;display:flex;flex-direction:column;gap:2rem;">
          ${blockDark(
            html`<lib-eyebrow size="lg" style="margin-bottom:.75rem"
              >Design System · v0.1.0 · Zaragoza</lib-eyebrow
            >`,
            "La belleza de lo austero",
          )}
          ${blockDark(
            html`<lib-eyebrow line="both" style="margin-bottom:.75rem"
              >© 2026 · Shibui · MIT</lib-eyebrow
            >`,
            "渋い",
          )}
        </div>
      </div>
    </div>
  `,
};

/* ══════════════════════════════════════════
   09 · Terminal context (glitch drift)
   ══════════════════════════════════════════ */
export const TerminalContext: Story = {
  name: "09 · Terminal context ⌗",
  render: () => html`
    <div data-katachi="terminal" style="background:var(--bg-base);">
      <div
        style="display:grid;grid-template-columns:1fr 1fr;gap:1px;background:oklch(68% 0.14 155deg / 0.1);"
      >
        <div style="padding:2.5rem 2rem;display:flex;flex-direction:column;gap:2rem;">
          ${blockDark(
            html`<lib-eyebrow style="margin-bottom:.75rem"
              >⌗ runtime · session</lib-eyebrow
            >`,
            "Sistema operativo",
          )}
          ${blockDark(
            html`<lib-eyebrow line="none" style="margin-bottom:.75rem"
              >⌗ error.log</lib-eyebrow
            >`,
            "PID 4821 · offline",
          )}
        </div>
        <div style="padding:2.5rem 2rem;display:flex;flex-direction:column;gap:2rem;">
          ${blockDark(
            html`<lib-eyebrow style="margin-bottom:.75rem"
              >⌗ SHIBUI.SYS · v0.1</lib-eyebrow
            >`,
            "RUNTIME ACTIVE_",
          )}
          ${blockDark(
            html`<lib-eyebrow size="sm" style="margin-bottom:.5rem"
              >⌗ processes · 4</lib-eyebrow
            >`,
            "node · postgres · redis",
          )}
        </div>
      </div>
    </div>
  `,
  parameters: { backgrounds: { default: "dark" } },
};

/* ══════════════════════════════════════════
   10 · En contexto (uso real)
   ══════════════════════════════════════════ */
export const EnContexto: Story = {
  name: "10 · En contexto · uso real",
  render: () => html`
    <div
      style="display:flex;flex-direction:column;gap:1px;background:var(--color-washi-200,#E5DDD3);"
    >
      <!-- Hero kintsugi -->
      <div
        style="padding:4rem 2.5rem;background:var(--color-washi-950,#120E0A);position:relative;overflow:hidden;"
      >
        <div
          style="position:absolute;right:2rem;top:50%;transform:translateY(-50%);font-family:'Cormorant Garamond',serif;font-size:12rem;font-weight:300;color:rgba(255,255,255,.02);pointer-events:none;user-select:none;"
        >
          渋
        </div>
        <div style="position:relative;z-index:2;">
          <lib-eyebrow size="lg" style="margin-bottom:1.25rem"
            >Design System · v0.1.0 · Zaragoza</lib-eyebrow
          >
          <div
            style="font-family:'Cormorant Garamond',serif;font-size:clamp(2.5rem,6vw,5rem);font-weight:300;letter-spacing:-.03em;line-height:1.05;color:rgba(250,247,244,.65);"
          >
            La belleza<br />de lo
            <em style="font-style:italic;color:var(--color-kaki-400,#D97234);"
              >austero</em
            >
          </div>
          <p
            style="font-size:.8125rem;color:rgba(250,247,244,.28);margin-top:1.5rem;max-width:460px;line-height:1.9;"
          >
            66 componentes sin dependencias. CSS puro y vanilla JS bajo
            principios estéticos japoneses.
          </p>
        </div>
      </div>

      <!-- Sección light -->
      <div style="padding:2.5rem 2rem;background:#fff;">
        <div style="max-width:600px;">
          <lib-eyebrow style="margin-bottom:.75rem"
            >Filosofía · Wabi-sabi</lib-eyebrow
          >
          <div
            style="font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:300;letter-spacing:-.02em;color:var(--color-washi-800,#3D332A);"
          >
            La imperfección
            <em style="font-style:italic;color:var(--color-kaki-500,#B85A1E);"
              >como virtud</em
            >
          </div>
          <p
            style="font-size:.8125rem;color:var(--color-washi-500,#9A8878);line-height:1.8;margin-top:.75rem;max-width:480px;"
          >
            Lo bello no se anuncia. Se descubre con pausa. El sistema abraza las
            restricciones como características, no como limitaciones.
          </p>
        </div>
      </div>

      <!-- Cards dark -->
      <div
        style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,.04);"
      >
        <div
          style="padding:1.5rem;background:var(--color-washi-950,#120E0A);display:flex;flex-direction:column;gap:.75rem;"
        >
          <lib-eyebrow size="sm" style="margin-bottom:.5rem"
            >41 · Motion</lib-eyebrow
          >
          <div
            style="font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:300;color:rgba(250,247,244,.55);"
          >
            Liquid Button
          </div>
          <div
            style="font-size:.6875rem;color:rgba(250,247,244,.2);line-height:1.7;"
          >
            Canvas water-drop con física reactiva al cursor.
          </div>
        </div>
        <div
          style="padding:1.5rem;background:var(--color-washi-950,#120E0A);display:flex;flex-direction:column;gap:.75rem;"
        >
          <lib-eyebrow size="sm" style="margin-bottom:.5rem"
            >59 · Overlay</lib-eyebrow
          >
          <div
            style="font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:300;color:rgba(250,247,244,.55);"
          >
            Drawer
          </div>
          <div
            style="font-size:.6875rem;color:rgba(250,247,244,.2);line-height:1.7;"
          >
            4 posiciones, 5 tamaños, kintsugi y glitch.
          </div>
        </div>
        <div
          style="padding:1.5rem;background:var(--color-washi-950,#120E0A);display:flex;flex-direction:column;gap:.75rem;"
        >
          <lib-eyebrow size="sm" style="margin-bottom:.5rem"
            >✦ Featured</lib-eyebrow
          >
          <div
            style="font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:300;color:var(--color-kaki-400,#D97234);"
          >
            Tour
          </div>
          <div
            style="font-size:.6875rem;color:rgba(250,247,244,.2);line-height:1.7;"
          >
            Spotlight SVG con beacon y modal central.
          </div>
        </div>
      </div>

      <!-- Dashboard header dark -->
      <div
        style="padding:1.25rem 1.5rem;background:var(--color-washi-950,#120E0A);"
      >
        <div style="display:flex;align-items:center;gap:2rem;flex-wrap:wrap;">
          <div>
            <lib-eyebrow
              dot
              size="sm"
              style="margin-bottom:.25rem"
              >Sistema online</lib-eyebrow
            >
            <div
              style="font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:300;color:rgba(250,247,244,.55);"
            >
              Monitor
            </div>
          </div>
          <div style="margin-left:auto;display:flex;gap:1.5rem;">
            <div style="text-align:right;">
              <lib-eyebrow size="sm" line="right" style="margin-bottom:.25rem"
                >Latencia</lib-eyebrow
              >
              <div
                style="font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:300;color:var(--color-celadon-400,#4E9482);"
              >
                42ms
              </div>
            </div>
            <div style="text-align:right;">
              <lib-eyebrow size="sm" line="right" style="margin-bottom:.25rem"
                >Alertas</lib-eyebrow
              >
              <div
                style="font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:300;color:var(--color-kaki-400,#D97234);"
              >
                3
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer editorial centered -->
      <div
        style="padding:3rem 2rem;background:#fff;display:flex;flex-direction:column;align-items:center;gap:1rem;"
      >
        <lib-eyebrow line="both">© 2026 · Shibui · MIT License</lib-eyebrow>
        <div
          style="font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:300;letter-spacing:-.02em;color:var(--color-washi-700,#5C4E42);"
        >
          渋い
        </div>
      </div>
    </div>
  `,
  parameters: { layout: "fullscreen" },
};

/* ═══════════════════════════════════════════════════════════════
   KATACHI · 形 · Las 6 historias estándar
   Sin color= explícito → el ambient del contexto determina el tono
   del eyebrow via --lib-comp-fg-accent.
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<LibEyebrow>(() => html`
  <div style="display:flex;flex-direction:column;gap:var(--lib-space-sm);">
    <lib-eyebrow size="sm">Design System · v0.1.0</lib-eyebrow>
    <div style="
      font-family: var(--lib-font-display, 'Cormorant Garamond', serif);
      font-size: 2rem;
      font-weight: 300;
      letter-spacing: -0.02em;
      color: var(--text-primary);
      margin-top: 0.25rem;
    ">
      La belleza de lo
      <em style="font-style:italic;color:var(--text-accent)">austero</em>
    </div>
    <lib-eyebrow line="none" size="sm" style="margin-top:var(--lib-space-md)">
      Zaragoza · MIT License
    </lib-eyebrow>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;
