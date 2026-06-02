import { useState } from 'react';
import type { ReactNode } from 'react';
import { WorkspaceTabs, type WorkspaceTab } from '../../shell/WorkspaceTabs';
import { FileBrowser } from '../../gadgets/FileExplorerGadget/FileBrowser';
import { GitGraphPanel } from './GitGraphPanel';
import { useProject } from '../../core/hooks/useProject';

const TABS: WorkspaceTab[] = [
  { id: 'files', label: 'Files', icon: 'folder-open' },
  { id: 'git', label: 'Git', icon: 'git-branch' },
];

/**
 * Ventana de workspace del macro entorno: barra de tabs (Files / Git) sobre el
 * proyecto abierto. El proyecto lo gestiona el servicio compartido `useProject`:
 * el explorador permite "abrir como proyecto" la carpeta navegada, y ambos
 * paneles (Files y Git) apuntan a `project.path`.
 *
 * Los paneles se mantienen montados (display:none en el inactivo) para no
 * perder estado al cambiar de tab.
 */
export function WorkspacePage() {
  const [active, setActive] = useState<string>('files');
  const { project, openProject } = useProject();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: 'var(--bg-base, #120e0a)',
      }}
    >
      <WorkspaceTabs
        tabs={TABS}
        activeId={active}
        onChange={setActive}
        trailing={<ProjectBadge />}
      />

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <Panel visible={active === 'files'}>
          <div style={{ height: '100%', padding: '0.875rem 1.25rem', boxSizing: 'border-box' }}>
            {/* key fuerza re-montaje al cambiar de proyecto → re-navega a su raíz */}
            <FileBrowser
              key={project?.path ?? 'home'}
              initialPath={project?.path}
              onOpenProject={openProject}
            />
          </div>
        </Panel>
        <Panel visible={active === 'git'}>
          <GitGraphPanel repoPath={project?.path} />
        </Panel>
      </div>
    </div>
  );
}

/** Chip con el proyecto abierto (nombre + rama), a la derecha de los tabs. */
function ProjectBadge() {
  const { project } = useProject();

  if (!project) {
    return (
      <span
        style={{
          fontSize: '0.6rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}
      >
        sin proyecto
      </span>
    );
  }

  return (
    <span
      title={project.path}
      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.62rem' }}
    >
      <lib-icon name="folder-open" size="12" style={{ color: 'var(--text-accent)' }} />
      <span style={{ color: 'var(--text-primary)' }}>{project.name}</span>
      {project.git_branch && (
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--text-muted)' }}>
          <lib-icon name="git-branch" size="11" />
          {project.git_branch}
        </span>
      )}
    </span>
  );
}

function Panel({ visible, children }: { visible: boolean; children: ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: visible ? 'block' : 'none',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}
