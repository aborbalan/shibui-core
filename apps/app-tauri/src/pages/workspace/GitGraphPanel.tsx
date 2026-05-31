import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface GitCommit {
  hash: string;
  parents: string[];
  message: string;
  author: string;
  date: string;
  refs: string[];
}

/**
 * Vista de git a pantalla completa para el workspace. Reutiliza el comando
 * Rust `get_git_log` y pinta el web component `<lib-git-graph>`. Permite
 * apuntar a cualquier repositorio escribiendo su ruta (por defecto, el HOME).
 */
export function GitGraphPanel() {
  const graphRef = useRef<any>(null);
  const [repoPath, setRepoPath] = useState<string>('');
  const [draftPath, setDraftPath] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (path: string) => {
    setLoading(true);
    setError(null);
    try {
      const commits = await invoke<GitCommit[]>('get_git_log', { path, maxCount: 80 });
      if (graphRef.current) graphRef.current.commits = commits;
      if (commits.length === 0) setError('Sin commits (¿es un repositorio git?).');
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const home = await invoke<string>('get_home_dir');
        if (cancelled) return;
        setRepoPath(home);
        setDraftPath(home);
        await load(home);
      } catch (e) {
        if (!cancelled) {
          setError(String(e));
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  const submitPath = () => {
    const next = draftPath.trim();
    if (next && next !== repoPath) {
      setRepoPath(next);
      load(next);
    } else {
      load(repoPath);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Barra de ruta */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.6rem 0.9rem',
          borderBottom: '1px solid var(--border-subtle, #2a2018)',
          flexShrink: 0,
        }}
      >
        <lib-icon name="git-branch" size="14" style={{ color: 'var(--text-accent)' }} />
        <input
          value={draftPath}
          onChange={(e) => setDraftPath(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submitPath();
          }}
          spellCheck={false}
          placeholder="Ruta del repositorio…"
          style={{
            flex: 1,
            minWidth: 0,
            background: 'var(--bg-base, #120e0a)',
            border: '1px solid var(--border-subtle, #2a2018)',
            borderRadius: '4px',
            padding: '0.3rem 0.5rem',
            color: 'var(--text-default, #e8dcc8)',
            fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
            fontSize: '0.7rem',
          }}
        />
        <button onClick={submitPath} style={btnStyle}>
          {loading ? '…' : 'cargar'}
        </button>
      </div>

      {/* Gráfico */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0.75rem' }}>
        {error && (
          <div style={{ color: 'var(--text-danger, #e57373)', fontSize: '0.75rem', padding: '0.5rem' }}>
            {error}
          </div>
        )}
        <lib-git-graph ref={graphRef} />
      </div>
    </div>
  );
}

const btnStyle: CSSProperties = {
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border-default)',
  borderRadius: '4px',
  padding: '0.3rem 0.7rem',
  cursor: 'pointer',
  fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
  fontSize: '0.65rem',
  letterSpacing: '0.1em',
  color: 'var(--text-muted)',
};
