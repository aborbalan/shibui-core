import { useState, useEffect, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import '@shibui-ui/ui';
import { GadgetFrame } from '../GadgetFrame';
import type { GitCommit } from '@shibui-ui/ui';

interface GitGraphGadgetProps {
  /** Ruta absoluta al repositorio git a visualizar. */
  repoPath: string;
  /** Alto del área de scroll en px. Default 420. */
  height?: number;
  /** Número máximo de commits a cargar. Default 100. */
  maxCount?: number;
}

export function GitGraphGadget({ repoPath, height = 420, maxCount = 100 }: GitGraphGadgetProps) {
  const [commits, setCommits] = useState<GitCommit[]>([]);
  const [error,   setError  ] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const graphRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    invoke<GitCommit[]>('get_git_log', { path: repoPath, maxCount })
      .then((data) => { setCommits(data); setLoading(false); })
      .catch((err: unknown) => {
        setError(String(err));
        setLoading(false);
      });
  }, [repoPath, maxCount]);

  /* Los arrays no se pueden pasar como atributos HTML — se asignan como
     propiedad JS directamente en el elemento del DOM. */
  useEffect(() => {
    const el = graphRef.current as (HTMLElement & { commits?: GitCommit[] }) | null;
    if (el) el.commits = commits;
  }, [commits]);

  return (
    <GadgetFrame title="Git Graph" icon="git-branch">
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '1rem' }}>
          <lib-spinner variant="enso" size="sm" />
        </div>
      ) : error ? (
        <div style={{ padding: '1rem', color: 'var(--color-error-text, #f87171)', fontFamily: 'var(--lib-font-mono)', fontSize: '0.75rem' }}>
          {error}
        </div>
      ) : (
        <lib-git-graph
          ref={graphRef}
          height={height}
          show-date=""
        />
      )}
    </GadgetFrame>
  );
}
