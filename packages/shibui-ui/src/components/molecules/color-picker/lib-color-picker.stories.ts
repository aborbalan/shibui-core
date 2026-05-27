import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { expect, userEvent } from 'storybook/test';
import './lib-color-picker.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

const meta: Meta = {
  title: 'Universal/Forms/Color Picker',
  tags:['autodocs'],
  component: 'lib-color-picker',
  argTypes: {
    variant:   { control: 'select', options: ['inline', 'trigger'] },
    value:     { control: 'text' },
    showAlpha: { control: 'boolean' },
    dark:      { control: 'boolean' },
    disabled:  { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj;

/* ── Playground ── */
export const Playground: Story = {
  args: {
    value:     '#B85A1E',
    variant:   'inline',
    showAlpha: false,
    dark:      false,
    disabled:  false,
  },
  render: (args): TemplateResult => html`
    <div style="padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem;">
      <lib-color-picker
        value="${args.value}"
        variant="${args.variant}"
        ?show-alpha="${args.showAlpha}"
        ?dark="${args.dark}"
        ?disabled="${args.disabled}"
        @ui-lib-change="${(e: CustomEvent): void => console.log('change', e.detail)}"
        @ui-lib-apply="${(e: CustomEvent): void => console.log('apply', e.detail)}"
      ></lib-color-picker>
    </div>
  `,
};

/* ── Inline ── */
export const Inline: Story = {
  name: 'Inline — siempre visible',
  render: (): TemplateResult => html`
    <div style="padding: 2rem; display: flex; gap: 3rem; align-items: flex-start; flex-wrap: wrap;">
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <span style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted);">
          HEX · Sin alpha
        </span>
        <lib-color-picker
          value="#B85A1E"
          variant="inline"
          @ui-lib-change="${(e: CustomEvent): void => console.log(e.detail)}"
        ></lib-color-picker>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <span style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted);">
          Con alpha
        </span>
        <lib-color-picker
          value="#357164"
          variant="inline"
          show-alpha
          @ui-lib-change="${(e: CustomEvent): void => console.log(e.detail)}"
        ></lib-color-picker>
      </div>
    </div>
  `,
};

/* ── Trigger ── */
export const Trigger: Story = {
  name: 'Trigger — panel flotante',
  render: (): TemplateResult => html`
    <div style="padding: 2rem; display: flex; gap: 2rem; align-items: flex-start; flex-wrap: wrap;">

      <!-- Trigger completo con label -->
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <span style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted);">
          Con label + hex
        </span>
        <lib-color-picker
          value="#B85A1E"
          variant="trigger"
          show-alpha
          @ui-lib-apply="${(e: CustomEvent): void => console.log('apply', e.detail)}"
        ></lib-color-picker>
      </div>

      <!-- Trigger celadón -->
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <span style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted);">
          Celadón
        </span>
        <lib-color-picker
          value="#357164"
          variant="trigger"
          @ui-lib-apply="${(e: CustomEvent): void => console.log('apply', e.detail)}"
        ></lib-color-picker>
      </div>

      <!-- Trigger oscuro -->
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <span style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted);">
          Washi-900
        </span>
        <lib-color-picker
          value="#221C16"
          variant="trigger"
          @ui-lib-apply="${(e: CustomEvent): void => console.log('apply', e.detail)}"
        ></lib-color-picker>
      </div>

    </div>
    <p style="margin: 2rem; font-family: var(--lib-font-mono); font-size: 10px; color: var(--text-muted); letter-spacing: 0.08em;">
      Click sobre el trigger para abrir · Escape o click fuera para cerrar
    </p>
  `,
};

/* ── Dark mode ── */
export const Dark: Story = {
  name: 'Dark — Kintsugi',
  parameters: { backgrounds: { default: 'dark' } },
  render: (): TemplateResult => html`
    <div style="padding: 2rem; background: var(--color-washi-950); display: flex; gap: 3rem; flex-wrap: wrap; align-items: flex-start;">
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <span style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: oklch(35% 0.02 50);">
          Inline dark
        </span>
        <lib-color-picker
          value="#B85A1E"
          variant="inline"
          show-alpha
          dark
        ></lib-color-picker>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <span style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: oklch(35% 0.02 50);">
          Trigger dark
        </span>
        <lib-color-picker
          value="#357164"
          variant="trigger"
          dark
        ></lib-color-picker>
      </div>
    </div>
  `,
};

/* ── Swatches ── */
export const Swatches: Story = {
  name: 'Swatch Grid — paleta Shibui',
  render: (): TemplateResult => html`
    <div style="padding: 2rem; display: flex; flex-direction: column; gap: 2rem;">

      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <span style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted);">
          Paleta completa · tamaño MD (default)
        </span>
        <div style="padding: 1.5rem; background: var(--bg-elevated); border: 1px solid var(--border-subtle);">
          <lib-color-swatches
            value="#B85A1E"
            @ui-lib-swatch-click="${(e: CustomEvent): void => {
              const res = document.getElementById('swatch-result');
              if (res) {
                res.textContent = `${e.detail.name ?? ''} · ${e.detail.value as string}`;
                (res.nextElementSibling as HTMLElement | null)!.style.background = e.detail.value as string;
              }
            }}"
          ></lib-color-swatches>
          <div style="margin-top: 1.5rem; display: flex; align-items: center; gap: 1rem; border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
            <span id="swatch-result" style="font-family: var(--lib-font-mono); font-size: 11px; color: var(--text-secondary);">
              kaki-500 · #B85A1E
            </span>
            <div style="width: 24px; height: 24px; background: #B85A1E; border: 1px solid rgba(0,0,0,0.08); flex-shrink: 0;"></div>
          </div>
        </div>
      </div>

    </div>
  `,
};

/* ── Con colores guardados iniciales ── */
export const WithSavedColors: Story = {
  name: 'Con colores guardados',
  render: (): TemplateResult => html`
    <div style="padding: 2rem;">
      <lib-color-picker
        value="#B85A1E"
        variant="inline"
        saved='["#221C16","#B85A1E","#357164","#D97234","#245249"]'
        @ui-lib-change="${(e: CustomEvent): void => {
          const el = document.getElementById('saved-preview');
          if (el) {
            el.style.background = (e.detail as {hex: string}).hex;
            el.textContent = (e.detail as {hex: string}).hex;
          }
        }}"
      ></lib-color-picker>

      <div style="margin-top: 1.5rem; display: flex; align-items: center; gap: 1rem;">
        <div id="saved-preview"
          style="width: 48px; height: 48px; background: #B85A1E; display: flex; align-items: center; justify-content: center; font-family: var(--lib-font-mono); font-size: 9px; color: white; letter-spacing: 0.08em;">
          #B85A1E
        </div>
        <span style="font-family: var(--lib-font-mono); font-size: 10px; color: var(--text-muted);">
          Color actual
        </span>
      </div>
    </div>
  `,
};

/* ── En contexto: panel de tipografía ── */
export const InContext: Story = {
  name: 'En contexto — panel de estilos',
  render: (): TemplateResult => html`
    <div style="padding: 2rem; display: flex; gap: 2rem; align-items: flex-start; flex-wrap: wrap;">

      <!-- Panel de tipografía -->
      <div style="border: 1px solid var(--border-subtle); background: var(--bg-elevated); width: 280px;">
        <div style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-subtle); font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted);">
          Tipografía
        </div>

        <div style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; gap: 0.75rem;">
          <span style="font-family: var(--lib-font-mono); font-size: 10px; color: var(--text-secondary); flex: 1;">Color de texto</span>
          <lib-color-picker value="#221C16" variant="trigger"
            @ui-lib-apply="${(e: CustomEvent): void => {
              const p = document.getElementById('ctx-text');
              if (p) p.style.color = (e.detail as {hex: string}).hex;
            }}"></lib-color-picker>
        </div>

        <div style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; gap: 0.75rem;">
          <span style="font-family: var(--lib-font-mono); font-size: 10px; color: var(--text-secondary); flex: 1;">Fondo</span>
          <lib-color-picker value="#FAF7F4" variant="trigger"
            @ui-lib-apply="${(e: CustomEvent): void => {
              const p = document.getElementById('ctx-preview');
              if (p) p.style.background = (e.detail as {hex: string}).hex;
            }}"></lib-color-picker>
        </div>

        <div style="padding: 0.75rem 1rem; display: flex; align-items: center; gap: 0.75rem;">
          <span style="font-family: var(--lib-font-mono); font-size: 10px; color: var(--text-secondary); flex: 1;">Acento</span>
          <lib-color-picker value="#B85A1E" variant="trigger"
            @ui-lib-apply="${(e: CustomEvent): void => {
              const p = document.getElementById('ctx-accent');
              if (p) p.style.color = (e.detail as {hex: string}).hex;
            }}"></lib-color-picker>
        </div>
      </div>

      <!-- Preview reactivo -->
      <div id="ctx-preview" style="padding: 2rem; border: 1px solid var(--border-subtle); flex: 1; min-width: 200px; background: #FAF7F4; transition: background 300ms;">
        <p id="ctx-accent" style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: #B85A1E; margin-bottom: 0.5rem;">
          Design System
        </p>
        <p id="ctx-text" style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.5rem; font-weight: 300; color: #221C16; letter-spacing: -0.02em;">
          La belleza de <em style="font-style: italic;">lo incompleto</em>
        </p>
      </div>

    </div>
  `,
};
/* ═══════════════════════════════════════════════════════════════
   TESTS · Eventos de cambio de color
   ═══════════════════════════════════════════════════════════════ */

export const TestColorChange: Story = {
  name: 'Test · ui-lib-change al mover el slider de tono',
  tags: ['test'],
  render: (): TemplateResult => html`
    <div style="padding: 2rem;">
      <lib-color-picker value="#B85A1E" variant="inline"></lib-color-picker>
    </div>
  `,
  play: async ({ canvasElement }): Promise<void> => {
    const el = canvasElement.querySelector('lib-color-picker') as HTMLElement;
    const hueSlider = el.shadowRoot!.querySelector('.cp-range-hue') as HTMLInputElement;

    let detail: { hex: string; h: number; s: number; l: number } | null = null;
    canvasElement.addEventListener('ui-lib-change', (e) => {
      detail = (e as CustomEvent<{ hex: string; h: number; s: number; l: number }>).detail;
    }, { once: true });

    // Simulate moving the hue slider via direct value assignment + input event
    hueSlider.value = '180';
    hueSlider.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

    await new Promise<void>((resolve) => setTimeout(resolve, 50));

    expect(detail).not.toBeNull();
    expect(typeof detail!.hex).toBe('string');
    expect(detail!.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
  },
};

export const TestSwatchClick: Story = {
  name: 'Test · ui-lib-swatch-click al clickar swatch',
  tags: ['test'],
  render: (): TemplateResult => html`
    <div style="padding: 2rem;">
      <lib-color-swatches value="#B85A1E"></lib-color-swatches>
    </div>
  `,
  play: async ({ canvasElement }): Promise<void> => {
    const el = canvasElement.querySelector('lib-color-swatches') as HTMLElement;
    const swatch = el.shadowRoot!.querySelector('.cp-swatch') as HTMLElement;

    let detail: { value: string } | null = null;
    canvasElement.addEventListener('ui-lib-swatch-click', (e) => {
      detail = (e as CustomEvent<{ value: string }>).detail;
    }, { once: true });

    await userEvent.click(swatch);

    expect(detail).not.toBeNull();
    expect(typeof detail!.value).toBe('string');
  },
};

/* ═══════════════════════════════════════════════════════════════
   KATACHI · 形 · Las 6 historias estándar
   lib-color-picker usa tokens semánticos de superficie y borde
   (bg-elevated, border-subtle, text-muted) — adapta al katachi.
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<object>(() => html`
  <div style="padding:var(--lib-space-md);background:var(--bg-elevated);border:1px solid var(--border-subtle);">
    <lib-color-picker variant="inline" value="#4E9482"></lib-color-picker>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;
