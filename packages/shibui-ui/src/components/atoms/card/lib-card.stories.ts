import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-card.component';
import '../../atoms/button/lib-button.component';
import './card-grid/lib-card-grid.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

type LibCardArgs = {
  variant: 'default' | 'inverse' | 'accent' | 'featured' | 'kintsugi' | 'glitch' | 'celadon' | 'washi' | 'brutal';
  accentColor: string;
  kanji: string;
};

const meta: Meta<LibCardArgs> = {
  title: 'Content/Card',
  tags:['autodocs'],
  component: 'lib-card',
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'inverse', 'accent', 'featured', 'kintsugi', 'glitch', 'celadon', 'washi', 'brutal'],
      description: 'Variante visual de la card',
    },
    accentColor: {
      control: 'color',
      description: 'Color del borde accent (solo variante accent)',
    },
    kanji: {
      control: 'text',
      description: 'Carácter kanji decorativo de fondo',
    },
  },
  render: (args): TemplateResult => html`
    <div style="width:320px;padding:var(--lib-space-xl);background:${['kintsugi','inverse','featured','glitch','celadon'].includes(args.variant) ? 'var(--color-washi-950,#120E0A)' : 'var(--color-washi-100,#F2EDE6)'};">
      <lib-card variant="${args.variant}" accent-color="${args.accentColor}" kanji="${args.kanji}">
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
    variant:     'default',
    accentColor: '',
    kanji:       '渋',
  },
};

/* ── Todas las variantes — showcase de la imagen ── */
export const AllVariants: Story = {
  name: 'All Variants.',
  render: (): TemplateResult => html`
    <!-- Variantes light -->
    <div style="
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--lib-space-xl);
      padding: var(--lib-space-xl);
    ">
      <lib-card variant="default" kanji="渋">
        <span slot="tag">Component</span>
        <h2 slot="title">Default Card</h2>
        <p>A simple surface for grouping related content with subtle elevation on hover.</p>
        <div slot="footer">
          <span>v1.0</span>
          <lib-button variant="ghost" size="sm">Learn more</lib-button>
        </div>
      </lib-card>

      <lib-card variant="accent" kanji="和">
        <span slot="tag">Accent variant</span>
        <h2 slot="title">Kaki Accent</h2>
        <p>Left border in persimmon kaki. Used for highlighted or featured items.</p>
        <div slot="footer">
          <span>Featured</span>
          <lib-button variant="primary" size="sm">Explore</lib-button>
        </div>
      </lib-card>

      <lib-card variant="washi" kanji="和">
        <span slot="tag">Washi variant</span>
        <h2 slot="title">Washi</h2>
        <p>Paleta neutral cálida. 11 pasos desde washi-50 hasta washi-950. El alma cromática del sistema.</p>
        <div slot="footer">
          <span>Washi</span>
          <lib-button variant="ghost" size="sm">Ver más</lib-button>
        </div>
      </lib-card>

      <lib-card variant="brutal" kanji="力">
        <span slot="tag">Brutal variant</span>
        <h2 slot="title">Brutal</h2>
        <p>Superficie clara, borde ink sólido y sombra dura de 4px. Hover hunde el elemento en su sombra.</p>
        <div slot="footer">
          <span>Shadow · 4px</span>
          <lib-button variant="ghost" size="sm">Ver más</lib-button>
        </div>
      </lib-card>
    </div>

    <!-- Variantes dark -->
    <div style="padding:var(--lib-space-xl);padding-top:0;background:var(--color-washi-950,#120E0A);">
      <lib-component-grid>

        <lib-card variant="featured" style="grid-column:span 2;" kanji="渋">
          <span slot="tag">✦ Kintsugi · Firma</span>
          <h2 slot="title">La cicatriz<br><em>de oro</em></h2>
          <p>El principio japonés de reparar con oro. En Shibui, la variante kintsugi aplica gradientes dorados animados, anillos cónicos y seams que convierten el borde en el elemento más bello del componente.</p>
          <div slot="footer"><span>Featured · 2 columnas</span></div>
        </lib-card>

        <lib-card variant="inverse" kanji="渋">
          <span slot="tag">Inverse</span>
          <h2 slot="title">Dark</h2>
          <p>Fondo washi-900. La base nocturna del sistema.</p>
          <div slot="footer"><span>Dark</span></div>
        </lib-card>

        <lib-card variant="kintsugi" kanji="金">
          <span slot="tag">✦ Kintsugi</span>
          <h2 slot="title">Kintsugi</h2>
          <p>Seam animada kaki → gold. Gradiente dorado en títulos y barras.</p>
          <div slot="footer"><span>Kintsugi</span></div>
        </lib-card>

        <lib-card variant="glitch" kanji="⌗">
          <span slot="tag">⌗ Glitch</span>
          <h2 slot="title">Glitch</h2>
          <p>Scanlines CRT. RGB shadow split en ráfagas. Micro-drift en X. Terminal aesthetic.</p>
          <div slot="footer"><span>Glitch</span></div>
        </lib-card>

        <lib-card variant="celadon" kanji="青">
          <span slot="tag">Celadón</span>
          <h2 slot="title">Celadón</h2>
          <p>Acento verde-gris japonés. Para estados de éxito, confirmación o elementos secundarios de énfasis.</p>
          <div slot="footer"><span>Celadon</span></div>
        </lib-card>

      </lib-component-grid>
    </div>
  `,
  parameters: {
    backgrounds: { default: 'dark' },
    layout: 'fullscreen',
  },
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
      <lib-card variant="accent" accent-color="var(--color-kaki-400)" kanji="柿">
        <span slot="tag">Kaki</span>
        <h2 slot="title">Persimón</h2>
        <p>El acento por defecto del sistema Shibui.</p>
        <div slot="footer"><span>Highlight</span><lib-button variant="ghost" size="sm">Ver más</lib-button></div>
      </lib-card>

      <lib-card variant="accent" accent-color="var(--color-celadon-400)" kanji="青">
        <span slot="tag">Celadón</span>
        <h2 slot="title">Jade</h2>
        <p>El segundo acento del sistema, más sereno.</p>
        <div slot="footer"><span>Sereno</span><lib-button variant="ghost" size="sm">Ver más</lib-button></div>
      </lib-card>

      <lib-card variant="accent" accent-color="var(--color-washi-500)" kanji="和">
        <span slot="tag">Washi</span>
        <h2 slot="title">Neutro</h2>
        <p>Acento sutil para contenido sin jerarquía especial.</p>
        <div slot="footer"><span>Neutro</span><lib-button variant="ghost" size="sm">Ver más</lib-button></div>
      </lib-card>
    </div>
  `,
};

