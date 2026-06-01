import { html, nothing, TemplateResult } from 'lit';
import '../../atoms/icon/lib-icon.component';
import '../../atoms/spinner/lib-spinner.component';
import type { FileBrowserTemplateProps, FileRow } from './lib-file-browser.types';

/* ─── Helpers de presentación ────────────────────────────── */

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}K`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}M`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}G`;
}

/**
 * Mapea una entrada a un nombre de icono del registry de Shibui.
 * NOTA: el registry solo expone `folder`, `file`, `image` (no hay
 * variantes file-code / file-text). Se mapea a lo disponible.
 */
export function entryIcon(isDir: boolean, extension: string | null): string {
  if (isDir) return 'folder';
  const ext = extension?.toLowerCase() ?? '';
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico', 'bmp'].includes(ext)) return 'image';
  return 'file';
}

/* ─── Fila individual ────────────────────────────────────── */

function renderRow(
  row:        FileRow,
  iconSize:   string,
  onNavigate: (p: string) => void,
  onOpen:     (e: FileRow['entry']) => void,
): TemplateResult {
  const { entry, icon, sizeLabel } = row;

  const activate = (): void => {
    if (entry.isDir) onNavigate(entry.path);
    else onOpen(entry);
  };

  return html`
    <div
      class="fb-row"
      role="button"
      tabindex="0"
      data-dir=${entry.isDir ? 'true' : 'false'}
      title=${entry.path}
      @click=${activate}
      @keydown=${(e: KeyboardEvent): void => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate();
        }
      }}
    >
      <lib-icon class="fb-row-icon" name=${icon} size=${iconSize}></lib-icon>
      <span class="fb-row-name">${entry.name}</span>
      ${sizeLabel ? html`<span class="fb-row-size">${sizeLabel}</span>` : nothing}
    </div>
  `;
}

/* ─── Plantilla principal ────────────────────────────────── */

export function fileBrowserTemplate(props: FileBrowserTemplateProps): TemplateResult {
  const {
    rows, currentPath, rowSize, loading, error, canGoUp,
    onNavigate, onOpen, onGoUp,
  } = props;

  // lib-icon usa tamaños nominales (xs|sm|md…), nunca px.
  const iconSize = rowSize === 'compact' ? 'xs' : 'sm';

  return html`
    <div class="fb-root" data-size=${rowSize}>

      <!-- Barra de navegación -->
      <div class="fb-nav">
        <button
          class="fb-up"
          ?disabled=${!canGoUp || loading}
          aria-label="Subir un nivel"
          @click=${(): void => { if (canGoUp && !loading) onGoUp(); }}
        >
          <lib-icon name="arrow-left" size=${iconSize}></lib-icon>
        </button>
        <span class="fb-path" title=${currentPath}>${currentPath || '—'}</span>
      </div>

      <!-- Lista -->
      <div class="fb-list">
        ${loading
          ? html`<div class="fb-state"><lib-spinner variant="enso" size="sm"></lib-spinner></div>`
          : error
            ? html`<div class="fb-state fb-error">${error}</div>`
            : rows.length === 0
              ? html`<div class="fb-state fb-empty">Carpeta vacía</div>`
              : rows.map((r) => renderRow(r, iconSize, onNavigate, onOpen))}
      </div>

    </div>
  `;
}
