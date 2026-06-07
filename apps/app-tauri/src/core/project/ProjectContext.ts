import { createContext } from 'react';

/**
 * Metadata de un proyecto abierto. Espejo del struct `ProjectInfo` de Rust
 * (`core/src/project.rs`), devuelto por el comando `get_project_info`.
 */
export interface ProjectInfo {
  /** Ruta raíz absoluta. */
  path: string;
  /** Nombre (último segmento de la ruta). */
  name: string;
  /** Tipos detectados por marcadores (p.ej. ['node', 'rust']). */
  kinds: string[];
  /** Rama git actual, o null si no es repo. */
  git_branch: string | null;
  /** True si la ruta existe y es directorio. */
  exists: boolean;
}

export interface ProjectContextValue {
  /** Proyecto abierto actualmente, o null si no hay ninguno. */
  project: ProjectInfo | null;
  /** True mientras se resuelve la metadata de un `openProject`. */
  loading: boolean;
  /** Último error de apertura, o null. */
  error: string | null;
  /** Abre un proyecto por ruta: detecta metadata y lo fija como actual. */
  openProject: (path: string) => Promise<void>;
  /** Cierra el proyecto actual (lo limpia de memoria y persistencia). */
  closeProject: () => void;
  /** Recarga la metadata del proyecto actual (p.ej. tras cambiar de rama). */
  refresh: () => Promise<void>;
}

export const ProjectContext = createContext<ProjectContextValue | null>(null);
