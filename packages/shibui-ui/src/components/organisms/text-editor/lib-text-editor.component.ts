import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property }                    from 'lit/decorators.js';
import '../../molecules/tabs/lib-tabs.component';
import '../../molecules/editor-toolbar/lib-editor-toolbar.component';
import { textEditorTemplate }                         from './lib-text-editor.html';
import componentCss                                   from './lib-text-editor.css?inline';
import sharedTokens                                   from '../../../styles/shared/tokens.css?inline';
import type { EditorFile, TextEditorTemplateProps }   from './lib-text-editor.types';

/**
 * @element lib-text-editor
 *
 * Editor de texto multi-fichero. Combina `lib-editor-toolbar` y
 * `lib-tabs` en un organismo que gestiona múltiples ficheros abiertos
 * como pestañas de tipo card.
 *
 * Categoría: Organism · `app/editor`.
 *
 * @prop {EditorFile[]} files       — Ficheros abiertos. Cada item incluye id, filename, content y dirty.
 * @prop {string}       active      — Id del fichero activo.
 * @prop {boolean}      saving      — Guardado en curso (deshabilita botón Save).
 * @prop {boolean}      show-open   — Muestra el botón "Abrir" en el toolbar.
 * @prop {string}       placeholder — Texto vacío cuando no hay ficheros.
 * @prop {boolean}      readonly    — Textarea en modo solo lectura.
 *
 * @fires ui-lib-text-editor-new        — El usuario pide un fichero nuevo.
 * @fires ui-lib-text-editor-open       — El usuario pide abrir un fichero.
 * @fires ui-lib-text-editor-save       — El usuario pide guardar. `{ id, content }`.
 * @fires ui-lib-text-editor-change     — El usuario modifica el contenido. `{ id, content }`.
 * @fires ui-lib-text-editor-tab-change — El usuario cambia de pestaña. `{ id, prev }`.
 *
 * @example — uso básico con un fichero
 * <lib-text-editor
 *   .files="${[{ id: '1', filename: 'main.ts', content: '…', dirty: false }]}"
 *   active="1"
 * ></lib-text-editor>
 */
@customElement('lib-text-editor')
export class LibTextEditor extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(componentCss)}`,
  ];

  /** Ficheros abiertos en el editor. */
  @property({ type: Array, hasChanged: () => true })
  files: EditorFile[] = [];

  /** Id del fichero activo. */
  @property({ type: String, reflect: true })
  active = '';

  /** Guardado en curso — deshabilita el botón Save y muestra spinner. */
  @property({ type: Boolean, reflect: true })
  saving = false;

  /** Muestra el botón "Abrir" en el toolbar. */
  @property({ type: Boolean, attribute: 'show-open' })
  showOpen = false;

  /** Placeholder cuando no hay ficheros abiertos. */
  @property({ type: String })
  placeholder = 'Abre o crea un fichero para empezar';

  /** Textarea en modo solo lectura. */
  @property({ type: Boolean, reflect: true })
  readonly = false;

  override render(): TemplateResult {
    return textEditorTemplate(this._buildProps());
  }

  private _buildProps(): TextEditorTemplateProps {
    const activeFile = this.files.find(f => f.id === this.active);
    const tabItems   = this.files.map(f => ({
      id:    f.id,
      label: f.dirty ? `${f.filename} ·` : f.filename,
    }));

    return {
      files:       this.files,
      activeId:    this.active,
      saving:      this.saving,
      showOpen:    this.showOpen,
      placeholder: this.placeholder,
      readonly:    this.readonly,
      tabItems,
      activeFile,
      onTabChange: this._handleTabChange.bind(this),
      onInput:     this._handleInput.bind(this),
      onNew:       this._handleNew.bind(this),
      onOpen:      this._handleOpen.bind(this),
      onSave:      this._handleSave.bind(this),
    };
  }

  private _handleTabChange(e: Event): void {
    const { id, prev } = (e as CustomEvent<{ id: string; prev: string }>).detail;
    this.active = id;
    this.dispatchEvent(new CustomEvent('ui-lib-text-editor-tab-change', {
      detail:   { id, prev },
      bubbles:  true,
      composed: true,
    }));
  }

  private _handleInput(e: InputEvent): void {
    const content = (e.target as HTMLTextAreaElement).value;
    this.dispatchEvent(new CustomEvent('ui-lib-text-editor-change', {
      detail:   { id: this.active, content },
      bubbles:  true,
      composed: true,
    }));
  }

  private _handleNew(): void {
    this.dispatchEvent(new CustomEvent('ui-lib-text-editor-new', {
      bubbles:  true,
      composed: true,
    }));
  }

  private _handleOpen(): void {
    this.dispatchEvent(new CustomEvent('ui-lib-text-editor-open', {
      bubbles:  true,
      composed: true,
    }));
  }

  private _handleSave(): void {
    const activeFile = this.files.find(f => f.id === this.active);
    this.dispatchEvent(new CustomEvent('ui-lib-text-editor-save', {
      detail:   { id: this.active, content: activeFile?.content ?? '' },
      bubbles:  true,
      composed: true,
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-text-editor': LibTextEditor;
  }
}
