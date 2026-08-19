import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import '../../atoms/icon/lib-icon.component'; // registra <lib-icon>: el template lo usa y sin esto no se actualiza
import { customElement, property } from 'lit/decorators.js';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import componentCss from './lib-file-browser.css?inline';
import { fileBrowserTemplate, entryIcon, formatSize } from './lib-file-browser.html';
import type { FsEntry, FileBrowserRowSize, FileRow } from './lib-file-browser.types';

/**
 * @element lib-file-browser
 *
 * Organismo de escritorio: explorador de ficheros de una carpeta.
 * Lista las entradas de `entries` con su icono, nombre y tamaño,
 * y permite navegar (carpetas) o abrir (ficheros) emitiendo eventos.
 *
 * **Datos puros** — igual que `lib-git-graph`, el componente no sabe
 * cómo obtener los datos: recibe `entries` + `current-path` y emite
 * eventos. En Tauri, la capa React resuelve la navegación con
 * `invoke('list_dir')`; en otros entornos, con cualquier fuente.
 *
 * Katachi-aware: consume tokens semánticos del ancestro `data-katachi`.
 *
 * @prop {FsEntry[]}          entries      — Entradas de la carpeta actual.
 * @prop {string}            current-path — Ruta mostrada en la barra de navegación.
 * @prop {FileBrowserRowSize} row-size     — 'default' (pantalla completa) | 'compact' (gadget).
 * @prop {boolean}           loading      — Muestra el spinner.
 * @prop {string}            error        — Mensaje de error (tiene prioridad sobre la lista).
 *
 * @fires ui-lib-file-navigate — { detail: { path } } al entrar en una carpeta.
 * @fires ui-lib-file-open     — { detail: { entry } } al abrir un fichero.
 * @fires ui-lib-file-up       — void al pulsar "subir un nivel".
 *
 * @example
 * <lib-file-browser
 *   .entries=${fsEntries}
 *   current-path="C:\\Users\\me"
 *   @ui-lib-file-navigate=${(e) => load(e.detail.path)}
 * ></lib-file-browser>
 */
@customElement('lib-file-browser')
export class LibFileBrowser extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(componentCss)}`,
  ];

  @property({ type: Array })
  entries: FsEntry[] = [];

  @property({ type: String, attribute: 'current-path' })
  currentPath = '';

  @property({ type: String, attribute: 'row-size', reflect: true })
  rowSize: FileBrowserRowSize = 'default';

  @property({ type: Boolean, reflect: true })
  loading = false;

  @property({ type: String })
  error: string | null = null;

  /** ¿Hay un nivel superior al que subir desde `currentPath`? */
  private get _canGoUp(): boolean {
    const depth = this.currentPath.replace(/[/\\]+$/, '').split(/[/\\]/).filter(Boolean).length;
    return depth > 1;
  }

  /** Carpetas primero, luego ficheros; ambos alfabéticos (locale-aware). */
  private _buildRows(): FileRow[] {
    const sorted = [...this.entries].sort((a, b) => {
      if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    return sorted.map((entry) => ({
      entry,
      icon:      entryIcon(entry.isDir, entry.extension),
      sizeLabel: entry.size != null ? formatSize(entry.size) : null,
    }));
  }

  override render(): TemplateResult {
    return fileBrowserTemplate({
      rows:        this._buildRows(),
      currentPath: this.currentPath,
      rowSize:     this.rowSize,
      loading:     this.loading,
      error:       this.error,
      canGoUp:     this._canGoUp,
      onNavigate:  (path) => { this._emitNavigate(path); },
      onOpen:      (entry) => { this._emitOpen(entry); },
      onGoUp:      () => { this._emitUp(); },
    });
  }

  /* ── Eventos ── */

  private _emitNavigate(path: string): void {
    this.dispatchEvent(new CustomEvent<{ path: string }>('ui-lib-file-navigate', {
      detail: { path }, bubbles: true, composed: true,
    }));
  }

  private _emitOpen(entry: FsEntry): void {
    this.dispatchEvent(new CustomEvent<{ entry: FsEntry }>('ui-lib-file-open', {
      detail: { entry }, bubbles: true, composed: true,
    }));
  }

  private _emitUp(): void {
    this.dispatchEvent(new CustomEvent('ui-lib-file-up', {
      bubbles: true, composed: true,
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-file-browser': LibFileBrowser;
  }
}
