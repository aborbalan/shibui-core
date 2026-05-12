import React from 'react';
import type { DesignTokenDto } from '../../../data/api/domain/tokens/api/tokens.api';

interface TokenRowProps {
  token: DesignTokenDto;
  preview?: React.ReactNode;
}

export const TokenRow: React.FC<TokenRowProps> = ({ token, preview }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: preview ? '48px 1fr 1.2fr 2fr' : '1fr 1.2fr 2fr',
      gap: '1rem',
      alignItems: 'center',
      padding: '0.6rem 0',
      borderBottom: '1px solid color-mix(in oklch, var(--color-washi-700) 25%, transparent)',
    }}
  >
    {preview && <div style={{ flexShrink: 0 }}>{preview}</div>}
    <code
      style={{
        fontFamily: 'var(--lib-font-mono)',
        fontSize: '0.68rem',
        color: 'var(--color-kaki-300)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {token.cssVar}
    </code>
    <code
      style={{
        fontFamily: 'var(--lib-font-mono)',
        fontSize: '0.65rem',
        color: 'var(--text-secondary)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        opacity: 0.75,
      }}
    >
      {token.value}
    </code>
    <span
      style={{
        fontFamily: 'var(--lib-font-body)',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        lineHeight: '1.4',
      }}
    >
      {token.description}
    </span>
  </div>
);

interface SubHeaderProps {
  label: string;
  first?: boolean;
}

export const SubHeader: React.FC<SubHeaderProps> = ({ label, first }) => (
  <div
    style={{
      fontFamily: 'var(--lib-font-mono)',
      fontSize: '0.58rem',
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: 'color-mix(in oklch, var(--color-kaki-400) 45%, transparent)',
      borderBottom: '1px solid color-mix(in oklch, var(--color-washi-700) 35%, transparent)',
      paddingBottom: '0.4rem',
      marginBottom: '0.75rem',
      marginTop: first ? '0' : '2rem',
    }}
  >
    {label}
  </div>
);

export const LoadingText: React.FC<{ label?: string }> = ({ label }) => (
  <span
    style={{
      fontFamily: 'var(--lib-font-mono)',
      fontSize: '0.72rem',
      color: 'var(--text-muted)',
    }}
  >
    Cargando{label ? ` ${label}` : ''}…
  </span>
);

export const ErrorText: React.FC<{ error: Error | null }> = ({ error }) => (
  <span
    style={{
      fontFamily: 'var(--lib-font-mono)',
      fontSize: '0.72rem',
      color: 'color-mix(in oklch, red 70%, white)',
    }}
  >
    Error: {error?.message ?? 'desconocido'}
  </span>
);