/* ── Kanji showcase ── */
export const KanjiWatermark: Story = {
  name: 'Kanji watermark',
  render: (): TemplateResult => html`
    <div style="
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1px;
      background: rgba(255,255,255,.04);
      padding: 0;
    ">
      <lib-card variant="inverse" kanji="渋">
        <span slot="tag">Dark · 渋</span>
        <h2 slot="title">Dark</h2>
        <p>Fondo washi-950. La base nocturna del sistema. Texto en rgba-blanco escalado por función.</p>
      </lib-card>

      <lib-card variant="default" kanji="白">
        <span slot="tag">Light · 白</span>
        <h2 slot="title">Light</h2>
        <p>Fondo blanco o washi-50. Bordes en washi-200. Acento kaki para elementos interactivos.</p>
      </lib-card>

      <lib-card variant="kintsugi" kanji="金">
        <span slot="tag">Kintsugi · 金</span>
        <h2 slot="title">Kintsugi</h2>
        <p>Seam animada kaki → gold. Anillo cónico rotante. Gradiente dorado en títulos y barras.</p>
      </lib-card>

      <lib-card variant="glitch" kanji="⌗">
        <span slot="tag">⌗ Glitch</span>
        <h2 slot="title">Glitch</h2>
        <p>Scanlines CRT. RGB shadow split en ráfagas. Micro-drift en X. Terminal aesthetic.</p>
      </lib-card>

      <lib-card variant="celadon" kanji="青">
        <span slot="tag">Celadón · 青</span>
        <h2 slot="title">Celadón</h2>
        <p>Acento verde-gris japonés. Para estados de éxito, confirmación o elementos secundarios de énfasis.</p>
      </lib-card>

      <lib-card variant="washi" kanji="和">
        <span slot="tag">Washi · 和</span>
        <h2 slot="title">Washi</h2>
        <p>Paleta neutral cálida. 11 pasos desde washi-50 hasta washi-950. El alma cromática del sistema.</p>
      </lib-card>
    </div>
  `,
  parameters: {
    layout: 'fullscreen',
  },
};

