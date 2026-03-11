import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-button-group.component';
import '../../atoms/button/lib-button.component';

const meta: Meta = {
  title: 'Components/Molecules/ButtonGroup',
  component: 'lib-button-group',
  argTypes: {
    shape:       { control: 'select', options: ['flat', 'rounded', 'pill'] },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    toggle:      { control: 'boolean' },
    multi:       { control: 'boolean' },
    dark:        { control: 'boolean' },
    kintsugi:    { control: 'boolean' },
    block:       { control: 'boolean' },
    size:        { control: 'select', options: ['', 'sm', 'md', 'lg'] },
  },
};
export default meta;
type Story = StoryObj;

/* ── Playground ── */
export const Playground: Story = {
  args: {
    shape:       'rounded',
    orientation: 'horizontal',
    toggle:      true,
    multi:       false,
    dark:        false,
    kintsugi:    false,
    block:       false,
    size:        '',
  },
  render: (args): TemplateResult => html`
    <div style="padding: 2rem;">
      <lib-button-group
        shape="${args.shape}"
        orientation="${args.orientation}"
        ?toggle="${args.toggle}"
        ?multi="${args.multi}"
        ?dark="${args.dark}"
        ?kintsugi="${args.kintsugi}"
        ?block="${args.block}"
        size="${args.size}"
        @ui-lib-group-change="${(e: CustomEvent): void => console.log('change', e.detail)}"
      >
        <lib-button variant="secondary" active>Todos</lib-button>
        <lib-button variant="secondary">Activos</lib-button>
        <lib-button variant="secondary">Borrador</lib-button>
        <lib-button variant="secondary">Archivado</lib-button>
      </lib-button-group>
    </div>
  `,
};

/* ── Acción — geometría ── */
export const ActionShapes: Story = {
  name: 'Acción — Flat · Rounded · Pill',
  render: (): TemplateResult => html`
    <div style="padding: 2rem; display: flex; flex-direction: column; gap: 2rem;">

      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.75rem;">flat (default)</p>
        <lib-button-group shape="flat">
          <lib-button variant="secondary">Anterior</lib-button>
          <lib-button variant="secondary">Siguiente</lib-button>
        </lib-button-group>
      </div>

      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.75rem;">rounded</p>
        <lib-button-group shape="rounded">
          <lib-button variant="secondary">Anterior</lib-button>
          <lib-button variant="secondary">Siguiente</lib-button>
        </lib-button-group>
      </div>

      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.75rem;">pill</p>
        <lib-button-group shape="pill">
          <lib-button variant="secondary">Anterior</lib-button>
          <lib-button variant="secondary">Siguiente</lib-button>
        </lib-button-group>
      </div>

      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.75rem;">separador explícito · ghost</p>
        <lib-button-group>
          <lib-button variant="ghost">H1</lib-button>
          <lib-button variant="ghost">H2</lib-button>
          <lib-button variant="ghost">H3</lib-button>
          <lib-button-sep></lib-button-sep>
          <lib-button variant="ghost" icon-only aria-label="Bold">B</lib-button>
          <lib-button variant="ghost" icon-only aria-label="Italic">I</lib-button>
          <lib-button variant="ghost" icon-only aria-label="Underline">U</lib-button>
        </lib-button-group>
      </div>

      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.75rem;">mixto · accent · secondary · ghost</p>
        <lib-button-group shape="rounded">
          <lib-button variant="accent">Publicar</lib-button>
          <lib-button variant="secondary">Vista previa</lib-button>
          <lib-button variant="ghost">Descartar</lib-button>
        </lib-button-group>
      </div>

    </div>
  `,
};

/* ── Tamaños ── */
export const Sizes: Story = {
  name: 'Tamaños — sm · md · lg',
  render: (): TemplateResult => html`
    <div style="padding: 2rem; display: flex; flex-direction: column; gap: 2rem; align-items: flex-start;">
      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.75rem;">sm</p>
        <lib-button-group shape="rounded" size="sm">
          <lib-button variant="secondary">Copiar</lib-button>
          <lib-button variant="secondary">Cortar</lib-button>
          <lib-button variant="secondary">Pegar</lib-button>
        </lib-button-group>
      </div>
      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.75rem;">md (default)</p>
        <lib-button-group shape="rounded">
          <lib-button variant="secondary">Copiar</lib-button>
          <lib-button variant="secondary">Cortar</lib-button>
          <lib-button variant="secondary">Pegar</lib-button>
        </lib-button-group>
      </div>
      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.75rem;">lg</p>
        <lib-button-group shape="rounded" size="lg">
          <lib-button variant="secondary">Copiar</lib-button>
          <lib-button variant="secondary">Cortar</lib-button>
          <lib-button variant="secondary">Pegar</lib-button>
        </lib-button-group>
      </div>
    </div>
  `,
};

