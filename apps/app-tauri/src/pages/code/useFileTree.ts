import { useCallback, useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface FsEntry {
  name: string;
  path: string;
  is_dir: boolean;
  extension: string | null;
  size: number | null;
}

/** Nodo del árbol para `lib-tree-select`. `id` = ruta absoluta. */
export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  /** True si es un fichero (hoja seleccionable → abrir en editor). */
  isFile: boolean;
}

/** Carpetas a no expandir nunca (ruido / pesadas). */
const IGNORE = new Set(['node_modules', '.git', 'target', 'dist', '.next', 'build']);

/** Profundidad máxima de carga eager para no recorrer proyectos enteros. */
const MAX_DEPTH = 4;

async function loadDir(path: string, depth: number): Promise<TreeNode[]> {
  if (depth > MAX_DEPTH) return [];
  let entries: FsEntry[];
  try {
    entries = await invoke<FsEntry[]>('list_dir', { path });
  } catch {
    return [];
  }

  const nodes: TreeNode[] = [];
  for (const e of entries) {
    if (e.is_dir && IGNORE.has(e.name)) continue;
    if (e.is_dir) {
      nodes.push({
        id: e.path,
        label: e.name,
        isFile: false,
        children: await loadDir(e.path, depth + 1),
      });
    } else {
      nodes.push({ id: e.path, label: e.name, isFile: true });
    }
  }
  return nodes;
}

/**
 * Carga el árbol de ficheros de `rootPath` (hasta MAX_DEPTH niveles, ignorando
 * carpetas pesadas). Devuelve nodos para `lib-tree-select` + un índice de
 * cuáles son ficheros (para distinguir "abrir" de "expandir" al seleccionar).
 */
export function useFileTree(rootPath: string | undefined) {
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [fileIds, setFileIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const collectFileIds = useCallback((ns: TreeNode[], acc: Set<string>) => {
    for (const n of ns) {
      if (n.isFile) acc.add(n.id);
      if (n.children) collectFileIds(n.children, acc);
    }
  }, []);

  useEffect(() => {
    if (!rootPath) {
      setNodes([]);
      setFileIds(new Set());
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      const tree = await loadDir(rootPath, 0);
      if (cancelled) return;
      const ids = new Set<string>();
      collectFileIds(tree, ids);
      setNodes(tree);
      setFileIds(ids);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [rootPath, collectFileIds]);

  return { nodes, fileIds, loading };
}
