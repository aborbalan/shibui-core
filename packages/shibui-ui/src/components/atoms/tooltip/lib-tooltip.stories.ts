import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-tooltip.component';
import type { LibTooltip } from './lib-tooltip.component';

type LibTooltipArgs = Pick<LibTooltip, 'position' | 'variant' | 'size' | 'content' | 'instant' | 'open'>;

/* ── Trigger helpers ────────────────────────────────────────── */
const btnLight  = (label: string): TemplateResult => html`
  <button style="display:inline-flex;align-items:center;gap:0.5rem;font-family:var(--lib-font-mono);font-size:0.6875rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-secondary);background:var(--bg-elevated);border:1px solid var(--border-default);padding:0.75rem 1.25rem;cursor:default;user-select:none;">
    ${label}
  </button>`;

const iconBtn = (icon: string): TemplateResult => html`
  <button style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;color:var(--text-muted);background:var(--bg-surface);border:1px solid var(--border-subtle);cursor:default;">
    ${icon}
  </button>`;

const stage = (dark: boolean, content: TemplateResult): TemplateResult => html`
  <div style="
    padding:4rem;
    background:${dark ? 'oklch(18% 0.02 45)' : 'var(--bg-elevated)'};
    border:1px solid ${dark ? 'oklch(16% 0.02 45)' : 'var(--border-subtle)'};
    display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:3rem;
    min-height:12rem;
  ">
    ${content}
  </div>`;

const label = (text: string, dark = false): TemplateResult => html`
  <span style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:${dark ? 'oklch(40% 0 0)' : 'var(--text-muted)'};">
    ${text}
  </span>`;

const col = (inner: TemplateResult, sublabel: string, dark = false): TemplateResult => html`
  <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
    ${inner}
    ${label(sublabel, dark)}
  </div>`;


const meta: Meta<LibTooltipArgs> = {
  title: 'Components/Atoms/Tooltip',
  component: 'lib-tooltip',
  argTypes: {
    position: {
      control: 'select',
      options: ['top','bottom','left','right','top-start','top-end','bottom-start','bottom-end'],
      description: 'Posición de la burbuja respecto al trigger',
    },
    variant: {
      control: 'select',
      options: ['dark','light','kaki','celadon','error'],
      description: 'Variante de color',
    },
    size: {
      control: 'select',
      options: ['sm','md','lg'],
      description: 'Tamaño de la burbuja',
    },
    content: {
      control: 'text',
      description: 'Texto simple. Para contenido rico, usa slot="content".',
    },
    instant: {
      control: 'boolean',
      description: 'Elimina el delay de entrada de 300ms',
    },
    open: {
      control: 'boolean',
      description: 'Abre programáticamente (equivale a .is-open)',
    },
  },
  render: (args): TemplateResult => html`
    <div style="padding:5rem;background:var(--bg-base);display:flex;align-items:center;justify-content:center;min-height:12rem;">
      <lib-tooltip
        position=${args.position}
        variant=${args.variant}
        size=${args.size}
        content=${args.content}
        ?instant=${args.instant}
        ?open=${args.open}
      >
        ${btnLight('Pasa el ratón')}
      </lib-tooltip>
    </div>
  `,
};

export default meta;
type Story = StoryObj<LibTooltipArgs>;


/* ══════════════════════════════════════
   PLAYGROUND
   ══════════════════════════════════════ */
export const Playground: Story = {
  args: {
    position: 'top',
    variant:  'dark',
    size:     'md',
    content:  'Descripción de la acción',
    instant:  false,
    open:     false,
  },
};


/* ══════════════════════════════════════
   TAMAÑOS
   ══════════════════════════════════════ */
export const Sizes: Story = {
  name: 'Sizes — sm · md · lg',
  render: (): TemplateResult => stage(false, html`
    ${col(html`
      <lib-tooltip position="top" size="sm" content="Acción rápida">
        ${btnLight('SM')}
      </lib-tooltip>`, '.tip-sm · 10px')}

    ${col(html`
      <lib-tooltip position="top" size="md" content="Descripción de la acción">
        ${btnLight('MD')}
      </lib-tooltip>`, 'MD · 11px (default)')}

    ${col(html`
      <lib-tooltip position="top" size="lg" content="Descripción más larga con contexto adicional sobre la acción que se va a realizar.">
        ${btnLight('LG')}
      </lib-tooltip>`, '.tip-lg · Shippori')}
  `),
};


/* ══════════════════════════════════════
   POSICIONES — cardinales
   ══════════════════════════════════════ */
export const Positions: Story = {
  name: 'Positions — cardinales',
  render: (): TemplateResult => stage(false, html`
    ${(['top','bottom','left','right'] as const).map(p => html`
      ${col(html`
        <lib-tooltip position="${p}" content="Tooltip ${p}">
          ${btnLight(p)}
        </lib-tooltip>`, p)}
    `)}
  `),
};


