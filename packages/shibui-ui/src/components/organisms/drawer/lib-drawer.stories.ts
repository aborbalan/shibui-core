import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-drawer.component';
import type { LibDrawer } from './lib-drawer.component';

/** Obtiene un lib-drawer por selector y lo devuelve tipado */
function getDrawer(selector: string): LibDrawer {
  return document.querySelector(selector) as LibDrawer;
}

const meta: Meta = {
  title: 'Components/Overlay/Drawer',
  tags:['autodocs'],
  component: 'lib-drawer',
  argTypes: {
    open:      { control: 'boolean' },
    placement: { control: 'select', options: ['right', 'left', 'top', 'bottom'] },
    size:      { control: 'select', options: ['sm', 'md', 'lg', 'xl', 'full'] },
    variant:   { control: 'select', options: ['default', 'dark', 'kintsugi', 'kintsugi-dark', 'glitch', 'glitch-dark'] },
    label:     { control: 'text' },
    eyebrow:   { control: 'text' },
    subtitle:  { control: 'text' },
  },
};
export default meta;
type Story = StoryObj;

/* ──────────────────────────────────────────────
   Helper — botón de apertura uniforme
   ────────────────────────────────────────────── */
function launchBtn(label: string, onClick: () => void, accent = false): TemplateResult {
  return html`
    <button
      @click="${onClick}"
      style="
        display:inline-flex; align-items:center; gap:6px;
        font-family:var(--lib-font-mono); font-size:var(--text-xs);
        letter-spacing:.14em; text-transform:uppercase;
        border:1px solid ${accent ? 'var(--color-kaki-500)' : 'var(--border-default)'};
        background:${accent ? 'var(--color-kaki-500)' : 'var(--bg-elevated)'};
        color:${accent ? '#fff' : 'var(--text-secondary)'};
        padding:0 var(--lib-space-md); height:36px; cursor:pointer;
        transition:all var(--duration-base) var(--ease-out);
      "
    >${label}</button>
  `;
}

/* ──────────────────────────────────────────────
   Playground
   ────────────────────────────────────────────── */
export const Playground: Story = {
  args: {
    open: false,
    placement: 'right',
    size: 'md',
    variant: 'default',
    label: 'Panel lateral',
    eyebrow: 'Shibui DS',
    subtitle: '',
  },
  render: (args): TemplateResult => html`
    <div style="padding:3rem; background:var(--bg-surface); min-height:300px;
      display:flex; align-items:center; justify-content:center;">
      ${launchBtn('Abrir drawer', () => {
        getDrawer('#dr-playground').open = true;
      }, true)}
    </div>

    <lib-drawer
      id="dr-playground"
      placement="${args.placement}"
      size="${args.size}"
      variant="${args.variant}"
      label="${args.label}"
      eyebrow="${args.eyebrow}"
      subtitle="${args.subtitle}"
      ?open="${args.open}"
      @ui-lib-drawer-close="${(): void => {
        getDrawer('#dr-playground').open = false;
      }}"
    >
      <div style="display:flex;flex-direction:column;gap:var(--lib-space-md);">
        <p style="font-family:var(--lib-font-body);font-size:var(--text-sm);
          color:var(--text-secondary);line-height:1.7;">
          Este es el contenido del body del drawer. Puede contener cualquier elemento
          — formularios, listas de navegación, filtros, acciones rápidas.
        </p>
        <p style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
          color:var(--text-muted);letter-spacing:.06em;">
          Pulsa <kbd>Escape</kbd> o haz clic en el backdrop para cerrar.
        </p>
      </div>
      <div slot="footer" style="display:flex;gap:var(--lib-space-sm);width:100%;justify-content:flex-end;">
        <button style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
          letter-spacing:.12em;text-transform:uppercase;border:1px solid var(--border-default);
          background:none;color:var(--text-secondary);padding:0 var(--lib-space-md);height:32px;cursor:pointer;"
          @click="${(): void => { getDrawer('#dr-playground').open = false; }}"
        >Cancelar</button>
        <button style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
          letter-spacing:.12em;text-transform:uppercase;border:none;
          background:var(--color-washi-900);color:var(--color-washi-50);
          padding:0 var(--lib-space-md);height:32px;cursor:pointer;"
          @click="${(): void => { getDrawer('#dr-playground').open = false; }}"
        >Confirmar</button>
      </div>
    </lib-drawer>
  `,
};

/* ──────────────────────────────────────────────
   Placements — Right · Left · Top · Bottom
   ────────────────────────────────────────────── */
