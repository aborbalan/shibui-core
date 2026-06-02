import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { ProjectContext, type ProjectInfo } from './ProjectContext';

/**
 * Clave en localStorage. Se usa localStorage (no sessionStorage) por dos
 * razones del macro entorno:
 *   1. Compartir el proyecto abierto entre las dos ventanas (evento `storage`).
 *   2. Recordar el último proyecto al reabrir la app.
 */
const PROJECT_KEY = 'shibui-open-project';

function readStored(): ProjectInfo | null {
  try {
    const raw = localStorage.getItem(PROJECT_KEY);
    return raw ? (JSON.parse(raw) as ProjectInfo) : null;
  } catch {
    return null;
  }
}

function writeStored(project: ProjectInfo | null): void {
  if (project) localStorage.setItem(PROJECT_KEY, JSON.stringify(project));
  else localStorage.removeItem(PROJECT_KEY);
}

/**
 * Servicio en memoria del proyecto abierto, compartido entre ventanas y
 * persistido (recuerda el último). Sigue el patrón Context+Provider+hook de
 * la app (igual que auth).
 *
 * La metadata (tipo, rama git) la calcula el backend Rust vía `get_project_info`.
 */
export function ProjectProvider({ children }: { children: ReactNode }) {
  const [project, setProject] = useState<ProjectInfo | null>(readStored);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Evita pisar el estado si el provider se desmonta a mitad de un open. */
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Sincroniza el proyecto entre ventanas: si otra ventana lo cambia, este
  // localStorage `storage` event refleja el cambio en vivo.
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === PROJECT_KEY) {
        setProject(e.newValue ? (JSON.parse(e.newValue) as ProjectInfo) : null);
      }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const load = useCallback(async (path: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const info = await invoke<ProjectInfo>('get_project_info', { path });
      if (!mounted.current) return;
      setProject(info);
      writeStored(info);
    } catch (e) {
      if (!mounted.current) return;
      setError(String(e));
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  const openProject = useCallback((path: string) => load(path), [load]);

  const refresh = useCallback(async () => {
    if (project) await load(project.path);
  }, [project, load]);

  const closeProject = useCallback(() => {
    setProject(null);
    setError(null);
    writeStored(null);
  }, []);

  return (
    <ProjectContext.Provider value={{ project, loading, error, openProject, closeProject, refresh }}>
      {children}
    </ProjectContext.Provider>
  );
}
