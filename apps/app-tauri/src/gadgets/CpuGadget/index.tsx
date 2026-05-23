import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { GadgetFrame } from '../GadgetFrame';

interface CpuDetail {
  brand: string;
  physical_cores: number;
  logical_cores: number;
  global_usage: number;
  frequency_mhz: number;
  per_core: number[];
}

function coreTone(pct: number): string {
  if (pct > 85) return 'error';
  if (pct > 65) return 'kaki';
  return 'celadon';
}

export function CpuGadget() {
  const [info, setInfo] = useState<CpuDetail | null>(null);

  useEffect(() => {
    const fetch = () => invoke<CpuDetail>('get_cpu_detail').then(setInfo).catch(() => null);
    fetch();
    const id = setInterval(fetch, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <GadgetFrame title="CPU" icon="cpu">
      {!info ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '1rem' }}>
          <lib-spinner variant="enso" size="sm" />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%' }}>

          {/* Summary row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            flexShrink: 0,
          }}>
            <span style={{
              fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
              fontSize: '0.6rem',
              color: 'var(--text-muted)',
              maxWidth: '55%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {info.brand || 'CPU'}
            </span>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'baseline' }}>
              <span style={{
                fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
                fontSize: '0.55rem',
                color: 'var(--text-muted)',
              }}>
                {info.physical_cores}P / {info.logical_cores}L
              </span>
              <span style={{
                fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
                fontSize: '0.65rem',
                color: 'var(--text-secondary)',
              }}>
                {info.global_usage.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Per-core grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.35rem 0.75rem',
            overflow: 'auto',
            flex: 1,
          }}>
            {info.per_core.map((usage, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{
                    fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
                    fontSize: '0.5rem',
                    color: 'var(--text-muted)',
                  }}>
                    {i}
                  </span>
                  <span style={{
                    fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
                    fontSize: '0.5rem',
                    color: 'var(--text-secondary)',
                  }}>
                    {usage.toFixed(0)}%
                  </span>
                </div>
                <lib-progress value={usage} max={100} size="xs" tone={coreTone(usage)} />
              </div>
            ))}
          </div>

        </div>
      )}
    </GadgetFrame>
  );
}
