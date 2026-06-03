import type { CSSProperties, ReactNode } from 'react';

export interface WorkspaceTab {
  id: string;
  label: string;
  icon: string;
}

interface WorkspaceTabsProps {
  tabs: WorkspaceTab[];
  activeId: string;
  onChange: (id: string) => void;
  /** Muestra el botón × en cada pestaña y habilita el cierre. */
  closable?: boolean;
  /** Llamado al pulsar × (o click central) en una pestaña. */
  onClose?: (id: string) => void;
  /** Contenido opcional alineado a la derecha de la barra (acciones, estado…). */
  trailing?: ReactNode;
}

/**
 * Barra de tabs superior reutilizable para las ventanas del macro entorno.
 * Estilo terminal/IDE, alineada con los tokens de Shibui. Controlada: el padre
 * mantiene `activeId` y reacciona a `onChange` / `onClose`.
 */
export function WorkspaceTabs({ tabs, activeId, onChange, closable, onClose, trailing }: WorkspaceTabsProps) {
  return (
    <div style={barStyle} role="tablist" aria-label="Workspace">
      <div style={{ display: 'flex', alignItems: 'stretch', minWidth: 0, overflowX: 'auto' }}>
        {tabs.map((tab) => {
          const active = tab.id === activeId;
          return (
            <div
              key={tab.id}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(tab.id)}
              onAuxClick={(e) => {
                // Click central cierra (patrón navegador/IDE).
                if (e.button === 1 && closable && onClose) {
                  e.preventDefault();
                  onClose(tab.id);
                }
              }}
              style={tabStyle(active)}
            >
              <lib-icon name={tab.icon} size="14" />
              <span style={{ whiteSpace: 'nowrap' }}>{tab.label}</span>
              {closable && onClose && (
                <button
                  aria-label={`Cerrar ${tab.label}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose(tab.id);
                  }}
                  style={closeBtnStyle}
                >
                  <lib-icon name="x" size="11" />
                </button>
              )}
            </div>
          );
        })}
      </div>
      {trailing && <div style={{ display: 'flex', alignItems: 'center', paddingRight: '0.75rem', flexShrink: 0 }}>{trailing}</div>}
    </div>
  );
}

const barStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'stretch',
  justifyContent: 'space-between',
  height: '38px',
  flexShrink: 0,
  background: 'var(--bg-elevated, #1a1410)',
  borderBottom: '1px solid var(--border-subtle, #2a2018)',
  fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
  userSelect: 'none',
};

function tabStyle(active: boolean): CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0 0.75rem 0 1rem',
    height: '100%',
    border: 'none',
    cursor: 'pointer',
    background: active ? 'var(--bg-base, #120e0a)' : 'transparent',
    color: active ? 'var(--text-accent, #e0a96d)' : 'var(--text-muted, #8a7a68)',
    borderBottom: active ? '2px solid var(--text-accent, #e0a96d)' : '2px solid transparent',
    fontSize: '0.7rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    transition: 'color 120ms ease, background 120ms ease',
  };
}

const closeBtnStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '16px',
  height: '16px',
  marginLeft: '0.15rem',
  padding: 0,
  background: 'none',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
  color: 'inherit',
  opacity: 0.6,
};
