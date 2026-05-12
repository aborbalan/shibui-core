/* ============================================================
   LIB-FILE-UPLOADER — Tipos públicos
   ============================================================ */

/** Variante de zona de drop */
export type UploaderZone = 'default' | 'compact' | 'image';

/** Estado de un archivo en la lista */
export type FileUploadStatus = 'idle' | 'uploading' | 'done' | 'error';

/** Registro interno de cada archivo */
export interface FileEntry {
  /** ID único generado */
  id: string;
  file: File;
  progress: number;
  status: FileUploadStatus;
  /** Error message si status === 'error' */
  errorMessage?: string;
  /** Object URL para preview de imagen */
  previewUrl?: string;
}

/** Detail del evento ui-lib-files-change */
export interface FilesChangeDetail {
  files: File[];
}

/** Detail del evento ui-lib-upload-start */
export interface UploadStartDetail {
  id: string;
  file: File;
}

/** Detail del evento ui-lib-upload-done */
export interface UploadDoneDetail {
  id: string;
  file: File;
}

/** Detail del evento ui-lib-upload-error */
export interface UploadErrorDetail {
  id: string;
  file: File;
  message: string;
}

/** Detail del evento ui-lib-file-remove */
export interface FileRemoveDetail {
  id: string;
  file: File;
}

/** Props del template */
export interface FileUploaderTemplateProps {
  zone:       UploaderZone;
  title:      string;
  subtitle:   string;
  hint:       string;
  multiple:   boolean;
  accept:     string;
  disabled:   boolean;
  isDragover: boolean;
  entries:    FileEntry[];
  /* Imagen zone */
  imagePreviewUrl: string | null;
  /* Handlers */
  onDragover:    (e: DragEvent)  => void;
  onDragleave:   ()              => void;
  onDrop:        (e: DragEvent)  => void;
  onInputChange: (e: Event)      => void;
  onRemove:      (id: string)    => void;
  onUploadAll:   ()              => void;
  onClearAll:    ()              => void;
  onResetImage:  ()              => void;
}