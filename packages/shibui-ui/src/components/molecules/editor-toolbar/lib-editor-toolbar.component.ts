import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../atoms/icon/lib-icon.component';
import { editorToolbarTemplate }              from './lib-editor-toolbar.html';
import componentCss                           from './lib-editor-toolbar.css?inline';
import sharedTokens                           from '../../../styles/shared/tokens.css?inline';
import type { EditorToolbarTemplateProps }    from './lib-editor-toolbar.types';

/**
 * @element lib-editor-toolbar
 *
 * Barra de acciones para un editor de ficheros. Gestiona el ciclo de
 * vida básico: nuevo, abrir (opcional), guardar. Muestra el nombre del
 * fichero activo y un indicador de cambios sin guardar (`dirty`).
 *
 * Categoría: Molecule · `app/editor`.
 *
 * @prop {string}        filename  — Nombre del fichero activo. Vacío → "Sin título".
 * @prop {boolean}       dirty     — Indica cambios sin guardar (muestra `·` en el nombre).
 * @prop {boolean}       saving    — Estado de guardado en curso (deshabilita el botón Save).
 * @prop {boolean}       show-open — Muestra el botón "Abrir fichero".
 *
 * @fires ui-lib-editor-toolbar-new  — El usuario pide crear un fichero nuevo.
 * @fires ui-lib-editor-toolbar-open — El usuario pide abrir un fichero.
 * @fires ui-lib-editor-toolbar-save — El usuario pide guardar el fichero activo.
 *
 * @example — uso básico con fichero activo
 * <lib-editor-toolbar filename="main.ts" dirty></lib-editor-toolbar>
 *
 * @example — con botón de apertura de fichero (Tauri / dialogs)
 * <lib-editor-toolbar filename="config.json" show-open></lib-editor-toolbar>
 */
@customElement('lib-editor-toolbar')
export class LibEditorToolbar extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(componentCss)}`,
  ];

  /** Nombre del fichero activo. Vacío muestra "Sin título". */
  @property({ type: String })
  filename = '';

  /** Indica cambios sin guardar — muestra un punto junto al nombre. */
  @property({ type: Boolean, reflect: true })
  dirty = false;

  /** Guardado en curso — deshabilita el botón Save y muestra spinner. */
  @property({ type: Boolean, reflect: true })
  saving = false;

  /** Muestra el botón "Abrir fichero". */
  @property({ type: Boolean, attribute: 'show-open' })
  showOpen = false;

  override render(): TemplateResult {
    return editorToolbarTemplate(this._buildProps());
  }

  private _buildProps(): EditorToolbarTemplateProps {
    return {
      filename: this.filename,
      dirty:    this.dirty,
      saving:   this.saving,
      showOpen: this.showOpen,
      onNew:    this._handleNew.bind(this),
      onOpen:   this._handleOpen.bind(this),
      onSave:   this._handleSave.bind(this),
    };
  }

  private _handleNew(): void {
    this.dispatchEvent(new CustomEvent('ui-lib-editor-toolbar-new', {
      bubbles:  true,
      composed: true,
    }));
  }

  private _handleOpen(): void {
    this.dispatchEvent(new CustomEvent('ui-lib-editor-toolbar-open', {
      bubbles:  true,
      composed: true,
    }));
  }

  private _handleSave(): void {
    this.dispatchEvent(new CustomEvent('ui-lib-editor-toolbar-save', {
      bubbles:  true,
      composed: true,
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-editor-toolbar': LibEditorToolbar;
  }
}
