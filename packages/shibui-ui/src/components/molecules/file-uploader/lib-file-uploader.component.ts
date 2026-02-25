import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import uploaderStyles from './lib-file-uploader.css?inline';

interface FileStatus {
  file: File;
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
}

@customElement('lib-file-uploader')
export class LibFileUploader extends LitElement {
  static override styles = [css`${unsafeCSS(uploaderStyles)}` || []];

  @property({ type: String }) label = 'Subir archivos';
  @property({ type: String }) hint = 'Arrastra y suelta o haz clic para seleccionar';
  @property({ type: Boolean }) multiple = false;
  @property({ type: String }) accept = '*';

  @state() private _isDragging = false;
  @state() private _files: FileStatus[] = [];

  private _handleDragOver(e: DragEvent):void {
    e.preventDefault();
    this._isDragging = true;
  }

  private _handleDragLeave():void {
    this._isDragging = false;
  }

  private _handleDrop(e: DragEvent):void {
    e.preventDefault();
    this._isDragging = false;
    const files = e.dataTransfer?.files;
    if (files) this._processFiles(Array.from(files));
  }

  private _handleSelect(e: Event):void {
    const input = e.target as HTMLInputElement;
    if (input.files) this._processFiles(Array.from(input.files));
  }

  private _processFiles(files: File[]):void {
    const newFiles: FileStatus[] = files.map(f => ({
      file: f,
      progress: 0,
      status: 'idle'
    }));
    this._files = this.multiple ? [...this._files, ...newFiles] : newFiles;
    
    // Simulación de subida para ver el Progress Bar en acción
    newFiles.forEach(f => this._simulateUpload(f));
  }

  private _simulateUpload(fileStatus: FileStatus):void {
    fileStatus.status = 'uploading';
    const interval = setInterval(() => {
      fileStatus.progress += 10;
      this.requestUpdate();
      if (fileStatus.progress >= 100) {
        clearInterval(interval);
        fileStatus.status = 'success';
        this.requestUpdate();
      }
    }, 300);
  }

  override render(): TemplateResult {
    return html`
      <div class="uploader-container">
        <label class="main-label">${this.label}</label>
        
        <div 
          class="drop-zone ${this._isDragging ? 'dragging' : ''}"
          @dragover=${this._handleDragOver}
          @dragleave=${this._handleDragLeave}
          @drop=${this._handleDrop}
          @click=${():void => this.shadowRoot?.querySelector<HTMLInputElement>('#file-input')?.click()}
        >
          <lib-icon name="upload" size="xl"></lib-icon>
          <p class="hint">${this.hint}</p>
          
          <lib-button variant="primary" size="sm">
            Seleccionar archivo
          </lib-button>
          
          <input 
            type="file" 
            id="file-input" 
            hidden 
            .multiple=${this.multiple} 
            .accept=${this.accept}
            @change=${this._handleSelect}
          >
        </div>

        <div class="file-list">
          ${this._files.map(f => html`
            <div class="file-item">
              <div class="file-info">
                <lib-icon name="file" size="sm"></lib-icon>
                <span class="file-name">${f.file.name}</span>
                <lib-icon 
                  name="${f.status === 'success' ? 'check' : 'close'}" 
                  variant="${f.status === 'success' ? 'success' : 'default'}"
                  size="sm"
                ></lib-icon>
              </div>
              <lib-progress .value=${f.progress} ?showValue=${true}></lib-progress>
            </div>
          `)}
        </div>
      </div>
    `;
  }
}