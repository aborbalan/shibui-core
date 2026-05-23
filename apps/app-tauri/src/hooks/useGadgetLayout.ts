import { useState, useEffect } from 'react';
import type { Layout } from 'react-grid-layout';

const STORAGE_KEY = 'shibui-dashboard-layout';

const DEFAULT_LAYOUT: Layout[] = [
  { i: 'notes',   x: 0, y: 0, w: 5, h: 6, minW: 3, minH: 4 },
  { i: 'sysmon',  x: 5, y: 0, w: 4, h: 6, minW: 3, minH: 4 },
  { i: 'fileexp', x: 0, y: 6, w: 7, h: 8, minW: 4, minH: 5 },
];

function loadLayout(): Layout[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Layout[];
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
