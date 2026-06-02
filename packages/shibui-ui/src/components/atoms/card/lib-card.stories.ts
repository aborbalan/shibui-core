import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-card.component';
import '../../atoms/button/lib-button.component';
import './card-grid/lib-card-grid.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

type LibCardArgs = {
  variant: 'default' | 'inverse' | 'accent' | 'featured';
  accentColor: string;
  kanji: string;
  decoration: string;
};

const meta: Meta<LibCardArgs> = {
  title: 'Universal/Content/Card',
  tags: ['autodocs'],
  component: 'lib-card',
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'inverse', 'accent', 'featured'],
      description: 'Variante semántica de la card. Los efectos katachi (seam, scanlines, brutal shadow) se activan automáticamente por contexto.',
    },
    accentColor: {
      control: 'color',
      description: 'Color del borde izquierdo (solo variante accent)',
    },
    kanji: {
      control: 'text',
      description: 'Carácter kanji decorativo de fondo',
    },
    decoration: {
      control: 'text',
      description:
        'Decoraciones celadon opt-in, separadas por espacio (craquelure · condensation · depth · mist · reflejo · iridescence). Pensadas para data-katachi="celadon".',
    },
  },
  render: (args): TemplateResult => html`
    <div style="width:320px;padding:var(--lib-space-xl);background:${args.variant === 'inverse' ? 'var(--color-washi-950,#120E0A)' : 'var(--color-washi-100,#F2EDE6)'};">
      <lib-card variant="${args.variant}" accent-color="${args.accentColor}" kanji="${args.kanji}" decoration="${args.decoration}">
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

/* ── 1. Playground ──────────────────────────────────────── */

export const Playground: Story = {
  args: {
    variant:     'default',
    accentColor: '',
    kanji:       '渋',
    decoration:  '',
  },
};

/* ── 2. API stories ──────────────────────────────────────── */

export const Variants: Story = {
  render: (): TemplateResult => html`
    <div style="
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--lib-space-xl);
      padding: var(--lib-space-xl);
      background: var(--color-washi-100, #F2EDE6);
    ">
      <lib-card variant="default" kanji="渋">
        <span slot="tag">Default</span>
        <h2 slot="title">Default</h2>
        <p>Superficie elevada neutra. Adapta fondo, borde y texto al katachi activo en el ancestro.</p>
        <div slot="footer">
          <span>--bg-elevated</span>
          <lib-button variant="ghost" size="sm">Ver más</lib-button>
        </div>
      </lib-card>

      <lib-card variant="inverse" kanji="影">
        <span slot="tag">Inverse</span>
        <h2 slot="title">Inverse</h2>
        <p>Fondo invertido respecto a la base de página. Siempre contrasta con el contexto circundante.</p>
        <div slot="footer">
          <span>--bg-inverse</span>
          <lib-button variant="ghost" size="sm">Ver más</lib-button>
        </div>
      </lib-card>

      <lib-card variant="accent" kanji="和">
        <span slot="tag">Accent</span>
        <h2 slot="title">Accent</h2>
        <p>Borde izquierdo de énfasis. Color configurable vía prop <code>accent-color</code>.</p>
        <div slot="footer">
          <span>border-left</span>
          <lib-button variant="primary" size="sm">Explore</lib-button>
        </div>
      </lib-card>

      <lib-card variant="featured" kanji="★">
        <span slot="tag">✦ Featured</span>
        <h2 slot="title">Featured</h2>
        <p>Superficie destacada con gradiente cálido sutil. Pensada para ocupar 2 columnas en grid.</p>
        <div slot="footer">
          <span>2-col hero</span>
          <lib-button variant="ghost" size="sm">Ver más</lib-button>
        </div>
      </lib-card>
    </div>
  `,
};

export const Featured: Story = {
  name: 'Featured · en lib-component-grid',
  render: (): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);background:var(--color-washi-100,#F2EDE6);">
      <lib-component-grid>
        <lib-card variant="featured" style="grid-column:span 2;" kanji="渋">
          <span slot="tag">✦ Destacado · Sistema</span>
          <h2 slot="title">Katachi sellado<br><em>sin variant props</em></h2>
          <p>
            Coloca <code>data-katachi="kintsugi"</code> en cualquier ancestro y todas las
            cards internas muestran el seam dorado automáticamente — sin ningún
            <code>variant="kintsugi"</code> en el componente.
          </p>
          <div slot="footer"><span>Featured · span 2</span></div>
        </lib-card>

        <lib-card variant="default" kanji="金">
          <span slot="tag">01 · Katachi</span>
          <h2 slot="title">Kintsugi</h2>
          <p>Seam dorado animado activado por contexto. No necesita variant prop.</p>
          <div slot="footer"><span>context-driven</span></div>
        </lib-card>

        <lib-card variant="default" kanji="間">
          <span slot="tag">02 · Katachi</span>
          <h2 slot="title">Sabi</h2>
          <p>Brutal shadow activado por contexto. No necesita variant prop.</p>
          <div slot="footer"><span>context-driven</span></div>
        </lib-card>
      </lib-component-grid>
    </div>
  `,
};

