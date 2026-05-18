import type { ReactNode } from 'react';
import { LibGlassCard } from '@shibui-ui/ui/react';

interface GadgetFrameProps {
  title: string;
  icon: string;
  children: ReactNode;
  /** Pass className down so react-grid-layout can attach drag handle */
  className?: string;
  style?: React.CSSProperties;
}

/*
 * NOTE — candidato a lib-gadget-frame (ver docs/components/BACKLOG.md)
 * La barra de título actúa como drag handle via la clase CSS dragHandle.
 */
export function GadgetFrame({ title, icon, children, className, style }: GadgetFrameProps) {
  return (
    <LibGlassCard
      variant="water"
      intensity="md"
      className={className}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
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
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          cursor: 'grab',
          userSelect: 'none',
          flexShrink: 0,
        }}
      >
        <lib-icon name={icon} size="16" style={{ color: 'rgba(250,247,244,0.4)', flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(250,247,244,0.35)',
        }}>
          {title}
        </span>
      </div>

      <div style={{ flexGrow: 1, overflow: 'auto', padding: '0.875rem' }}>
        {children}
      </div>
    </LibGlassCard>
  );
}
