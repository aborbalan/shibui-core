import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-pagination.component';

const meta: Meta = {
  title: 'Components/Navigation/Pagination',
  component: 'lib-pagination',
  argTypes: {
    totalItems:   { control: { type: 'number' } },
    itemsPerPage: { control: { type: 'number' } },
    currentPage:  { control: { type: 'number' } },
    siblings:     { control: { type: 'range', min: 0, max: 3, step: 1 } },
    size:         { control: 'select', options: ['sm', 'md', 'lg'] },
    variant:      { control: 'select', options: ['default', 'outline', 'ghost'] },
    dark:         { control: 'boolean' },
    showInfo:     { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj;

/* ── helper ── */
const wrap = (bg = 'var(--bg-surface)', children: TemplateResult): TemplateResult => html`
  <div style="padding:var(--lib-space-xl);background:${bg};
    border:1px solid var(--border-subtle);display:flex;flex-direction:column;gap:var(--lib-space-lg);">
    ${children}
  </div>`;

const label = (text: string): TemplateResult => html`
  <p style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
    letter-spacing:var(--tracking-widest);text-transform:uppercase;color:var(--text-muted);">
    ${text}
  </p>`;

/* ── Playground ── */
export const Playground: Story = {
  args: {
    totalItems: 120, itemsPerPage: 10, currentPage: 5,
    siblings: 1, size: 'md', variant: 'default', dark: false, showInfo: false,
  },
  render: (args): TemplateResult => html`
    <div style="padding:2rem;">
      <lib-pagination
        total-items="${args.totalItems}"
        items-per-page="${args.itemsPerPage}"
        current-page="${args.currentPage}"
        siblings="${args.siblings}"
        size="${args.size}"
        variant="${args.variant}"
        ?dark="${args.dark}"
        ?show-info="${args.showInfo}"
        @ui-lib-page-change="${(e: CustomEvent): void =>
          console.log(`página ${e.detail.page} (antes: ${e.detail.prev})`)}"
      ></lib-pagination>
    </div>
  `,
};

/* ── Tamaños ── */
export const Sizes: Story = {
  name: 'Tamaños — sm · md · lg',
  render: (): TemplateResult => wrap('var(--bg-elevated)', html`
    ${label('sm')}
    <lib-pagination total-items="100" current-page="4" size="sm"></lib-pagination>

    ${label('md — default')}
    <lib-pagination total-items="100" current-page="4" size="md"></lib-pagination>

    ${label('lg')}
    <lib-pagination total-items="100" current-page="4" size="lg"></lib-pagination>
  `),
};

/* ── Variantes ── */
export const Variants: Story = {
  name: 'Variantes — default · outline · ghost',
  render: (): TemplateResult => wrap('var(--bg-surface)', html`
    ${label('default')}
    <lib-pagination total-items="100" current-page="5" variant="default"></lib-pagination>

    ${label('outline')}
    <lib-pagination total-items="100" current-page="5" variant="outline"></lib-pagination>

    ${label('ghost')}
    <lib-pagination total-items="100" current-page="5" variant="ghost"></lib-pagination>
  `),
};

/* ── Dark ── */
export const Dark: Story = {
  name: 'Dark — sobre fondo oscuro',
  render: (): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);background:var(--color-washi-950);
      display:flex;flex-direction:column;gap:var(--lib-space-lg);">
      ${label('dark + default')}
      <lib-pagination total-items="100" current-page="5" dark></lib-pagination>

      ${label('dark + outline')}
      <lib-pagination total-items="100" current-page="5" dark variant="outline"></lib-pagination>
    </div>
  `,
};

/* ── Siblings (ellipsis) ── */
export const EllipsisVariants: Story = {
  name: 'Ellipsis — siblings 0 · 1 · 2',
  render: (): TemplateResult => wrap('var(--bg-elevated)', html`
    ${label('siblings=0 — mínimo')}
    <lib-pagination total-items="200" current-page="7" siblings="0"></lib-pagination>

    ${label('siblings=1 — default')}
    <lib-pagination total-items="200" current-page="7" siblings="1"></lib-pagination>

    ${label('siblings=2 — amplio')}
    <lib-pagination total-items="200" current-page="7" siblings="2"></lib-pagination>
  `),
};

/* ── Con info de resultados ── */
export const WithInfo: Story = {
  name: 'Con info — X–Y de Z resultados',
  render: (): TemplateResult => wrap('var(--bg-elevated)', html`
    ${label('show-info + md')}
    <lib-pagination total-items="347" items-per-page="20"
      current-page="3" show-info></lib-pagination>

    ${label('show-info + lg')}
    <lib-pagination total-items="347" items-per-page="20"
      current-page="3" show-info size="lg"></lib-pagination>
  `),
};

/* ── Casos edge ── */
export const EdgeCases: Story = {
  name: 'Edge cases — 1 página · muchas páginas · primera · última',
  render: (): TemplateResult => wrap('var(--bg-surface)', html`
    ${label('1 sola página')}
    <lib-pagination total-items="8" items-per-page="10" current-page="1"></lib-pagination>

    ${label('primera página (prev deshabilitado)')}
    <lib-pagination total-items="200" current-page="1"></lib-pagination>

    ${label('última página (next deshabilitado)')}
    <lib-pagination total-items="200" current-page="20"></lib-pagination>

    ${label('muchas páginas — posición central')}
    <lib-pagination total-items="1000" current-page="50"></lib-pagination>
  `),
};

/* ── En contexto: tabla con paginación ── */
export const InTable: Story = {
  name: 'Contexto — tabla de datos',
  render: (): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);background:var(--bg-elevated);">

      <!-- Tabla mock -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:var(--lib-space-lg);">
        <thead>
          <tr style="border-bottom:1px solid var(--border-default);">
            ${['Componente','Categoría','Estado','Versión'].map(h => html`
              <th style="text-align:left;padding:var(--lib-space-sm) var(--lib-space-md);
                font-family:var(--lib-font-mono);font-size:var(--text-xs);
                letter-spacing:var(--tracking-widest);text-transform:uppercase;
                color:var(--text-muted);font-weight:400;">${h}</th>
            `)}
          </tr>
        </thead>
        <tbody>
          ${['lib-button','lib-chip','lib-dropdown','lib-tabs','lib-dialog',
             'lib-pagination','lib-sidebar','lib-timeline','lib-card','lib-tooltip']
            .map((name, i) => html`
            <tr style="border-bottom:1px solid var(--border-subtle);">
              <td style="padding:var(--lib-space-sm) var(--lib-space-md);
                font-family:var(--lib-font-mono);font-size:var(--text-xs);
                color:var(--color-kaki-500);">${name}</td>
              <td style="padding:var(--lib-space-sm) var(--lib-space-md);
                font-family:var(--lib-font-body);font-size:var(--text-sm);
                color:var(--text-secondary);">${i < 4 ? 'Atom' : 'Molecule'}</td>
              <td style="padding:var(--lib-space-sm) var(--lib-space-md);
                font-family:var(--lib-font-mono);font-size:var(--text-xs);
                color:var(--color-celadon-500);">Stable</td>
              <td style="padding:var(--lib-space-sm) var(--lib-space-md);
                font-family:var(--lib-font-mono);font-size:var(--text-xs);
                color:var(--text-muted);">0.1.0</td>
            </tr>
          `)}
        </tbody>
      </table>

      <!-- Footer con info + paginación -->
      <div style="display:flex;align-items:center;justify-content:space-between;
        padding-top:var(--lib-space-md);border-top:1px solid var(--border-subtle);">
        <span style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
          letter-spacing:var(--tracking-wide);color:var(--text-muted);">
          10 de 63 resultados
        </span>
        <lib-pagination
          total-items="63" items-per-page="10" current-page="1"
          size="sm" variant="ghost"
          @ui-lib-page-change="${(e: CustomEvent): void =>
            console.log('tabla → página', e.detail.page)}"
        ></lib-pagination>
      </div>

    </div>
  `,
};