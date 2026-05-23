import { FileBrowser } from '../../gadgets/FileExplorerGadget/FileBrowser';

export function FilesPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: 'var(--bg-base)',
      overflow: 'hidden',
    }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '1rem 1.5rem 0.875rem',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0,
      }}>
        <lib-icon
          name="folder-open"
          size="16"
          style={{ color: 'var(--text-accent)' }}
        />
        <span style={{
          fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
          fontSize: '0.65rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}>
          files
        </span>
      </div>

      {/* Browser */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '0.875rem 1.25rem' }}>
        <FileBrowser />
      </div>

    </div>
  );
}
