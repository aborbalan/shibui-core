import { Meta, StoryObj }      from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-reading-progress.component';
import type { LibReadingProgress } from './lib-reading-progress.component';

/* ── Meta ──────────────────────────────────────────────── */
const meta: Meta<LibReadingProgress> = {
  title: 'Components/Atoms/ReadingProgress',
  component: 'lib-reading-progress',
  parameters: { layout: 'fullscreen' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['bar', 'line', 'dots', 'ring', 'vertical'],
    },
    tone: {
      control: 'select',
      options: ['kaki', 'celadon', 'ink'],
    },
  },
};
export default meta;
type Story = StoryObj<LibReadingProgress>;

/* ── Artículo simulado — texto reutilizable ─────────────── */
const ARTICLE_BODY = html`
  <h2 style="font-family:var(--lib-font-display);font-size:2.2rem;font-weight:300;letter-spacing:-0.02em;line-height:1.25;margin-bottom:0.5rem;">
    La belleza de lo <em style="font-style:italic;color:var(--color-kaki-500);">incompleto</em>
  </h2>
  <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;margin-bottom:1.5rem;">
    Ensayo · 5 minutos de lectura
  </p>
  ${[
    'El wabi-sabi japonés no busca la perfección — la evita. Hay una forma de conocimiento que solo se adquiere a través de lo roto, lo desgastado, lo que lleva la marca del tiempo. Un cuenco de cerámica con una grieta reparada con oro no esconde su historia: la exhibe.',
    'En diseño de interfaces tendemos a lo contrario: bordes perfectos, transiciones suaves, estados siempre predecibles. Hay algo que ganar al introducir la imperfección calculada — una animación que no termina del todo, un borde que vibra levemente, una tipografía que respira de forma irregular.',
    'Los tokens de Shibui son una forma de codificar esa filosofía. El washi-900 no es negro — es la oscuridad de la tinta vegetal sobre papel de arroz. El kaki-500 no es naranja — es el color de la tela teñida con caqui fermentado, un proceso que dura meses.',
    'Cuando el componente de progreso de lectura llega al 100%, no debería celebrarlo con un confeti. Debería simplemente... completarse. Silenciosamente. La satisfacción de terminar algo no necesita aplausos.',
    'Cada componente del sistema tiene un kanji asociado no por ornamento sino por comprensión. El kanji condensa en un símbolo lo que el nombre en inglés solo puede describir. 液体 no es solo "liquid" — es la naturaleza de algo que toma la forma del contenedor.',
    '「渋い」no es austeridad — es la elegancia que solo aparece cuando has eliminado todo lo que sobra, y lo que queda todavía no es suficiente.',
    'La animación del botón funciona por eso: el agua sube desde abajo porque el gesto del usuario —el hover— es un verter. La superficie del líquido interfiere consigo misma porque eso es lo que hace el agua real. No hay metáfora — hay física.',
  ].map(p => html`<p style="font-size:0.9375rem;line-height:1.85;color:var(--text-secondary);margin-bottom:1.25rem;">${p}</p>`)}
`;

/* ── Nav mock reutilizable ──────────────────────────────── */
function mockNav(inner: TemplateResult): TemplateResult {
  return html`
    <div style="
      background:rgba(250,247,244,0.96);
      backdrop-filter:blur(8px);
      border-bottom:1px solid var(--border-subtle);
      padding:0.75rem 2rem;
      display:flex;
      align-items:center;
      justify-content:space-between;
      position:relative;
      overflow:hidden;
      flex-shrink:0;
      z-index:2;
    ">
      <div style="font-family:var(--lib-font-display);font-size:1.5rem;letter-spacing:0.15em;font-weight:300;">
        shibui
        <span style="font-family:var(--lib-font-mono);font-size:0.6875rem;color:var(--text-muted);letter-spacing:0.25em;display:block;">渋い · artículo</span>
      </div>
      ${inner}
    </div>
  `;
}


/* ══════════════════════════════════════
   VARIANTE BAR — dentro del nav
   ══════════════════════════════════════ */
export const Bar: Story = {
  name: 'Bar — borde inferior del nav',
  render: (): TemplateResult => html`
    <div style="display:flex;flex-direction:column;height:100vh;background:var(--bg-base);">
      ${mockNav(html`
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">
          ← prev · next →
        </span>
        <!-- BAR: posición absoluta, pegada al borde inferior del nav -->
        <lib-reading-progress
          variant="bar"
          tone="kaki"
          target="#article-bar"
        ></lib-reading-progress>
      `)}
      <div
        id="article-bar"
        style="flex:1;overflow-y:scroll;padding:3rem 3.5rem;max-width:680px;margin:0 auto;width:100%;scrollbar-width:none;"
      >
        ${ARTICLE_BODY}
      </div>
    </div>
  `,
};