export const Placements: Story = {
  name: 'Placements — right · left · top · bottom',
  render: (): TemplateResult => html`
    <div style="padding:3rem; background:var(--bg-surface); min-height:300px;
      display:flex; align-items:center; justify-content:center; gap:var(--lib-space-md); flex-wrap:wrap;">
      ${(['right','left','top','bottom'] as const).map(p => html`
        ${launchBtn(`→ ${p}`, () => {
          getDrawer(`#dr-place-${p}`).open = true;
        })}
        <lib-drawer id="dr-place-${p}" placement="${p}" label="${p}" eyebrow="Placement"
          @ui-lib-drawer-close="${(): void => { getDrawer(`#dr-place-${p}`).open = false; }}">
          <p style="font-family:var(--lib-font-body);font-size:var(--text-sm);color:var(--text-secondary);line-height:1.7;">
            Drawer placement: <strong>${p}</strong>
          </p>
        </lib-drawer>
      `)}
    </div>
  `,
};

/* ──────────────────────────────────────────────
   Sizes
   ────────────────────────────────────────────── */
export const Sizes: Story = {
  name: 'Sizes — sm · md · lg · xl · full',
  render: (): TemplateResult => html`
    <div style="padding:3rem; background:var(--bg-surface); min-height:300px;
      display:flex; align-items:center; justify-content:center; gap:var(--lib-space-md); flex-wrap:wrap;">
      ${(['sm','md','lg','xl','full'] as const).map(s => html`
        ${launchBtn(s, () => { getDrawer(`#dr-size-${s}`).open = true; })}
        <lib-drawer id="dr-size-${s}" size="${s}" label="Size ${s}" eyebrow="Drawer size"
          @ui-lib-drawer-close="${(): void => { getDrawer(`#dr-size-${s}`).open = false; }}">
          <p style="font-family:var(--lib-font-body);font-size:var(--text-sm);color:var(--text-secondary);">
            Width/height controlado por el token de tamaño <code>size="${s}"</code>.
          </p>
        </lib-drawer>
      `)}
    </div>
  `,
};

/* ──────────────────────────────────────────────
   Nav drawer — contenido de navegación (SG ejemplo 1)
   ────────────────────────────────────────────── */
export const NavDrawer: Story = {
  name: 'Nav drawer — navegación del DS',
  render: (): TemplateResult => html`
    <div style="padding:3rem; background:var(--bg-surface); min-height:300px;
      display:flex; align-items:center; justify-content:center;">
      ${launchBtn('Abrir navegación', () => {
        getDrawer('#dr-nav').open = true;
      })}
    </div>

    <lib-drawer id="dr-nav" placement="right" label="Navegación" eyebrow="Design System"
      @ui-lib-drawer-close="${(): void => { getDrawer('#dr-nav').open = false; }}">

      <!-- Sección componentes -->
      <div style="margin-bottom:var(--lib-space-lg);padding-bottom:var(--lib-space-lg);border-bottom:1px solid var(--color-washi-100);">
        <div style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.2em;
          text-transform:uppercase;color:var(--text-muted);margin-bottom:var(--lib-space-md);">Componentes</div>
        <ul style="list-style:none;">
          ${[
            { icon: '⊞', label: 'Dashboard',  active: true },
            { icon: '□', label: 'Botones',     active: false },
            { icon: '▭', label: 'Inputs',      active: false },
            { icon: '✦', label: 'Tokens',      active: false },
            { icon: '∿', label: 'Charts',      active: false },
            { icon: '◎', label: 'Motion',      active: false },
          ].map(item => html`
            <li>
              <a href="#" style="
                display:flex; align-items:center; gap:var(--lib-space-sm);
                padding:var(--lib-space-sm) var(--lib-space-md);
                font-family:var(--lib-font-mono); font-size:var(--text-xs);
                letter-spacing:.12em; text-transform:uppercase; text-decoration:none;
                border-left:2px solid ${item.active ? 'var(--color-kaki-500)' : 'transparent'};
                background:${item.active ? 'var(--color-kaki-50)' : 'none'};
                color:${item.active ? 'var(--color-kaki-500)' : 'var(--text-muted)'};
                transition:all var(--duration-base);
              ">${item.icon} ${item.label}</a>
            </li>
          `)}
        </ul>
      </div>

      <!-- Sección utilidades -->
      <div>
        <div style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.2em;
          text-transform:uppercase;color:var(--text-muted);margin-bottom:var(--lib-space-md);">Utilidades</div>
        <ul style="list-style:none;">
          ${[
            { icon: 'ⓘ', label: 'Guía' },
            { icon: '◈', label: 'Changelog' },
          ].map(item => html`
            <li>
              <a href="#" style="
                display:flex; align-items:center; gap:var(--lib-space-sm);
                padding:var(--lib-space-sm) var(--lib-space-md);
                font-family:var(--lib-font-mono); font-size:var(--text-xs);
                letter-spacing:.12em; text-transform:uppercase; text-decoration:none;
                border-left:2px solid transparent; color:var(--text-muted);
                transition:all var(--duration-base);
              ">${item.icon} ${item.label}</a>
            </li>
          `)}
        </ul>
      </div>

      <div slot="footer" style="width:100%;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.16em;
          color:var(--text-muted);text-transform:uppercase;">shibui v0.1.0</span>
        <button style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
          letter-spacing:.12em;text-transform:uppercase;border:none;
          background:none;color:var(--text-secondary);cursor:pointer;padding:0 var(--lib-space-sm);"
          @click="${(): void => { getDrawer('#dr-nav').open = false; }}"
        >Cerrar</button>
      </div>
    </lib-drawer>
  `,
};