/* ── Toggle single ── */
export const ToggleSingle: Story = {
  name: 'Toggle — Single select',
  render: (): TemplateResult => html`
    <div style="padding: 2rem; display: flex; flex-direction: column; gap: 2rem; align-items: flex-start;">

      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.75rem;">outline · filtro de estado</p>
        <lib-button-group shape="rounded" toggle
          @ui-lib-group-change="${(e: CustomEvent): void => console.log(e.detail)}">
          <lib-button variant="secondary" active>Todos</lib-button>
          <lib-button variant="secondary">Activos</lib-button>
          <lib-button variant="secondary">Borrador</lib-button>
          <lib-button variant="secondary">Archivado</lib-button>
        </lib-button-group>
      </div>

      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.75rem;">ghost · vista de layout</p>
        <lib-button-group toggle>
          <lib-button variant="ghost" active>Grid</lib-button>
          <lib-button variant="ghost">Lista</lib-button>
          <lib-button variant="ghost">Mosaic</lib-button>
        </lib-button-group>
      </div>

      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.75rem;">kaki · kintsugi · rango temporal</p>
        <lib-button-group shape="rounded" toggle kintsugi>
          <lib-button variant="accent" active>Día</lib-button>
          <lib-button variant="accent">Semana</lib-button>
          <lib-button variant="accent">Mes</lib-button>
          <lib-button variant="accent">Año</lib-button>
        </lib-button-group>
      </div>

    </div>
  `,
};

/* ── Toggle multi ── */
export const ToggleMulti: Story = {
  name: 'Toggle — Multi select',
  render: (): TemplateResult => html`
    <div style="padding: 2rem; display: flex; flex-direction: column; gap: 2rem; align-items: flex-start;">

      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.75rem;">formato de texto</p>
        <lib-button-group shape="rounded" toggle multi>
          <lib-button variant="secondary" active>Bold</lib-button>
          <lib-button variant="secondary">Italic</lib-button>
          <lib-button variant="secondary" active>Under</lib-button>
          <lib-button variant="secondary">Strike</lib-button>
        </lib-button-group>
      </div>

      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.75rem;">días recurrentes</p>
        <lib-button-group shape="rounded" toggle multi>
          <lib-button variant="secondary">Lun</lib-button>
          <lib-button variant="secondary" active>Mar</lib-button>
          <lib-button variant="secondary" active>Mié</lib-button>
          <lib-button variant="secondary">Jue</lib-button>
          <lib-button variant="secondary" active>Vie</lib-button>
          <lib-button variant="secondary">Sáb</lib-button>
          <lib-button variant="secondary">Dom</lib-button>
        </lib-button-group>
      </div>

    </div>
  `,
};

/* ── Vertical ── */
export const Vertical: Story = {
  name: 'Orientación vertical',
  render: (): TemplateResult => html`
    <div style="padding: 2rem; display: flex; gap: 3rem; align-items: flex-start; flex-wrap: wrap;">

      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.75rem;">outline · toggle vertical</p>
        <lib-button-group orientation="vertical" shape="rounded" toggle>
          <lib-button variant="secondary" active>Grid</lib-button>
          <lib-button variant="secondary">Lista</lib-button>
          <lib-button variant="secondary">Gráfico</lib-button>
        </lib-button-group>
      </div>

      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.75rem;">ghost · icon only</p>
        <lib-button-group orientation="vertical">
          <lib-button variant="ghost" icon-only aria-label="Negrita">B</lib-button>
          <lib-button variant="ghost" icon-only aria-label="Cursiva">I</lib-button>
          <lib-button variant="ghost" icon-only aria-label="Link">↗</lib-button>
          <lib-button variant="ghost" icon-only aria-label="Imagen">⬜</lib-button>
        </lib-button-group>
      </div>

      <div style="width: 180px;">
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.75rem;">kaki · block · menú lateral</p>
        <lib-button-group orientation="vertical" shape="rounded" toggle block>
          <lib-button variant="accent" active>Componentes</lib-button>
          <lib-button variant="accent">Tokens</lib-button>
          <lib-button variant="accent">Motion</lib-button>
          <lib-button variant="accent">Guía</lib-button>
        </lib-button-group>
      </div>

    </div>
  `,
};

