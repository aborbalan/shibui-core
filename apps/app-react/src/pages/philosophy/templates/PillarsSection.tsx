interface Pillar {
  kanji: string;
  label: string;
  description: string;
}

const PILLARS: Pillar[] = [
  {
    kanji: '侘',
    label: 'Wabi · Imperfección',
    description:
      'La belleza en lo incompleto e impermanente. No se busca la perfección simétrica sino el carácter que emerge de las irregularidades. Los componentes abrazan los estados de transición como parte de la experiencia — el foco, el hover, el loading — no como errores a corregir sino como momentos con dignidad propia.',
  },
  {
    kanji: '金',
    label: 'Kintsugi · Cicatrices de oro',
    description:
      'El arte japonés de reparar la cerámica rota con oro, convirtiendo las fracturas en el rasgo más llamativo de la pieza. En el sistema de diseño, los bordes, las transiciones y los acentos son el oro: la variante kintsugi no oculta sus costuras — las exhibe como ornamento deliberado.',
  },
  {
    kanji: '間',
    label: 'Ma · El espacio',
    description:
      'El intervalo consciente entre notas, entre palabras, entre elementos. El vacío no es ausencia — es presencia activa. Los tokens de espaciado están calibrados para crear respiración visual intencional; comprimir este espacio no es eficiencia, es ruido.',
  },
];

export const PillarsSection: React.FC = () => {
  return (
    <section style={{ padding: 'clamp(3rem, 6vh, 5rem) 0' }}>

      <div style={{ marginBottom: 'clamp(2.5rem, 5vh, 4rem)' }}>
        <lib-display-heading
          line1="Tres conceptos,"
          accent="una intención."
          surface="dark"
          size="md"
          tag="h2"
        >
          <lib-eyebrow slot="eyebrow" color="dark" size="sm">
            Los tres pilares
          </lib-eyebrow>
        </lib-display-heading>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'clamp(1.5rem, 3vw, 2rem)',
      }}>
        {PILLARS.map((pillar) => (
          <div
            key={pillar.kanji}
            style={{
              background: 'rgba(18, 14, 10, 0.85)',
              border: '1px solid rgba(255,255,255,0.07)',
              backdropFilter: 'blur(12px)',
              padding: 'clamp(1.75rem, 4vw, 2.5rem)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Kanji watermark */}
            <div style={{
              position: 'absolute',
              top: '-0.5rem',
              right: '1rem',
              fontFamily: 'var(--lib-font-display, "Cormorant Garamond", serif)',
              fontSize: 'clamp(5rem, 10vw, 8rem)',
              fontWeight: 300,
              color: 'rgba(184, 90, 30, 0.08)',
              lineHeight: 1,
              userSelect: 'none',
              pointerEvents: 'none',
            }}>
              {pillar.kanji}
            </div>

            {/* Label */}
            <p style={{
              fontFamily: 'var(--lib-font-mono, "DM Mono", monospace)',
              fontSize: '0.62rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase' as const,
              color: 'rgba(184, 90, 30, 0.6)',
              margin: '0 0 1rem 0',
            }}>
              {pillar.label}
            </p>

            {/* Description */}
            <p style={{
              fontFamily: 'var(--lib-font-body, "Shippori Mincho", serif)',
              fontSize: 'clamp(0.82rem, 1.2vw, 0.92rem)',
              color: 'rgba(250, 247, 244, 0.65)',
              lineHeight: 1.9,
              margin: 0,
            }}>
              {pillar.description}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
};

export default PillarsSection;
