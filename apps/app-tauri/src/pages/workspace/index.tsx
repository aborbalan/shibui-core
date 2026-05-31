import { useState } from 'react';
import type { ReactNode } from 'react';
import { WorkspaceTabs, type WorkspaceTab } from '../../shell/WorkspaceTabs';
import { FileBrowser } from '../../gadgets/FileExplorerGadget/FileBrowser';
import { GitGraphPanel } from './GitGraphPanel';

const TABS: WorkspaceTab[] = [
  { id: 'files', label: 'Files', icon: 'folder-open' },
  { id: 'git', label: 'Git', icon: 'git-branch' },
];

/**
 * Ventana de workspace del macro entorno: barra de tabs superior que conmuta
 * entre el explorador de ficheros y el visualizador de git. Sin sidebar —
 * pensada para vivir en su propio monitor.
 *
 * Los paneles se mantienen montados (display:none en el inactivo) para no
 * perder estado (ruta navegada, scroll del grafo) al cambiar de tab.
 */
export function WorkspacePage() {
  const [active, setActive] = useState<string>('files');

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
      <WorkspaceTabs tabs={TABS} activeId={active} onChange={setActive} />

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <Panel visible={active === 'files'}>
          <div style={{ height: '100%', padding: '0.875rem 1.25rem', boxSizing: 'border-box' }}>
            <FileBrowser />
          </div>
        </Panel>
        <Panel visible={active === 'git'}>
          <GitGraphPanel />
        </Panel>
      </div>
    </div>
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