/* ══════════════════════════════════════
   POSICIONES — diagonales
   ══════════════════════════════════════ */
export const PositionsEdge: Story = {
  name: 'Positions — start · end',
  render: (): TemplateResult => stage(false, html`
    ${(['top-start','top-end','bottom-start','bottom-end'] as const).map(p => html`
      ${col(html`
        <lib-tooltip position="${p}" content="Alineado ${p}">
          ${btnLight(p)}
        </lib-tooltip>`, p)}
    `)}
  `),
};


/* ══════════════════════════════════════
   VARIANTES
   ══════════════════════════════════════ */
export const Variants: Story = {
  name: 'Variants — dark · light · kaki · celadón · error',
  render: (): TemplateResult => html`
    <!-- Light bg -->
    ${stage(false, html`
      ${col(html`<lib-tooltip position="top" variant="dark" content="washi-900 · default">${btnLight('Dark')}</lib-tooltip>`, 'default')}
      ${col(html`<lib-tooltip position="top" variant="light" content="Fondo blanco con borde">${btnLight('Light')}</lib-tooltip>`, '.tip-light')}
      ${col(html`<lib-tooltip position="top" variant="kaki" content="Acento naranja terracota">${btnLight('Kaki')}</lib-tooltip>`, '.tip-kaki')}
      ${col(html`<lib-tooltip position="top" variant="celadon" content="Estado positivo confirmado">${btnLight('Celadón')}</lib-tooltip>`, '.tip-celadon')}
      ${col(html`<lib-tooltip position="top" variant="error" content="Acción destructiva">${btnLight('Error')}</lib-tooltip>`, '.tip-error')}
    `)}
    <!-- Dark bg — light variant -->
    ${stage(true, html`
      ${col(html`<lib-tooltip position="top" variant="light" content="Ajustes del sistema">${btnLight('Configuración')}</lib-tooltip>`, 'light · dark bg', true)}
      ${col(html`<lib-tooltip position="top" variant="light" content="3 notificaciones pendientes">${btnLight('Alertas')}</lib-tooltip>`, 'light · dark bg', true)}
      ${col(html`<lib-tooltip position="bottom" variant="error" content="Acción destructiva">${btnLight('Eliminar')}</lib-tooltip>`, 'error · dark bg', true)}
    `)}
  `,
};


/* ══════════════════════════════════════
   CONTENIDO RICO
   ══════════════════════════════════════ */
export const RichContent: Story = {
  name: 'Rich Content — título · kbd · sep',
  render: (): TemplateResult => stage(false, html`

    <!-- Título + cuerpo -->
    ${col(html`
      <lib-tooltip position="top" size="lg">
        ${btnLight('Título + texto')}
        <span slot="content" style="padding:0.75rem 1rem;display:block;">
          <span class="tip-title">Tokens de color</span>
          <span class="tip-body">Paleta completa en variables CSS. Incluye escala washi, kaki y celadón en 10 pasos.</span>
        </span>
      </lib-tooltip>`, '.tip-title + .tip-body')}

    <!-- Acción + separador + atajo de teclado -->
    ${col(html`
      <lib-tooltip position="top">
        ${btnLight('Guardar')}
        <span slot="content" style="padding:0.75rem 1rem;display:block;">
          Guardar cambios
          <div class="tip-sep" style="height:1px;background:rgba(255,255,255,0.12);margin:0.5rem 0;"></div>
          <div class="tip-kbd" style="display:inline-flex;gap:2px;margin-top:0.5rem;">
            <kbd>⌘</kbd><kbd>S</kbd>
          </div>
        </span>
      </lib-tooltip>`, 'sep + kbd')}

    <!-- Light variant con título -->
    ${col(html`
      <lib-tooltip position="top" variant="light" size="lg">
        <span style="font-family:var(--lib-font-body);font-size:var(--text-sm);color:var(--text-secondary);border-bottom:1px dashed var(--border-default);cursor:default;padding-bottom:1px;">oklch</span>
        <span slot="content" style="padding:0.75rem 1rem;display:block;">
          <span class="tip-title" style="color:var(--text-primary);">oklch(L C H)</span>
          <span class="tip-body" style="color:var(--text-secondary);">Espacio de color perceptualmente uniforme. L = luminosidad, C = croma, H = tono.</span>
        </span>
      </lib-tooltip>`, 'light · rich')}

  `),
};


/* ══════════════════════════════════════
   DELAY
   ══════════════════════════════════════ */
export const Delay: Story = {
  name: 'Delay — 300ms default · instant',
  render: (): TemplateResult => stage(false, html`
    ${col(html`
      <lib-tooltip position="top" content="Aparezco tras 300ms">
        ${btnLight('Default delay')}
      </lib-tooltip>`, '300ms (default)')}

    ${col(html`
      <lib-tooltip position="top" content="Aparezco al instante" instant>
        ${btnLight('Instant')}
      </lib-tooltip>`, '.tip-instant · 0ms')}
  `),
};


