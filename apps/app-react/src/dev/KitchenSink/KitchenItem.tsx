import type { ReactNode } from 'react';
import { coverageOf } from './catalog';
import { StatusBadge } from './StatusBadge';

interface Props {
  name: string;
  note?: string;
  children: ReactNode;
}

export function KitchenItem({ name, note, children }: Props) {
  return (
    <article
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--lib-space-sm)',
        padding: 'var(--lib-space-md)',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm, 2px)',
      }}
    >
      <header style={{ display: 'flex', alignItems: 'center', gap: 'var(--lib-space-sm)', flexWrap: 'wrap' }}>
        <h4 style={{ margin: 0, fontFamily: 'var(--lib-font-mono, monospace)', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
          {name}
        </h4>
        <StatusBadge coverage={coverageOf(name)} />
        {note && <small style={{ color: 'var(--text-muted)' }}>{note}</small>}
      </header>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--lib-space-sm)', alignItems: 'flex-start' }}>
        {children}
      </div>
    </article>
  );
}
