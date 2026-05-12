import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { generateUniqueId } from '../../../core/a11y';
import uploaderCss from './lib-file-uploader.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import { fileUploaderTemplate } from './lib-file-uploader.html';
import type {
  UploaderZone,
  FileEntry,
  FilesChangeDetail,
  UploadStartDetail,
  UploadDoneDetail,
  UploadErrorDetail,
  FileRemoveDetail,
} from './lib-file-uploader.types';

/**
 * @element lib-file-uploader
 *
 * Tres variantes de zona de drop:
 * - `zone="default"` — zona grande con icono, título y lista de archivos
 * - `zone="compact"` — zona horizontal para formularios, con lista adjunta
 * - `zone="image"`   — zona con aspect-ratio 16/7 y preview inline de imagen
 *
 * La lista de archivos muestra progreso por ítem, thumbnail para imágenes
 * y estados idle · uploading · done · error.
 *
 * El upload real se delega al exterior vía eventos. Si `simulate` es true,
 * el componente simula el upload internamente (útil en Storybook).
 *
 * @prop {UploaderZone} zone         — Variante de zona (default: 'default')
 * @prop {string}       title        — Título de la zona
 * @prop {string}       subtitle     — Subtítulo (solo zone='default')
 * @prop {string}       hint         — Texto de restricciones (formatos, tamaño)
 * @prop {boolean}      multiple     — Permite múltiples archivos
 * @prop {string}       accept       — Tipos aceptados (e.g. '.pdf,image/*')
 * @prop {boolean}      disabled     — Deshabilita la zona
 * @prop {boolean}      simulate     — Simula upload internamente (Storybook)
 * @prop {number}       simulateMs   — Duración simulada en ms (default: 2000)
 *
 * @fires ui-lib-files-change  — Al seleccionar/soltar archivos
 *   Detail: { files: File[] }
 * @fires ui-lib-upload-start  — Inicio de upload de un archivo
 *   Detail: { id: string, file: File }
 * @fires ui-lib-upload-done   — Upload completado
 *   Detail: { id: string, file: File }
 * @fires ui-lib-upload-error  — Upload fallido
 *   Detail: { id: string, file: File, message: string }
 * @fires ui-lib-file-remove   — Archivo eliminado de la lista
 *   Detail: { id: string, file: File }
 */
