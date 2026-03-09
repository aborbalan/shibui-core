import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-tree-select.component.html';
import { TreeNode } from './lib-tree-node.types';
import { LibTreeSelect } from './lib-tree-node.component';

/* ── Datos de prueba ── */
const DESIGN_TOKENS: TreeNode[] = [
  {
    id: 'tokens', label: 'Tokens', children: [
      { id: 'color', label: 'Color', children: [
        { id: 'primitives', label: 'Primitivos' },
        { id: 'semantic',   label: 'Semánticos' },
        { id: 'dark',       label: 'Dark mode' },
      ]},
      { id: 'typography', label: 'Tipografía', children: [
        { id: 'display', label: 'Display' },
        { id: 'body',    label: 'Body' },
        { id: 'mono',    label: 'Mono' },
      ]},
      { id: 'spacing', label: 'Espaciado', children: [
        { id: 'scale',      label: 'Escala 4pt' },
        { id: 'breakpoints',label: 'Breakpoints' },
      ]},
      { id: 'motion', label: 'Motion', children: [
        { id: 'duration', label: 'Duración' },
        { id: 'easing',   label: 'Easing' },
      ]},
    ],
  },
  {
    id: 'components', label: 'Componentes', children: [
      { id: 'atoms', label: 'Átomos', children: [
        { id: 'btn',     label: 'Button' },
        { id: 'badge',   label: 'Badge' },
        { id: 'icon',    label: 'Icon' },
        { id: 'divider', label: 'Divider' },
        { id: 'spinner', label: 'Spinner' },
      ]},
      { id: 'molecules', label: 'Moléculas', children: [
        { id: 'input',    label: 'Input' },
        { id: 'select',   label: 'Select' },
        { id: 'modal',    label: 'Modal' },
        { id: 'tabs',     label: 'Tabs' },
        { id: 'tree',     label: 'Tree Select' },
      ]},
    ],
  },
  {
    id: 'effects', label: 'Efectos', children: [
      { id: 'glitch',   label: 'Text Glitch' },
      { id: 'progress', label: 'Reading Progress' },
      { id: 'kintsugi', label: 'Kintsugi Spotlight' },
    ],
  },
];

const FILE_TREE: TreeNode[] = [
  { id: 'foundations', label: 'Foundations', children: [
    { id: 'f-tokens',  label: '00 · Tokens' },
    { id: 'f-colors',  label: '01 · Colors' },
    { id: 'f-type',    label: '02 · Typography' },
  ]},
  { id: 'atoms', label: 'Atoms', children: [
    { id: 'a-btn',    label: '10 · Button' },
    { id: 'a-badge',  label: '11 · Badge' },
    { id: 'a-avatar', label: '12 · Avatar' },
  ]},
  { id: 'molecules', label: 'Molecules', children: [
    { id: 'm-select',  label: '30 · Select' },
    { id: 'm-modal',   label: '31 · Modal' },
    { id: 'm-tooltip', label: '32 · Tooltip' },
    { id: 'm-tree',    label: '33 · Tree Select' },
  ]},
  { id: 'effects', label: 'Effects', children: [
    { id: 'e-glitch',   label: '40 · Text Glitch' },
    { id: 'e-progress', label: '41 · Reading Progress' },
  ]},
];

const FILTER_NODES: TreeNode[] = [
  { id: 'color-f', label: 'Color', children: [
    { id: 'washi',   label: 'Washi' },
    { id: 'kaki',    label: 'Kaki' },
    { id: 'celadon', label: 'Celadón' },
  ]},
  { id: 'type-f', label: 'Tipografía', children: [
    { id: 'cormorant', label: 'Cormorant' },
    { id: 'shippori',  label: 'Shippori' },
    { id: 'dmmono',    label: 'DM Mono' },
  ]},
  { id: 'motion-f', label: 'Motion', children: [
    { id: 'fast',   label: 'Fast 100ms' },
    { id: 'base',   label: 'Base 200ms' },
    { id: 'slow',   label: 'Slow 350ms' },
    { id: 'slower', label: 'Slower 600ms' },
  ]},
];

/* ──────────────────────────────────────────────────────────── */

