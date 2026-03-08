import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-data-table.component';
import type { LibDataTable } from './lib-data-table.component';
import type { TableColumn, TableRowData, TableVariant, TableSize } from './lib-data-table.types';

/* ════════════════════════════════════════════════════════════
   DATASETS
   ════════════════════════════════════════════════════════════ */

/** Catálogo Shibui — datos base para la mayoría de stories */
const CATALOG: TableRowData[] = [
  { id: 24, name: 'Tooltip',       category: 'Overlays',   status: 'estable',  variants: 5, date: '12.01.2026' },
  { id: 25, name: 'Dropdown',      category: 'Navegación', status: 'estable',  variants: 3, date: '14.01.2026' },
  { id: 26, name: 'Chips',         category: 'Entradas',   status: 'estable',  variants: 3, date: '16.01.2026' },
  { id: 27, name: 'File Uploader', category: 'Entradas',   status: 'estable',  variants: 3, date: '18.01.2026' },
  { id: 28, name: 'Text Inputs',   category: 'Entradas',   status: 'estable',  variants: 4, date: '20.01.2026' },
  { id: 29, name: 'Select',        category: 'Entradas',   status: 'estable',  variants: 2, date: '22.01.2026' },
  { id: 30, name: 'Drawer',        category: 'Overlays',   status: 'estable',  variants: 4, date: '02.02.2026' },
  { id: 31, name: 'Breadcrumb',    category: 'Navegación', status: 'estable',  variants: 4, date: '04.02.2026' },
  { id: 32, name: 'Table',         category: 'Datos',      status: 'estable',  variants: 4, date: '06.03.2026' },
  { id: 33, name: 'Modal',         category: 'Overlays',   status: 'beta',     variants: 2, date: '—' },
];

/** Columnas estándar del catálogo */
const CATALOG_COLS: TableColumn[] = [
  { key: 'name',     header: 'Componente', sortable: true },
  { key: 'category', header: 'Categoría',  sortable: true, type: 'mono' },
  { key: 'status',   header: 'Estado',     sortable: true, type: 'badge', toneKey: 'status' },
  { key: 'id',       header: 'N.º',        sortable: true, type: 'num' },
  { key: 'variants', header: 'Variantes',  sortable: true, type: 'num' },
  { key: 'date',     header: 'Última edición', type: 'mono' },
];

/** Equipo con celdas avatar + progress */
const TEAM: TableRowData[] = [
  { name: 'Alejandro Bravo', email: 'a.bravo@shibui.dev', role: 'Design lead',   status: 'estable', components: 78, commits: 248 },
  { name: 'María Molina',    email: 'm.molina@shibui.dev', role: 'Frontend eng', status: 'estable', components: 54, commits: 183 },
  { name: 'Kenji Llorens',   email: 'k.llorens@shibui.dev', role: 'Contributor', status: 'beta',    components: 31, commits: 67  },
  { name: 'Riku Garriga',    email: 'r.garriga@shibui.dev', role: 'Contributor', status: 'inactive', components: 8,  commits: 12, _state: 'disabled' as const },
];

const TEAM_COLS: TableColumn[] = [
  { key: 'name',       header: 'Miembro',     type: 'avatar', hintKey: 'email', sortable: true },
  { key: 'role',       header: 'Rol',         type: 'mono' },
  { key: 'status',     header: 'Estado',      type: 'badge', toneKey: 'status' },
  { key: 'components', header: 'Componentes', type: 'progress', progressTone: 'kaki', sortable: true },
  { key: 'commits',    header: 'Commits',     type: 'num', sortable: true },
  { key: '_actions',   header: '',            type: 'actions' },
];

/* ════════════════════════════════════════════════════════════
   META
   ════════════════════════════════════════════════════════════ */
type LibDataTableArgs = Pick<
  LibDataTable,
  'variant' | 'size' | 'dark' | 'loading' | 'selectable' | 'stickyHead'
  | 'toolbar' | 'toolbarTitle' | 'pageSize' | 'caption'
>;

