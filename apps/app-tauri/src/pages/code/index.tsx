import { useProject } from '../../core/hooks/useProject';
import { LibTextEditor, LibTreeSelect, LibSpinner, LibIcon } from '@shibui-ui/ui/react';
import type { EditorFile } from '@shibui-ui/ui';
import { useOpenFiles } from './useOpenFiles';
import { useFileTree } from './useFileTree';
import './code.css';

/**
 * Área "Code" — editor estilo VS Code. Layout fijo de 2 columnas:
 *   izquierda  → árbol de ficheros del proyecto abierto (`lib-tree-select` inline)
 *   derecha    → editor multi-fichero (`lib-text-editor`)
 *
 * Opera sobre el proyecto abierto del servicio compartido (`useProject`). Si no
 * hay proyecto, muestra un empty-state. Usa los wrappers React de @shibui-ui/ui
 * (no los elementos intrinsic) para que los eventos `onUiLib*` se conecten.
 */
export function CodePage() {
  const { project } = useProject();
  const { nodes, fileIds, loading: treeLoading } = useFileTree(project?.path);
  const {
    files, activeId, saving, error,
    openFile, updateContent, saveFile, setActiveId,
  } = useOpenFiles();

  if (!project) {
    return (
      <div className="code-empty">
        <LibIcon name="folder" size="32" style={{ color: 'var(--text-muted)' }} />
        <p className="code-empty-title">Sin proyecto abierto</p>
        <p className="code-empty-desc">Abre un proyecto (área Files → "abrir proyecto") para editar su código.</p>
      </div>
    );
  }

  return (
    <div className="code-root">
      {/* ── Panel izquierdo: árbol ── */}
      <aside className="code-tree">
        <div className="code-tree-head">
          <LibIcon name="folder" size="13" style={{ color: 'var(--text-accent)' }} />
          <span>{project.name}</span>
        </div>
        <div className="code-tree-body">
          {treeLoading ? (
            <div className="code-tree-state"><LibSpinner variant="enso" size="sm" /></div>
          ) : (
            <LibTreeSelect
              inline
              searchable={false}
              nodes={nodes}
              onUiLibTreeChange={(e: CustomEvent<{ ids: string[] }>) => {
                // Solo abrimos hojas (ficheros); las carpetas solo expanden.
                const id = e.detail.ids[e.detail.ids.length - 1];
                if (id && fileIds.has(id)) void openFile(id);
              }}
            />
          )}
        </div>
      </aside>

      {/* ── Panel derecho: editor ── */}
      <main className="code-editor">
        <LibTextEditor
          active={activeId}
          saving={saving}
          files={files as EditorFile[]}
          placeholder="Selecciona un fichero del árbol para empezar"
          onUiLibTextEditorTabChange={(e: CustomEvent<{ id: string }>) => setActiveId(e.detail.id)}
          onUiLibTextEditorChange={(e: CustomEvent<{ id: string; content: string }>) =>
            updateContent(e.detail.id, e.detail.content)}
          onUiLibTextEditorSave={(e: CustomEvent<{ id: string }>) => void saveFile(e.detail.id)}
        />
        {error && <div className="code-error">{error}</div>}
      </main>
    </div>
  );
}
