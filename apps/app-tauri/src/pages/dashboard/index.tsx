import ReactGridLayout from 'react-grid-layout';
import { useGadgetLayout } from '../../hooks/useGadgetLayout';
import { NotesGadget } from '../../gadgets/NotesGadget';
import { SystemMonitorGadget } from '../../gadgets/SystemMonitorGadget';
import type { Layout } from 'react-grid-layout';

const GADGETS: Record<string, JSX.Element> = {
  notes:  <NotesGadget />,
  sysmon: <SystemMonitorGadget />,
};

const COL_WIDTH = 120;
const COLS = 12;
const ROW_HEIGHT = 60;
const MARGIN: [number, number] = [12, 12];

export function DashboardPage() {
  const { layout, setLayout } = useGadgetLayout();

  return (
    <div style={{
      padding: '1rem',
      minHeight: '100vh',
      background: 'var(--bg-base, #120e0a)',
    }}>
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
