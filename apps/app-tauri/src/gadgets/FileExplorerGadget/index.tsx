import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { GadgetFrame } from '../GadgetFrame';

interface FsEntry {
  name: string;
  path: string;
  is_dir: boolean;
  extension: string | null;
  size: number | null;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}K`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}M`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}G`;
}

function entryIcon(entry: FsEntry): string {
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

function parentPath(path: string): string {
  const normalized = path.replace(/[/\\]+$/, '');
  const sep = normalized.includes('\\') ? '\\' : '/';
  const parts = normalized.split(sep);
  if (parts.length <= 1) return normalized;
  const parent = parts.slice(0, -1).join(sep);
  return parent || sep;
}

function baseName(path: string): string {
  const normalized = path.replace(/[/\\]+$/, '');
  const sep = normalized.includes('\\') ? '\\' : '/';
  const parts = normalized.split(sep).filter(Boolean);
  return parts[parts.length - 1] ?? normalized;
}

export function FileExplorerGadget() {
  const [currentPath, setCurrentPath] = useState('');
  const [entries, setEntries] = useState<FsEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useCallback((path: string) => {
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
    invoke<string>('get_home_dir')
      .then(navigate)
      .catch(() => navigate('C:\\'));
  }, [navigate]);

  const canGoUp = currentPath.replace(/[/\\]+$/, '').split(/[/\\]/).filter(Boolean).length > 1;

  return (
    <GadgetFrame title="Archivos" icon="folder-open">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '0.5rem' }}>

        {/* Nav bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          paddingBottom: '0.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <button
            onClick={() => canGoUp && !loading && navigate(parentPath(currentPath))}
            disabled={!canGoUp || loading}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.1rem 0.2rem',
              cursor: canGoUp && !loading ? 'pointer' : 'default',
              color: canGoUp ? 'rgba(250,247,244,0.5)' : 'rgba(250,247,244,0.18)',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
              borderRadius: '3px',
            }}
          >
            <lib-icon name="arrow-left" size="13" />
          </button>
          <span style={{
            fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
            fontSize: '0.6rem',
            color: 'rgba(250,247,244,0.35)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}>
            {baseName(currentPath) || currentPath}
          </span>
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
              color: 'rgba(250,247,244,0.22)',
            }}>
              Carpeta vacía
            </span>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {entries.map((entry) => (
                <div
                  key={entry.path}
                  onClick={() => entry.is_dir && navigate(entry.path)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.22rem 0.3rem',
                    borderRadius: '3px',
                    cursor: entry.is_dir ? 'pointer' : 'default',
                  }}
                  onMouseEnter={(e) => {
                    if (entry.is_dir) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  <lib-icon
                    name={entryIcon(entry)}
                    size="13"
                    style={{
                      color: entry.is_dir ? 'rgba(190,165,110,0.65)' : 'rgba(250,247,244,0.28)',
                      flexShrink: 0,
                    }}
                  />
                  <span style={{
                    fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
                    fontSize: '0.65rem',
                    color: entry.is_dir ? 'rgba(250,247,244,0.72)' : 'rgba(250,247,244,0.48)',
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
                      color: 'rgba(250,247,244,0.22)',
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
    </GadgetFrame>
  );
}