const meta: Meta = {
  title: 'Components/Molecules/TreeSelect',
  component: 'lib-tree-select',
  parameters: {
    docs: {
      description: {
        component: `
Selector jerárquico con propagación bidireccional de selección.

**Modos:**
- \`multi\` — checkboxes + selección en cascada. Al seleccionar un padre, todos sus descendientes se marcan. Al desmarcar un hijo, el padre pasa a estado indeterminado (raya).
- \`single\` — selección única. Al elegir un nodo el dropdown se cierra.
- \`inline\` — el árbol vive directamente en el layout, sin trigger.

**Búsqueda:** filtra el árbol manteniendo visibles los ancestros del resultado. Los términos coincidentes se resaltan con \`<mark>\`.

**Eventos:**
- \`ui-lib-tree-change\` — cada cambio de selección → \`{ selected: TreeNode[], ids: string[] }\`
- \`ui-lib-tree-confirm\` — al pulsar Aplicar (multi dropdown) → mismo detail
        `,
      },
    },
  },
  argTypes: {
    multi:      { control: 'boolean', description: 'Selección múltiple con checkboxes' },
    inline:     { control: 'boolean', description: 'Árbol siempre visible, sin dropdown' },
    searchable: { control: 'boolean', description: 'Mostrar barra de búsqueda' },
    disabled:   { control: 'boolean', description: 'Estado deshabilitado' },
    placeholder:{ control: 'text',    description: 'Texto cuando no hay selección' },
  },
};

export default meta;
type Story = StoryObj;

/* ─────────────────────────────────────────────────────────────
   PLAYGROUND
───────────────────────────────────────────────────────────── */
export const Playground: Story = {
  name: 'Playground',
  args: {
    multi:      true,
    inline:     false,
    searchable: true,
    disabled:   false,
    placeholder: 'Seleccionar categorías…',
  },
  render: (args): TemplateResult => html`
    <div style="padding: 40px; background: var(--bg-surface); min-height: 420px;">
      <lib-tree-select
        .nodes="${DESIGN_TOKENS}"
        ?multi="${args.multi}"
        ?inline="${args.inline}"
        ?searchable="${args.searchable}"
        ?disabled="${args.disabled}"
        placeholder="${args.placeholder}"
        style="width: 300px;"
        @ui-lib-tree-change="${(e: CustomEvent): void => console.log('[tree-change]', e.detail)}"
        @ui-lib-tree-confirm="${(e: CustomEvent): void => console.log('[tree-confirm]', e.detail)}"
      ></lib-tree-select>
    </div>
  `,
};

/* ─────────────────────────────────────────────────────────────
   MULTI — categorías de diseño
───────────────────────────────────────────────────────────── */
export const MultiSelect: Story = {
  name: 'Multi — con tags',
  render: (): TemplateResult => html`
    <div style="padding: 40px; background: var(--bg-surface); min-height: 420px; display: flex; gap: 40px; align-items: flex-start;">
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span style="font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.15em; color: var(--text-muted); text-transform: uppercase;">Multi · con tags</span>
        <lib-tree-select
          .nodes="${DESIGN_TOKENS}"
          multi
          placeholder="Seleccionar categorías…"
          style="width: 300px;"
        ></lib-tree-select>
      </div>
    </div>
  `,
};

/* ─────────────────────────────────────────────────────────────
   SINGLE — ficheros del SG
───────────────────────────────────────────────────────────── */
export const SingleSelect: Story = {
  name: 'Single — ficheros SG',
  render: (): TemplateResult => html`
    <div style="padding: 40px; background: var(--bg-surface); min-height: 420px; display: flex; gap: 40px; align-items: flex-start;">
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span style="font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.15em; color: var(--text-muted); text-transform: uppercase;">Single · selección única</span>
        <lib-tree-select
          .nodes="${FILE_TREE}"
          placeholder="Seleccionar fichero…"
          style="width: 280px;"
          @ui-lib-tree-change="${(e: CustomEvent): void => console.log('[single change]', e.detail)}"
        ></lib-tree-select>
      </div>
    </div>
  `,
};

/* ─────────────────────────────────────────────────────────────
   INLINE — panel de filtros
───────────────────────────────────────────────────────────── */
export const Inline: Story = {
  name: 'Inline — panel de filtros',
  render: (): TemplateResult => html`
    <div style="padding: 40px; background: var(--bg-surface); display: flex; gap: 40px; align-items: flex-start;">

      <div style="width: 260px; display: flex; flex-direction: column; gap: 8px;">
        <span style="font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.15em; color: var(--text-muted); text-transform: uppercase;">Inline multi · filtros</span>
        <lib-tree-select
          .nodes="${FILTER_NODES}"
          multi
          inline
          placeholder="Filtrar…"
          @ui-lib-tree-change="${(e: CustomEvent): void => console.log('[filter change]', e.detail)}"
        ></lib-tree-select>
      </div>

      <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
        <span style="font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.15em; color: var(--text-muted); text-transform: uppercase;">Inline single</span>
        <lib-tree-select
          .nodes="${FILE_TREE}"
          inline
          placeholder="Seleccionar…"
          style="width: 260px;"
        ></lib-tree-select>
      </div>

    </div>
  `,
};

