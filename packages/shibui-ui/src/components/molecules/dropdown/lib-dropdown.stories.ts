import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-dropdown.component';

const meta: Meta = {
  title: 'Components/Navigation/Dropdown',
  tags:['autodocs'],
  component: 'lib-dropdown',
  argTypes: {
    variant: { control: 'select', options: ['default', 'ghost', 'filled', 'kaki'] },
    align:   { control: 'select', options: ['left', 'right'] },
    open:    { control: 'boolean' },
    dark:    { control: 'boolean' },
    label:   { control: 'text' },
  },
};
export default meta;
type Story = StoryObj;

/* ── helpers ── */
const sep  = (): TemplateResult => html`<div class="dd-sep"></div>`;
const grp  = (t: string): TemplateResult => html`<div class="dd-group-label">${t}</div>`;

/* inline SVGs para no depender de Phosphor en Storybook */
const iconPencil   = `<svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152a15.86,15.86,0,0,0-4.69,11.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63Z"/></svg>`;
const iconCopy     = `<svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32Z"/></svg>`;
const iconTrash    = `<svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16Z"/></svg>`;
const iconGear     = `<svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40q-2.16-.06-4.32,0L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84q-.06,2.16,0,4.32L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Z"/></svg>`;
const iconSignOut  = `<svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M120,216a8,8,0,0,1-8,8H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h64a8,8,0,0,1,0,16H48V208h64A8,8,0,0,1,120,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L204.69,120H112a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,229.66,122.34Z"/></svg>`;
const iconCheck    = `<svg width="12" height="12" viewBox="0 0 256 256" fill="currentColor"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/></svg>`;

const item = (label: string, opts: {
  icon?: string; hint?: string; active?: boolean;
  danger?: boolean; disabled?: boolean; check?: boolean;
} = {}): TemplateResult => html`
  <button class="dd-item ${opts.active ? 'is-active' : ''} ${opts.danger ? 'is-danger' : ''} ${opts.disabled ? 'is-disabled' : ''}">
    ${opts.icon ? html`<span class="dd-item-icon" .innerHTML="${opts.icon}"></span>` : ''}
    ${label}
    ${opts.hint ? html`<span class="dd-item-hint">${opts.hint}</span>` : ''}
    ${opts.check || opts.active ? html`<span class="dd-item-check" .innerHTML="${iconCheck}"></span>` : ''}
  </button>`;

/* ── Playground ── */
export const Playground: Story = {
  args: { label: 'Opciones', variant: 'default', align: 'left', open: false, dark: false },
  render: (args): TemplateResult => html`
    <div style="padding:4rem;min-height:280px;">
      <lib-dropdown
        label="${args.label}"
        variant="${args.variant}"
        align="${args.align}"
        ?open="${args.open}"
        ?dark="${args.dark}"
        @ui-lib-dropdown-toggle="${(e: CustomEvent): void => console.log(e.detail)}"
      >
        ${item('Ver perfil')}
        ${item('Configuración')}
        ${item('Notificaciones')}
        ${sep()}
        ${item('Cerrar sesión', { danger: true })}
      </lib-dropdown>
    </div>
  `,
};

/* ── Base ── */
export const Base: Story = {
  name: 'Base — items simples',
  render: (): TemplateResult => html`
    <div style="padding:2rem;min-height:320px;display:flex;gap:3rem;align-items:flex-start;background:var(--bg-surface);">

      <!-- Simple -->
      <lib-dropdown label="Opciones">
        ${item('Ver perfil')}
        ${item('Configuración')}
        ${item('Notificaciones')}
        ${sep()}
        ${item('Cerrar sesión', { danger: true })}
      </lib-dropdown>

      <!-- Con iconos y shortcuts -->
      <lib-dropdown label="Archivo">
        ${item('Nuevo archivo',  { icon: iconPencil, hint: '⌘N' })}
        ${item('Abrir',          { icon: iconCopy,   hint: '⌘O' })}
        ${item('Guardar',        { icon: iconGear,   hint: '⌘S', active: true })}
        ${sep()}
        ${item('Exportar PDF',   { icon: iconCopy, disabled: true })}
        ${sep()}
        ${item('Eliminar',       { icon: iconTrash, danger: true, hint: '⌫' })}
      </lib-dropdown>

    </div>
  `,
};

