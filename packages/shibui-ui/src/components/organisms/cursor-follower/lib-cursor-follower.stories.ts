import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-cursor-follower.component';
import type { LibCursorFollower } from './lib-cursor-follower.component';
import type { CursorMode } from './lib-cursor-follower.types';

/* Estilos comunes de las zonas demo */
const zoneBase = `
  padding: 2.5rem 3rem;
  border: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  min-height: 140px;
  position: relative;
  overflow: hidden;
`;

const meta: Meta = {
  title: 'Components/Organisms/CursorFollower',
  component: 'lib-cursor-follower',
  parameters: {
    /* El cursor nativo se oculta a nivel de página; desactivar en docs */
    docs: { story: { inline: false } },
  },
};
export default meta;
type Story = StoryObj;

/* ── Playground ── */
export const Playground: Story = {
  render: (): TemplateResult => html`
    <lib-cursor-follower mode="ink" .trail="${false}"></lib-cursor-follower>

    <div style="${zoneBase} background: var(--bg-elevated); flex-direction: column; gap: 1rem;">
      <span style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted);">
        Mueve el cursor aquí
      </span>
      <div style="display:flex; gap: 1.5rem; flex-wrap: wrap; justify-content: center;">
        <button style="font-family: var(--lib-font-mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.75rem 1.5rem; background: var(--color-washi-900); color: var(--color-washi-100); border: none; cursor: none;">
          Botón primario
        </button>
        <button style="font-family: var(--lib-font-mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.75rem 1.5rem; background: transparent; color: var(--text-primary); border: 1px solid var(--border-strong); cursor: none;">
          Botón outline
        </button>
        <a href="#" style="font-family: var(--lib-font-mono); font-size: 11px; color: var(--color-kaki-500); cursor: none;">
          Enlace
        </a>
      </div>
    </div>
  `,
};

/* ── Los cuatro modos ── */
export const Modes: Story = {
  name: 'Modos — Ink · Minimal · Kaki · Ghost',
  render: (): TemplateResult => {
    const modes: CursorMode[] = ['ink', 'minimal', 'kaki', 'ghost'];

    const switchMode = (mode: CursorMode): void => {
      const cf = document.querySelector('lib-cursor-follower') as LibCursorFollower;
      cf?.setMode(mode);
      document.querySelectorAll('.mode-btn').forEach(b => {
        (b as HTMLElement).style.background = b.getAttribute('data-mode') === mode
          ? 'var(--color-washi-900)'
          : 'var(--bg-elevated)';
        (b as HTMLElement).style.color = b.getAttribute('data-mode') === mode
          ? 'var(--color-washi-100)'
          : 'var(--text-secondary)';
      });
    };

    return html`
      <lib-cursor-follower mode="ink"></lib-cursor-follower>

      <!-- Mode switcher -->
      <div style="display: flex; gap: 0.75rem; margin-bottom: 2rem; flex-wrap: wrap;">
        ${modes.map(m => html`
          <button
            class="mode-btn"
            data-mode="${m}"
            @click="${(): void => switchMode(m)}"
            style="
              font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.08em;
              text-transform: uppercase; padding: 0.5rem 1rem;
              border: 1px solid var(--border-default);
              background: ${m === 'ink' ? 'var(--color-washi-900)' : 'var(--bg-elevated)'};
              color: ${m === 'ink' ? 'var(--color-washi-100)' : 'var(--text-secondary)'};
              cursor: none; transition: background 150ms, color 150ms;
            "
          >${m}</button>
        `)}
      </div>

      <!-- Demo zone -->
      <div style="${zoneBase} background: var(--bg-elevated); flex-direction: column; gap: 1.5rem;">
        <p style="font-family: var(--lib-font-display); font-size: 1.5rem; font-weight: 300; letter-spacing: -0.02em; color: var(--text-primary);">
          Shibui · <em style="font-style: italic; color: var(--text-accent);">残像</em>
        </p>
        <div style="display: flex; gap: 1.5rem;">
          <button style="padding: 0.75rem 1.5rem; background: var(--color-washi-900); color: var(--color-washi-100); border: none; font-family: var(--lib-font-mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; cursor: none;">
            Interactivo
          </button>
        </div>
      </div>
    `;
  },
};

