import type { ReactNode } from 'react';

interface GadgetFrameProps {
  title: string;
  icon: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function GadgetFrame({ title, icon, children, className, style }: GadgetFrameProps) {
  return (
    <div
      className={className}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        ...style,
      }}
    >
      <div
        className="dragHandle"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.625rem 0.875rem',
          borderBottom: '1px solid var(--border-subtle)',
          cursor: 'grab',
          userSelect: 'none',
          flexShrink: 0,
        }}
      >
        <lib-icon name={icon} size="16" style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}>
          {title}
        </span>
      </div>

      <div style={{ flexGrow: 1, overflow: 'auto', padding: '0.875rem' }}>
        {children}
      </div>
    </div>
  );
}
