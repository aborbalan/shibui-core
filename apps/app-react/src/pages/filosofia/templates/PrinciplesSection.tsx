interface Principle {
  num: string;
  title: string;
  description: string;
}

const PRINCIPLES: Principle[] = [
  {
    num: '01',
    title: 'Tokens intencionados',
    description:
      'Cada valor en el sistema — color, espacio, tipografía — existe por una razón semántica. No hay tokens arbitrarios; cada uno codifica una decisión de diseño que puede razonarse.',
  },
  {
    num: '02',
    title: 'Variantes significativas',
    description:
      'Un componente no tiene variantes porque puede tenerlas. Kintsugi, celadon, washi — cada variante encarna un estado emocional o contextual distinto, no una permutación estética.',
  },
  {
    num: '03',
    title: 'Espacio como elemento',
    description:
      'El espaciado no es lo que queda entre cosas. Es un elemento de composición con el mismo peso que el color o la tipografía. Comprimir el espacio es distorsionar el mensaje.',
  },
  {
    num: '04',
    title: 'Transiciones con propósito',
    description:
      'Una animación que no comunica nada es ruido visual. Cada transición en el sistema señala un cambio de estado con duración y curva calibradas — ni más lentas ni más rápidas de lo necesario.',
  },
];

export const PrinciplesSection: React.FC = () => {
  return (
    <section style={{ padding: 'clamp(3rem, 6vh, 5rem) 0' }}>

      <div style={{ marginBottom: 'clamp(2.5rem, 5vh, 4rem)' }}>
        <lib-display-heading
          line1="De la filosofía"
          accent="a la práctica."
          surface="dark"
          size="md"
          tag="h2"
        >
          <lib-eyebrow slot="eyebrow" color="dark" size="sm">
            Principios de diseño
          </lib-eyebrow>
        </lib-display-heading>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: 'clamp(1.5rem, 3vw, 2rem)',
      }}>
        {PRINCIPLES.map((principle) => (
          <div
            key={principle.num}
            style={{
              display: 'flex',
              gap: '1.5rem',
              alignItems: 'flex-start',
              padding: 'clamp(1.5rem, 3vw, 2rem)',
              borderLeft: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            {/* Number */}
            <div style={{
              fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
              fontSize: '0.6rem',
              letterSpacing: '0.15em',
              color: 'rgba(184, 90, 30, 0.3)',
              lineHeight: 1,
              flexShrink: 0,
              paddingTop: '0.2rem',
            }}>
              {principle.num}
            </div>

            {/* Content */}
            <div>
              <p style={{
                fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                color: 'rgba(250, 247, 244, 0.4)',
                margin: '0 0 0.6rem 0',
              }}>
                {principle.title}
              </p>
              <p style={{
                fontFamily: 'var(--lib-font-body, "Shippori Mincho", serif)',
                fontSize: 'clamp(0.82rem, 1.2vw, 0.92rem)',
                color: 'rgba(250, 247, 244, 0.25)',
                lineHeight: 1.9,
                margin: 0,
              }}>
                {principle.description}
              </p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default PrinciplesSection;