/* ══════════════════════════════════════
   VARIANTE LINE
   ══════════════════════════════════════ */
export const Line: Story = {
  name: 'Line — 1px, borde inferior sutil',
  render: (): TemplateResult => html`
    <div style="display:flex;flex-direction:column;height:100vh;background:var(--bg-base);">
      ${mockNav(html`
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">
          ← prev · next →
        </span>
        <lib-reading-progress
          variant="line"
          tone="celadon"
          target="#article-line"
        ></lib-reading-progress>
      `)}
      <div
        id="article-line"
        style="flex:1;overflow-y:scroll;padding:3rem 3.5rem;max-width:680px;margin:0 auto;width:100%;scrollbar-width:none;"
      >
        ${ARTICLE_BODY}
      </div>
    </div>
  `,
};


/* ══════════════════════════════════════
   VARIANTE DOTS
   ══════════════════════════════════════ */
export const Dots: Story = {
  name: 'Dots — puntos de capítulo',
  render: (): TemplateResult => html`
    <div style="display:flex;flex-direction:column;height:100vh;background:var(--bg-base);">
      ${mockNav(html`
        <lib-reading-progress
          variant="dots"
          tone="kaki"
          dots-count="7"
          target="#article-dots"
        ></lib-reading-progress>
      `)}
      <div
        id="article-dots"
        style="flex:1;overflow-y:scroll;padding:3rem 3.5rem;max-width:680px;margin:0 auto;width:100%;scrollbar-width:none;"
      >
        ${ARTICLE_BODY}
      </div>
    </div>
  `,
};


/* ══════════════════════════════════════
   VARIANTE RING — junto al brand
   ══════════════════════════════════════ */
export const Ring: Story = {
  name: 'Ring — anillo SVG junto al brand',
  render: (): TemplateResult => html`
    <div style="display:flex;flex-direction:column;height:100vh;background:var(--bg-base);">
      <div style="
        background:rgba(250,247,244,0.96);
        backdrop-filter:blur(8px);
        border-bottom:1px solid var(--border-subtle);
        padding:0.75rem 2rem;
        display:flex;
        align-items:center;
        justify-content:space-between;
        position:relative;
        overflow:hidden;
        flex-shrink:0;
        z-index:2;
      ">
        <!-- Brand + ring juntos -->
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <lib-reading-progress
            variant="ring"
            tone="kaki"
            ring-size="32"
            target="#article-ring"
          ></lib-reading-progress>
          <div style="font-family:var(--lib-font-display);font-size:1.5rem;letter-spacing:0.15em;font-weight:300;">
            shibui
            <span style="font-family:var(--lib-font-mono);font-size:0.6875rem;color:var(--text-muted);letter-spacing:0.25em;display:block;">渋い · artículo</span>
          </div>
        </div>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">← prev · next →</span>
      </div>
      <div
        id="article-ring"
        style="flex:1;overflow-y:scroll;padding:3rem 3.5rem;max-width:680px;margin:0 auto;width:100%;scrollbar-width:none;"
      >
        ${ARTICLE_BODY}
      </div>
    </div>
  `,
};


/* ══════════════════════════════════════
   VARIANTE VERTICAL — margen izquierdo
   ══════════════════════════════════════ */
export const Vertical: Story = {
  name: 'Vertical — margen izquierdo fijo',
  render: (): TemplateResult => html`
    <div style="display:flex;flex-direction:column;height:100vh;background:var(--bg-base);">
      <!-- La barra vertical se posiciona sola con position:fixed -->
      <lib-reading-progress
        variant="vertical"
        tone="kaki"
        target="#article-vertical"
      ></lib-reading-progress>

      ${mockNav(html`
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">
          ← prev · next →
        </span>
      `)}
      <div
        id="article-vertical"
        style="flex:1;overflow-y:scroll;padding:3rem 3.5rem;max-width:680px;margin:0 auto;width:100%;scrollbar-width:none;"
      >
        ${ARTICLE_BODY}
      </div>
    </div>
  `,
};


/* ══════════════════════════════════════
   TONOS — comparativa
   ══════════════════════════════════════ */
