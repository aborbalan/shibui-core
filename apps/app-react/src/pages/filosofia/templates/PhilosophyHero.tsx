import React from 'react';

export const PhilosophyHero: React.FC = () => {
  return (
    <section style={{
      padding: 'clamp(4rem, 10vh, 7rem) clamp(1.5rem, 5vw, 5rem)',
      textAlign: 'center',
      maxWidth: '860px',
      margin: '0 auto',
    }}>

      <lib-eyebrow
        color="kaki"
        line="both"
        size="sm"
        style={{ marginBottom: '2rem', display: 'inline-flex' } as React.CSSProperties}
      >
        Filosofía de Diseño
      </lib-eyebrow>

      <div style={{
        fontFamily: 'var(--lib-font-display, "Cormorant Garamond", serif)',
        fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
        fontWeight: 300,
        letterSpacing: '-0.03em',
        lineHeight: 1.1,
        color: 'rgba(250, 247, 244, 0.55)',
        marginBottom: '0.3rem',
      }}>
        Lo bello
      </div>
      <div style={{
        fontFamily: 'var(--lib-font-display, "Cormorant Garamond", serif)',
        fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
        fontWeight: 300,
        fontStyle: 'italic',
        letterSpacing: '-0.03em',
        lineHeight: 1.1,
        color: 'var(--color-kaki-400, #D97234)',
        marginBottom: 'clamp(2rem, 4vh, 3.5rem)',
      }}>
        no se anuncia.
      </div>

      <p style={{
        fontFamily: 'var(--lib-font-body, "Shippori Mincho", serif)',
        fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
        color: 'rgba(250, 247, 244, 0.35)',
        lineHeight: 1.9,
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        Shibui (渋い) es una forma japonesa de percibir la belleza: austera,
        refinada, descubierta con pausa. Cada decisión de diseño en este sistema
        nace de tres conceptos que transforman la imperfección en intención.
      </p>

    </section>
  );
};

export default PhilosophyHero;
