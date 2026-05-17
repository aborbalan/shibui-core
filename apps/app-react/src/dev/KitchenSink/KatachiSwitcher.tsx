import { KATACHI_IDS, KATACHI_KANJI, type KatachiId } from './catalog';

interface Props {
  value: KatachiId | '';
  onChange: (next: KatachiId | '') => void;
}

const BTN: React.CSSProperties = {
  appearance: 'none',
  border: '1px solid var(--border-default)',
  background: 'var(--bg-elevated)',
  color: 'var(--text-primary)',
  padding: '8px 14px',
  fontFamily: 'var(--lib-font-mono, monospace)',
  fontSize: '0.85rem',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
  minWidth: 90,
};

const ACTIVE: React.CSSProperties = {
  background: 'var(--text-primary)',
  color: 'var(--bg-base)',
  borderColor: 'var(--text-primary)',
};

export function KatachiSwitcher({ value, onChange }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Katachi context"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        padding: 'var(--lib-space-md)',
        background: 'var(--bg-base)',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: 'var(--lib-space-lg)',
      }}
    >
      <button
        type="button"
        role="radio"
        aria-checked={value === ''}
        onClick={() => onChange('')}
        style={value === '' ? { ...BTN, ...ACTIVE } : BTN}
      >
        <span style={{ fontSize: '1.1rem' }}>○</span>
        <span>none</span>
      </button>
      {KATACHI_IDS.map((id) => {
        const isActive = value === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(id)}
            style={isActive ? { ...BTN, ...ACTIVE } : BTN}
          >
            <span style={{ fontSize: '1.1rem' }}>{KATACHI_KANJI[id]}</span>
            <span>{id}</span>
          </button>
        );
      })}
    </div>
  );
}
