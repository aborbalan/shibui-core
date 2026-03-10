import { html, nothing, TemplateResult } from 'lit';
import { map } from 'lit/directives/map.js';
import { styleMap } from 'lit/directives/style-map.js';
import type { FileEntry, FileUploaderTemplateProps } from './lib-file-uploader.types';

/* ================================================================
   FILE ENTRY — una fila en la lista
   ================================================================ */

function renderFileEntry(
  entry: FileEntry,
  onRemove: (id: string) => void,
): TemplateResult {
  const isUploading = entry.status === 'uploading';
  const isDone      = entry.status === 'done';
  const isError     = entry.status === 'error';

  const rowCls = [
    'fu-file',
    isDone    ? 'is-done'      : '',
    isError   ? 'is-error'     : '',
    isUploading ? 'is-uploading' : '',
  ].filter(Boolean).join(' ');

  /* Icono o thumbnail para imágenes */
  const ext = entry.file.name.split('.').pop()?.toLowerCase() ?? '';
  const isImg = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);

  const fileSize = entry.file.size < 1024 * 1024
    ? `${(entry.file.size / 1024).toFixed(0)} KB`
    : `${(entry.file.size / (1024 * 1024)).toFixed(1)} MB`;

  return html`
    <div class="${rowCls}">
      <!-- Progress background -->
      <div
        class="fu-file-prog-bg"
        style="${styleMap({ width: isUploading ? `${entry.progress}%` : isDone ? '100%' : '0%' })}"
      ></div>

      <!-- Thumbnail o icono -->
      ${isImg && entry.previewUrl
        ? html`<img class="fu-file-thumb" src="${entry.previewUrl}" alt="${entry.file.name}">`
        : html`
            <div class="fu-file-icon">
              ${isDone
                ? html`<lib-icon name="check-circle" weight="fill" size="sm"></lib-icon>`
                : isError
                  ? html`<lib-icon name="warning-circle" weight="fill" size="sm"></lib-icon>`
                  : html`<span class="fu-ext">${ext || '—'}</span>`}
            </div>`}

      <!-- Meta -->
      <div class="fu-file-meta">
        <span class="fu-file-name">${entry.file.name}</span>
        <span class="fu-file-info">
          <span>${fileSize}</span>
          ${isError
            ? html`
                <span class="fu-file-info-sep"></span>
                <span style="color:var(--color-error)">${entry.errorMessage ?? 'Error al subir'}</span>`
            : nothing}
          ${isDone
            ? html`
                <span class="fu-file-info-sep"></span>
                <span style="color:var(--color-celadon-500)">Completado</span>`
            : nothing}
        </span>
      </div>

      <!-- Acciones -->
      <div class="fu-file-actions">
        ${isUploading
          ? html`
              <span class="fu-file-pct">${entry.progress}%</span>
              <span class="fu-spinner"></span>`
          : isDone
            ? html`<span class="fu-status-done"><lib-icon name="check-circle" weight="fill" size="sm"></lib-icon></span>`
            : isError
              ? html`<span class="fu-status-error"><lib-icon name="warning" weight="fill" size="sm"></lib-icon></span>`
              : nothing}

        <button
          class="fu-file-remove"
          aria-label="Eliminar ${entry.file.name}"
          @click="${(e: Event): void => { e.stopPropagation(); onRemove(entry.id); }}"
        >
          <lib-icon name="x" size="xs"></lib-icon>
        </button>
      </div>
    </div>
  `;
}

/* ================================================================
   TEMPLATE PRINCIPAL
   ================================================================ */

