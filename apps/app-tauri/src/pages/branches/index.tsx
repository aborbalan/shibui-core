import ReactGridLayout from 'react-grid-layout';
import type { Layout } from 'react-grid-layout';
import { useGadgetLayout } from '../../hooks/useGadgetLayout';
import { useProject } from '../../core/hooks/useProject';
import { GitGraphGadget } from '../../gadgets/GitGraphGadget';
import { AgentGadget } from '../../gadgets/AgentGadget';
import { MOCK_AGENTS } from './agents.mock';

const STORAGE_KEY = 'shibui-branches-layout';

const COL_WIDTH = 120;
const COLS = 12;
const ROW_HEIGHT = 60;
const MARGIN: [number, number] = [12, 12];

/** Layout por defecto: grafo arriba ocupando ancho, agentes en rejilla debajo. */
const DEFAULT_LAYOUT: Layout[] = [
  { i: 'gitgraph', x: 0, y: 0, w: 12, h: 8, minW: 5, minH: 5 },
  ...MOCK_AGENTS.map((a, idx) => ({
    i: `agent-${a.id}`,
    x: (idx % 3) * 4,
    y: 8 + Math.floor(idx / 3) * 4,
    w: 4,
    h: 4,
    minW: 3,
    minH: 3,
  })),
];

/**
 * Área "Branches / Agents" — vista de mando. Grid de gadgets arrastrables
 * (mismo motor que el Dashboard) sobre el proyecto abierto:
 *   - GitGraphGadget: ramas del repo (`get_git_log`).
 *   - AgentGadget: una tarjeta por agente (datos mock por ahora).
 *
 * Layout independiente del Dashboard (storageKey propio).
 */
export function BranchesPage() {
  const { project } = useProject();
  const { layout, setLayout, resetLayout } = useGadgetLayout(STORAGE_KEY, DEFAULT_LAYOUT);

  if (!project) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '100%', gap: '0.6rem', background: 'var(--bg-base)', textAlign: 'center', padding: '2rem',
      }}>
        <lib-icon name="dots" size="32" style={{ color: 'var(--text-muted)' }} />
        <span style={{
          fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)', fontSize: '0.8rem',
          letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-primary)',
        }}>
          Sin proyecto abierto
        </span>
        <span style={{
          fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)', fontSize: '0.65rem',
          color: 'var(--text-muted)', maxWidth: 320, lineHeight: 1.6,
        }}>
          Abre un proyecto (área Files → "abrir proyecto") para ver sus ramas y agentes.
        </span>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', minHeight: '100%', background: 'var(--bg-base, #120e0a)', position: 'relative' }}>
      <button onClick={resetLayout} style={resetBtnStyle}>reset layout</button>

      <ReactGridLayout
        className="layout"
        layout={layout}
        cols={COLS}
        rowHeight={ROW_HEIGHT}
        width={COLS * COL_WIDTH + (COLS + 1) * MARGIN[0]}
        margin={MARGIN}
        draggableHandle=".dragHandle"
        onLayoutChange={(newLayout: Layout[]) => setLayout(newLayout)}
        resizeHandles={['se']}
      >
        {layout.map(({ i }) => (
          <div key={i} style={{ height: '100%' }}>
            {renderGadget(i, project.path)}
          </div>
        ))}
      </ReactGridLayout>
    </div>
  );
}

function renderGadget(id: string, repoPath: string) {
  if (id === 'gitgraph') {
    return <GitGraphGadget repoPath={repoPath} />;
  }
  if (id.startsWith('agent-')) {
    const agent = MOCK_AGENTS.find((a) => `agent-${a.id}` === id);
    return agent ? <AgentGadget agent={agent} /> : null;
  }
  return null;
}

const resetBtnStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '1rem',
  right: '1rem',
  zIndex: 9999,
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border-default)',
  borderRadius: '6px',
  padding: '0.35rem 0.75rem',
  cursor: 'pointer',
  fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
  fontSize: '0.6rem',
  letterSpacing: '0.12em',
  color: 'var(--text-muted)',
};
