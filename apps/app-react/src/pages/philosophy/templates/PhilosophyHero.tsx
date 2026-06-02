import React from 'react';

export const PhilosophyHero: React.FC = () => {
  return (
    <section style={{
      padding: 'clamp(4rem, 10vh, 7rem) clamp(1.5rem, 5vw, 5rem)',
      maxWidth: '860px',
      margin: '0 auto',
    }}>

      <lib-display-heading
        line1="Lo bello"
        accent="no se anuncia."
        description="Shibui (渋い) es una forma japonesa de percibir la belleza: austera, refinada, descubierta con pausa. Cada decisión de diseño en este sistema nace de tres conceptos que transforman la imperfección en intención."
        surface="dark"
        size="lg"
        tag="h1"
        centered
      >
        <lib-eyebrow slot="eyebrow" tone="accent" line="both" size="sm">
          Filosofía de Diseño
        </lib-eyebrow>
      </lib-display-heading>

    </section>
  );
};

export default PhilosophyHero;
