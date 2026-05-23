import { useState, useEffect } from 'react';
import type { Layout } from 'react-grid-layout';

const STORAGE_KEY = 'shibui-dashboard-layout';

const DEFAULT_LAYOUT: Layout[] = [
  // Row 1 — notes + system overview + CPU detail
  { i: 'notes',   x: 0, y: 0,  w: 3, h: 5, minW: 2, minH: 4 },
  { i: 'sysmon',  x: 3, y: 0,  w: 3, h: 5, minW: 2, minH: 4 },
  { i: 'cpu',     x: 6, y: 0,  w: 6, h: 5, minW: 4, minH: 4 },
  // Row 2 — RAM + disk + network
  { i: 'ram',     x: 0, y: 5,  w: 3, h: 5, minW: 2, minH: 3 },
  { i: 'disk',    x: 3, y: 5,  w: 5, h: 5, minW: 3, minH: 3 },
  { i: 'network', x: 8, y: 5,  w: 4, h: 5, minW: 3, minH: 3 },
  // Row 3 — file explorer
  { i: 'fileexp', x: 0, y: 10, w: 7, h: 8, minW: 4, minH: 5 },
];

function loadLayout(): Layout[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved: Layout[] = JSON.parse(raw) as Layout[];
      const knownIds = new Set(DEFAULT_LAYOUT.map(l => l.i));
      const savedIds = new Set(saved.map(l => l.i));
      // If saved layout is missing new gadgets, reset to default
      const hasAll = [...knownIds].every(id => savedIds.has(id));
      if (hasAll) return saved;
    }
  } catch {
    // ignore
  }
  return DEFAULT_LAYOUT;
}

export function useGadgetLayout() {
  const [layout, setLayout] = useState<Layout[]>(loadLayout);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  }, [layout]);

  const resetLayout = () => setLayout(DEFAULT_LAYOUT);

  return { layout, setLayout, resetLayout };
}
