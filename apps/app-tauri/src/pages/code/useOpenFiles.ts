import { useCallback, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

/** Fichero abierto en el editor. `id` = ruta absoluta. Espejo de `EditorFile`. */
export interface OpenFile {
  id: string;        // ruta absoluta (única)
  filename: string;  // nombre mostrado en el tab
  content: string;
  dirty: boolean;
}

function baseName(path: string): string {
  const norm = path.replace(/[/\\]+$/, '');
  const parts = norm.split(/[/\\]/);
  return parts[parts.length - 1] ?? path;
}

/**
 * Gestiona los ficheros abiertos en el editor del área Code: abrir (lee del
 * backend), editar (marca dirty), guardar (escribe), cerrar y conmutar activo.
 *
 * No persiste: el estado vive mientras la pestaña Code esté montada.
 */
export function useOpenFiles() {
  const [files, setFiles] = useState<OpenFile[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Abre un fichero por ruta (o lo enfoca si ya estaba abierto). */
  const openFile = useCallback(async (path: string) => {
    setError(null);
    // Ya abierto → solo enfocar.
    let exists = false;
    setFiles((prev) => {
      exists = prev.some((f) => f.id === path);
      return prev;
    });
    if (exists) {
      setActiveId(path);
      return;
    }
    try {
      const content = await invoke<string>('read_file', { path });
      setFiles((prev) =>
        prev.some((f) => f.id === path)
          ? prev
          : [...prev, { id: path, filename: baseName(path), content, dirty: false }],
      );
      setActiveId(path);
    } catch (e) {
      setError(String(e));
    }
  }, []);

  /** Actualiza el contenido del fichero activo (lo marca dirty). */
  const updateContent = useCallback((id: string, content: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, content, dirty: true } : f)),
    );
  }, []);

  /** Guarda el fichero activo en disco. */
  const saveFile = useCallback(async (id: string) => {
    let target: OpenFile | undefined;
    setFiles((prev) => {
      target = prev.find((f) => f.id === id);
      return prev;
    });
    if (!target) return;

    setSaving(true);
    setError(null);
    try {
      await invoke('write_file', { path: id, content: target.content });
      setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, dirty: false } : f)));
    } catch (e) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  }, []);

  /** Cierra un fichero; si era el activo, salta al vecino. */
  const closeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      const next = prev.filter((f) => f.id !== id);
      setActiveId((cur) => (cur !== id ? cur : next[Math.min(idx, next.length - 1)]?.id ?? ''));
      return next;
    });
  }, []);

  return {
    files,
    activeId,
    saving,
    error,
    openFile,
    updateContent,
    saveFile,
    closeFile,
    setActiveId,
  };
}
