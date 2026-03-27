import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-display-heading.component';
import '../eyebrow/lib-eyebrow.component';
import type { LibDisplayHeading } from './lib-display-heading.component';

/* ── Stage wrappers ── */
const stageLight = (content: ReturnType<typeof html>):TemplateResult => html`
  <div style="padding:3rem 2.5rem;background:#fff;border:1px solid var(--color-washi-200,#E5DDD3);">
    ${content}
  </div>
`;

const stageDark = (content: ReturnType<typeof html>):TemplateResult => html`
  <div style="padding:3rem 2.5rem;background:var(--color-washi-950,#120E0A);">
    ${content}
  </div>
`;

const stageWashi = (content: ReturnType<typeof html>):TemplateResult => html`
  <div style="padding:3rem 2.5rem;background:var(--color-washi-100,#F2EDE6);">
    ${content}
  </div>
`;

/* ── Meta ── */
const meta: Meta<LibDisplayHeading> = {
  title: 'Data Display/DisplayHeading',
  component: 'lib-display-heading',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**\`<lib-display-heading>\`** — Titular de display editorial.

Heading en Cormorant Garamond peso 300 con acento itálico en kaki.
Patrón recurrente del sistema: línea normal + acento itálico \`--color-kaki-400\`.
Acepta un \`<lib-eyebrow>\` por slot.

### Atributos

| Atributo | Tipo | Default | Descripción |
|---|---|---|---|
| \`line1\` | \`string\` | \`''\` | Primera línea del titular |
| \`line2-prefix\` | \`string\` | \`''\` | Texto antes del acento |
| \`accent\` | \`string\` | \`''\` | Texto en itálica kaki |
| \`description\` | \`string\` | \`''\` | Párrafo de descripción |
| \`surface\` | \`'light'\\|'dark'\\|'washi'\` | \`'light'\` | Superficie de fondo |
| \`size\` | \`'sm'\\|'md'\\|'lg'\` | \`'md'\` | Tamaño fluido |
| \`tag\` | \`'h1'\\|'h2'\\|'h3'\\|'h4'\` | \`'h2'\` | Tag semántico |
| \`centered\` | \`boolean\` | \`false\` | Centra el bloque |
| \`_animate\` | \`boolean\` | \`false\` | Animación de entrada |

### Slots
- \`eyebrow\` — Coloca un \`<lib-eyebrow>\` como prefijo.
- \`description\` — Rich content como descripción.
        `,
      },
    },
  },
  argTypes: {
    surface:  { control: 'select', options: ['light', 'dark', 'washi'] },
    size:     { control: 'select', options: ['sm', 'md', 'lg'] },
    tag:      { control: 'select', options: ['h1', 'h2', 'h3', 'h4'] },
    centered: { control: 'boolean' },
    _animate:  { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<LibDisplayHeading>;

/* ══════════════════════════════════════════
   Playground
   ══════════════════════════════════════════ */
export const Playground: Story = {
  name: '⚙ Playground',
  args: {
    line1:       'Todo lo que',
    line2Prefix: 'necesitas,',
    accent:      'nada más',
    description: 'Cada componente existe porque tiene un propósito claro. Sin ornamento superfluo, sin dependencias. Cuatro variantes estéticas: light, dark, kintsugi y glitch.',
    surface:  'dark',
    size:     'md',
    tag:      'h2',
    centered: false,
    _animate:  false,
  },
  render: (args) => html`
    <div style="padding:3rem 2.5rem;background:${args.surface === 'dark' ? 'var(--color-washi-950,#120E0A)' : args.surface === 'washi' ? 'var(--color-washi-100,#F2EDE6)' : '#fff'}">
      <lib-display-heading
        line1=${args.line1}
        line2-prefix=${args.line2Prefix}
        accent=${args.accent}
        description=${args.description}
        surface=${args.surface}
        size=${args.size}
        tag=${args.tag}
        ?centered=${args.centered}
        ?_animate=${args._animate}
      ></lib-display-heading>
    </div>
  `,
};

/* ══════════════════════════════════════════
   01 · Réplica de la imagen de referencia
   ══════════════════════════════════════════ */
export const Reference: Story = {
  name: '01 · Referencia · dark + eyebrow',
  render: () => stageDark(html`
    <lib-display-heading
      line1="Todo lo que"
      line2-prefix="necesitas,"
      accent="nada más"
      description="Cada componente existe porque tiene un propósito claro. Sin ornamento superfluo, sin dependencias. Cuatro variantes estéticas: light, dark, kintsugi y glitch."
      surface="dark"
      size="md"
    >
      <lib-eyebrow
        slot="eyebrow"
        color="dark"
        size="sm"
        style="margin-bottom:var(--lib-space-md,1rem)"
      >66 · Componentes</lib-eyebrow>
    </lib-display-heading>
  `),
  parameters: { backgrounds: { default: 'dark' } },
};

/* ══════════════════════════════════════════
   02 · Superficies
   ══════════════════════════════════════════ */
export const Surfaces: Story = {
  name: '02 · Superficies',
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:1px;background:var(--color-washi-200,#E5DDD3);">

      ${stageLight(html`
        <lib-display-heading
          line1="Arquitectura"
          line2-prefix="que"
          accent="perdura"
          description="Componentes agnósticos construidos sobre estándares web."
          surface="light"
        >
          <lib-eyebrow slot="eyebrow" size="sm" style="margin-bottom:1rem">Light surface</lib-eyebrow>
        </lib-display-heading>
      `)}

      ${stageDark(html`
        <lib-display-heading
          line1="Todo lo que"
          line2-prefix="necesitas,"
          accent="nada más"
          description="Cada componente existe porque tiene un propósito claro."
          surface="dark"
        >
          <lib-eyebrow slot="eyebrow" color="dark" size="sm" style="margin-bottom:1rem">Dark surface</lib-eyebrow>
        </lib-display-heading>
      `)}

      ${stageWashi(html`
        <lib-display-heading
          line1="Belleza en"
          accent="la austeridad"
          description="El sistema abraza las restricciones como características, no como limitaciones."
          surface="washi"
        >
          <lib-eyebrow slot="eyebrow" color="washi" size="sm" style="margin-bottom:1rem">Washi surface</lib-eyebrow>
        </lib-display-heading>
      `)}

    </div>
  `,
  parameters: { layout: 'fullscreen' },
};

/* ══════════════════════════════════════════
   03 · Tamaños
   ══════════════════════════════════════════ */
export const Sizes: Story = {
  name: '03 · Tamaños',
  render: () => stageLight(html`
    <div style="display:flex;flex-direction:column;gap:3rem;">

      <div>
        <lib-eyebrow size="sm" style="margin-bottom:.75rem">sm · clamp(1.5rem, 3.5vw, 2.2rem)</lib-eyebrow>
        <lib-display-heading size="sm" line1="Componente" accent="mínimo" surface="light"></lib-display-heading>
      </div>

      <div>
        <lib-eyebrow size="sm" style="margin-bottom:.75rem">md · clamp(2.2rem, 5vw, 3.5rem)</lib-eyebrow>
        <lib-display-heading size="md" line1="Diseño" accent="editorial" surface="light"></lib-display-heading>
      </div>

      <div>
        <lib-eyebrow size="sm" style="margin-bottom:.75rem">lg · clamp(2.75rem, 6vw, 5rem)</lib-eyebrow>
        <lib-display-heading size="lg" line1="La belleza de" accent="lo austero" surface="light"></lib-display-heading>
      </div>

    </div>
  `),
  parameters: { backgrounds: { default: 'paper' } },
};

/* ══════════════════════════════════════════
   04 · Solo acento (sin line2-prefix)
   ══════════════════════════════════════════ */
export const AccentOnly: Story = {
  name: '04 · Solo acento',
  render: () => html`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--color-washi-200,#E5DDD3);">
      ${stageLight(html`
        <lib-display-heading
          line1="Belleza en"
          accent="la austeridad"
          surface="light"
        ></lib-display-heading>
      `)}
      ${stageDark(html`
        <lib-display-heading
          line1="La belleza"
          accent="de lo austero"
          surface="dark"
          size="lg"
        >
          <lib-eyebrow slot="eyebrow" effect="kintsugi" size="lg" style="margin-bottom:1.25rem">Design System · v0.1.0</lib-eyebrow>
        </lib-display-heading>
      `)}
    </div>
  `,
};

/* ══════════════════════════════════════════
   05 · Centered
   ══════════════════════════════════════════ */
export const Centered: Story = {
  name: '05 · Centered',
  render: () => stageLight(html`
    <lib-display-heading
      line1="Componentes que"
      line2-prefix="respiran"
      accent="belleza funcional"
      description="Shibui UI es una librería de Web Components agnósticos inspirada en la estética japonesa."
      surface="light"
      size="lg"
      centered
    >
      <lib-eyebrow slot="eyebrow" line="both" style="margin-bottom:1.25rem">Design System · Zaragoza</lib-eyebrow>
    </lib-display-heading>
  `),
  parameters: { backgrounds: { default: 'paper' } },
};

/* ══════════════════════════════════════════
   06 · Con descripción por slot
   ══════════════════════════════════════════ */
export const DescriptionSlot: Story = {
  name: '06 · Descripción por slot',
  render: () => stageDark(html`
    <lib-display-heading
      line1="Todo lo que"
      line2-prefix="necesitas,"
      accent="nada más"
      surface="dark"
    >
      <lib-eyebrow slot="eyebrow" color="dark" size="sm" style="margin-bottom:1rem">Slot · rich content</lib-eyebrow>
      <p slot="description">
        Cada componente existe porque tiene un propósito claro.
        Sin ornamento superfluo, sin dependencias.
        <em style="font-style:italic;color:var(--color-kaki-400,#D97234);">Cuatro variantes estéticas.</em>
      </p>
    </lib-display-heading>
  `),
  parameters: { backgrounds: { default: 'dark' } },
};

/* ══════════════════════════════════════════
   07 · Kintsugi hero
   ══════════════════════════════════════════ */
export const KintsugiHero: Story = {
  name: '07 · Kintsugi hero',
  render: () => html`
    <div style="padding:4rem 2.5rem;background:var(--color-washi-950,#120E0A);position:relative;overflow:hidden;">
      <div style="position:absolute;right:2rem;top:50%;transform:translateY(-50%);font-family:'Cormorant Garamond',serif;font-size:12rem;font-weight:300;color:rgba(255,255,255,.02);user-select:none;pointer-events:none;">渋</div>
      <div style="position:relative;z-index:2;">
        <lib-display-heading
          line1="La belleza"
          line2-prefix="de lo"
          accent="austero"
          description="66 componentes sin dependencias. CSS puro y vanilla JS bajo principios estéticos japoneses."
          surface="dark"
          size="lg"
          _animate
        >
          <lib-eyebrow slot="eyebrow" effect="kintsugi" size="lg" style="margin-bottom:1.25rem">
            Design System · v0.1.0 · Zaragoza
          </lib-eyebrow>
        </lib-display-heading>
      </div>
    </div>
  `,
  parameters: { backgrounds: { default: 'dark' } },
};

/* ══════════════════════════════════════════
   08 · Tags semánticos
   ══════════════════════════════════════════ */
export const SemanticTags: Story = {
  name: '08 · Tags semánticos',
  render: () => stageLight(html`
    <div style="display:flex;flex-direction:column;gap:2rem;">

      <div>
        <lib-eyebrow size="sm" style="margin-bottom:.5rem">tag="h1"</lib-eyebrow>
        <lib-display-heading tag="h1" size="lg" line1="Heading" accent="uno" surface="light"></lib-display-heading>
      </div>

      <div>
        <lib-eyebrow size="sm" style="margin-bottom:.5rem">tag="h2" (default)</lib-eyebrow>
        <lib-display-heading tag="h2" size="md" line1="Heading" accent="dos" surface="light"></lib-display-heading>
      </div>

      <div>
        <lib-eyebrow size="sm" style="margin-bottom:.5rem">tag="h3"</lib-eyebrow>
        <lib-display-heading tag="h3" size="sm" line1="Heading" accent="tres" surface="light"></lib-display-heading>
      </div>

    </div>
  `),
  parameters: { backgrounds: { default: 'paper' } },
};