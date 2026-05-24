import { html, nothing, TemplateResult } from 'lit';
import type { TextEditorTemplateProps }  from './lib-text-editor.types';

/**
 * Template de lib-text-editor.
 *
 * Estructura:
 *   .editor
 *   ├── lib-editor-toolbar   ← acciones + nombre del fichero activo
 *   ├── lib-tabs [card, sm]  ← pestañas de ficheros (oculta sus paneles internos)
 *   └── .editor__content     ← textarea o empty state
 */
export function textEditorTemplate(props: TextEditorTemplateProps): TemplateResult {
  const {
    files, activeId, saving, showOpen, placeholder, readonly,
    tabItems, activeFile,
    onTabChange, onInput, onNew, onOpen, onSave,
  } = props;

  const hasFiles = files.length > 0;

  return html`
    <div class="editor" part="root">

      <!-- TOOLBAR -->
      <lib-editor-toolbar
        class="editor__toolbar"
        .filename="${activeFile?.filename ?? null}"
        ?dirty="${activeFile?.dirty ?? false}"
        ?saving="${saving}"
        ?show-open="${showOpen}"
        @ui-lib-editor-toolbar-new="${(): void => onNew()}"
        @ui-lib-editor-toolbar-open="${(): void => onOpen()}"
        @ui-lib-editor-toolbar-save="${(): void => onSave()}"
      ></lib-editor-toolbar>

      <!-- PESTAÑAS — visibles cuando hay ficheros abiertos -->
      ${hasFiles ? html`
        <lib-tabs
          class="editor__tabs"
          variant="card"
          size="sm"
          .items="${tabItems}"
          active="${activeId}"
          @ui-lib-tab-change="${(e: Event): void => onTabChange(e)}"
        ></lib-tabs>
      ` : nothing}

      <!-- ÁREA DE CONTENIDO -->
      <div class="editor__content" part="content">
        ${hasFiles ? html`
          <textarea
            class="editor__textarea"
            part="textarea"
            .value="${activeFile?.content ?? ''}"
            ?readonly="${readonly}"
            placeholder="${placeholder}"
            spellcheck="false"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            @input="${(e: InputEvent): void => onInput(e)}"
          ></textarea>
        ` : html`
          <div class="editor__empty">
            <span class="editor__empty-text">${placeholder}</span>
          </div>
        `}
      </div>

    </div>
  `;
}