/* ══════════════════════════════════════
   OPEN programático
   ══════════════════════════════════════ */
export const OpenProgrammatic: Story = {
  name: 'Open — programático (is-open)',
  render: (): TemplateResult => stage(false, html`
    <lib-tooltip position="top" content="Siempre visible" open>
      ${btnLight('Siempre abierto')}
    </lib-tooltip>
  `),
};


/* ══════════════════════════════════════
   CONTEXT — usos reales
   ══════════════════════════════════════ */
export const Context: Story = {
  name: 'Context — usos en la interfaz',
  render: (): TemplateResult => html`
    <div style="padding:2rem;background:var(--bg-base);display:flex;flex-direction:column;gap:2rem;">

      <!-- Barra de iconos — dark bg -->
      <div>
        <p style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:var(--text-muted);margin-bottom:1rem;">Barra de iconos sobre fondo oscuro</p>
        <div style="background:oklch(18% 0.02 45);padding:1.5rem 2rem;border-radius:8px;display:inline-flex;gap:1px;">
          ${(['💾','🔗','⚙️'].map((ic, i) => html`
            <lib-tooltip position="bottom" variant="light" content="${['Guardar ⌘S','Compartir','Configuración'][i]}">
              ${iconBtn(ic)}
            </lib-tooltip>
          `))}
          <lib-tooltip position="bottom-end" variant="error" content="Eliminar definitivamente">
            ${iconBtn('🗑️')}
          </lib-tooltip>
        </div>
      </div>

      <!-- Inline glossary -->
      <div>
        <p style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:var(--text-muted);margin-bottom:1rem;">Glosario inline — texto con tooltip</p>
        <p style="font-size:var(--text-sm);color:var(--text-secondary);line-height:var(--leading-relaxed);max-width:440px;">
          El sistema de tokens usa
          <lib-tooltip position="top" variant="light" size="lg" style="display:inline;">
            <span style="border-bottom:1px dashed var(--border-default);cursor:default;color:var(--text-accent);">oklch</span>
            <span slot="content" style="padding:0.75rem 1rem;display:block;">
              <span class="tip-title" style="color:var(--text-primary);">oklch(L C H)</span>
              <span class="tip-body" style="color:var(--text-secondary);">Espacio de color perceptualmente uniforme. Garantiza contraste consistente en todas las superficies.</span>
            </span>
          </lib-tooltip>
          para garantizar contraste uniforme en todas las superficies.
        </p>
      </div>

      <!-- Cabecera de tabla -->
      <div>
        <p style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:var(--text-muted);margin-bottom:1rem;">Cabeceras de tabla con tooltip informativo</p>
        <table style="width:100%;border-collapse:collapse;font-family:var(--lib-font-body);font-size:var(--text-sm);background:var(--bg-elevated);border:1px solid var(--border-subtle);">
          <thead>
            <tr>
              <th style="padding:0.75rem 1.25rem;text-align:left;background:var(--bg-surface);border-bottom:1px solid var(--border-default);">
                <lib-tooltip position="bottom-start" size="sm" content="Nombre del componente en Shibui Design System" style="display:inline-flex;">
                  <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:var(--text-muted);cursor:default;">Componente ℹ</span>
                </lib-tooltip>
              </th>
              <th style="padding:0.75rem 1.25rem;text-align:left;background:var(--bg-surface);border-bottom:1px solid var(--border-default);">
                <lib-tooltip position="bottom" size="sm" content="% de variantes documentadas vs. planificadas" style="display:inline-flex;">
                  <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:var(--text-muted);cursor:default;">Cobertura ℹ</span>
                </lib-tooltip>
              </th>
              <th style="padding:0.75rem 1.25rem;text-align:right;background:var(--bg-surface);border-bottom:1px solid var(--border-default);">
                <lib-tooltip position="bottom-end" size="sm" content="Incidencias abiertas en GitHub" style="display:inline-flex;">
                  <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:var(--text-muted);cursor:default;">ℹ Issues</span>
                </lib-tooltip>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid var(--border-subtle);">
              <td style="padding:0.75rem 1.25rem;color:var(--text-secondary);">Spinner</td>
              <td style="padding:0.75rem 1.25rem;color:var(--color-celadon-500);font-family:var(--lib-font-mono);font-size:var(--text-xs);">100%</td>
              <td style="padding:0.75rem 1.25rem;text-align:right;color:var(--text-muted);font-family:var(--lib-font-mono);font-size:var(--text-xs);">0</td>
            </tr>
            <tr>
              <td style="padding:0.75rem 1.25rem;color:var(--text-secondary);">Tooltip</td>
              <td style="padding:0.75rem 1.25rem;color:var(--color-kaki-500);font-family:var(--lib-font-mono);font-size:var(--text-xs);">84%</td>
              <td style="padding:0.75rem 1.25rem;text-align:right;color:var(--color-kaki-400);font-family:var(--lib-font-mono);font-size:var(--text-xs);">1</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  `,
};