export function fileUploaderTemplate(props: FileUploaderTemplateProps): TemplateResult {
  const {
    zone, title, /*subtitle*/ hint, multiple, accept, disabled,
    isDragover, entries, imagePreviewUrl,
    onDragover, onDragleave, onDrop, onInputChange, onRemove,
    onUploadAll, onClearAll, onResetImage,
  } = props;

  const doneCount     = entries.filter(e => e.status === 'done').length;
  const uploadingCount = entries.filter(e => e.status === 'uploading').length;
  const allDone       = entries.length > 0 && doneCount === entries.length;
  const anyUploading  = uploadingCount > 0;

  /* ────────────────────────────────────
     VARIANTE: default (zona grande)
     ──────────────────────────────────── */
  if (zone === 'default') {
    return html`
      <div class="fu-root">
        <!-- Drop zone -->
        <div
          class="fu-zone ${isDragover ? 'is-dragover' : ''} ${disabled ? 'is-disabled' : ''}"
          @dragover="${(e: DragEvent): void => { if (!disabled) onDragover(e); }}"
          @dragleave="${(): void => { if (!disabled) onDragleave(); }}"
          @drop="${(e: DragEvent): void => { if (!disabled) onDrop(e); }}"
        >
          <!-- input real cubriendo toda la zona -->
          <input
            type="file"
            ?multiple="${multiple}"
            accept="${accept}"
            ?disabled="${disabled}"
            @change="${onInputChange}"
            aria-label="${title}"
          >

          <div class="fu-zone-icon">
            <lib-icon name="cloud-arrow-up" weight="thin" size="xl"></lib-icon>
          </div>

          <div>
            <p class="fu-zone-title">${title}</p>
            <p class="fu-zone-sub" style="margin-top:var(--lib-space-sm)">
              o <span>busca en tu equipo</span>
            </p>
          </div>

          <p class="fu-zone-hint">${hint}</p>
        </div>

        <!-- Lista de archivos -->
        ${entries.length > 0 ? html`
          <div class="fu-list">
            ${map(entries, (entry: FileEntry) => renderFileEntry(entry, onRemove))}
          </div>

          <!-- Footer summary -->
          <div class="fu-summary">
            <span class="fu-summary-text">
              ${allDone
                ? `${doneCount} archivo${doneCount !== 1 ? 's' : ''} subido${doneCount !== 1 ? 's' : ''}`
                : anyUploading
                  ? `Subiendo ${uploadingCount} archivo${uploadingCount !== 1 ? 's' : ''}…`
                  : `${entries.length} archivo${entries.length !== 1 ? 's' : ''} seleccionado${entries.length !== 1 ? 's' : ''}`}
            </span>
            <div style="display:flex;gap:var(--lib-space-sm)">
              <button
                class="fu-summary-btn"
                style="background:transparent;color:var(--text-muted);border:1px solid var(--border-default)"
                ?disabled="${anyUploading}"
                @click="${onClearAll}"
              >Limpiar</button>
              <button
                class="fu-summary-btn"
                ?disabled="${anyUploading || allDone}"
                @click="${onUploadAll}"
              >
                ${anyUploading ? 'Subiendo…' : 'Subir todo'}
              </button>
            </div>
          </div>
        ` : nothing}
      </div>
    `;
  }

  /* ────────────────────────────────────
     VARIANTE: compact (horizontal)
     ──────────────────────────────────── */
  if (zone === 'compact') {
    return html`
      <div class="fu-root">
        <div
          class="fu-zone-sm ${isDragover ? 'is-dragover' : ''} ${disabled ? 'is-disabled' : ''}"
          @dragover="${(e: DragEvent): void => { if (!disabled) onDragover(e); }}"
          @dragleave="${(): void => { if (!disabled) onDragleave(); }}"
          @drop="${(e: DragEvent): void => { if (!disabled) onDrop(e); }}"
        >
          <input
            type="file"
            ?multiple="${multiple}"
            accept="${accept}"
            ?disabled="${disabled}"
            @change="${onInputChange}"
            aria-label="${title}"
          >

          <span class="fu-zone-sm-icon">
            <lib-icon name="paperclip" size="md"></lib-icon>
          </span>

          <div class="fu-zone-sm-text">
            <span class="fu-zone-sm-title">${title}</span>
            <span class="fu-zone-sm-sub">${hint}</span>
          </div>
        </div>

        ${entries.length > 0 ? html`
          <div class="fu-list" style="margin-top:1px">
            ${map(entries, (entry: FileEntry) => renderFileEntry(entry, onRemove))}
          </div>
        ` : nothing}
      </div>
    `;
  }

  /* ────────────────────────────────────
     VARIANTE: image (preview inline)
     ──────────────────────────────────── */
  return html`
    <div class="fu-root">
      <div
        class="fu-zone-img ${isDragover ? 'is-dragover' : ''} ${imagePreviewUrl ? 'has-preview' : ''} ${disabled ? 'is-disabled' : ''}"
        @dragover="${(e: DragEvent): void => { if (!disabled) onDragover(e); }}"
        @dragleave="${(): void => { if (!disabled) onDragleave(); }}"
        @drop="${(e: DragEvent): void => { if (!disabled) onDrop(e); }}"
      >
        <input
          type="file"
          accept="image/*"
          ?disabled="${disabled || !!imagePreviewUrl}"
          @change="${onInputChange}"
          aria-label="${title}"
        >

        <!-- Placeholder (sin imagen) -->
        <div class="fu-zone-img-placeholder">
          <lib-icon name="image" weight="thin" size="xl" style="color:var(--text-muted)"></lib-icon>
          <p class="fu-zone-sub">${title}</p>
          <p class="fu-zone-hint">${hint}</p>
        </div>

        <!-- Preview (con imagen) -->
        ${imagePreviewUrl
          ? html`<img class="fu-zone-img-preview" src="${imagePreviewUrl}" alt="Preview">`
          : nothing}

        <!-- Overlay de reemplazo -->
        ${imagePreviewUrl
          ? html`
              <div class="fu-zone-img-overlay">
                <lib-icon name="camera" size="md" style="color:#fff"></lib-icon>
                <span class="fu-zone-img-overlay-text">Cambiar imagen</span>
              </div>`
          : nothing}
      </div>

      <!-- Barra de progreso debajo de la zona imagen -->
      ${entries.length > 0 && entries[0]?.status === 'uploading'
        ? html`
            <div class="fu-progress-bar">
              <div class="fu-progress-fill" style="width:${entries[0]?.progress ?? 0}%"></div>
            </div>`
        : nothing}

      ${imagePreviewUrl
        ? html`
            <div style="display:flex;justify-content:flex-end;margin-top:var(--lib-space-sm)">
              <button class="fu-file-remove" style="width:auto;padding:0 var(--lib-space-sm);border-radius:0;border:1px solid var(--border-default);font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase" @click="${onResetImage}">
                Eliminar
              </button>
            </div>`
        : nothing}
    </div>
  `;
}