import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { GadgetFrame } from '../GadgetFrame';

interface DiskDetail {
  name: string;
  mount: string;
  total_gb: number;
  used_gb: number;
}

function DiskRow({ disk }: { disk: DiskDetail }) {
  const pct = disk.total_gb > 0 ? Math.round((disk.used_gb / disk.total_gb) * 100) : 0;
  const tone = pct > 90 ? 'error' : pct > 75 ? 'kaki' : 'celadon';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <lib-icon name="hard-drive" size="11" style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <span style={{
            fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
            fontSize: '0.6rem',
            color: 'var(--text-secondary)',
          }}>
            {disk.mount}
          </span>
        </div>
        <span style={{
          fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
          fontSize: '0.6rem',
          color: 'var(--text-secondary)',
        }}>
          {disk.used_gb.toFixed(0)} / {disk.total_gb.toFixed(0)} GB
        </span>
      </div>
      <lib-progress value={disk.used_gb} max={disk.total_gb} size="xs" tone={tone} />
    </div>
  );
}

export function DiskGadget() {
  const [disks, setDisks] = useState<DiskDetail[]>([]);

  useEffect(() => {
    const fetch = () => invoke<DiskDetail[]>('get_disk_detail').then(setDisks).catch(() => null);
    fetch();
    const id = setInterval(fetch, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <GadgetFrame title="Almacenamiento" icon="hard-drives">
      {disks.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '1rem' }}>
          <lib-spinner variant="enso" size="sm" />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {disks.map((d) => <DiskRow key={d.mount} disk={d} />)}
        </div>
      )}
    </GadgetFrame>
  );
}
