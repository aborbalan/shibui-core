import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-quote.component';
import type { LibQuote } from './lib-quote.component';

const stageDark  = (c: ReturnType<typeof html>):TemplateResult => html`<div style="padding:3rem 2.5rem;background:var(--color-washi-950,#120E0A);">${c}</div>`;
const stageLight = (c: ReturnType<typeof html>):TemplateResult => html`<div style="padding:3rem 2.5rem;background:#fff;">${c}</div>`;
const stageWashi = (c: ReturnType<typeof html>):TemplateResult => html`<div style="padding:3rem 2.5rem;background:var(--color-washi-100,#F2EDE6);">${c}</div>`;

const meta: Meta<LibQuote> = {
  title: 'Data Display/Quote',
  component: 'lib-quote',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: `
**\`<lib-quote>\`** — Cita display editorial en Cormorant Garamond.

Blockquote con primera línea normal, segunda línea en itálica kaki
y atribución en DM Mono. Patrón recurrente en hero sections, CTAs
y secciones de filosofía.

### Atributos

| Atributo | Tipo | Default | Descripción |
|---|---|---|---|
| \`text\`    | \`string\` | \`''\` | Primera línea (o usa el slot) |
| \`accent\`  | \`string\` | \`''\` | Segunda línea itálica kaki |
| \`cite\`    | \`string\` | \`''\` | Atribución |
| \`surface\` | \`'dark'\\|'light'\\|'washi'\` | \`'dark'\` | Superficie |
| \`size\`    | \`'sm'\\|'md'\\|'lg'\` | \`'md'\` | Tamaño fluido |
        `,
      },
    },
  },
  argTypes: {
    surface: { control: 'select', options: ['dark', 'light', 'washi'] },
    size:    { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<LibQuote>;

/* ── Playground ── */
export const Playground: Story = {
  name: '⚙ Playground',
  args: {
    text:    'Lo bello no se anuncia.',
    accent:  'Se descubre con pausa.',
    cite:    '— Principio Shibui · 渋い',
    surface: 'dark',
    size:    'md',
  },
  render: (args) => html`
    <div style="padding:3rem 2.5rem;background:${args.surface === 'dark' ? 'var(--color-washi-950,#120E0A)' : args.surface === 'washi' ? 'var(--color-washi-100,#F2EDE6)' : '#fff'}">
      <lib-quote
        text=${args.text}
        accent=${args.accent}
        cite=${args.cite}
        surface=${args.surface}
        size=${args.size}
      ></lib-quote>
    </div>
  `,
};

/* ── Superficies ── */
export const Surfaces: Story = {
  name: '01 · Superficies',
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:1px;background:var(--color-washi-200,#E5DDD3);">
      ${stageDark(html`
        <lib-quote
          text="Lo bello no se anuncia."
          accent="Se descubre con pausa."
          cite="— Principio Shibui · 渋い"
          surface="dark"
        ></lib-quote>
      `)}
      ${stageLight(html`
        <lib-quote
          text="Lo bello no se anuncia."
          accent="Se descubre con pausa."
          cite="— Principio Shibui · 渋い"
          surface="light"
        ></lib-quote>
      `)}
      ${stageWashi(html`
        <lib-quote
          text="Lo bello no se anuncia."
          accent="Se descubre con pausa."
          cite="— Principio Shibui · 渋い"
          surface="washi"
        ></lib-quote>
      `)}
    </div>
  `,
};

/* ── Tamaños ── */
export const Sizes: Story = {
  name: '02 · Tamaños',
  render: () => stageDark(html`
    <div style="display:flex;flex-direction:column;gap:3rem;">
      <lib-quote size="sm" text="Lo bello no se anuncia." accent="Se descubre con pausa." surface="dark"></lib-quote>
      <lib-quote size="md" text="Lo bello no se anuncia." accent="Se descubre con pausa." surface="dark"></lib-quote>
      <lib-quote size="lg" text="Lo bello no se anuncia." accent="Se descubre con pausa." surface="dark"></lib-quote>
    </div>
  `),
};

/* ── Sin acento ── */
export const QuoteOnly: Story = {
  name: '03 · Solo cita',
  render: () => stageDark(html`
    <lib-quote
      text="La imperfección como virtud."
      cite="— Wabi-sabi"
      surface="dark"
      size="lg"
    ></lib-quote>
  `),
};

/* ── En contexto: philosophy section ── */
export const InContext: Story = {
  name: '04 · En contexto · Philosophy section',
  render: () => html`
    <div style="
      background: var(--color-washi-950,#120E0A);
      padding: clamp(4rem,10vh,7rem) clamp(1.5rem,5vw,5rem);
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: clamp(3rem,6vw,5rem);
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    ">
      <!-- Columna izquierda: quote -->
      <div>
        <lib-eyebrow color="dark" size="sm" style="margin-bottom:1.5rem;display:inline-flex;">Filosofía</lib-eyebrow>
        <lib-quote
          text="Lo bello no se anuncia."
          accent="Se descubre con pausa."
          cite="— Principio Shibui · 渋い"
          surface="dark"
          size="md"
        ></lib-quote>
      </div>

      <!-- Columna derecha: pilares -->
      <div style="display:flex;flex-direction:column;gap:2rem;">
        <lib-philosophy-pillar
          kanji="侘"
          label="Wabi · Imperfección"
          description="La belleza en lo incompleto e impermanente. Los componentes embracen el estado de transición como parte de la experiencia."
        ></lib-philosophy-pillar>
        <lib-philosophy-pillar
          kanji="金"
          label="Kintsugi · Cicatrices de oro"
          description="Reparar con oro en lugar de ocultar. La variante kintsugi convierte los bordes en el elemento más llamativo del componente."
        ></lib-philosophy-pillar>
        <lib-philosophy-pillar
          kanji="間"
          label="Ma · El espacio"
          description="El silencio entre notas. El espacio vacío no es ausencia — es presencia."
        ></lib-philosophy-pillar>
      </div>
    </div>
  `,
  parameters: { layout: 'fullscreen' },
};