export const CustomAccent: Story = {
  name: 'Custom Accent Color',
  render: (): TemplateResult => html`
    <div style="
      display: grid;
      grid-template-columns: repeat(3, 280px);
      gap: var(--lib-space-xl);
      padding: var(--lib-space-xl);
      background: var(--color-washi-100, #F2EDE6);
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

export const KanjiWatermark: Story = {
  name: 'Kanji watermark',
  render: (): TemplateResult => html`
    <div style="
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1px;
      background: oklch(0% 0 0deg / 0.1);
    ">
      <div style="background:var(--color-washi-100);">
        <lib-card variant="default" kanji="渋">
          <span slot="tag">Light (shizen) · 渋</span>
          <h2 slot="title">Tinta oscura</h2>
          <p>Sin katachi: marca de agua con tinta al 4%. Casi imperceptible sobre fondo claro.</p>
        </lib-card>
      </div>

      <div data-katachi="kintsugi" style="background:var(--bg-base);">
        <lib-card variant="default" kanji="金">
          <span slot="tag">kintsugi · 金</span>
          <h2 slot="title">Tinte dorado</h2>
          <p>En contexto kintsugi el kanji toma un tinte kaki-dorado al 6%.</p>
        </lib-card>
      </div>

      <div data-katachi="terminal" style="background:var(--bg-base);">
        <lib-card variant="default" kanji="⌗">
          <span slot="tag">terminal · ⌗</span>
          <h2 slot="title">Phosphor</h2>
          <p>En contexto terminal el kanji adopta el verde fósforo al 6%.</p>
        </lib-card>
      </div>

      <div data-katachi="wabi" style="background:var(--bg-base);">
        <lib-card variant="default" kanji="侘">
          <span slot="tag">wabi · 侘</span>
          <h2 slot="title">Silencio</h2>
          <p>En contexto wabi el kanji es blanco puro al 4% sobre la oscuridad.</p>
        </lib-card>
      </div>

      <div data-katachi="celadon" style="background:var(--bg-base);">
        <lib-card variant="default" kanji="青">
          <span slot="tag">celadon · 青</span>
          <h2 slot="title">Jade pálido</h2>
          <p>En contexto celadon el kanji usa tinta oscura al 4% sobre fondo jade.</p>
        </lib-card>
      </div>

      <div data-katachi="sabi" style="background:var(--bg-base);">
        <lib-card variant="default" kanji="寂">
          <span slot="tag">sabi · 寂</span>
          <h2 slot="title">Papel envejecido</h2>
          <p>En contexto sabi el kanji usa tinta oscura al 4% sobre fondo washi-100.</p>
        </lib-card>
      </div>
    </div>
  `,
  parameters: {
    layout: 'fullscreen',
  },
};

/* ── Katachi context demos ──────────────────────────────── */
/* Estas stories muestran cómo los efectos se activan automáticamente
   por contexto, sin ningún variant prop en la card. */

export const KintsugiContext: Story = {
  name: 'Kintsugi context — seam automático',
  render: (): TemplateResult => html`
    <div data-katachi="kintsugi" style="padding:var(--lib-space-xl);background:var(--bg-base);">
      <lib-component-grid>
        <lib-card kanji="金">
          <span slot="tag">✦ Kintsugi · Default</span>
          <h2 slot="title">Seam de oro</h2>
          <p>Sin variant prop. El seam dorado animado aparece porque el ancestro tiene <code>data-katachi="kintsugi"</code>.</p>
          <div slot="footer"><span>context-driven</span></div>
        </lib-card>

        <lib-card variant="accent" accent-color="var(--color-kaki-400)" kanji="侘">
          <span slot="tag">01 · Accent</span>
          <h2 slot="title">Accent</h2>
          <p>El borde izquierdo toma el acento dorado del katachi.</p>
          <div slot="footer"><span>Atom</span></div>
        </lib-card>

        <lib-card variant="inverse" kanji="間">
          <span slot="tag">02 · Inverse</span>
          <h2 slot="title">Inverse</h2>
          <p>Fondo invertido: --bg-inverse resuelto por kintsugi → washi-50.</p>
          <div slot="footer"><span>Molecule</span></div>
        </lib-card>
      </lib-component-grid>
    </div>
  `,
  parameters: { layout: 'fullscreen' },
};

export const SabiContext: Story = {
  name: 'Sabi context — brutal shadow automático',
  render: (): TemplateResult => html`
    <div data-katachi="sabi" style="
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--lib-space-xl);
      padding: var(--lib-space-xl);
      background: var(--bg-base);
    ">
      <lib-card kanji="力">
        <span slot="tag">01 · Design system</span>
        <h2 slot="title">Tokens</h2>
        <p>CSS custom properties en capas: primitivos, compuestos y semánticos.</p>
        <div slot="footer">
          <span>Atom</span>
          <lib-button variant="ghost" size="sm">Ver más</lib-button>
        </div>
      </lib-card>

      <lib-card kanji="型">
        <span slot="tag">02 · Componentes</span>
        <h2 slot="title">Web Components</h2>
        <p>Agnósticos de framework. Shadow DOM nativo. Funcionan en React, Svelte, Angular y vanilla.</p>
        <div slot="footer">
          <span>Atom</span>
          <lib-button variant="ghost" size="sm">Ver más</lib-button>
        </div>
      </lib-card>

      <lib-card kanji="影">
        <span slot="tag">03 · Efectos</span>
        <h2 slot="title">Shadow Brutal</h2>
        <p>La sombra brutal llega por contexto: <code>--lib-effect-brutal-shadow</code> activado por sabi.</p>
        <div slot="footer">
          <span>--lib-effect-brutal-shadow</span>
          <lib-button variant="ghost" size="sm">Ver más</lib-button>
        </div>
      </lib-card>
    </div>
  `,
};

export const TerminalContext: Story = {
  name: 'Terminal context — scanlines + drift automático',
  render: (): TemplateResult => html`
    <div data-katachi="terminal" style="
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--lib-space-xl);
      padding: var(--lib-space-xl);
      background: var(--bg-base);
    ">
      <lib-card kanji="⌗">
        <span slot="tag">⌗ Terminal · Default</span>
        <h2 slot="title">Glitch Drift</h2>
        <p>Sin variant prop. La barra phosphor y las scanlines aparecen desde el contexto.</p>
        <div slot="footer"><span>context-driven</span></div>
      </lib-card>

      <lib-card variant="accent" accent-color="var(--katachi-accent)" kanji="⌗">
        <span slot="tag">⌗ Accent</span>
        <h2 slot="title">Accent</h2>
        <p>Borde izquierdo en phosphor green usando el acento del katachi terminal.</p>
        <div slot="footer"><span>accent + drift</span></div>
      </lib-card>

      <lib-card variant="inverse" kanji="⌗">
        <span slot="tag">⌗ Inverse</span>
        <h2 slot="title">Inverse</h2>
        <p>Fondo invertido: --bg-inverse en terminal es el verde phosphor 300.</p>
        <div slot="footer"><span>inverse + drift</span></div>
      </lib-card>
    </div>
  `,
  parameters: { layout: 'fullscreen' },
};

/* ── Celadon · decoraciones opt-in ──────────────────────── */
/* Las decoraciones celadon son capas .fx-* opt-in vía la prop
   `decoration`. Pensadas para data-katachi="celadon" (fondo jade
   pálido). La sombra jade es ambiental (llega por el katachi). */

export const CeladonDecorations: Story = {
  name: 'Celadon · decoraciones',
  render: (): TemplateResult => html`
    <div data-katachi="celadon" style="
      display: grid;
      grid-template-columns: repeat(2, 320px);
      gap: var(--lib-space-xl);
      padding: var(--lib-space-xl);
      background: var(--bg-base);
    ">
      <lib-card variant="default" decoration="craquelure mist depth reflejo" kanji="青">
        <span slot="tag">Surface · completo</span>
        <h2 slot="title">Craquelé + niebla</h2>
        <p>Combinación rica para superficies grandes: craquelé cerámico, bruma jade que deriva, profundidad en la base y reflejo que barre.</p>
        <div slot="footer"><span>craquelure · mist · depth · reflejo</span></div>
      </lib-card>

      <lib-card variant="default" decoration="craquelure" kanji="氷">
        <span slot="tag">Craquelure</span>
        <h2 slot="title">Ice-crackle</h2>
        <p>Red de grietas estática: fisura jade oscura + realce claro. El centro queda despejado para no competir con el contenido.</p>
        <div slot="footer"><span>decoration="craquelure"</span></div>
      </lib-card>

      <lib-card variant="default" decoration="condensation depth" kanji="露">
        <span slot="tag">Condensación</span>
        <h2 slot="title">Micro-gotas frías</h2>
        <p>Gotas dispersas como lentes refractivas sobre el vidriado, ancladas por la masa de agua de la base.</p>
        <div slot="footer"><span>condensation · depth</span></div>
      </lib-card>

      <lib-card variant="default" decoration="mist reflejo" kanji="霧">
        <span slot="tag">Niebla + reflejo</span>
        <h2 slot="title">Bruma viva</h2>
        <p>Bruma jade que oscurece levemente (multiply) y deriva, con la banda de luz del reflejo barriendo la superficie.</p>
        <div slot="footer"><span>mist · reflejo</span></div>
      </lib-card>
    </div>
  `,
  parameters: { layout: 'fullscreen' },
};

/* ── 3. Katachi · 形 ──────────────────────────────────────── */

const _katachi = createKatachiStories<object>(() => html`
  <div style="display:flex;flex-direction:column;gap:var(--lib-space-md);width:320px;">
    <lib-card variant="default" kanji="渋">
      <span slot="tag">default</span>
      <h2 slot="title">Shibui Card</h2>
      <p>Superficie que adapta fondo, borde y texto al contexto estético ambient. Los efectos se activan automáticamente.</p>
      <div slot="footer"><span>Default</span></div>
    </lib-card>
    <lib-card variant="accent" kanji="和">
      <span slot="tag">accent</span>
      <h2 slot="title">Accent</h2>
      <p>Borde izquierdo en el acento del katachi activo.</p>
      <div slot="footer"><span>Accent</span></div>
    </lib-card>
    <lib-card variant="inverse" kanji="影">
      <span slot="tag">inverse</span>
      <h2 slot="title">Inverse</h2>
      <p>Fondo invertido respecto a la base del katachi.</p>
      <div slot="footer"><span>Inverse</span></div>
    </lib-card>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;