/* ── Split ── */
export const Split: Story = {
  name: 'Split button',
  render: (): TemplateResult => html`
    <div style="padding: 2rem; display: flex; gap: 2rem; align-items: flex-start; flex-wrap: wrap; padding-bottom: 10rem;">

      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted);">primary</p>
        <lib-button-split
          variant="primary"
          label="Publicar"
          items='[{"label":"Publicar ahora","value":"now"},{"label":"Programar","value":"schedule"},{"label":"Guardar borrador","value":"draft"}]'
          @ui-lib-split-action="${(): void => console.log('acción principal')}"
          @ui-lib-split-select="${(e: CustomEvent): void => console.log('item', e.detail)}"
        ></lib-button-split>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted);">accent</p>
        <lib-button-split
          variant="accent"
          label="Exportar"
          items='[{"label":"PDF","value":"pdf"},{"label":"CSV","value":"csv"},{"label":"JSON","value":"json"},{"label":"Markdown","value":"md"}]'
          @ui-lib-split-select="${(e: CustomEvent): void => console.log('formato', e.detail)}"
        ></lib-button-split>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted);">secondary</p>
        <lib-button-split
          variant="secondary"
          label="Enviar"
          items='[{"label":"Enviar ahora","value":"now"},{"label":"Enviar con copia","value":"cc"},{"label":"Programar envío","value":"schedule"}]'
        ></lib-button-split>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted);">slot menu</p>
        <lib-button-split variant="primary" label="Acción">
          <button slot="menu">Opción A</button>
          <button slot="menu">Opción B</button>
          <button slot="menu" disabled>Opción C (off)</button>
        </lib-button-split>
      </div>

    </div>
  `,
};

/* ── Dark ── */
export const Dark: Story = {
  name: 'Surface dark',
  parameters: { backgrounds: { default: 'dark' } },
  render: (): TemplateResult => html`
    <div style="padding: 2rem; background: var(--color-washi-950); display: flex; flex-direction: column; gap: 2rem; align-items: flex-start;">

      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(250,247,244,0.2); margin-bottom: 0.75rem;">dark primary · toggle</p>
        <lib-button-group shape="rounded" toggle dark>
          <lib-button variant="primary" active>Sistema</lib-button>
          <lib-button variant="primary">Monitor</lib-button>
          <lib-button variant="primary">Señal</lib-button>
        </lib-button-group>
      </div>

      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(250,247,244,0.2); margin-bottom: 0.75rem;">dark ghost · toggle</p>
        <lib-button-group toggle dark>
          <lib-button variant="ghost" active>Grid</lib-button>
          <lib-button variant="ghost">Lista</lib-button>
          <lib-button variant="ghost">Chart</lib-button>
        </lib-button-group>
      </div>

      <div>
        <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(250,247,244,0.2); margin-bottom: 0.75rem;">kaki · kintsugi · sobre dark</p>
        <lib-button-group shape="rounded" toggle kintsugi>
          <lib-button variant="accent" active>1d</lib-button>
          <lib-button variant="accent">7d</lib-button>
          <lib-button variant="accent">30d</lib-button>
          <lib-button variant="accent">1a</lib-button>
        </lib-button-group>
      </div>

      <div style="display: flex; gap: 2rem; align-items: flex-start;">
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(250,247,244,0.2);">dark ghost vertical icon</p>
          <lib-button-group orientation="vertical" toggle dark>
            <lib-button variant="ghost" icon-only active aria-label="Grid">▦</lib-button>
            <lib-button variant="ghost" icon-only aria-label="Lista">☰</lib-button>
            <lib-button variant="ghost" icon-only aria-label="Chart">↗</lib-button>
          </lib-button-group>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(250,247,244,0.2);">split dark</p>
          <lib-button-split
            variant="accent"
            dark
            label="Exportar"
            items='[{"label":"CSV","value":"csv"},{"label":"JSON","value":"json"},{"label":"PDF","value":"pdf"}]'
          ></lib-button-split>
        </div>
      </div>

    </div>
  `,
};

/* ── Demo en contexto ── */
export const InContext: Story = {
  name: 'Demo — Toolbar editor',
  render: (): TemplateResult => html`
    <div style="border: 1px solid var(--border-subtle);">

      <!-- Toolbar light -->
      <div style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem 1rem;background:var(--bg-surface);border-bottom:1px solid var(--border-subtle);">
        <div style="display:flex;align-items:center;gap:1rem;">
          <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:var(--text-muted);">Editor</span>
          <lib-button-group toggle size="sm">
            <lib-button variant="ghost" active>Grid</lib-button>
            <lib-button variant="ghost">Lista</lib-button>
          </lib-button-group>
        </div>
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <lib-button-group shape="rounded" toggle multi size="sm">
            <lib-button variant="secondary" active icon-only aria-label="Bold">B</lib-button>
            <lib-button variant="secondary" icon-only aria-label="Italic">I</lib-button>
            <lib-button variant="secondary" icon-only aria-label="Link">↗</lib-button>
          </lib-button-group>
          <lib-button-split variant="accent" size="sm" label="Publicar"
            items='[{"label":"Publicar ahora","value":"now"},{"label":"Programar","value":"schedule"},{"label":"Guardar borrador","value":"draft"}]'>
          </lib-button-split>
        </div>
      </div>

      <div style="height:120px;display:flex;align-items:center;justify-content:center;font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:var(--text-muted);">
        Contenido del editor
      </div>

    </div>
  `,
};