export const Tones: Story = {
  name: 'Tonos — kaki · celadon · ink',
  render: (): TemplateResult => html`
    <div style="padding:2rem;display:flex;flex-direction:column;gap:2rem;background:var(--bg-base);">

      ${(['kaki', 'celadon', 'ink'] as const).map(tone => html`
        <div style="display:flex;flex-direction:column;gap:0.5rem;">
          <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">${tone}</span>

          <!-- Bar estática al 65% -->
          <div style="position:relative;overflow:hidden;height:2px;background:var(--bg-surface);width:100%;">
            <lib-reading-progress
              variant="bar"
              tone="${tone}"
              style="width:65%;position:absolute;bottom:0;left:0;"
            ></lib-reading-progress>
          </div>

          <!-- Dots -->
          <div style="display:flex;align-items:center;gap:0.75rem;margin-top:0.5rem;">
            <lib-reading-progress variant="dots" tone="${tone}" dots-count="7" style="--rp-progress:65%"></lib-reading-progress>
            <span style="font-family:var(--lib-font-mono);font-size:10px;color:var(--text-muted);">dots · 65%</span>
          </div>

          <!-- Ring -->
          <div style="display:flex;align-items:center;gap:0.75rem;margin-top:0.25rem;">
            <lib-reading-progress variant="ring" tone="${tone}" ring-size="32" style="--rp-progress:65%"></lib-reading-progress>
            <span style="font-family:var(--lib-font-mono);font-size:10px;color:var(--text-muted);">ring · 65%</span>
          </div>
        </div>
      `)}

    </div>
  `,
};


/* ══════════════════════════════════════
   DEMO COMPLETO — todas las variantes
   ══════════════════════════════════════ */
export const FullDemo: Story = {
  name: 'Demo completo — bar + ring + dots',
  render: (): TemplateResult => html`
    <div style="display:flex;flex-direction:column;height:100vh;background:var(--bg-base);">

      <!-- Nav con BAR + RING + DOTS activos a la vez -->
      <div style="
        background:rgba(250,247,244,0.96);
        backdrop-filter:blur(8px);
        border-bottom:1px solid var(--border-subtle);
        padding:0.625rem 2rem;
        display:flex;
        align-items:center;
        justify-content:space-between;
        position:relative;
        overflow:hidden;
        flex-shrink:0;
        z-index:2;
      ">
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <lib-reading-progress variant="ring" tone="kaki" ring-size="32" target="#article-full"></lib-reading-progress>
          <div style="font-family:var(--lib-font-display);font-size:1.5rem;letter-spacing:0.15em;font-weight:300;">
            shibui
            <span style="font-family:var(--lib-font-mono);font-size:0.6875rem;color:var(--text-muted);letter-spacing:0.25em;display:block;">渋い · artículo de prueba</span>
          </div>
        </div>

        <lib-reading-progress variant="dots" tone="kaki" dots-count="7" target="#article-full"></lib-reading-progress>

        <!-- BAR: pegada al borde inferior -->
        <lib-reading-progress variant="bar" tone="kaki" target="#article-full"></lib-reading-progress>
      </div>

      <!-- Artículo scrollable -->
      <div
        id="article-full"
        style="flex:1;overflow-y:scroll;padding:3rem 3.5rem;max-width:680px;margin:0 auto;width:100%;scrollbar-width:none;"
      >
        ${ARTICLE_BODY}
      </div>
    </div>
  `,
};

/* ══════════════════════════════════════
   KINTSUGI — gold in the cracks
   ══════════════════════════════════════ */
export const Kintsugi: Story = {
  name: 'Kintsugi — oro en las grietas',
  render: (): TemplateResult => html`
    <div style="display:flex;flex-direction:column;height:100vh;background:var(--bg-base);">

      <!-- Nav completo con BAR kintsugi + RING kaki + DOTS kintsugi -->
      <div style="
        background:rgba(250,247,244,0.96);
        backdrop-filter:blur(8px);
        border-bottom:1px solid var(--border-subtle);
        padding:0.625rem 2rem;
        display:flex;
        align-items:center;
        justify-content:space-between;
        position:relative;
        overflow:hidden;
        flex-shrink:0;
        z-index:2;
      ">
        <!-- Brand -->
        <div style="font-family:var(--lib-font-display);font-size:1.5rem;letter-spacing:0.15em;font-weight:300;">
          shibui
          <span style="font-family:var(--lib-font-mono);font-size:0.6875rem;color:var(--text-muted);letter-spacing:0.25em;display:block;">渋い · 金継ぎ · kintsugi</span>
        </div>

        <!-- Dots kintsugi -->
        <lib-reading-progress
          variant="dots"
          tone="kintsugi"
          dots-count="7"
          target="#article-kintsugi"
        ></lib-reading-progress>

        <!-- BAR kintsugi — pegada al borde inferior -->
        <lib-reading-progress
          variant="bar"
          tone="kintsugi"
          target="#article-kintsugi"
        ></lib-reading-progress>
      </div>

      <!-- Barra vertical kintsugi -->
      <lib-reading-progress
        variant="vertical"
        tone="kintsugi"
        target="#article-kintsugi"
      ></lib-reading-progress>

      <!-- Artículo -->
      <div
        id="article-kintsugi"
        style="flex:1;overflow-y:scroll;padding:3rem 3.5rem 3rem 4rem;max-width:680px;margin:0 auto;width:100%;scrollbar-width:none;"
      >
        ${ARTICLE_BODY}
      </div>
    </div>
  `,
};


