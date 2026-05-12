import React from 'react';

interface TokenSectionProps {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  children?: React.ReactNode;
}

export const TokenSection: React.FC<TokenSectionProps> = ({
  id,
  eyebrow,
  title,
  description,
  children,
}) => (
  <section id={id} style={{ marginBottom: '5rem', scrollMarginTop: '80px' }}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.7rem',
        fontFamily: 'var(--lib-font-mono)',
        fontSize: '0.6rem',
        letterSpacing: '0.26em',
        textTransform: 'uppercase',
        color: 'color-mix(in oklch, var(--color-kaki-400) 60%, transparent)',
        marginBottom: '0.75rem',
      }}
    >
      <span
        style={{
          width: '22px',
          height: '1px',
          background: 'linear-gradient(90deg, var(--color-kaki-400), transparent)',
          flexShrink: 0,
        }}
      />
      {eyebrow}
    </div>

    <h2
      style={{
        fontFamily: 'var(--lib-font-display)',
        fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
        fontWeight: 300,
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
        color: 'var(--text-primary)',
        marginBottom: '0.75rem',
      }}
    >
      {title}
    </h2>

    <p
      style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--text-secondary)',
        maxWidth: '560px',
        lineHeight: 'var(--leading-relaxed)',
        marginBottom: '2.5rem',
        fontFamily: 'var(--lib-font-body)',
      }}
    >
      {description}
    </p>

    {children}
  </section>
);
