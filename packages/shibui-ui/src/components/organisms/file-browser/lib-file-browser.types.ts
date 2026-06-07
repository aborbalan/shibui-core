/* ============================================================
   LIB-FILE-BROWSER — Tipos e interfaces
   ============================================================ */

/**
 * Entrada del sistema de ficheros. Contrato de datos compartido:
 * en Tauri lo produce el comando Rust `list_dir`; en otros entornos,
 * cualquier fuente que respete esta forma.
 */
export interface FsEntry {
  /** Nombre del fichero o carpeta (sin ruta). */
  name: string;
  /** Ruta absoluta completa. */
  path: string;
  /** True si es un directorio. */
  isDir: boolean;
  /** Extensión sin punto (`ts`, `png`…) o null para carpetas / sin extensión. */
  extension: string | null;
  /** Tamaño en bytes, o null si no aplica (carpetas). */
  size: number | null;
}

/** Densidad de fila: `compact` para gadgets, `default` a pantalla completa. */
export type FileBrowserRowSize = 'compact' | 'default';

/** Fila ya resuelta para pintar (entrada + icono + tamaño formateado). */
export interface FileRow {
  entry:      FsEntry;
  icon:       string;
  sizeLabel:  string | null;
}

export interface FileBrowserTemplateProps {
  rows:        FileRow[];
  currentPath: string;
  rowSize:     FileBrowserRowSize;
  loading:     boolean;
  error:       string | null;
  canGoUp:     boolean;
  onNavigate:  (path: string) => void;
  onOpen:      (entry: FsEntry) => void;
  onGoUp:      () => void;
}
