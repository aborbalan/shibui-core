import type { Coverage } from './catalog';

const STYLES: Record<Coverage, { bg: string; fg: string; label: string; dot: string }> = {
  semantic: { bg: 'oklch(70% 0.15 145deg / 0.18)', fg: 'oklch(80% 0.18 145deg)', label: 'semantic', dot: '🟢' },
  marker:   { bg: 'oklch(70% 0.15 230deg / 0.18)', fg: 'oklch(80% 0.18 230deg)', label: 'marker',   dot: '🔵' },
  effect:   { bg: 'oklch(60% 0.02 270deg / 0.18)', fg: 'oklch(80% 0.02 270deg)', label: 'effect',   dot: '⚪' },
};

export function StatusBadge({ coverage }: { coverage: Coverage }) {
  const s = STYLES[coverage];
  return (
    <span
      title={`Katachi coverage: ${s.label}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 4,
        fontFamily: 'var(--lib-font-mono, monospace)',
        fontSize: '0.7rem',
        letterSpacing: '0.04em',
        background: s.bg,
        color: s.fg,
        whiteSpace: 'nowrap',
      }}
    >
      {s.dot} {s.label}
    </span>
  );
}