/* ── Zonas contextuales ── */
export const ContextualZones: Story = {
  name: 'Zonas — Texto · Botones · Oscuro · Label',
  render: (): TemplateResult => html`
    <lib-cursor-follower mode="ink"></lib-cursor-follower>

    <div style="display: flex; flex-direction: column; gap: 1.5rem;">

      <!-- Zona texto — cursor vertical -->
      <div data-cursor-zone="text" style="${zoneBase} background: var(--bg-elevated); flex-direction: column; align-items: flex-start;">
        <span style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 1rem;">
          Zona texto — cursor vertical
        </span>
        <p style="font-family: var(--lib-font-display); font-size: 1.4rem; font-weight: 300; line-height: 1.6; letter-spacing: -0.01em; color: var(--text-primary); cursor: text;">
          La belleza de lo inacabado. El cursor se convierte en línea de texto al entrar en esta zona.
        </p>
      </div>

      <!-- Zona botones — cursor expandido -->
      <div style="${zoneBase} background: var(--bg-surface);">
        <span style="position: absolute; top: 0.75rem; left: 1rem; font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted);">
          Zona interactivos — cursor expandido
        </span>
        <button style="padding: 0.75rem 1.5rem; background: var(--color-washi-900); color: var(--color-washi-100); border: none; font-family: var(--lib-font-mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; cursor: none; transition: background 200ms;"
          @mouseenter="${(e: MouseEvent): void => { (e.target as HTMLElement).style.background = 'var(--color-kaki-500)'; }}"
          @mouseleave="${(e: MouseEvent): void => { (e.target as HTMLElement).style.background = 'var(--color-washi-900)'; }}">
          Pasa por encima
        </button>
        <a href="#" style="font-family: var(--lib-font-mono); font-size: 11px; color: var(--color-kaki-500); text-decoration: none; cursor: none;"
          @click="${(e: Event): void => e.preventDefault()}">
          Enlace decorativo
        </a>
      </div>

      <!-- Zona oscura — ring adapta color -->
      <div data-cursor-zone="dark" style="${zoneBase} background: var(--color-washi-950); border-color: oklch(16% 0.02 45); flex-direction: column; align-items: flex-start;">
        <span style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: oklch(35% 0.02 50); margin-bottom: 1rem;">
          Zona oscura — ring ajusta color
        </span>
        <p style="font-family: var(--lib-font-display); font-size: 2rem; font-weight: 300; color: rgba(250,247,244,0.75); letter-spacing: -0.02em;">
          Kintsugi · <em style="font-style: italic; color: var(--color-kaki-400);">暗い</em>
        </p>
      </div>

      <!-- Label contextual -->
      <div style="${zoneBase} background: var(--bg-elevated); gap: 2rem; flex-wrap: wrap;">
        <span style="position: absolute; top: 0.75rem; left: 1rem; font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted);">
          Label contextual — data-cursor-label
        </span>
        ${([
          { label: 'Ver proyecto', eyebrow: 'Atoms', title: 'Button Liquid' },
          { label: 'Explorar',     eyebrow: 'Molecules', title: 'Glass Card' },
          { label: 'Abrir docs',   eyebrow: 'Organisms', title: 'Data Table' },
        ]).map(c => html`
          <div data-cursor-label="${c.label}"
            style="padding: 1.5rem; background: var(--bg-surface); border: 1px solid var(--border-subtle); min-width: 140px; transition: box-shadow 300ms, transform 300ms; cursor: none;"
            @mouseenter="${(e: MouseEvent): void => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = 'var(--shadow-md)';
              el.style.transform = 'translateY(-2px)';
            }}"
            @mouseleave="${(e: MouseEvent): void => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = '';
              el.style.transform = '';
            }}"
          >
            <p style="font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.5rem;">${c.eyebrow}</p>
            <p style="font-family: var(--lib-font-display); font-size: 1.25rem; font-weight: 300; letter-spacing: -0.02em;">${c.title}</p>
          </div>
        `)}
      </div>
    </div>
  `,
};

/* ── Trail de tinta ── */
export const Trail: Story = {
  name: 'Trail — cola de tinta',
  render: (): TemplateResult => html`
    <lib-cursor-follower mode="ink" id="cf-trail"></lib-cursor-follower>

    <div style="${zoneBase} background: var(--color-washi-950); border-color: oklch(16% 0.02 45); flex-direction: column; gap: 2rem; min-height: 300px;">
      <p style="font-family: var(--lib-font-display); font-size: 1.8rem; font-weight: 300; color: rgba(250,247,244,0.75); letter-spacing: -0.02em; text-align: center;">
        Mueve el cursor <em style="font-style: italic; color: var(--color-kaki-400);">rápido</em>
      </p>
      <button
        @click="${(): void => {
          const cf = document.getElementById('cf-trail') as LibCursorFollower;
          cf?.toggleTrail();
          const btn = document.querySelector('#trail-btn') as HTMLElement;
          if (btn) btn.textContent = (cf as unknown as { trail: boolean }).trail
            ? 'Desactivar trail'
            : 'Activar trail';
        }}"
        id="trail-btn"
        style="
          font-family: var(--lib-font-mono); font-size: 10px; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 0.75rem 1.5rem;
          background: transparent; color: rgba(250,247,244,0.5);
          border: 1px solid oklch(25% 0.02 45); cursor: none;
          transition: border-color 150ms, color 150ms;
        "
      >Activar trail</button>
    </div>
  `,
};