/* ── Triggers ── */
export const Triggers: Story = {
  name: 'Triggers — default · ghost · filled · kaki',
  render: (): TemplateResult => html`
    <div style="padding:2rem;min-height:280px;display:flex;gap:1.5rem;align-items:flex-start;flex-wrap:wrap;background:var(--bg-surface);">

      <lib-dropdown label="Default" variant="default">
        ${item('Editar',    { icon: iconPencil })}
        ${item('Duplicar',  { icon: iconCopy })}
        ${sep()}
        ${item('Eliminar',  { icon: iconTrash, danger: true })}
      </lib-dropdown>

      <lib-dropdown label="Ghost" variant="ghost">
        ${item('Editar',    { icon: iconPencil })}
        ${item('Duplicar',  { icon: iconCopy })}
        ${sep()}
        ${item('Eliminar',  { icon: iconTrash, danger: true })}
      </lib-dropdown>

      <lib-dropdown label="Filled" variant="filled">
        ${item('Editar',    { icon: iconPencil })}
        ${item('Duplicar',  { icon: iconCopy })}
        ${sep()}
        ${item('Eliminar',  { icon: iconTrash, danger: true })}
      </lib-dropdown>

      <lib-dropdown label="Kaki" variant="kaki">
        ${item('Editar',    { icon: iconPencil })}
        ${item('Duplicar',  { icon: iconCopy })}
        ${sep()}
        ${item('Eliminar',  { icon: iconTrash, danger: true })}
      </lib-dropdown>

      <!-- Icon-only trigger -->
      <lib-dropdown align="right" min-width="180px">
        <span slot="trigger" style="display:flex;align-items:center;">
          <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
            <circle cx="128" cy="128" r="16"/><circle cx="64" cy="128" r="16"/><circle cx="192" cy="128" r="16"/>
          </svg>
        </span>
        ${item('Editar',        { icon: iconPencil })}
        ${item('Duplicar',      { icon: iconCopy })}
        ${sep()}
        ${item('Eliminar',      { icon: iconTrash, danger: true })}
      </lib-dropdown>

    </div>
  `,
};

/* ── Items enriquecidos con descripción ── */
export const RichItems: Story = {
  name: 'Items con descripción de dos líneas',
  render: (): TemplateResult => html`
    <div style="padding:2rem;min-height:360px;background:var(--bg-surface);">
      <lib-dropdown label="Nuevo elemento" min-width="280px">

        ${grp('Crear')}

        <button class="dd-item" style="align-items:flex-start;">
          <span class="dd-item-icon" style="margin-top:2px;" .innerHTML="${iconPencil}"></span>
          <div class="dd-item-body">
            <span class="dd-item-label">Documento</span>
            <span class="dd-item-desc">Página de texto con formato libre</span>
          </div>
        </button>

        <button class="dd-item" style="align-items:flex-start;">
          <span class="dd-item-icon" style="margin-top:2px;" .innerHTML="${iconCopy}"></span>
          <div class="dd-item-body">
            <span class="dd-item-label">Hoja de datos</span>
            <span class="dd-item-desc">Tabla estructurada con columnas y filas</span>
          </div>
        </button>

        <button class="dd-item" style="align-items:flex-start;">
          <span class="dd-item-icon" style="margin-top:2px;" .innerHTML="${iconGear}"></span>
          <div class="dd-item-body">
            <span class="dd-item-label">Componente</span>
            <span class="dd-item-desc">Elemento reutilizable del sistema de diseño</span>
          </div>
        </button>

        ${sep()}
        ${grp('Importar')}

        <button class="dd-item" style="align-items:flex-start;">
          <span class="dd-item-icon" style="margin-top:2px;" .innerHTML="${iconCopy}"></span>
          <div class="dd-item-body">
            <span class="dd-item-label">Desde archivo</span>
            <span class="dd-item-desc">PDF, Figma, Sketch o SVG</span>
          </div>
        </button>

      </lib-dropdown>
    </div>
  `,
};

