import ReactGridLayout from 'react-grid-layout';
import { useGadgetLayout } from '../../hooks/useGadgetLayout';
import { NotesGadget } from '../../gadgets/NotesGadget';
import { SystemMonitorGadget } from '../../gadgets/SystemMonitorGadget';
import { FileExplorerGadget } from '../../gadgets/FileExplorerGadget';
import type { Layout } from 'react-grid-layout';

const GADGETS: Record<string, JSX.Element> = {
  notes:   <NotesGadget />,
  sysmon:  <SystemMonitorGadget />,
  fileexp: <FileExplorerGadget />,
};

const COL_WIDTH = 120;
const COLS = 12;
const ROW_HEIGHT = 60;
const MARGIN: [number, number] = [12, 12];

export function DashboardPage() {
  const { layout, setLayout, resetLayout } = useGadgetLayout();

  return (
    <div style={{
      padding: '1rem',
      minHeight: '100vh',
      background: 'var(--bg-base, #120e0a)',
      position: 'relative',
    }}>
      {import.meta.env.DEV && (
        <button
          onClick={resetLayout}
          style={{
            position: 'fixed',
            bottom: '1rem',
            right: '1rem',
            zIndex: 9999,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '6px',
            padding: '0.35rem 0.75rem',
            cursor: 'pointer',
            fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
            fontSize: '0.6rem',
            letterSpacing: '0.12em',
            color: 'rgba(250,247,244,0.35)',
          }}
        >
          reset layout
        </button>
      )}
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
            {GADGETS[i]}
          </div>
        ))}
      </ReactGridLayout>
    </div>
  );
}
