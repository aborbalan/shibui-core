<script lang="ts">
  const PILLARS = [
    {
      kanji: '侘',
      label: 'Wabi · Imperfección',
      description: 'La belleza en lo incompleto e impermanente. No se busca la perfección simétrica sino el carácter que emerge de las irregularidades. Los componentes abrazan los estados de transición como parte de la experiencia — el foco, el hover, el loading — no como errores a corregir sino como momentos con dignidad propia.',
    },
    {
      kanji: '金',
      label: 'Kintsugi · Cicatrices de oro',
      description: 'El arte japonés de reparar la cerámica rota con oro, convirtiendo las fracturas en el rasgo más llamativo de la pieza. En el sistema de diseño, los bordes, las transiciones y los acentos son el oro: la variante kintsugi no oculta sus costuras — las exhibe como ornamento deliberado.',
    },
    {
      kanji: '間',
      label: 'Ma · El espacio',
      description: 'El intervalo consciente entre notas, entre palabras, entre elementos. El vacío no es ausencia — es presencia activa. Los tokens de espaciado están calibrados para crear respiración visual intencional; comprimir este espacio no es eficiencia, es ruido.',
    },
  ];

  const PRINCIPLES = [
    { num: '01', title: 'Tokens intencionados',     description: 'Cada valor en el sistema — color, espacio, tipografía — existe por una razón semántica. No hay tokens arbitrarios; cada uno codifica una decisión de diseño que puede razonarse.' },
    { num: '02', title: 'Variantes significativas',  description: 'Un componente no tiene variantes porque puede tenerlas. Kintsugi, celadon, washi — cada variante encarna un estado emocional o contextual distinto, no una permutación estética.' },
    { num: '03', title: 'Espacio como elemento',     description: 'El espaciado no es lo que queda entre cosas. Es un elemento de composición con el mismo peso que el color o la tipografía. Comprimir el espacio es distorsionar el mensaje.' },
    { num: '04', title: 'Transiciones con propósito',description: 'Una animación que no comunica nada es ruido visual. Cada transición en el sistema señala un cambio de estado con duración y curva calibradas — ni más lentas ni más rápidas de lo necesario.' },
  ];
</script>

<!-- ── PhilosophyHero ─────────────────────────────────────────────────────── -->
<section class="philosophy-hero">
  <lib-display-heading
    line1="Lo bello"
    accent="no se anuncia."
    description="Shibui (渋い) es una forma japonesa de percibir la belleza: austera, refinada, descubierta con pausa. Cada decisión de diseño en este sistema nace de tres conceptos que transforman la imperfección en intención."
    surface="dark"
    size="lg"
    tag="h1"
    centered
  >
    <lib-eyebrow slot="eyebrow" color="kaki" line="both" size="sm">Filosofía de Diseño</lib-eyebrow>
  </lib-display-heading>
</section>

<lib-divider style-variant="hairline" style="margin:0;"></lib-divider>

<!-- ── PillarsSection ────────────────────────────────────────────────────── -->
<div class="pillars-wrapper">
  <section class="pillars-section">
    <div class="pillars-header">
      <lib-display-heading
        line1="Tres conceptos,"
        accent="una intención."
        surface="dark"
        size="md"
        tag="h2"
      >
        <lib-eyebrow slot="eyebrow" color="dark" size="sm">Los tres pilares</lib-eyebrow>
      </lib-display-heading>
    </div>

    <div class="pillars-grid">
      {#each PILLARS as pillar}
        <div class="pillar-card">
          <div class="pillar-kanji-bg">{pillar.kanji}</div>
          <p class="pillar-label">{pillar.label}</p>
          <p class="pillar-desc">{pillar.description}</p>
        </div>
      {/each}
    </div>
  </section>

  <lib-divider style-variant="hairline" style="margin:0;"></lib-divider>

  <!-- ── PrinciplesSection ─────────────────────────────────────────────── -->
  <section class="principles-section">
    <div class="pillars-header">
      <lib-display-heading
        line1="De la filosofía"
        accent="a la práctica."
        surface="dark"
        size="md"
        tag="h2"
      >
        <lib-eyebrow slot="eyebrow" color="dark" size="sm">Principios de diseño</lib-eyebrow>
      </lib-display-heading>
    </div>

    <div class="principles-grid">
      {#each PRINCIPLES as p}
        <div class="principle-item">
          <div class="principle-num">{p.num}</div>
          <div>
            <p class="principle-title">{p.title}</p>
            <p class="principle-desc">{p.description}</p>
          </div>
        </div>
      {/each}
    </div>
  </section>
</div>

<style>
  .philosophy-hero {
    padding: clamp(4rem,10vh,7rem) clamp(1.5rem,5vw,5rem);
    padding-top: calc(80px + clamp(4rem,10vh,7rem));
    max-width: 860px;
    margin: 0 auto;
  }

  .pillars-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 clamp(1.5rem,5vw,5rem);
  }

  .pillars-section, .principles-section {
    padding: clamp(3rem,6vh,5rem) 0;
  }

  .pillars-header {
    margin-bottom: clamp(2.5rem,5vh,4rem);
  }

  .pillars-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit,minmax(280px,1fr));
    gap: clamp(1.5rem,3vw,2rem);
  }

  .pillar-card {
    background: var(--bg-overlay);
    border: 1px solid var(--border-subtle);
    backdrop-filter: blur(12px);
    padding: clamp(1.75rem,4vw,2.5rem);
    position: relative;
    overflow: hidden;
  }

  .pillar-kanji-bg {
    position: absolute;
    top: -0.5rem;
    right: 1rem;
    font-family: var(--lib-font-display);
    font-size: clamp(5rem,10vw,8rem);
    font-weight: var(--weight-light);
    color: color-mix(in oklch, var(--color-kaki-500), transparent 92%);
    line-height: 1;
    user-select: none;
    pointer-events: none;
  }

  .pillar-label {
    font-family: var(--lib-font-mono);
    font-size: 0.62rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: color-mix(in oklch, var(--color-kaki-500), transparent 40%);
    margin: 0 0 1rem;
  }

  .pillar-desc {
    font-family: var(--lib-font-body);
    font-size: clamp(0.82rem,1.2vw,0.92rem);
    color: var(--text-muted);
    line-height: 1.9;
    margin: 0;
  }

  .principles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit,minmax(340px,1fr));
    gap: clamp(1.5rem,3vw,2rem);
  }

  .principle-item {
    display: flex;
    gap: 1.5rem;
    align-items: flex-start;
    padding: clamp(1.5rem,3vw,2rem);
    border-left: 1px solid var(--border-subtle);
  }

  .principle-num {
    font-family: var(--lib-font-mono);
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    color: color-mix(in oklch, var(--color-kaki-500), transparent 70%);
    line-height: 1;
    flex-shrink: 0;
    padding-top: 0.2rem;
  }

  .principle-title {
    font-family: var(--lib-font-mono);
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-secondary);
    margin: 0 0 0.6rem;
  }

  .principle-desc {
    font-family: var(--lib-font-body);
    font-size: clamp(0.82rem,1.2vw,0.92rem);
    color: var(--text-muted);
    line-height: 1.9;
    margin: 0;
  }
</style>
