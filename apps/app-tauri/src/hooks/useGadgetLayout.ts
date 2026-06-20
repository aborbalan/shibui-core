import { useState, useEffect } from 'react';
import type { Layout } from 'react-grid-layout';

const DASHBOARD_STORAGE_KEY = 'shibui-dashboard-layout';

const DASHBOARD_DEFAULT_LAYOUT: Layout[] = [
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

function loadLayout(storageKey: string, defaultLayout: Layout[]): Layout[] {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const saved: Layout[] = JSON.parse(raw) as Layout[];
      const knownIds = new Set(defaultLayout.map(l => l.i));
      const savedIds = new Set(saved.map(l => l.i));
      // If saved layout is missing new gadgets, reset to default
      const hasAll = [...knownIds].every(id => savedIds.has(id));
      if (hasAll) return saved;
    }
  } catch {
    // ignore
  }
  return defaultLayout;
}

/**
 * Estado + persistencia de un grid de gadgets (react-grid-layout).
 *
 * Parametrizable por `storageKey` y `defaultLayout` para reutilizarlo en varias
 * áreas sin colisión (Dashboard, Branches…). Sin argumentos usa los valores del
 * Dashboard (retrocompatible con los consumidores existentes).
 *
 * @param storageKey   clave de localStorage donde persiste el layout
 * @param defaultLayout layout por defecto (y baseline de migración: si el
 *                       guardado no tiene todos sus ids, se resetea)
 */
export function useGadgetLayout(
  storageKey: string = DASHBOARD_STORAGE_KEY,
  defaultLayout: Layout[] = DASHBOARD_DEFAULT_LAYOUT,
) {
  const [layout, setLayout] = useState<Layout[]>(() => loadLayout(storageKey, defaultLayout));

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(layout));
  }, [storageKey, layout]);

  const resetLayout = () => setLayout(defaultLayout);

  return { layout, setLayout, resetLayout };
}
