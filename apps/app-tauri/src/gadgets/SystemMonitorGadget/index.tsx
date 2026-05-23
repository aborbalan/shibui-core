import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { GadgetFrame } from '../GadgetFrame';

interface SystemInfo {
  cpu_usage: number;
  ram_used_gb: number;
  ram_total_gb: number;
  disk_used_gb: number;
  disk_total_gb: number;
}

function MetricRow({ label, used, total, unit }: { label: string; used: number; total: number; unit: string }) {
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
    </div>
  );
}

export function SystemMonitorGadget() {
  const [info, setInfo] = useState<SystemInfo | null>(null);

  useEffect(() => {
    const fetch = () => invoke<SystemInfo>('get_system_info').then(setInfo).catch(() => null);
    fetch();
    const id = setInterval(fetch, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <GadgetFrame title="Sistema" icon="activity">
      {!info ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '1rem' }}>
          <lib-spinner variant="enso" size="sm" />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <lib-eyebrow style={{ fontSize: '0.55rem', letterSpacing: '0.18em' }}>CPU</lib-eyebrow>
              <span style={{
                fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
                fontSize: '0.65rem',
                color: 'var(--text-secondary)',
              }}>
                {info.cpu_usage.toFixed(1)} %
              </span>
            </div>
            <lib-progress
              value={info.cpu_usage}
              max={100}
              size="xs"
              tone={info.cpu_usage > 85 ? 'error' : info.cpu_usage > 65 ? 'kaki' : 'celadon'}
            />
          </div>

          <MetricRow label="RAM"   used={info.ram_used_gb}  total={info.ram_total_gb}  unit="GB" />
          <MetricRow label="Disco" used={info.disk_used_gb} total={info.disk_total_gb} unit="GB" />
        </div>
      )}
    </GadgetFrame>
  );
}
