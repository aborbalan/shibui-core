import React from 'react';
import { LibCard, LibComponentGrid, LibDisplayHeading } from '@shibui-ui/ui/react';

const FEATURE_DATA = [
  {
    icon: 'globe',
    title: 'Agnóstico y Ligero',
    description: 'Construido con Web Components nativos. Funciona en React, Vue, Svelte o HTML puro sin dependencias pesadas.'
  },
  {
    icon: 'shield',
    title: 'Accesibilidad Nativa',
    description: 'Cumple con los estándares WCAG desde el núcleo. Gestión de foco, ARIA y navegación por teclado out-of-the-box.'
  },
  {
    icon: 'atom',
    title: 'Tokens de Autor',
    description: 'Sistema basado en OKLCH para colores perceptualmente uniformes y una escala editorial japonesa.'
  },
  {
    icon: 'plugin',
    title: 'Composición Total',
    description: 'Uso extensivo de Slots para que puedas insertar lo que quieras donde quieras sin romper el diseño.'
  }
];

export const Features: React.FC = () => {
  return (
    /* Sección celadon: cards y heading toman los tokens semánticos del
       contexto (data-katachi), igual que CardsSection/CardsShowcase. */
    <section
      data-katachi="celadon"
      style={{ background: 'var(--color-washi-950)' }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'var(--lib-space-3xl) var(--lib-space-xl)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--lib-space-2xl)'
      }}>

        {/* CABECERA DE SECCIÓN */}
        <LibDisplayHeading
          tag="h2"
          size="md"
          surface="dark"
          centered
          line1="Diseñado para el"
          accent="desarrollador moderno"
          description="Una base técnica sólida para que te centres en la experiencia, no en la configuración."
        />

        {/* GRID DE CARDS */}
        <LibComponentGrid
          transparent
          style={{
            '--cg-cols': 'repeat(auto-fit, minmax(240px, 1fr))',
            '--cg-gap': 'var(--lib-space-lg)'
          } as React.CSSProperties}
        >
          {FEATURE_DATA.map((feature) => (
            <LibCard key={feature.title} variant="solid">
              <span slot="tag">
                <lib-icon name={feature.icon} size="20"></lib-icon>
              </span>
              <h3 slot="title">{feature.title}</h3>
              <p>{feature.description}</p>
            </LibCard>
          ))}
        </LibComponentGrid>

      </div>
    </section>
  );
};
