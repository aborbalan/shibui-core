import { useState, useEffect, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { GadgetFrame } from '../GadgetFrame';

interface NetworkInterface {
  name: string;
  rx_bytes: number;
  tx_bytes: number;
}

interface NetworkRate extends NetworkInterface {
  rx_rate: number;
  tx_rate: number;
}

const POLL_MS = 2000;

function fmtBytes(n: number): string {
  if (n < 1024) return `${n.toFixed(0)} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function fmtRate(bps: number): string {
  if (bps < 1024) return `${bps.toFixed(0)} B/s`;
  if (bps < 1024 * 1024) return `${(bps / 1024).toFixed(1)} KB/s`;
  return `${(bps / (1024 * 1024)).toFixed(1)} MB/s`;
}

export function NetworkGadget() {
  const [ifaces, setIfaces] = useState<NetworkRate[]>([]);
  const prevRef = useRef<Map<string, { rx: number; tx: number }>>(new Map());

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await invoke<NetworkInterface[]>('get_network_detail');
        const rates: NetworkRate[] = data.map((iface) => {
          const prev = prevRef.current.get(iface.name);
          const rx_rate = prev ? Math.max(0, (iface.rx_bytes - prev.rx) / (POLL_MS / 1000)) : 0;
          const tx_rate = prev ? Math.max(0, (iface.tx_bytes - prev.tx) / (POLL_MS / 1000)) : 0;
          prevRef.current.set(iface.name, { rx: iface.rx_bytes, tx: iface.tx_bytes });
          return { ...iface, rx_rate, tx_rate };
        });
        setIfaces(rates.filter(r => r.rx_bytes > 0 || r.tx_bytes > 0));
      } catch {
        // silently ignore
      }
    };

    fetch();
    const id = setInterval(fetch, POLL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <GadgetFrame title="Red" icon="wifi-high">
      {ifaces.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '1rem' }}>
          <lib-spinner variant="enso" size="sm" />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflow: 'auto', height: '100%' }}>
          {ifaces.map((iface) => (
            <div key={iface.name} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.3rem',
              paddingBottom: '0.6rem',
              borderBottom: '1px solid var(--border-subtle)',
            }}>
              <span style={{
                fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
                fontSize: '0.6rem',
                color: 'var(--text-secondary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {iface.name}
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem' }}>
                {/* RX */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <lib-icon name="arrow-down" size="10" style={{ color: 'var(--text-primary)', flexShrink: 0 }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{
                      fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
                      fontSize: '0.6rem',
                      color: 'var(--text-primary)',
                    }}>
                      {fmtRate(iface.rx_rate)}
                    </span>
                    <span style={{
                      fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
                      fontSize: '0.5rem',
                      color: 'var(--text-muted)',
                    }}>
                      {fmtBytes(iface.rx_bytes)}
                    </span>
                  </div>
                </div>
                {/* TX */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <lib-icon name="arrow-up" size="10" style={{ color: 'var(--text-accent)', flexShrink: 0 }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{
                      fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
                      fontSize: '0.6rem',
                      color: 'var(--text-accent)',
                    }}>
                      {fmtRate(iface.tx_rate)}
                    </span>
                    <span style={{
                      fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
                      fontSize: '0.5rem',
                      color: 'var(--text-muted)',
                    }}>
                      {fmtBytes(iface.tx_bytes)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </GadgetFrame>
  );
}