/* ── Featured en grid ── */
export const Featured: Story = {
  name: 'Featured · en lib-component-grid',
  render: (): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);background:var(--color-washi-950,#120E0A);">
      <lib-component-grid>
        <lib-card variant="featured" style="grid-column:span 2;" kanji="渋">
          <span slot="tag">✦ Kintsugi · Firma</span>
          <h2 slot="title">La cicatriz<br><em>de oro</em></h2>
          <p>El principio japonés de reparar con oro. En Shibui, la variante kintsugi aplica gradientes dorados animados.</p>
          <div slot="footer"><span>Featured · span 2</span></div>
        </lib-card>

        <lib-card variant="kintsugi" kanji="金">
          <span slot="tag">01 · Botones</span>
          <h2 slot="title">Buttons</h2>
          <p>Primary, outline, ghost, liquid, group y speed dial.</p>
          <div slot="footer"><span>Atom</span></div>
        </lib-card>

        <lib-card variant="kintsugi" kanji="間">
          <span slot="tag">28 · Formularios</span>
          <h2 slot="title">Inputs</h2>
          <p>Text inputs, select, checkbox, radio, switch y pin code.</p>
          <div slot="footer"><span>Molecule</span></div>
        </lib-card>
      </lib-component-grid>
    </div>
  `,
  parameters: { backgrounds: { default: 'dark' }, layout: 'fullscreen' },
};

/* ── Brutal ── */
export const Brutal: Story = {
  name: 'Brutal ◼',
  render: (): TemplateResult => html`
    <div style="
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--lib-space-xl);
      padding: var(--lib-space-xl);
      background: var(--color-washi-100, #F2EDE6);
    ">
      <lib-card variant="brutal" kanji="力">
        <span slot="tag">01 · Design system</span>
        <h2 slot="title">Tokens</h2>
        <p>CSS custom properties en capas: primitivos, compuestos y semánticos. Un sistema sin dependencias.</p>
        <div slot="footer">
          <span>Atom</span>
          <lib-button variant="ghost" size="sm">Ver más</lib-button>
        </div>
      </lib-card>

      <lib-card variant="brutal" kanji="型">
        <span slot="tag">02 · Componentes</span>
        <h2 slot="title">Web Components</h2>
        <p>Agnósticos de framework. Shadow DOM nativo. Funcionan en React, Svelte, Angular y vanilla.</p>
        <div slot="footer">
          <span>Atom</span>
          <lib-button variant="ghost" size="sm">Ver más</lib-button>
        </div>
      </lib-card>

      <lib-card variant="brutal" kanji="影">
        <span slot="tag">03 · Efectos</span>
        <h2 slot="title">Shadow Brutal</h2>
        <p>Sombra sólida de 4px. Hover clásico brutalista: el elemento se hunde en su propia sombra.</p>
        <div slot="footer">
          <span>--lib-shadow-brutal</span>
          <lib-button variant="ghost" size="sm">Ver más</lib-button>
        </div>
      </lib-card>
    </div>
  `,
  parameters: {
    backgrounds: { default: 'light' },
    layout: 'fullscreen',
  },
};

/* ── Kintsugi ── */
export const Kintsugi: Story = {
  name: 'Kintsugi ✦',
  render: (): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);background:var(--color-washi-950,#120E0A);">
      <lib-component-grid>
        <lib-card variant="kintsugi" kanji="金">
          <span slot="tag">✦ Diseño · Sistema</span>
          <h2 slot="title">Kintsugi</h2>
          <p>El arte de reparar con oro. La imperfección como virtud.</p>
          <div slot="footer"><span>v0.1.0</span></div>
        </lib-card>

        <lib-card variant="kintsugi" kanji="侘">
          <span slot="tag">01 · Átomos</span>
          <h2 slot="title">Button</h2>
          <p>Elemento interactivo base con variantes primary, ghost y liquid.</p>
          <div slot="footer"><span>Atom</span></div>
        </lib-card>

        <lib-card variant="kintsugi" kanji="間">
          <span slot="tag">✦ Featured</span>
          <h2 slot="title">Tour</h2>
          <p>Spotlight SVG con beacon y modal central animado.</p>
          <div slot="footer"><span>Organism</span></div>
        </lib-card>
      </lib-component-grid>
    </div>
  `,
  parameters: { backgrounds: { default: 'dark' }, layout: 'fullscreen' },
};