@customElement('lib-file-uploader')
export class LibFileUploader extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(uploaderCss)}`,
  ];

  /* ── Props ── */

  @property({ type: String, reflect: true })
  zone: UploaderZone = 'default';

  @property({ type: String })
  override title = 'Arrastra archivos aquí';

  @property({ type: String })
  subtitle = 'o busca en tu equipo';

  @property({ type: String })
  hint = 'PDF, DOCX, PNG, JPG · máx. 20 MB por archivo';

  @property({ type: Boolean, reflect: true })
  multiple = false;

  @property({ type: String })
  accept = '*';

  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Simula el upload internamente (ideal para Storybook) */
  @property({ type: Boolean, reflect: true })
  simulate = false;

  /** Duración de la simulación por archivo en ms */
  @property({ type: Number, attribute: 'simulate-ms' })
  simulateMs = 2000;

  /* ── State ── */

  @state() private _isDragover = false;
  @state() private _entries: FileEntry[] = [];
  @state() private _imagePreviewUrl: string | null = null;

  /* ── Drag & Drop ── */

  private _onDragover(e: DragEvent): void {
    e.preventDefault();
    this._isDragover = true;
  }

  private _onDragleave(): void {
    this._isDragover = false;
  }

  private _onDrop(e: DragEvent): void {
    e.preventDefault();
    this._isDragover = false;
    const files = Array.from(e.dataTransfer?.files ?? []);
    if (files.length) this._processFiles(files);
  }

  /* ── Input change ── */

  private _onInputChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (files.length) this._processFiles(files);
    /* Limpiar el input para permitir seleccionar el mismo archivo otra vez */
    input.value = '';
  }

  /* ── Procesar archivos ── */

  private _processFiles(files: File[]): void {
    /* zone=image — solo un archivo, genera preview */
    if (this.zone === 'image') {
      const file = files[0];
      if (!file) return;

      /* Revocar URL anterior si existe */
      if (this._imagePreviewUrl) URL.revokeObjectURL(this._imagePreviewUrl);

      const entry: FileEntry = {
        id:         generateUniqueId('fu-'),
        file,
        progress:   0,
        status:     'idle',
        previewUrl: URL.createObjectURL(file),
      };

      this._imagePreviewUrl = entry.previewUrl ?? null;
      this._entries = [entry];
      this._emitFilesChange([file]);

      if (this.simulate) this._simulateUpload(entry);
      return;
    }

    /* zone=default | compact — múltiples archivos */
    const newEntries: FileEntry[] = files.map((file): FileEntry => {
      const isImg = file.type.startsWith('image/');
      return {
        id:         generateUniqueId('fu-'),
        file,
        progress:   0,
        status:     'idle',
        ...(isImg ? { previewUrl: URL.createObjectURL(file) } : {}),
      };
    });

    this._entries = this.multiple
      ? [...this._entries, ...newEntries]
      : newEntries;

    this._emitFilesChange(files);

    if (this.simulate) {
      newEntries.forEach(entry => this._simulateUpload(entry));
    }
  }

  /* ── Simulación de upload ── */

  private _simulateUpload(entry: FileEntry): void {
    const steps    = 20;
    const interval = this.simulateMs / steps;
    const step     = 100 / steps;

    /* Lanzar error aleatorio en ~20% de los archivos */
    const willFail = Math.random() < 0.2;
    const failAt   = willFail ? Math.floor(Math.random() * 8 + 3) * step : Infinity;

    entry.status = 'uploading';
    this.requestUpdate();

    this.dispatchEvent(
      new CustomEvent<UploadStartDetail>('ui-lib-upload-start', {
        detail: { id: entry.id, file: entry.file },
        bubbles: true, composed: true,
      })
    );

    const tick = setInterval((): void => {
      const idx = this._entries.findIndex(e => e.id === entry.id);
      if (idx === -1) { clearInterval(tick); return; }

      const current = this._entries[idx];
      if (!current) { clearInterval(tick); return; }

      const next = Math.min(current.progress + step, 100);

      if (next >= failAt) {
        clearInterval(tick);
        this._entries = this._entries.map(e =>
          e.id === entry.id
            ? { ...e, progress: next, status: 'error', errorMessage: 'Error de conexión' }
            : e
        );
        this.requestUpdate();
        this.dispatchEvent(
          new CustomEvent<UploadErrorDetail>('ui-lib-upload-error', {
            detail: { id: entry.id, file: entry.file, message: 'Error de conexión' },
            bubbles: true, composed: true,
          })
        );
        return;
      }

      if (next >= 100) {
        clearInterval(tick);
        this._entries = this._entries.map(e =>
          e.id === entry.id ? { ...e, progress: 100, status: 'done' } : e
        );
        this.requestUpdate();
        this.dispatchEvent(
          new CustomEvent<UploadDoneDetail>('ui-lib-upload-done', {
            detail: { id: entry.id, file: entry.file },
            bubbles: true, composed: true,
          })
        );
        return;
      }

      this._entries = this._entries.map(e =>
        e.id === entry.id ? { ...e, progress: next } : e
      );
      this.requestUpdate();
    }, interval);
  }

  /* ── Eliminar archivo ── */

  private _onRemove(id: string): void {
    const entry = this._entries.find(e => e.id === id);
    if (!entry) return;

    /* Revocar object URL si existe */
    if (entry.previewUrl) URL.revokeObjectURL(entry.previewUrl);

    this._entries = this._entries.filter(e => e.id !== id);

    this.dispatchEvent(
      new CustomEvent<FileRemoveDetail>('ui-lib-file-remove', {
        detail: { id, file: entry.file },
        bubbles: true, composed: true,
      })
    );
  }

  /* ── Upload all (delega a host si simulate=false) ── */

  private _onUploadAll(): void {
    if (this.simulate) {
      const idleEntries = this._entries.filter(e => e.status === 'idle' || e.status === 'error');
      idleEntries.forEach(e => this._simulateUpload(e));
    }
    /* Si simulate=false, el host escucha ui-lib-files-change y maneja el upload */
  }

  /* ── Limpiar lista ── */

  private _onClearAll(): void {
    this._entries.forEach(e => { if (e.previewUrl) URL.revokeObjectURL(e.previewUrl); });
    this._entries = [];
  }

  /* ── Reset imagen ── */

  private _onResetImage(): void {
    if (this._imagePreviewUrl) URL.revokeObjectURL(this._imagePreviewUrl);
    this._imagePreviewUrl = null;
    this._entries = [];
  }

  /* ── API pública ── */

  /** Marca un archivo como completado desde el exterior */
  public markDone(id: string): void {
    this._entries = this._entries.map(e =>
      e.id === id ? { ...e, progress: 100, status: 'done' } : e
    );
  }

  /** Marca un archivo como error desde el exterior */
  public markError(id: string, message = 'Error al subir'): void {
    this._entries = this._entries.map(e =>
      e.id === id ? { ...e, status: 'error', errorMessage: message } : e
    );
  }

  /** Actualiza el progreso de un archivo desde el exterior */
  public setProgress(id: string, progress: number): void {
    this._entries = this._entries.map(e =>
      e.id === id ? { ...e, progress: Math.min(100, Math.max(0, progress)), status: 'uploading' } : e
    );
  }

  /** Archivos actuales en la lista */
  public get files(): FileEntry[] {
    return [...this._entries];
  }

  /* ── Helpers ── */

  private _emitFilesChange(files: File[]): void {
    this.dispatchEvent(
      new CustomEvent<FilesChangeDetail>('ui-lib-files-change', {
        detail: { files },
        bubbles: true, composed: true,
      })
    );
  }

  /* ── Lifecycle ── */

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    /* Revocar todas las object URLs al desmontar */
    this._entries.forEach(e => { if (e.previewUrl) URL.revokeObjectURL(e.previewUrl); });
    if (this._imagePreviewUrl) URL.revokeObjectURL(this._imagePreviewUrl);
  }

  /* ── Render ── */

  protected override render(): TemplateResult {
    return fileUploaderTemplate({
      zone:            this.zone,
      title:           this.title,
      subtitle:        this.subtitle,
      hint:            this.hint,
      multiple:        this.multiple,
      accept:          this.accept,
      disabled:        this.disabled,
      isDragover:      this._isDragover,
      entries:         this._entries,
      imagePreviewUrl: this._imagePreviewUrl,
      onDragover:      (e): void => this._onDragover(e),
      onDragleave:     ():  void => this._onDragleave(),
      onDrop:          (e): void => this._onDrop(e),
      onInputChange:   (e): void => this._onInputChange(e),
      onRemove:        (id): void => this._onRemove(id),
      onUploadAll:     ():  void => this._onUploadAll(),
      onClearAll:      ():  void => this._onClearAll(),
      onResetImage:    ():  void => this._onResetImage(),
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-file-uploader': LibFileUploader;
  }
}