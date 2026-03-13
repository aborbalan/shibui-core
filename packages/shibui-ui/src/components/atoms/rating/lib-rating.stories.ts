import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-rating.component';

const meta: Meta = {
  title: 'Components/Forms/Rating',
  component: 'lib-rating',
  argTypes: {
    value:     { control: { type: 'number', min: 0, max: 10, step: 0.5 } },
    max:       { control: { type: 'number', min: 1, max: 10 } },
    size:      { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    color:     { control: 'select', options: ['gold', 'kaki', 'washi', 'celadon'] },
    icon:      { control: 'select', options: ['star', 'heart', 'diamond'] },
    readonly:  { control: 'boolean' },
    disabled:  { control: 'boolean' },
    showCount: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj;

/* ── helpers ── */
const wrap = (bg = 'var(--bg-surface)', content: TemplateResult): TemplateResult => html`
  <div style="padding:var(--lib-space-xl);background:${bg};
    border:1px solid var(--border-subtle);display:flex;flex-direction:column;gap:var(--lib-space-lg);">
    ${content}
  </div>`;

const row = (label: string, content: TemplateResult): TemplateResult => html`
  <div style="display:flex;align-items:center;gap:var(--lib-space-lg);">
    ${content}
    <span style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
      letter-spacing:var(--tracking-wide);color:var(--text-muted);">${label}</span>
  </div>`;

/* ──────────────────────────────────────────────
   Playground
   ────────────────────────────────────────────── */
export const Playground: Story = {
  args: { value: 3, max: 5, size: 'md', color: 'gold', icon: 'star', readonly: false, disabled: false, showCount: false },
  render: (args): TemplateResult => html`
    <div style="padding:2rem;">
      <lib-rating
        value="${args.value}"
        max="${args.max}"
        size="${args.size}"
        color="${args.color}"
        icon="${args.icon}"
        ?readonly="${args.readonly}"
        ?disabled="${args.disabled}"
        ?show-count="${args.showCount}"
        @ui-lib-rating-change="${(e: CustomEvent): void =>
          console.log(`rating → ${e.detail.value} (antes: ${e.detail.prev})`)}"
      ></lib-rating>
    </div>
  `,
};

/* ──────────────────────────────────────────────
   States — vacío · parcial · lleno · read-only · disabled
   ────────────────────────────────────────────── */
export const States: Story = {
  name: 'States — empty · partial · full · readonly · disabled',
  render: (): TemplateResult => wrap('var(--bg-surface)', html`
    ${row('Empty — sin valorar',           html`<lib-rating value="0"></lib-rating>`)}
    ${row('Partial — 3 de 5',             html`<lib-rating value="3"></lib-rating>`)}
    ${row('Full — valoración máxima',     html`<lib-rating value="5"></lib-rating>`)}
    ${row('Read-only — solo display',     html`<lib-rating value="4" readonly></lib-rating>`)}
    ${row('Disabled — 40% opacity',       html`<lib-rating value="3" disabled></lib-rating>`)}
  `),
};

/* ──────────────────────────────────────────────
   Sizes — xs · sm · md · lg · xl
   ────────────────────────────────────────────── */
export const Sizes: Story = {
  name: 'Sizes — xs · sm · md · lg · xl',
  render: (): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);background:var(--bg-elevated);
      border:1px solid var(--border-subtle);display:flex;align-items:flex-end;
      gap:var(--lib-space-xl);flex-wrap:wrap;">
      ${(['xs','sm','md','lg','xl'] as const).map(s => html`
        <div style="display:flex;flex-direction:column;align-items:center;gap:var(--lib-space-sm);">
          <lib-rating size="${s}" value="3" readonly></lib-rating>
          <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:var(--tracking-widest);
            text-transform:uppercase;color:var(--text-muted);">${s}</span>
        </div>
      `)}
    </div>
  `,
};

/* ──────────────────────────────────────────────
   Icons — star · heart · diamond
   ────────────────────────────────────────────── */
export const Icons: Story = {
  name: 'Icons — star · heart · diamond',
  render: (): TemplateResult => wrap('var(--bg-surface)', html`
    ${row('ph-star — valoración genérica',   html`<lib-rating icon="star"    value="4" size="lg"></lib-rating>`)}
    ${row('ph-heart — favoritos · kaki',     html`<lib-rating icon="heart"   value="3" size="lg" color="kaki"></lib-rating>`)}
    ${row('ph-diamond — calidad · washi',    html`<lib-rating icon="diamond" value="5" size="lg" color="washi"></lib-rating>`)}
  `),
};

/* ──────────────────────────────────────────────
   Colors — gold · kaki · washi · celadon
   ────────────────────────────────────────────── */
export const Colors: Story = {
  name: 'Colors — gold · kaki · washi · celadon',
  render: (): TemplateResult => wrap('var(--bg-surface)', html`
    ${row('Gold (default)',    html`<lib-rating color="gold"    value="4"></lib-rating>`)}
    ${row('Kaki',             html`<lib-rating color="kaki"    value="4"></lib-rating>`)}
    ${row('Washi (mono)',     html`<lib-rating color="washi"   value="4"></lib-rating>`)}
    ${row('Celadón',          html`<lib-rating color="celadon" value="4"></lib-rating>`)}
  `),
};

/* ──────────────────────────────────────────────
   Half-star — valores decimales .5, read-only
   ────────────────────────────────────────────── */
export const HalfStar: Story = {
  name: 'Half-star — read-only con decimales',
  render: (): TemplateResult => wrap('var(--bg-surface)', html`
    ${row('1.5 / 5', html`<lib-rating value="1.5" readonly></lib-rating>`)}
    ${row('2.5 / 5', html`<lib-rating value="2.5" readonly></lib-rating>`)}
    ${row('3.5 / 5', html`<lib-rating value="3.5" readonly></lib-rating>`)}
    ${row('4.5 / 5', html`<lib-rating value="4.5" readonly></lib-rating>`)}
  `),
};

/* ──────────────────────────────────────────────
   Numeric display — show-count
   ────────────────────────────────────────────── */
export const NumericDisplay: Story = {
  name: 'Numeric display — show-count',
  render: (): TemplateResult => wrap('var(--bg-elevated)', html`
    ${row('sm + valor',              html`<lib-rating value="4.3" size="sm" readonly show-count></lib-rating>`)}
    ${row('md + valor + reseñas',    html`<lib-rating value="4.3" size="md" readonly show-count count="214"></lib-rating>`)}
    ${row('lg + valor + reseñas',    html`<lib-rating value="4.3" size="lg" readonly show-count count="214"></lib-rating>`)}
  `),
};

/* ──────────────────────────────────────────────
   Contexto — resumen + distribución
   ────────────────────────────────────────────── */
export const DistributionSummary: Story = {
  name: 'Contexto — resumen + distribución',
  render: (): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);background:var(--bg-surface);
      border:1px solid var(--border-subtle);display:flex;gap:var(--lib-space-xl);
      align-items:flex-start;flex-wrap:wrap;">

      <!-- Score hero -->
      <div style="display:flex;flex-direction:column;align-items:center;gap:var(--lib-space-sm);min-width:100px;">
        <span style="font-family:var(--lib-font-display);font-size:4rem;font-weight:300;
          letter-spacing:var(--tracking-tight);line-height:1;color:var(--text-primary);">4.3</span>
        <lib-rating value="4.5" size="sm" readonly></lib-rating>
        <span style="font-family:var(--lib-font-mono);font-size:10px;
          letter-spacing:var(--tracking-widest);color:var(--text-muted);">214 reseñas</span>
      </div>

      <!-- Distribution bars -->
      <div style="display:flex;flex-direction:column;gap:var(--lib-space-sm);max-width:280px;flex:1;">
        ${[
          { n: 5, pct: 62 },
          { n: 4, pct: 24 },
          { n: 3, pct:  9 },
          { n: 2, pct:  3 },
          { n: 1, pct:  2 },
        ].map(row => html`
          <div style="display:flex;align-items:center;gap:var(--lib-space-sm);">
            <span style="font-family:var(--lib-font-mono);font-size:10px;
              letter-spacing:var(--tracking-wider);color:var(--text-muted);
              width:10px;text-align:right;flex-shrink:0;">${row.n}</span>
            <div style="flex:1;height:4px;background:var(--color-washi-200);border-radius:999px;overflow:hidden;">
              <div style="height:100%;background:#C4922A;border-radius:999px;
                width:${row.pct}%;transition:width 800ms var(--ease-out);"></div>
            </div>
            <span style="font-family:var(--lib-font-mono);font-size:10px;
              color:var(--text-muted);width:28px;text-align:right;flex-shrink:0;">${row.pct}%</span>
          </div>
        `)}
      </div>
    </div>
  `,
};

/* ──────────────────────────────────────────────
   Contexto — tarjetas de reseña
   ────────────────────────────────────────────── */
export const ReviewCards: Story = {
  name: 'Contexto — tarjetas de reseña',
  render: (): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);background:var(--bg-surface);
      border:1px solid var(--border-subtle);display:flex;gap:var(--lib-space-md);flex-wrap:wrap;">
      ${[
        { name: 'Alejandro B.', date: 'Marzo 2026',    value: 5,   text: 'El sistema de tokens es exactamente lo que llevaba buscando. La coherencia entre componentes es impecable.' },
        { name: 'Marta R.',     date: 'Febrero 2026',  value: 4.5, text: 'Las animaciones tienen una personalidad muy marcada. El bounce del switch es mi favorito — se siente físico.' },
      ].map(r => html`
        <div style="border:1px solid var(--border-subtle);background:var(--bg-elevated);
          padding:var(--lib-space-lg);display:flex;flex-direction:column;
          gap:var(--lib-space-md);max-width:360px;">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:var(--lib-space-md);">
            <div>
              <div style="font-family:var(--lib-font-body);font-size:var(--text-base);color:var(--text-primary);">${r.name}</div>
              <div style="font-family:var(--lib-font-mono);font-size:10px;
                letter-spacing:var(--tracking-wide);color:var(--text-muted);margin-top:2px;">${r.date}</div>
            </div>
            <lib-rating value="${r.value}" size="sm" readonly></lib-rating>
          </div>
          <p style="font-family:var(--lib-font-body);font-size:var(--text-sm);
            color:var(--text-secondary);line-height:1.8;font-style:italic;">"${r.text}"</p>
        </div>
      `)}
    </div>
  `,
};

/* ──────────────────────────────────────────────
   Contexto — tabla compacta XS inline
   ────────────────────────────────────────────── */
export const InTable: Story = {
  name: 'Contexto — tabla compacta (xs inline)',
  render: (): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);background:var(--bg-surface);">
      <div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);">

        <div style="display:grid;grid-template-columns:1fr auto auto;
          padding:var(--lib-space-sm) var(--lib-space-md);background:var(--bg-surface);
          border-bottom:1px solid var(--border-subtle);">
          ${['Componente','Valoración','Usos'].map(h => html`
            <span style="font-family:var(--lib-font-mono);font-size:10px;
              letter-spacing:var(--tracking-widest);text-transform:uppercase;color:var(--text-muted);">${h}</span>
          `)}
        </div>

        ${[
          { name: 'Switch',           value: 5,   half: false, uses: '2.4k' },
          { name: 'Progress Circle',  value: 4.5, half: true,  uses: '1.8k' },
          { name: 'KBD',              value: 4,   half: false, uses: '980' },
          { name: 'lib-rating',       value: 3.5, half: true,  uses: '612' },
        ].map(r => html`
          <div style="display:grid;grid-template-columns:1fr auto auto;
            padding:var(--lib-space-sm) var(--lib-space-md);
            border-bottom:1px solid var(--border-subtle);align-items:center;gap:var(--lib-space-md);">
            <span style="font-family:var(--lib-font-body);font-size:var(--text-sm);color:var(--text-secondary);">${r.name}</span>
            <div style="display:flex;align-items:center;gap:var(--lib-space-xs);">
              <lib-rating value="${r.value}" size="xs" readonly></lib-rating>
              <span style="font-family:var(--lib-font-mono);font-size:10px;color:var(--text-muted);">${r.value.toFixed(1)}</span>
            </div>
            <span style="font-family:var(--lib-font-mono);font-size:10px;color:var(--text-muted);
              padding-left:var(--lib-space-md);">${r.uses}</span>
          </div>
        `)}

      </div>
    </div>
  `,
};