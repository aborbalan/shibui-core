interface SectionPlaceholderProps {
  section: string;
  icon: string;
}

export function SectionPlaceholder({ section, icon }: SectionPlaceholderProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: '1rem',
      background: 'var(--bg-base)',
    }}>
      <lib-icon name={icon} size="32" style={{ color: 'var(--text-muted)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
        <span style={{
          fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--text-primary)',
        }}>
          {section}
        </span>
        <span style={{
          fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
          fontSize: '0.6rem',
          letterSpacing: '0.12em',
          color: 'var(--text-muted)',
        }}>
          en desarrollo
        </span>
      </div>
    </div>
  );
}
