import { html, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-icon.component';
import { ICON_REGISTRY } from '../../../shared/icons/icon-registry';

interface IconStoryArgs {
  size: string;
  color: string;
}

const meta: Meta<IconStoryArgs> = {
  title: 'Components/Display/Icon',
  tags:['autodocs'],
  component: 'lib-icon',
  argTypes: {
    size:  { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    color: { control: 'color' },
  },
};
export default meta;

/* ── Copia el nombre al portapapeles y hace flash en la card ── */
function copyName(name: string, card: HTMLElement): void {
  navigator.clipboard.writeText(name).catch(() => undefined);
  card.setAttribute('data-copied', '');
  setTimeout(() => card.removeAttribute('data-copied'), 1200);
}

export const Gallery: StoryObj<IconStoryArgs> = {
  args: { size: 'md', color: '' },
  render: (args: IconStoryArgs): TemplateResult => html`
    <style>
      /* ── Layout ── */
      .ig-wrap {
        padding: var(--lib-space-xl);
        background: var(--bg-base);
        min-height: 100vh;
      }

      /* ── Cabecera ── */
      .ig-header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        margin-bottom: var(--lib-space-lg);
        padding-bottom: var(--lib-space-md);
        border-bottom: 1px solid var(--border-subtle);
      }
      .ig-title {
        font-family: var(--lib-font-display);
        font-size: var(--text-xl);
        font-weight: 300;
        letter-spacing: var(--tracking-tight);
        color: var(--text-primary);
      }
      .ig-title em {
        font-style: italic;
        color: var(--color-kaki-500);
      }
      .ig-count {
        font-family: var(--lib-font-mono);
        font-size: var(--text-xs);
        letter-spacing: var(--tracking-widest);
        text-transform: uppercase;
        color: var(--text-muted);
      }

      /* ── Buscador ── */
      .ig-search-wrap {
        margin-bottom: var(--lib-space-lg);
        position: relative;
      }
      .ig-search {
        width: 100%;
        max-width: 360px;
        font-family: var(--lib-font-mono);
        font-size: var(--text-xs);
        letter-spacing: var(--tracking-wide);
        color: var(--text-primary);
        background: var(--bg-elevated);
        border: 1px solid var(--border-default);
        padding: var(--lib-space-sm) var(--lib-space-md);
        height: 36px;
        outline: none;
        transition: border-color var(--duration-base) var(--ease-out);
      }
      .ig-search::placeholder {
        color: var(--text-muted);
      }
      .ig-search:focus {
        border-color: var(--color-kaki-400);
      }

      /* ── Grid de cards ── */
      .ig-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
        gap: var(--lib-space-md);
      }

      /* ── Card individual ── */
      .ig-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--lib-space-sm);
        padding: var(--lib-space-lg) var(--lib-space-md) var(--lib-space-md);
        background: var(--bg-elevated);
        border: 1px solid var(--border-subtle);
        cursor: pointer;
        position: relative;
        transition:
          border-color var(--duration-base) var(--ease-out),
          background   var(--duration-base) var(--ease-out),
          transform    var(--duration-base) var(--ease-bounce);
        user-select: none;
      }
      .ig-card:hover {
        border-color: var(--border-strong);
        background: var(--bg-surface);
        transform: translateY(-2px);
      }
      .ig-card:active {
        transform: translateY(0);
      }

      /* Icono dentro de la card — área cuadrada centrada */
      .ig-icon-wrap {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-primary);
        transition: color var(--duration-base) var(--ease-out);
      }
      .ig-card:hover .ig-icon-wrap {
        color: var(--color-kaki-500);
      }

      /* Nombre */
      .ig-name {
        font-family: var(--lib-font-mono);
        font-size: 9px;
        letter-spacing: var(--tracking-wide);
        color: var(--text-muted);
        text-align: center;
        line-height: 1.5;
        word-break: break-all;
        transition: color var(--duration-base) var(--ease-out);
      }
      .ig-card:hover .ig-name {
        color: var(--text-secondary);
      }

      /* Hint de copia — aparece en hover */
      .ig-copy-hint {
        font-family: var(--lib-font-mono);
        font-size: 8px;
        letter-spacing: var(--tracking-widest);
        text-transform: uppercase;
        color: var(--text-muted);
        opacity: 0;
        transition: opacity var(--duration-base) var(--ease-out);
      }
      .ig-card:hover .ig-copy-hint {
        opacity: 1;
      }

      /* Flash de confirmación al copiar */
      .ig-card[data-copied] {
        border-color: var(--color-celadon-400);
        background: var(--color-celadon-50, #EFF5F3);
      }
      .ig-card[data-copied] .ig-icon-wrap {
        color: var(--color-celadon-500);
      }
      .ig-card[data-copied] .ig-copy-hint {
        opacity: 1;
        color: var(--color-celadon-500);
        letter-spacing: var(--tracking-widest);
      }

      /* Estado vacío del filtro */
      .ig-empty {
        grid-column: 1 / -1;
        padding: var(--lib-space-xl);
        text-align: center;
        font-family: var(--lib-font-mono);
        font-size: var(--text-xs);
        letter-spacing: var(--tracking-widest);
        text-transform: uppercase;
        color: var(--text-muted);
      }
    </style>

    <div class="ig-wrap">

      <!-- Cabecera -->
      <div class="ig-header">
        <h2 class="ig-title">Icon <em>registry</em></h2>
        <span class="ig-count">${Object.keys(ICON_REGISTRY).length} iconos</span>
      </div>

      <!-- Buscador -->
      <div class="ig-search-wrap">
        <input
          class="ig-search"
          type="search"
          placeholder="Buscar icono..."
          @input="${(e: Event): void => {
            const q = (e.target as HTMLInputElement).value.toLowerCase();
            const grid = (e.target as HTMLElement)
              .closest('.ig-wrap')
              ?.querySelector('.ig-grid');
            grid?.querySelectorAll<HTMLElement>('.ig-card').forEach(card => {
              const name = card.dataset.name ?? '';
              card.style.display = name.includes(q) ? '' : 'none';
            });
            const visible = grid?.querySelectorAll<HTMLElement>('.ig-card:not([style*="none"])');
            const empty = grid?.querySelector('.ig-empty') as HTMLElement | null;
            if (empty) empty.style.display = visible?.length === 0 ? '' : 'none';
          }}"
        />
      </div>

      <!-- Grid -->
      <div class="ig-grid">
        ${Object.keys(ICON_REGISTRY).map((name: string): TemplateResult => html`
          <div
            class="ig-card"
            data-name="${name}"
            title="Clic para copiar: ${name}"
            @click="${(e: Event): void => {
              copyName(name, e.currentTarget as HTMLElement);
            }}"
          >
            <div class="ig-icon-wrap">
              <lib-icon
                .name="${name}"
                size="${args.size || 'lg'}"
                style="${args.color ? `color:${args.color}` : ''}"
              ></lib-icon>
            </div>
            <span class="ig-name">${name}</span>
            <span class="ig-copy-hint">copiar</span>
          </div>
        `)}

        <!-- Estado vacío -->
        <div class="ig-empty" style="display:none;">
          Sin resultados
        </div>
      </div>

    </div>
  `,
};