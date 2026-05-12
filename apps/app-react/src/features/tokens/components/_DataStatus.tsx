import React from 'react';

interface DataStatusProps {
  label: string;
  isPending: boolean;
  isError: boolean;
  error?: Error | null;
  count?: number;
}

const base: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  fontFamily: 'var(--lib-font-mono)',
  fontSize: '0.72rem',
  padding: '0.25rem 0.6rem',
  borderRadius: '4px',
  marginBottom: '0.5rem',
};

export const DataStatus: React.FC<DataStatusProps> = ({ label, isPending, isError, error, count }) => {
  if (isPending) {
    return (
      <span style={{ ...base, background: 'color-mix(in oklch, var(--color-kaki-600) 15%, transparent)', color: 'var(--color-kaki-300)' }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-kaki-400)', animation: 'pulse 1.2s ease-in-out infinite' }} />
        {label} — cargando…
      </span>
    );
  }

  if (isError) {
    return (
      <span style={{ ...base, background: 'color-mix(in oklch, red 15%, transparent)', color: 'color-mix(in oklch, red 70%, white)' }}>
        ✕ {label} — {error?.message ?? 'error desconocido'}
      </span>
    );
  }

  return (
    <span style={{ ...base, background: 'color-mix(in oklch, var(--color-kaki-500) 12%, transparent)', color: 'var(--color-kaki-400)' }}>
      ✓ {label} — {count} tokens
    </span>
  );
};