/* ──────────────────────────────────────────────
   Form drawer — lg size (SG ejemplo 2)
   ────────────────────────────────────────────── */
export const FormDrawer: Story = {
  name: 'Form drawer — añadir proyecto',
  render: (): TemplateResult => html`
    <div style="padding:3rem; background:var(--bg-surface); min-height:300px;
      display:flex; align-items:center; justify-content:center;">
      ${launchBtn('Nuevo proyecto', () => {
        getDrawer('#dr-form').open = true;
      }, true)}
    </div>

    <lib-drawer id="dr-form" placement="right" size="lg"
      label="Añadir proyecto" eyebrow="Nuevo registro"
      subtitle="Completa los campos para crear un nuevo proyecto en el sistema."
      @ui-lib-drawer-close="${(): void => { getDrawer('#dr-form').open = false; }}">

      <div style="display:flex;flex-direction:column;gap:var(--lib-space-lg);">

        <!-- Sección info básica -->
        <div style="padding-bottom:var(--lib-space-lg);border-bottom:1px solid var(--color-washi-100);">
          <div style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.2em;
            text-transform:uppercase;color:var(--text-muted);margin-bottom:var(--lib-space-md);">Información básica</div>
          ${[
            { label: 'Nombre del proyecto', type: 'text',  placeholder: 'Mi proyecto...' },
            { label: 'URL del repositorio', type: 'url',   placeholder: 'https://github.com/...' },
          ].map(f => html`
            <div style="margin-bottom:var(--lib-space-md);">
              <label style="display:block;font-family:var(--lib-font-mono);font-size:9px;
                letter-spacing:.14em;text-transform:uppercase;color:var(--text-secondary);
                margin-bottom:var(--lib-space-xs);">${f.label}</label>
              <input type="${f.type}" placeholder="${f.placeholder}" style="
                width:100%; font-family:var(--lib-font-body); font-size:var(--text-sm);
                color:var(--text-primary); background:var(--bg-base);
                border:1px solid var(--border-subtle); padding:var(--lib-space-xs) var(--lib-space-sm);
                outline:none; transition:border-color var(--duration-base);
              ">
            </div>
          `)}
          <div>
            <label style="display:block;font-family:var(--lib-font-mono);font-size:9px;
              letter-spacing:.14em;text-transform:uppercase;color:var(--text-secondary);
              margin-bottom:var(--lib-space-xs);">Descripción</label>
            <textarea placeholder="Describe el proyecto..." style="
              width:100%; min-height:80px; resize:vertical;
              font-family:var(--lib-font-body); font-size:var(--text-sm);
              color:var(--text-primary); background:var(--bg-base);
              border:1px solid var(--border-subtle); padding:var(--lib-space-xs) var(--lib-space-sm);
              outline:none;
            "></textarea>
          </div>
        </div>

        <!-- Sección configuración -->
        <div>
          <div style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.2em;
            text-transform:uppercase;color:var(--text-muted);margin-bottom:var(--lib-space-md);">Configuración</div>
          ${[
            { label: 'Stack tecnológico',      opts: ['Angular + RxJS','React + TypeScript','Astro.js','Vue 3'] },
            { label: 'Entorno de despliegue',  opts: ['Producción','Staging','Preview'] },
          ].map(f => html`
            <div style="margin-bottom:var(--lib-space-md);">
              <label style="display:block;font-family:var(--lib-font-mono);font-size:9px;
                letter-spacing:.14em;text-transform:uppercase;color:var(--text-secondary);
                margin-bottom:var(--lib-space-xs);">${f.label}</label>
              <select style="
                width:100%; font-family:var(--lib-font-body); font-size:var(--text-sm);
                color:var(--text-primary); background:var(--bg-base);
                border:1px solid var(--border-subtle); padding:var(--lib-space-xs) var(--lib-space-sm);
                outline:none; height:36px;
              ">${f.opts.map(o => html`<option>${o}</option>`)}</select>
            </div>
          `)}
        </div>
      </div>

      <div slot="footer" style="display:flex;gap:var(--lib-space-sm);">
        <button style="font-family:var(--lib-font-mono);font-size:var(--text-xs);letter-spacing:.12em;
          text-transform:uppercase;border:1px solid var(--border-default);background:none;
          color:var(--text-secondary);padding:0 var(--lib-space-md);height:32px;cursor:pointer;"
          @click="${(): void => { getDrawer('#dr-form').open = false; }}"
        >Cancelar</button>
        <button style="font-family:var(--lib-font-mono);font-size:var(--text-xs);letter-spacing:.12em;
          text-transform:uppercase;border:none;background:var(--color-kaki-500);
          color:#fff;padding:0 var(--lib-space-md);height:32px;cursor:pointer;"
          @click="${(): void => { getDrawer('#dr-form').open = false; }}"
        >Crear proyecto</button>
      </div>
    </lib-drawer>
  `,
};