/* ─────────────────────────────────────────────────────────────
   SIN BÚSQUEDA
───────────────────────────────────────────────────────────── */
export const NoSearch: Story = {
  name: 'Sin búsqueda',
  render: (): TemplateResult => html`
    <div style="padding: 40px; background: var(--bg-surface); min-height: 380px; display: flex; gap: 40px; align-items: flex-start;">
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span style="font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.15em; color: var(--text-muted); text-transform: uppercase;">Searchable: false</span>
        <lib-tree-select
          .nodes="${FILTER_NODES}"
          multi
          .searchable="${false}"
          placeholder="Seleccionar…"
          style="width: 280px;"
        ></lib-tree-select>
      </div>
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span style="font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.15em; color: var(--text-muted); text-transform: uppercase;">Inline sin búsqueda</span>
        <lib-tree-select
          .nodes="${FILTER_NODES}"
          multi
          inline
          .searchable="${false}"
          style="width: 260px;"
        ></lib-tree-select>
      </div>
    </div>
  `,
};

/* ─────────────────────────────────────────────────────────────
   DISABLED
───────────────────────────────────────────────────────────── */
export const Disabled: Story = {
  name: 'Disabled',
  render: (): TemplateResult => html`
    <div style="padding: 40px; background: var(--bg-surface); min-height: 200px; display: flex; gap: 40px; align-items: flex-start;">
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span style="font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.15em; color: var(--text-muted); text-transform: uppercase;">Multi disabled</span>
        <lib-tree-select
          .nodes="${DESIGN_TOKENS}"
          multi
          disabled
          placeholder="Deshabilitado"
          style="width: 280px;"
        ></lib-tree-select>
      </div>
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span style="font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.15em; color: var(--text-muted); text-transform: uppercase;">Single disabled</span>
        <lib-tree-select
          .nodes="${FILE_TREE}"
          disabled
          placeholder="Deshabilitado"
          style="width: 280px;"
        ></lib-tree-select>
      </div>
    </div>
  `,
};

/* ─────────────────────────────────────────────────────────────
   API PÚBLICA — control programático
───────────────────────────────────────────────────────────── */
export const ProgrammaticControl: Story = {
  name: 'API pública — control programático',
  render: (): TemplateResult => html`
    <div style="padding: 40px; background: var(--bg-surface); min-height: 420px;">
      <div style="display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap;">
        <button
          style="font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; padding: 8px 16px; background: var(--color-washi-900); color: var(--color-washi-50); border: none; cursor: pointer;"
          @click="${(): void => (document.querySelector('#ts-demo') as LibTreeSelect | null)?.openPanel()}"
        >openPanel()</button>
        <button
          style="font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; padding: 8px 16px; background: transparent; color: var(--text-secondary); border: 1px solid var(--border-default); cursor: pointer;"
          @click="${(): void => (document.querySelector('#ts-demo') as LibTreeSelect | null)?.closePanel()}"
        >closePanel()</button>
        <button
          style="font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; padding: 8px 16px; background: transparent; color: var(--color-error); border: 1px solid var(--color-error); cursor: pointer;"
          @click="${(): void => (document.querySelector('#ts-demo') as LibTreeSelect | null)?.clear()}"
        >clear()</button>
        <button
          style="font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; padding: 8px 16px; background: var(--color-celadon-500); color: white; border: none; cursor: pointer;"
          @click="${(): void => {
            const sel = (document.querySelector('#ts-demo') as LibTreeSelect | null)?.getSelected();
            console.log('[getSelected()]', sel);
          }}"
        >getSelected()</button>
      </div>

      <lib-tree-select
        id="ts-demo"
        .nodes="${DESIGN_TOKENS}"
        multi
        placeholder="Seleccionar categorías…"
        style="width: 300px;"
        @ui-lib-tree-change="${(e: CustomEvent): void => console.log('[change]', e.detail)}"
        @ui-lib-tree-confirm="${(e: CustomEvent): void => console.log('[confirm]', e.detail)}"
      ></lib-tree-select>
    </div>
  `,
};