const meta: Meta<LibDataTableArgs> = {
  title: 'Components/Organisms/Data Table',
  component: 'lib-data-table',
  argTypes: {
    variant:      { control: 'select', options: ['lines','grid','striped','borderless'] satisfies TableVariant[] },
    size:         { control: 'select', options: ['sm','md','lg'] satisfies TableSize[] },
    dark:         { control: 'boolean' },
    loading:      { control: 'boolean' },
    selectable:   { control: 'boolean' },
    stickyHead:   { control: 'boolean' },
    toolbar:      { control: 'boolean' },
    toolbarTitle: { control: 'text' },
    pageSize:     { control: 'number' },
    caption:      { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<LibDataTableArgs>;


/* ════════════════════════════════════════════════════════════
   PLAYGROUND
   ════════════════════════════════════════════════════════════ */
export const Playground: Story = {
  args: {
    variant:      'lines',
    size:         'md',
    dark:         false,
    loading:      false,
    selectable:   true,
    stickyHead:   false,
    toolbar:      true,
    toolbarTitle: 'Componentes',
    pageSize:     5,
    caption:      '',
  },
  render: (args): TemplateResult => html`
    <div style="padding:2rem;background:var(--bg-base);">
      <lib-data-table
        variant="${args.variant}"
        size="${args.size}"
        ?dark="${args.dark}"
        ?loading="${args.loading}"
        ?selectable="${args.selectable}"
        ?sticky-head="${args.stickyHead}"
        ?toolbar="${args.toolbar}"
        toolbar-title="${args.toolbarTitle}"
        page-size="${args.pageSize}"
        caption="${args.caption}"
        .columns="${CATALOG_COLS}"
        .data="${CATALOG}"
      ></lib-data-table>
    </div>
  `,
};


/* ════════════════════════════════════════════════════════════
   VARIANTES DE BORDE
   ════════════════════════════════════════════════════════════ */
export const Variants: Story = {
  name: 'Variants — lines · grid · striped · borderless',
  render: (): TemplateResult => {
    const variants: TableVariant[] = ['lines', 'grid', 'striped', 'borderless'];
    const descs: Record<TableVariant, string> = {
      'lines':       'Solo separa filas. La más limpia. Default.',
      'grid':        'Cuadrícula completa. Tablas de datos densos.',
      'striped':     'Fondos alternos. Facilita el seguimiento ocular.',
      'borderless':  'Sin bordes internos. Se integra en el layout.',
    };

    return html`
      <div style="padding:2rem;background:var(--bg-base);display:flex;flex-direction:column;gap:2rem;">
        ${variants.map(v => html`
          <div>
            <p style="font-family:var(--lib-font-mono);font-size:10px;color:var(--text-muted);
                      letter-spacing:0.25em;text-transform:uppercase;margin-bottom:0.5rem;">
              .tbl-${v} — ${descs[v]}
            </p>
            <lib-data-table
              variant="${v}"
              .columns="${CATALOG_COLS.slice(0, 4)}"
              .data="${CATALOG.slice(0, 4)}"
            ></lib-data-table>
          </div>
        `)}
      </div>
    `;
  },
};


/* ════════════════════════════════════════════════════════════
   TAMAÑOS
   ════════════════════════════════════════════════════════════ */
export const Sizes: Story = {
  name: 'Sizes — sm · md · lg',
  render: (): TemplateResult => {
    const sizes: TableSize[] = ['sm', 'md', 'lg'];
    const descs: Record<TableSize, string> = {
      sm: 'Denso — tablas con mucha información',
      md: 'Base — padding equilibrado (default)',
      lg: 'Espacioso — tablas de lectura',
    };

    return html`
      <div style="padding:2rem;background:var(--bg-base);display:flex;flex-direction:column;gap:2rem;">
        ${sizes.map(s => html`
          <div>
            <p style="font-family:var(--lib-font-mono);font-size:10px;color:var(--text-muted);
                      letter-spacing:0.25em;text-transform:uppercase;margin-bottom:0.5rem;">
              size="${s}" — ${descs[s]}
            </p>
            <lib-data-table
              size="${s}"
              .columns="${CATALOG_COLS.slice(0, 4)}"
              .data="${CATALOG.slice(0, 3)}"
            ></lib-data-table>
          </div>
        `)}
      </div>
    `;
  },
};


/* ════════════════════════════════════════════════════════════
   ESTADOS DE FILA
   ════════════════════════════════════════════════════════════ */
export const RowStates: Story = {
  name: 'Row States — selected · error · warning · success · disabled',
  render: (): TemplateResult => {
    const stateData: TableRowData[] = [
      { state: 'default',  component: 'Breadcrumb',    desc: 'Sin modificador de estado',           code: 31, badge: 'estable' },
      { state: 'selected', component: 'Select',        desc: 'Fila seleccionada por checkbox',      code: 29, badge: 'estable',  _state: 'selected'  as const },
      { state: 'error',    component: 'File Uploader', desc: 'Validación fallida o error de carga', code: 27, badge: 'error',    _state: 'error'     as const },
      { state: 'warning',  component: 'Chips',         desc: 'Requiere atención del usuario',       code: 26, badge: 'warning',  _state: 'warning'   as const },
      { state: 'success',  component: 'Drawer',        desc: 'Proceso completado',                  code: 30, badge: 'estable',  _state: 'success'   as const },
      { state: 'disabled', component: 'Modal',         desc: 'Fila bloqueada, sin interacción',     code: 33, badge: 'inactive', _state: 'disabled'  as const },
    ];
    const stateCols: TableColumn[] = [
      { key: 'state',     header: 'Estado',     type: 'mono' },
      { key: 'component', header: 'Componente' },
      { key: 'desc',      header: 'Descripción' },
      { key: 'code',      header: 'Código',     type: 'num' },
      { key: 'badge',     header: 'Badge',      type: 'badge', toneKey: 'badge' },
    ];

    return html`
      <div style="padding:2rem;background:var(--bg-base);">
        <lib-data-table
          .columns="${stateCols}"
          .data="${stateData}"
        ></lib-data-table>
      </div>
    `;
  },
};


/* ════════════════════════════════════════════════════════════
   TIPOS DE CELDA
   ════════════════════════════════════════════════════════════ */
export const CellTypes: Story = {
  name: 'Cell Types — avatar · badge · num · mono · progress · actions',
  render: (): TemplateResult => html`
    <div style="padding:2rem;background:var(--bg-base);">
      <lib-data-table
        ?selectable="${true}"
        .columns="${TEAM_COLS}"
        .data="${TEAM}"
        @ui-lib-table-row-action="${(e: CustomEvent):void => console.log('action', e.detail)}"
      ></lib-data-table>
    </div>
  `,
};


/* ════════════════════════════════════════════════════════════
   SORT
   ════════════════════════════════════════════════════════════ */
export const Sort: Story = {
  name: 'Sort — click en cabeceras',
  render: (): TemplateResult => html`
    <div style="padding:2rem;background:var(--bg-base);">
      <p style="font-family:var(--lib-font-mono);font-size:10px;color:var(--text-muted);
                letter-spacing:0.25em;text-transform:uppercase;margin-bottom:0.75rem;">
        Haz click en cualquier cabecera para ordenar — click doble invierte el sentido
      </p>
      <lib-data-table
        .columns="${CATALOG_COLS}"
        .data="${CATALOG}"
        @ui-lib-table-sort="${(e: CustomEvent):void => console.log('sort', e.detail)}"
      ></lib-data-table>
    </div>
  `,
};


/* ════════════════════════════════════════════════════════════
   STICKY HEAD
   ════════════════════════════════════════════════════════════ */
export const StickyHeader: Story = {
  name: 'Sticky Header — scroll vertical con header fijo',
  render: (): TemplateResult => html`
    <div style="padding:2rem;background:var(--bg-base);">
      <p style="font-family:var(--lib-font-mono);font-size:10px;color:var(--text-muted);
                letter-spacing:0.25em;text-transform:uppercase;margin-bottom:0.75rem;">
        sticky-head — max-height 380px · la cabecera queda fija al hacer scroll
      </p>
      <lib-data-table
        size="sm"
        ?sticky-head="${true}"
        .columns="${[
          { key: 'token',   header: 'Token',       type: 'mono' as const },
          { key: 'value',   header: 'Valor CSS',   type: 'mono' as const },
          { key: 'px',      header: 'px',          type: 'num'  as const },
          { key: 'usage',   header: 'Uso' },
        ]}"
        .data="${[
          { token: '--space-1',  value: '0.25rem', px: 4,   usage: 'Microgaps' },
          { token: '--space-2',  value: '0.5rem',  px: 8,   usage: 'Gap entre icono y texto' },
          { token: '--space-3',  value: '0.75rem', px: 12,  usage: 'Padding compacto' },
          { token: '--space-4',  value: '1rem',    px: 16,  usage: 'Padding base de celdas' },
          { token: '--space-5',  value: '1.25rem', px: 20,  usage: 'Padding lateral' },
          { token: '--space-6',  value: '1.5rem',  px: 24,  usage: 'Gap entre secciones' },
          { token: '--space-8',  value: '2rem',    px: 32,  usage: 'Espaciado de componentes' },
          { token: '--space-10', value: '2.5rem',  px: 40,  usage: 'Padding de previews' },
          { token: '--space-12', value: '3rem',    px: 48,  usage: 'Separación grande' },
          { token: '--space-16', value: '4rem',    px: 64,  usage: 'Padding hero' },
          { token: '--space-20', value: '5rem',    px: 80,  usage: 'Margin hero' },
          { token: '--space-24', value: '6rem',    px: 96,  usage: 'Margin entre secciones' },
          { token: '--space-32', value: '8rem',    px: 128, usage: 'Padding footer de página' },
        ]}"
      ></lib-data-table>
    </div>
  `,
};


/* ════════════════════════════════════════════════════════════
   LOADING — SKELETON
   ════════════════════════════════════════════════════════════ */
export const Loading: Story = {
  name: 'Loading — skeleton de carga',
  render: (): TemplateResult => html`
    <div style="padding:2rem;background:var(--bg-base);">
      <lib-data-table
        ?loading="${true}"
        skeleton-rows="4"
        .columns="${TEAM_COLS}"
        .data="${[]}"
      ></lib-data-table>
    </div>
  `,
};


/* ════════════════════════════════════════════════════════════
   EMPTY STATE
   ════════════════════════════════════════════════════════════ */
export const Empty: Story = {
  name: 'Empty — sin resultados',
  render: (): TemplateResult => html`
    <div style="padding:2rem;background:var(--bg-base);">
      <lib-data-table
        empty-title="Sin resultados"
        empty-desc="Ningún componente coincide con los filtros activos"
        .columns="${CATALOG_COLS}"
        .data="${[]}"
      ></lib-data-table>
    </div>
  `,
};


/* ════════════════════════════════════════════════════════════
   DARK — SUPERFICIE OSCURA
   ════════════════════════════════════════════════════════════ */
export const Dark: Story = {
  name: 'Dark — superficie oscura',
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: (): TemplateResult => html`
    <div style="padding:2rem;background:oklch(10% 0.015 45);">
      <lib-data-table
        ?dark="${true}"
        ?toolbar="${true}"
        toolbar-title="API Tokens"
        .columns="${[
          { key: 'name',    header: 'Nombre' },
          { key: 'perms',   header: 'Permisos', type: 'mono' as const },
          { key: 'status',  header: 'Estado',   type: 'badge' as const, toneKey: 'status' },
          { key: 'last',    header: 'Última vez', type: 'mono' as const },
          { key: '_action', header: '',          type: 'actions' as const },
        ]}"
        .data="${[
          { name: 'Producción · CRM',  perms: 'read / write', status: 'estable',  last: 'hace 2h'  },
          { name: 'Staging · Tests',   perms: 'read only',    status: 'estable',  last: 'hace 5d'  },
          { name: 'CI/CD · GitHub',    perms: 'read / write', status: 'beta',     last: 'hace 1d'  },
          { name: 'Legacy · v0.0.1',   perms: 'admin',        status: 'error',    last: 'hace 90d', _state: 'error' as const },
        ]}"
      ></lib-data-table>
    </div>
  `,
};


/* ════════════════════════════════════════════════════════════
   CONTEXTO COMPLETO — toolbar · selección · paginación
   ════════════════════════════════════════════════════════════ */
export const FullContext: Story = {
  name: 'Full Context — toolbar · select · paginación',
  render: (): TemplateResult => html`
    <div style="padding:2rem;background:var(--bg-base);">
      <lib-data-table
        ?toolbar="${true}"
        toolbar-title="Componentes Shibui"
        ?selectable="${true}"
        page-size="5"
        .columns="${CATALOG_COLS}"
        .data="${CATALOG}"
        @ui-lib-table-sort="${(e: CustomEvent):void => console.log('[sort]',   e.detail)}"
        @ui-lib-table-filter="${(e: CustomEvent):void => console.log('[filter]', e.detail)}"
        @ui-lib-table-select="${(e: CustomEvent):void => console.log('[select]', e.detail)}"
      >
        <div slot="toolbar-actions" style="display:flex;gap:0.5rem;">
          <button style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.08em;
                         text-transform:uppercase;background:transparent;
                         border:1px solid var(--border-default);color:var(--text-muted);
                         padding:0.25rem 0.75rem;cursor:pointer;">
            ⬡ Filtrar
          </button>
          <button style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.08em;
                         text-transform:uppercase;background:var(--color-washi-900);
                         border:1px solid var(--color-washi-900);color:var(--color-washi-50);
                         padding:0.25rem 0.75rem;cursor:pointer;">
            + Nuevo
          </button>
        </div>
      </lib-data-table>
    </div>
  `,
};