/* ──────────────────────────────────────────────
   Bottom sheet (SG ejemplo 4)
   ────────────────────────────────────────────── */
export const BottomSheet: Story = {
  name: 'Bottom sheet — acciones rápidas',
  render: (): TemplateResult => html`
    <div style="padding:3rem; background:var(--bg-surface); min-height:300px;
      display:flex; align-items:center; justify-content:center;">
      ${launchBtn('Abrir acciones', () => {
        getDrawer('#dr-bottom').open = true;
      })}
    </div>

    <lib-drawer id="dr-bottom" placement="bottom" label="¿Qué deseas hacer?" eyebrow="Acciones"
      @ui-lib-drawer-close="${(): void => { getDrawer('#dr-bottom').open = false; }}">
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--lib-space-md);">
        ${[
          { icon: '＋', label: 'Nuevo',     color: 'var(--color-kaki-500)' },
          { icon: '↑',  label: 'Exportar',  color: 'var(--text-secondary)' },
          { icon: '⊃',  label: 'Compartir', color: 'var(--text-secondary)' },
          { icon: '␡',  label: 'Eliminar',  color: 'var(--color-error)' },
        ].map(a => html`
          <button style="
            display:flex; flex-direction:column; align-items:center; gap:var(--lib-space-sm);
            padding:var(--lib-space-md); border:1px solid var(--border-subtle);
            background:var(--bg-elevated); cursor:pointer;
            transition:border-color var(--duration-base), background var(--duration-base);
          "
            @click="${(): void => { getDrawer('#dr-bottom').open = false; }}"
          >
            <span style="font-size:1.25rem;color:${a.color};">${a.icon}</span>
            <span style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.12em;
              text-transform:uppercase;color:var(--text-muted);">${a.label}</span>
          </button>
        `)}
      </div>
    </lib-drawer>
  `,
};

/* ──────────────────────────────────────────────
   Variantes
   ────────────────────────────────────────────── */
export const Variants: Story = {
  name: 'Variantes — dark · kintsugi · glitch',
  render: (): TemplateResult => html`
    <div style="padding:3rem; background:var(--bg-surface); min-height:300px;
      display:flex; align-items:center; justify-content:center; gap:var(--lib-space-md); flex-wrap:wrap;">

      ${([
        { id: 'default',      label: 'Default',        eyebrow: 'Variant', accent: false },
        { id: 'dark',         label: 'Dark',           eyebrow: 'Variant', accent: false },
        { id: 'kintsugi',     label: 'Kintsugi',       eyebrow: '金継ぎ',   accent: true  },
        { id: 'kintsugi-dark',label: 'Kintsugi Dark',  eyebrow: '金継ぎ',   accent: true  },
        { id: 'glitch',       label: 'Glitch',         eyebrow: 'Variant', accent: false },
        { id: 'glitch-dark',  label: 'Glitch Dark',    eyebrow: 'Variant', accent: false },
      ] as const).map(v => html`
        ${launchBtn(v.label, () => {
          getDrawer(`#dr-v-${v.id}`).open = true;
        }, v.accent)}
        <lib-drawer
          id="dr-v-${v.id}"
          variant="${v.id}"
          label="${v.label}"
          eyebrow="${v.eyebrow}"
          @ui-lib-drawer-close="${(): void => { getDrawer(`#dr-v-${v.id}`).open = false; }}"
        >
          <p style="font-family:var(--lib-font-body);font-size:var(--text-sm);line-height:1.7;opacity:.7;">
            Variante <strong>${v.label}</strong>. Los tokens de color, bordes y animaciones
            se aplican automáticamente según el atributo <code>variant</code>.
          </p>
        </lib-drawer>
      `)}

    </div>
  `,
};