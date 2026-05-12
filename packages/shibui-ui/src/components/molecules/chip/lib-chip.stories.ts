import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-chip.component';

const meta: Meta = {
  title: 'Components/Atoms/Chip',
  tags:['autodocs'],
  component: 'lib-chip',
  argTypes: {
    kind:     { control: 'select', options: ['static', 'toggle', 'input'] },
    size:     { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    color:    { control: 'select', options: ['default', 'kaki', 'celadon', 'error', 'info', 'dark'] },
    selected: { control: 'boolean' },
    dot:      { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj;

/* ── helper group container ── */
const group = (children: TemplateResult): TemplateResult => html`
  <div style="display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;">${children}</div>`;

/* ── Playground ── */
export const Playground: Story = {
  args: { kind: 'static', size: 'md', color: 'default', selected: false, dot: false },
  render: (args): TemplateResult => html`
    <div style="padding:3rem;">
      <lib-chip
        kind="${args.kind}"
        size="${args.size}"
        color="${args.color}"
        ?selected="${args.selected}"
        ?dot="${args.dot}"
        @ui-lib-chip-toggle="${(e: CustomEvent): void => console.log('toggle', e.detail)}"
        @ui-lib-chip-remove="${(): void => console.log('remove')}"
      >Design System</lib-chip>
    </div>
  `,
};

/* ── Las tres familias ── */
export const Families: Story = {
  name: 'Familias — static · toggle · input',
  render: (): TemplateResult => html`
    <div style="padding:2rem;display:flex;flex-direction:column;gap:2rem;">

      <div>
        <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.25em;
          text-transform:uppercase;color:var(--text-muted);margin-bottom:.75rem;">
          Static — read-only, taxonomía
        </p>
        ${group(html`
          <lib-chip>Design</lib-chip>
          <lib-chip>Architecture</lib-chip>
          <lib-chip>Development</lib-chip>
          <lib-chip>Strategy</lib-chip>
        `)}
      </div>

      <div>
        <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.25em;
          text-transform:uppercase;color:var(--text-muted);margin-bottom:.75rem;">
          Toggle — filtro, multi-select (click para seleccionar)
        </p>
        ${group(html`
          <lib-chip kind="toggle" selected>Frontend</lib-chip>
          <lib-chip kind="toggle">Backend</lib-chip>
          <lib-chip kind="toggle" selected>Design</lib-chip>
          <lib-chip kind="toggle">DevOps</lib-chip>
          <lib-chip kind="toggle">Data</lib-chip>
        `)}
      </div>

      <div>
        <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.25em;
          text-transform:uppercase;color:var(--text-muted);margin-bottom:.75rem;">
          Input — removible con botón ×
        </p>
        ${group(html`
          <lib-chip kind="input"
            @ui-lib-chip-remove="${(e: Event): void => (e.target as HTMLElement).remove()}">
            shibui.css
          </lib-chip>
          <lib-chip kind="input"
            @ui-lib-chip-remove="${(e: Event): void => (e.target as HTMLElement).remove()}">
            tokens.json
          </lib-chip>
          <lib-chip kind="input"
            @ui-lib-chip-remove="${(e: Event): void => (e.target as HTMLElement).remove()}">
            index.ts
          </lib-chip>
        `)}
      </div>

    </div>
  `,
};

/* ── Tamaños ── */
export const Sizes: Story = {
  name: 'Tamaños — xs · sm · md · lg',
  render: (): TemplateResult => html`
    <div style="padding:2rem;display:flex;flex-direction:column;gap:2rem;">

      ${(['xs','sm','md','lg'] as const).map(sz => html`
        <div>
          <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.25em;
            text-transform:uppercase;color:var(--text-muted);margin-bottom:.75rem;">${sz}</p>
          ${group(html`
            <lib-chip size="${sz}">Static</lib-chip>
            <lib-chip kind="toggle" size="${sz}" selected>Toggle</lib-chip>
            <lib-chip kind="input"  size="${sz}">Input</lib-chip>
          `)}
        </div>
      `)}

    </div>
  `,
};

/* ── Colores ── */
export const Colors: Story = {
  name: 'Colores — todos los tokens',
  render: (): TemplateResult => html`
    <div style="padding:2rem;display:flex;flex-direction:column;gap:1.5rem;">

      ${(['default','kaki','celadon','error','info'] as const).map(c => html`
        <div style="display:flex;align-items:center;gap:1rem;">
          <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.25em;
            text-transform:uppercase;color:var(--text-muted);width:72px;flex-shrink:0;">${c}</span>
          ${group(html`
            <lib-chip color="${c}">Static</lib-chip>
            <lib-chip kind="toggle" color="${c}">Toggle</lib-chip>
            <lib-chip kind="toggle" color="${c}" selected>Selected</lib-chip>
            <lib-chip kind="input"  color="${c}">Input</lib-chip>
          `)}
        </div>
      `)}

      <!-- Dark — sobre fondo oscuro -->
      <div style="background:var(--color-washi-950);padding:1rem;display:flex;align-items:center;gap:1rem;">
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.25em;
          text-transform:uppercase;color:var(--color-washi-700);width:72px;flex-shrink:0;">dark</span>
        ${group(html`
          <lib-chip color="dark">Static</lib-chip>
          <lib-chip kind="toggle" color="dark">Toggle</lib-chip>
          <lib-chip kind="toggle" color="dark" selected>Selected</lib-chip>
          <lib-chip kind="input"  color="dark">Input</lib-chip>
        `)}
      </div>

    </div>
  `,
};

/* ── Enriquecidos: dot, icono, avatar ── */
export const Enriched: Story = {
  name: 'Enriquecidos — dot · icon · avatar',
  render: (): TemplateResult => html`
    <div style="padding:2rem;display:flex;flex-direction:column;gap:2rem;">

      <div>
        <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.25em;
          text-transform:uppercase;color:var(--text-muted);margin-bottom:.75rem;">Dot</p>
        ${group(html`
          <lib-chip dot color="kaki">Kaki</lib-chip>
          <lib-chip dot color="celadon">Celadon</lib-chip>
          <lib-chip dot color="error">Error</lib-chip>
          <lib-chip kind="toggle" dot selected>Seleccionado</lib-chip>
        `)}
      </div>

      <div>
        <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.25em;
          text-transform:uppercase;color:var(--text-muted);margin-bottom:.75rem;">Icon</p>
        ${group(html`
          <lib-chip>
            <span slot="icon" class="chip-icon">
              <svg width="13" height="13" viewBox="0 0 256 256" fill="currentColor">
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-4,48a12,12,0,1,1-12,12A12,12,0,0,1,124,72Zm12,112a16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40a8,8,0,0,1,0,16Z"/>
              </svg>
            </span>
            Info
          </lib-chip>
          <lib-chip kind="toggle" selected>
            <span slot="icon" class="chip-icon">
              <svg width="13" height="13" viewBox="0 0 256 256" fill="currentColor">
                <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/>
              </svg>
            </span>
            Activo
          </lib-chip>
        `)}
      </div>

      <div>
        <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.25em;
          text-transform:uppercase;color:var(--text-muted);margin-bottom:.75rem;">Avatar</p>
        ${group(html`
          <lib-chip kind="input"
            @ui-lib-chip-remove="${(e: Event): void => (e.target as HTMLElement).remove()}">
            <span slot="avatar" class="chip-avatar"
              style="background:var(--color-kaki-100);color:var(--color-kaki-600);">AB</span>
            Alejandro B.
          </lib-chip>
          <lib-chip kind="input"
            @ui-lib-chip-remove="${(e: Event): void => (e.target as HTMLElement).remove()}">
            <span slot="avatar" class="chip-avatar"
              style="background:var(--color-celadon-100);color:var(--color-celadon-600);">MR</span>
            Marta R.
          </lib-chip>
        `)}
      </div>

    </div>
  `,
};

/* ── Filter bar ── */
export const FilterBar: Story = {
  name: 'Contexto — filter bar',
  render: (): TemplateResult => html`
    <div style="padding:2rem;display:flex;flex-direction:column;gap:2rem;max-width:600px;">

      <div class="chip-filter-bar" style="display:flex;flex-wrap:wrap;align-items:center;gap:.5rem;">
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.25em;
          text-transform:uppercase;color:var(--text-muted);margin-right:.25rem;">Filtrar</span>
        <lib-chip kind="toggle" selected>Todo</lib-chip>
        <lib-chip kind="toggle">Frontend</lib-chip>
        <lib-chip kind="toggle">Backend</lib-chip>
        <lib-chip kind="toggle">Design</lib-chip>
        <lib-chip kind="toggle">DevOps</lib-chip>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.15em;
          color:var(--text-muted);padding:4px .5rem;border:1px dashed var(--border-default);
          border-radius:9999px;cursor:pointer;">+3</span>
      </div>

      <div>
        <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.25em;
          text-transform:uppercase;color:var(--text-muted);margin-bottom:.5rem;">Kaki seleccionado</p>
        <div style="display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;">
          <lib-chip kind="toggle" color="kaki" selected>Diseño</lib-chip>
          <lib-chip kind="toggle" color="kaki">Tipografía</lib-chip>
          <lib-chip kind="toggle" color="kaki">Tokens</lib-chip>
          <lib-chip kind="toggle" color="kaki" selected>Grid</lib-chip>
        </div>
      </div>

    </div>
  `,
};

/* ── Chip field (input + tags) ── */
export const ChipField: Story = {
  name: 'Contexto — chip field',
  render: (): TemplateResult => html`
    <div style="padding:2rem;max-width:480px;">
      <div style="display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;
        padding:.5rem .75rem;border:1px solid var(--border-default);background:var(--bg-elevated);
        min-height:44px;cursor:text;transition:border-color .2s,box-shadow .2s;"
        @focusin="${(e: FocusEvent): void => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-washi-800)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px rgba(26,20,14,.06)';
        }}"
        @focusout="${(e: FocusEvent): void => {
          (e.currentTarget as HTMLElement).style.borderColor = '';
          (e.currentTarget as HTMLElement).style.boxShadow = '';
        }}"
      >
        <lib-chip kind="input"
          @ui-lib-chip-remove="${(e: Event): void => (e.target as HTMLElement).remove()}">
          Frontend
        </lib-chip>
        <lib-chip kind="input"
          @ui-lib-chip-remove="${(e: Event): void => (e.target as HTMLElement).remove()}">
          Lit
        </lib-chip>
        <lib-chip kind="input" color="kaki"
          @ui-lib-chip-remove="${(e: Event): void => (e.target as HTMLElement).remove()}">
          TypeScript
        </lib-chip>
        <input
          type="text"
          placeholder="Añadir tag…"
          style="border:none;background:transparent;outline:none;
            font-family:var(--lib-font-body);font-size:var(--text-sm);flex:1;min-width:120px;"
          @keydown="${(e: KeyboardEvent): void => {
            if (e.key === 'Enter') {
              const input = e.target as HTMLInputElement;
              if (!input.value.trim()) return;
              const chip = document.createElement('lib-chip');
              chip.setAttribute('kind', 'input');
              chip.textContent = input.value.trim();
              chip.addEventListener('ui-lib-chip-remove', () => chip.remove());
              input.before(chip);
              input.value = '';
            }
          }}"
        />
      </div>
      <p style="margin-top:.5rem;font-family:var(--lib-font-mono);font-size:10px;
        letter-spacing:.15em;color:var(--text-muted);">Escribe y pulsa Enter para añadir tags</p>
    </div>
  `,
};