/* ══════════════════════════════════════
   KINTSUGI DARK — sobre fondo oscuro
   ══════════════════════════════════════ */
export const KintsugiDark: Story = {
  name: 'Kintsugi Dark — sobre fondo oscuro',
  parameters: { backgrounds: { default: 'dark' } },
  render: (): TemplateResult => html`
    <div style="display:flex;flex-direction:column;height:100vh;background:var(--color-washi-950);">

      <!-- Nav oscuro -->
      <div style="
        background:oklch(8% 0.015 45 / 0.97);
        backdrop-filter:blur(8px);
        border-bottom:1px solid oklch(16% 0.015 45);
        padding:0.75rem 2rem;
        display:flex;
        align-items:center;
        justify-content:space-between;
        position:relative;
        overflow:hidden;
        flex-shrink:0;
        z-index:2;
      ">
        <div style="font-family:var(--lib-font-display);font-size:1.5rem;letter-spacing:0.15em;font-weight:300;color:oklch(82% 0.015 55);">
          shibui
          <span style="font-family:var(--lib-font-mono);font-size:0.6875rem;color:oklch(30% 0.02 50);letter-spacing:0.25em;display:block;">渋い · 金継ぎ</span>
        </div>

        <lib-reading-progress
          variant="dots"
          tone="kintsugi"
          dots-count="5"
          target="#article-kintsugi-dark"
        ></lib-reading-progress>

        <lib-reading-progress
          variant="bar"
          tone="kintsugi"
          target="#article-kintsugi-dark"
        ></lib-reading-progress>
      </div>

      <lib-reading-progress
        variant="vertical"
        tone="kintsugi"
        target="#article-kintsugi-dark"
      ></lib-reading-progress>

      <div
        id="article-kintsugi-dark"
        style="flex:1;overflow-y:scroll;padding:3rem 3.5rem 3rem 4rem;max-width:680px;margin:0 auto;width:100%;scrollbar-width:none;"
      >
        <!-- Versión oscura del body -->
        <h2 style="font-family:var(--lib-font-display);font-size:2.2rem;font-weight:300;letter-spacing:-0.02em;line-height:1.25;margin-bottom:0.5rem;color:oklch(82% 0.015 55);">
          La belleza de lo <em style="font-style:italic;color:var(--color-kaki-400);">incompleto</em>
        </h2>
        <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:oklch(28% 0.02 50);text-transform:uppercase;margin-bottom:1.5rem;">
          Ensayo · 5 minutos de lectura
        </p>
        ${[
          'El wabi-sabi japonés no busca la perfección — la evita. Hay una forma de conocimiento que solo se adquiere a través de lo roto, lo desgastado, lo que lleva la marca del tiempo.',
          'En diseño de interfaces tendemos a lo contrario: bordes perfectos, transiciones suaves, estados siempre predecibles. Hay algo que ganar al introducir la imperfección calculada.',
          'Los tokens de Shibui son una forma de codificar esa filosofía. El washi-900 no es negro — es la oscuridad de la tinta vegetal sobre papel de arroz.',
          'Cuando el componente de progreso de lectura llega al 100%, no debería celebrarlo con un confeti. Debería simplemente... completarse. Silenciosamente.',
          '「渋い」no es austeridad — es la elegancia que solo aparece cuando has eliminado todo lo que sobra, y lo que queda todavía no es suficiente.',
        ].map(p => html`
          <p style="font-size:0.9375rem;line-height:1.85;color:oklch(38% 0.02 50);margin-bottom:1.25rem;">${p}</p>
        `)}
      </div>
    </div>
  `,
};