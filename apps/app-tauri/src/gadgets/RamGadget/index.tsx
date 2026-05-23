import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { GadgetFrame } from '../GadgetFrame';

interface MemoryDetail {
  ram_used_gb: number;
  ram_total_gb: number;
  swap_used_gb: number;
  swap_total_gb: number;
}

function MemBar({ label, used, total, unit }: { label: string; used: number; total: number; unit: string }) {
  const pct = total > 0 ? Math.round((used / total) * 100) : 0;
  const tone = pct > 85 ? 'error' : pct > 65 ? 'kaki' : 'celadon';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <lib-eyebrow style={{ fontSize: '0.55rem', letterSpacing: '0.18em' }}>{label}</lib-eyebrow>
        <span style={{
          fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
          fontSize: '0.65rem',
          color: 'var(--text-secondary)',
        }}>
          {used.toFixed(1)} / {total.toFixed(1)} {unit}
        </span>
      </div>
      <lib-progress value={used} max={total} size="xs" tone={tone} />
      <span style={{
        fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
        fontSize: '0.52rem',
        color: 'var(--text-muted)',
        textAlign: 'right',
      }}>
        {pct}%
      </span>
    </div>
  );
}

export function RamGadget() {
  const [info, setInfo] = useState<MemoryDetail | null>(null);

  useEffect(() => {
    const fetch = () => invoke<MemoryDetail>('get_memory_detail').then(setInfo).catch(() => null);
    fetch();
    const id = setInterval(fetch, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <GadgetFrame title="Memoria" icon="memory">
      {!info ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '1rem' }}>
          <lib-spinner variant="enso" size="sm" />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <MemBar label="RAM"  used={info.ram_used_gb}  total={info.ram_total_gb}  unit="GB" />
          {info.swap_total_gb > 0 && (
            <MemBar label="SWAP" used={info.swap_used_gb} total={info.swap_total_gb} unit="GB" />
          )}
        </div>
      )}
    </GadgetFrame>
  );
}