/* ═══════════════════════════════════════════════════════════════
   KATACHI · 形 · Las 6 historias estándar
   lib-card default usa --lib-comp-fg-sec y tokens semánticos
   (--bg-elevated, --border-subtle) — adapta al katachi activo.
   Las variantes kintsugi/glitch/celadon son superficies oscuras
   deliberadas, independientes del katachi.
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<object>(() => html`
  <lib-card kanji="渋" style="max-width:280px;">
    <span slot="tag">Katachi · Default</span>
    <h2 slot="title">Shibui Card</h2>
    <p>Superficie que adapta fondo, borde y texto al contexto estético ambient.</p>
    <div slot="footer"><span>Default variant</span></div>
  </lib-card>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;

export const KatachiExplicitOverride: Story = {
  name: 'Katachi · explicit variant wins',
  render: (): TemplateResult => html`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--lib-space-xl);padding:var(--lib-space-xl);background:var(--color-washi-100);">
      <section data-katachi="kintsugi" style="padding:var(--lib-space-lg);display:flex;flex-direction:column;gap:var(--lib-space-md);background:var(--bg-base);">
        <header style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--text-muted);">
          <strong style="font-family:'Shippori Mincho',serif;font-size:1.5rem;color:var(--katachi-accent);">金</strong>
          &nbsp;data-katachi="kintsugi" + default variant
        </header>
        <lib-card kanji="金">
          <span slot="tag">Ambient katachi</span>
          <h2 slot="title">Hereda kintsugi</h2>
          <p>Sin variant explícito — la card adopta la paleta del katachi activo.</p>
          <div slot="footer"><span>variant="default"</span></div>
        </lib-card>
      </section>

      <section data-katachi="kintsugi" style="padding:var(--lib-space-lg);display:flex;flex-direction:column;gap:var(--lib-space-md);background:var(--bg-base);">
        <header style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--text-muted);">
          <strong style="font-family:'Shippori Mincho',serif;font-size:1.5rem;color:var(--katachi-accent);">金</strong>
          &nbsp;data-katachi="kintsugi" + variant="washi"
        </header>
        <lib-card variant="washi" kanji="和">
          <span slot="tag">Explicit override</span>
          <h2 slot="title">Washi gana</h2>
          <p>El <code>variant="washi"</code> explícito tiene mayor especificidad que el contexto ambient.</p>
          <div slot="footer"><span>variant="washi"</span></div>
        </lib-card>
      </section>
    </div>
  `,
  parameters: { layout: 'fullscreen' },
};