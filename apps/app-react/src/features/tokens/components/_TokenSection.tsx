import React from 'react';
import { LibEyebrow } from '@shibui-ui/ui/react';

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
    <LibEyebrow color="kaki" line="left" size="sm" style={{ marginBottom: '0.75rem' }}>
      {eyebrow}
    </LibEyebrow>

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