/* ── Dark ── */
export const Dark: Story = {
  name: 'Dark — menú oscuro',
  parameters: { backgrounds: { default: 'dark' } },
  render: (): TemplateResult => html`
    <div style="padding:2rem;min-height:320px;display:flex;gap:3rem;
      align-items:flex-start;background:var(--color-washi-900);">

      <lib-dropdown label="Mi cuenta" variant="filled" dark min-width="200px">
        ${grp('Sesión')}
        ${item('Perfil',        { icon: iconGear })}
        ${item('Ajustes',       { icon: iconGear, hint: '⌘,' })}
        ${item('Tema oscuro',   { icon: iconGear, active: true })}
        ${sep()}
        ${item('Cerrar sesión', { icon: iconSignOut, danger: true })}
      </lib-dropdown>

      <!-- Icon-only + dark + right -->
      <lib-dropdown variant="ghost" align="right" dark min-width="180px">
        <span slot="trigger" style="display:flex;align-items:center;color:var(--color-washi-500);">
          <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
            <circle cx="128" cy="128" r="16"/><circle cx="64" cy="128" r="16"/><circle cx="192" cy="128" r="16"/>
          </svg>
        </span>
        ${item('Renombrar',  { icon: iconPencil })}
        ${item('Duplicar',   { icon: iconCopy })}
        ${sep()}
        ${item('Eliminar',   { icon: iconTrash, danger: true })}
      </lib-dropdown>

    </div>
  `,
};

/* ── Grupos y separadores ── */
export const Groups: Story = {
  name: 'Grupos y separadores',
  render: (): TemplateResult => html`
    <div style="padding:2rem;min-height:320px;background:var(--bg-surface);">
      <lib-dropdown label="Diseño" min-width="200px">

        ${grp('Componentes')}
        ${item('Galería',  { icon: iconGear })}
        ${item('Tokens',   { icon: iconGear })}
        ${sep()}
        ${grp('Variantes')}
        ${item('Kintsugi', { icon: iconGear })}
        ${item('Glitch',   { icon: iconGear })}
        ${sep()}
        ${item('Exportar', { icon: iconCopy, hint: '⌘E' })}

      </lib-dropdown>
    </div>
  `,
};

/* ── Alineación derecha ── */
export const AlignRight: Story = {
  name: 'Alineación right — al borde del layout',
  render: (): TemplateResult => html`
    <div style="padding:2rem;min-height:280px;display:flex;justify-content:flex-end;background:var(--bg-surface);">
      <lib-dropdown label="Más acciones" align="right" min-width="180px">
        ${item('Editar',    { icon: iconPencil })}
        ${item('Duplicar',  { icon: iconCopy })}
        ${item('Compartir', { icon: iconCopy })}
        ${sep()}
        ${item('Eliminar',  { icon: iconTrash, danger: true })}
      </lib-dropdown>
    </div>
  `,
};

/* ── En contexto: tabla con menú por fila ── */
export const InTableRow: Story = {
  name: 'Contexto — acciones por fila de tabla',
  render: (): TemplateResult => html`
    <div style="padding:2rem;background:var(--bg-elevated);">
      <table style="width:100%;border-collapse:collapse;font-family:var(--lib-font-mono);font-size:var(--text-xs);">
        <thead>
          <tr style="border-bottom:1px solid var(--border-subtle);">
            <th style="text-align:left;padding:.5rem 1rem;color:var(--text-muted);letter-spacing:.15em;text-transform:uppercase;font-weight:400;">Componente</th>
            <th style="text-align:left;padding:.5rem 1rem;color:var(--text-muted);letter-spacing:.15em;text-transform:uppercase;font-weight:400;">Categoría</th>
            <th style="text-align:left;padding:.5rem 1rem;color:var(--text-muted);letter-spacing:.15em;text-transform:uppercase;font-weight:400;">Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${['lib-button','lib-dropdown','lib-tabs'].map(name => html`
            <tr style="border-bottom:1px solid var(--border-subtle);">
              <td style="padding:.75rem 1rem;color:var(--text-primary);">${name}</td>
              <td style="padding:.75rem 1rem;color:var(--text-secondary);">Atom</td>
              <td style="padding:.75rem 1rem;color:var(--color-celadon-500);">Stable</td>
              <td style="padding:.75rem 1rem;text-align:right;">
                <lib-dropdown align="right" variant="ghost" min-width="160px">
                  <span slot="trigger" style="display:flex;align-items:center;">
                    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
                      <circle cx="128" cy="128" r="16"/><circle cx="64" cy="128" r="16"/><circle cx="192" cy="128" r="16"/>
                    </svg>
                  </span>
                  ${item('Editar',   { icon: iconPencil })}
                  ${item('Duplicar', { icon: iconCopy })}
                  ${sep()}
                  ${item('Eliminar', { icon: iconTrash, danger: true })}
                </lib-dropdown>
              </td>
            </tr>
          `)}
        </tbody>
      </table>
    </div>
  `,
};