import { useState, useCallback, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { WorkspaceTabs, type WorkspaceTab } from '../../shell/WorkspaceTabs';
import { HubPanel } from './HubPanel';
import { AreaView } from './AreaView';
import { AREA_BY_ID, type AreaId } from './areas';

/**
 * Una pestaña abierta: un Hub (grid de cards) o un Área concreta.
 * `key` es estable e identifica la pestaña aunque cambie el orden.
 */
type Tab =
  | { key: string; kind: 'hub' }
  | { key: string; kind: 'area'; area: AreaId };

let _seq = 0;
const nextKey = (prefix: string): string => `${prefix}-${++_seq}`;

/**
 * Shell de la ventana principal tras el login: SIN sidebar, modelo de pestañas.
 *
 * - La primera pestaña es siempre un Hub (grid de áreas + "Añadir pestaña").
 * - Click en una card de área → abre esa área como pestaña nueva (o la enfoca
 *   si ya estaba abierta).
 * - "Añadir pestaña" → abre otro Hub.
 * - Las pestañas se pueden cerrar (excepto si es la última).
 *
 * Los paneles se mantienen montados (display:none en el inactivo) para no
 * perder su estado al cambiar de pestaña.
 */
export function MainShell() {
  const firstKey = useRef(nextKey('hub')).current;
  const [tabs, setTabs] = useState<Tab[]>([{ key: firstKey, kind: 'hub' }]);
  const [activeKey, setActiveKey] = useState<string>(firstKey);

  /** Abre un área como pestaña nueva, o enfoca la existente. */
  const openArea = useCallback((area: AreaId) => {
    setTabs((prev) => {
      const existing = prev.find((t) => t.kind === 'area' && t.area === area);
      if (existing) {
        setActiveKey(existing.key);
        return prev;
      }
      const key = nextKey('area');
      setActiveKey(key);
      return [...prev, { key, kind: 'area', area }];
    });
  }, []);

  /** Abre una pestaña-Hub nueva. */
  const addHubTab = useCallback(() => {
    const key = nextKey('hub');
    setTabs((prev) => [...prev, { key, kind: 'hub' }]);
    setActiveKey(key);
  }, []);

  /** Cierra una pestaña; si era la activa, salta a la vecina. */
  const closeTab = useCallback((key: string) => {
    setTabs((prev) => {
      if (prev.length === 1) return prev; // nunca dejar cero pestañas
      const idx = prev.indexOf(prev.find((t) => t.key === key)!);
      const next = prev.filter((t) => t.key !== key);
      setActiveKey((cur) => {
        if (cur !== key) return cur;
        const neighbour = next[Math.min(idx, next.length - 1)];
        return neighbour?.key ?? next[0]!.key;
      });
      return next;
    });
  }, []);

  const tabBar: WorkspaceTab[] = tabs.map((t) =>
    t.kind === 'hub'
      ? { id: t.key, label: 'Hub', icon: 'home' }
      : { id: t.key, label: AREA_BY_ID[t.area].label, icon: AREA_BY_ID[t.area].icon },
  );

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
        tabs={tabBar}
        activeId={activeKey}
        onChange={setActiveKey}
        closable={tabs.length > 1}
        onClose={closeTab}
        trailing={
          <button onClick={addHubTab} title="Nueva pestaña (Hub)" style={addBtnStyle}>
            <lib-icon name="plus" size="14" />
          </button>
        }
      />

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {tabs.map((t) => (
          <Panel key={t.key} visible={t.key === activeKey}>
            {t.kind === 'hub'
              ? <HubPanel onOpenArea={openArea} onAddTab={addHubTab} />
              : <AreaView area={t.area} />}
          </Panel>
        ))}
      </div>
    </div>
  );
}

function Panel({ visible, children }: { visible: boolean; children: ReactNode }) {
  return (
    <div style={{ position: 'absolute', inset: 0, display: visible ? 'block' : 'none', overflow: 'auto' }}>
      {children}
    </div>
  );
}

const addBtnStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '26px',
  height: '26px',
  background: 'none',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  color: 'var(--text-muted)',
};
