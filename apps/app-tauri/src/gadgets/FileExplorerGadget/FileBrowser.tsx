import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';

export interface FsEntry {
  name: string;
  path: string;
  is_dir: boolean;
  extension: string | null;
  size: number | null;
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}K`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}M`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}G`;
}

export function entryIcon(entry: FsEntry): string {
  if (entry.is_dir) return 'folder';
  const ext = entry.extension?.toLowerCase();
  if (!ext) return 'file';
  if (['ts', 'tsx', 'js', 'jsx', 'mjs', 'rs', 'py', 'go', 'c', 'cpp', 'h', 'css', 'scss', 'html', 'htm'].includes(ext)) return 'file-code';
  if (['json', 'toml', 'yaml', 'yml', 'xml', 'env'].includes(ext)) return 'file-code';
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico'].includes(ext)) return 'file-image';
  if (['md', 'mdx', 'txt', 'log'].includes(ext)) return 'file-text';
  if (['mp3', 'wav', 'flac', 'ogg', 'm4a'].includes(ext)) return 'file-audio';
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) return 'file-video';
  if (['pdf'].includes(ext)) return 'file-pdf';
  if (['zip', 'tar', 'gz', 'rar', '7z'].includes(ext)) return 'file-zip';
  return 'file';
}

export function parentPath(path: string): string {
  const normalized = path.replace(/[/\\]+$/, '');
  const sep = normalized.includes('\\') ? '\\' : '/';
  const parts = normalized.split(sep);
  if (parts.length <= 1) return normalized;
  const parent = parts.slice(0, -1).join(sep);
  return parent || sep;
}

export function baseName(path: string): string {
  const normalized = path.replace(/[/\\]+$/, '');
  const sep = normalized.includes('\\') ? '\\' : '/';
  const parts = normalized.split(sep).filter(Boolean);
  return parts[parts.length - 1] ?? normalized;
}

interface FileBrowserProps {
  rowSize?: 'compact' | 'default';
  /**
   * Carpeta inicial. Si se omite, arranca en el HOME del usuario (caso gadget).
   * El workspace pasa aquí la ruta del proyecto abierto.
   */
  initialPath?: string;
  /**
   * Si se define, muestra un botón "abrir como proyecto" en la barra de
   * navegación que invoca este callback con la carpeta actual.
   */
  onOpenProject?: (path: string) => void;
}

export function FileBrowser({ rowSize = 'default', initialPath, onOpenProject }: FileBrowserProps) {
  const [currentPath, setCurrentPath] = useState('');
  const [entries, setEntries] = useState<FsEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigateTo = useCallback((path: string) => {
    setLoading(true);
    setError(null);
    invoke<FsEntry[]>('list_dir', { path })
      .then((result) => {
        setCurrentPath(path);
        setEntries(result);
      })
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (initialPath) {
      navigateTo(initialPath);
      return;
    }
    invoke<string>('get_home_dir')
      .then(navigateTo)
      .catch(() => navigateTo('C:\\'));
  }, [navigateTo, initialPath]);

  const canGoUp = currentPath.replace(/[/\\]+$/, '').split(/[/\\]/).filter(Boolean).length > 1;

  const rowPadding = rowSize === 'compact' ? '0.22rem 0.3rem' : '0.35rem 0.5rem';
  const iconSize   = rowSize === 'compact' ? '13' : '15';
  const fontSize   = rowSize === 'compact' ? '0.65rem' : '0.72rem';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '0.5rem' }}>

      {/* Nav bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0,
      }}>
        <button
          onClick={() => canGoUp && !loading && navigateTo(parentPath(currentPath))}
          disabled={!canGoUp || loading}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.1rem 0.2rem',
            cursor: canGoUp && !loading ? 'pointer' : 'default',
            color: canGoUp ? 'var(--text-secondary)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            borderRadius: '3px',
          }}
        >
          <lib-icon name="arrow-left" size={iconSize} />
        </button>
        <span style={{
          fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
          fontSize: '0.6rem',
          color: 'var(--text-muted)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1,
        }}>
          {currentPath}
        </span>
        {onOpenProject && currentPath && !loading && (
          <button
            onClick={() => onOpenProject(currentPath)}
            title="Abrir esta carpeta como proyecto"
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: '4px',
              padding: '0.2rem 0.5rem',
              cursor: 'pointer',
              fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
              fontSize: '0.55rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-accent)',
            }}
          >
            <lib-icon name="folder-open" size="12" />
            abrir proyecto
          </button>
        )}
      </div>

      {/* File list */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '0.75rem' }}>
            <lib-spinner variant="enso" size="sm" />
          </div>
        ) : error ? (
          <span style={{
            fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
            fontSize: '0.65rem',
            color: 'rgba(220,80,80,0.75)',
          }}>
            {error}
          </span>
        ) : entries.length === 0 ? (
          <span style={{
            fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
          }}>
            Carpeta vacía
          </span>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {entries.map((entry) => (
              <div
                key={entry.path}
                onClick={() => entry.is_dir && navigateTo(entry.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: rowPadding,
                  borderRadius: '4px',
                  cursor: entry.is_dir ? 'pointer' : 'default',
                }}
                onMouseEnter={(e) => {
                  if (entry.is_dir) (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <lib-icon
                  name={entryIcon(entry)}
                  size={iconSize}
                  style={{
                    color: entry.is_dir ? 'var(--text-accent)' : 'var(--text-muted)',
                    flexShrink: 0,
                  }}
                />
                <span style={{
                  fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
                  fontSize,
                  // Las carpetas se resaltan con el token de acento (verde phosphor en
                  // katachi terminal). NO usar --text-primary: en el light DOM de React
                  // ese token puede caer al default claro (washi-900, casi negro) y las
                  // carpetas quedan invisibles sobre el fondo oscuro. --text-accent y
                  // --text-secondary son valores literales por katachi y siempre se ven.
                  color: entry.is_dir
                    ? 'var(--text-accent, #4E9482)'
                    : 'var(--text-secondary, #9aa0a6)',
                  fontWeight: entry.is_dir ? 500 : 400,
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {entry.name}
                </span>
                {entry.size != null && (
                  <span style={{
                    fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
                    fontSize: '0.52rem',
                    color: 'var(--text-muted)',
                    flexShrink: 0,
                  }}>
                    {formatSize(entry.size)}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
