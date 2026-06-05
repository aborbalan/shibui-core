<script lang="ts">
  import { navigate } from '../lib/router';

  const PILLARS = [
    { kanji: '侘', label: 'Wabi · Imperfección',     description: 'La belleza en lo incompleto e impermanente. Los componentes embracen el estado de transición como parte de la experiencia, no como error a corregir.' },
    { kanji: '金', label: 'Kintsugi · Cicatrices de oro', description: 'Reparar con oro en lugar de ocultar. La variante kintsugi convierte los bordes y las transiciones en el elemento más llamativo del componente.' },
    { kanji: '間', label: 'Ma · El espacio',           description: 'El silencio entre notas. El espacio vacío no es ausencia — es presencia. Los tokens de espaciado están calibrados para crear respiración visual intencional.' },
  ];

  const SHOWCASE_CARDS = [
    { variant: 'inverse',  kanji: '渋', tag: 'Dark',     title: 'Dark',     description: 'Fondo washi-950. La base nocturna del sistema. Texto en rgba-blanco escalado por función.' },
    { variant: 'default',  kanji: '白', tag: 'Light',    title: 'Light',    description: 'Fondo blanco o washi-50. Bordes en washi-200. Acento kaki para elementos interactivos.' },
    { variant: 'kintsugi', kanji: '金', tag: 'Kintsugi', title: 'Kintsugi', description: 'Seam animada kaki → gold. Anillo cónico rotante. Gradiente dorado en títulos y barras.' },
    { variant: 'glitch',   kanji: '⌗', tag: '⌗ Glitch', title: 'Glitch',   description: 'Scanlines CRT. RGB shadow split en ráfagas. Micro-drift en X. Terminal aesthetic.' },
    { variant: 'celadon',  kanji: '青', tag: 'Celadón',  title: 'Celadón',  description: 'Acento verde-gris japonés. Para estados de éxito, confirmación o elementos secundarios.' },
    { variant: 'washi',    kanji: '和', tag: 'Washi',    title: 'Washi',    description: 'Paleta neutral cálida. 11 pasos desde washi-50 hasta washi-950. El alma cromática del sistema.' },
  ];
</script>

<!-- ── HeroIntro ──────────────────────────────────────────────────────────── -->
<section class="hero-intro">
  <div class="eyebrow-row">
    <span class="eyebrow-line"></span>
    <span class="eyebrow-text">Design System · v1.0.0 · Zaragoza</span>
  </div>

  <h1 class="hero-title">
    La belleza<br />de lo
    <em>austero</em>
  </h1>

  <p class="hero-subtitle">
    <strong>66 componentes.</strong> Sin dependencias externas. CSS puro y vanilla JS bajo principios
    estéticos japoneses — <strong>wabi-sabi</strong>, <strong>kintsugi</strong> y <strong>ma</strong>.
    Donde cada elemento justifica su presencia.
  </p>

  <lib-button-group dark>
    <lib-button
      variant="primary"
      size="lg"
      onui-lib-click={() => navigate('/componentes')}
    >
      <svg slot="prefix" viewBox="0 0 16 16" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;">
        <rect x="1" y="1" width="6" height="6" /><rect x="9" y="1" width="6" height="6" />
        <rect x="1" y="9" width="6" height="6" /><rect x="9" y="9" width="6" height="6" />
      </svg>
      Ver componentes
    </lib-button>
    <lib-button variant="ghost" size="lg" onui-lib-click={() => navigate('/philosophy')}>
      Leer filosofía
    </lib-button>
  </lib-button-group>
</section>

<!-- ── HeroStats ─────────────────────────────────────────────────────────── -->
<lib-divider>sobre...</lib-divider>

<section class="hero-stats">
  <div class="stat">
    <lib-counter value={66} suffix="+" size="md" tone="on-dark" play-on-visible></lib-counter>
    <span class="stat-label">Componentes</span>
  </div>
  <lib-divider orientation="vertical" style-variant="hairline" style="height:100%;margin:0 2.5rem;opacity:.3;"></lib-divider>
  <div class="stat">
    <lib-counter value={0} size="md" tone="on-dark" play-on-visible></lib-counter>
    <span class="stat-label">Dependencias</span>
  </div>
  <lib-divider orientation="vertical" style-variant="hairline" style="height:100%;margin:0 2.5rem;opacity:.3;"></lib-divider>
  <div class="stat">
    <lib-counter value={4} suffix="×" size="md" tone="on-dark" play-on-visible></lib-counter>
    <span class="stat-label">Variantes cada uno</span>
  </div>
  <lib-divider orientation="vertical" style-variant="hairline" style="height:100%;margin:0 2.5rem;opacity:.3;"></lib-divider>
  <div class="stat">
    <span class="stat-text">MIT</span>
    <span class="stat-label">Licencia</span>
  </div>
</section>

<!-- ── ContentSection: Proyectos ─────────────────────────────────────────── -->
<section class="content-section">
  <lib-eyebrow>03 · Proyectos</lib-eyebrow>
  <lib-display-heading
    tag="h2" size="md" surface="dark"
    line1="Arquitectura que"
    line2Prefix="perdura,"
    accent="zero deps"
    description="Cada decisión técnica tiene un porqué."
  ></lib-display-heading>
</section>

<!-- ── CardsSection ──────────────────────────────────────────────────────── -->
<section class="cards-bg">
  <lib-component-grid>
    <lib-card variant="featured" style="grid-column:span 2;">
      <span slot="tag">✦ Kintsugi · Firma</span>
      <h3 slot="title">La cicatriz<br /><em>de oro</em></h3>
      <p>El principio japonés de reparar con oro. En Shibui, la variante kintsugi aplica gradientes dorados animados, anillos cónicos y seams que convierten el borde en el elemento más bello del componente.</p>
      <span slot="footer">Featured · 2 columnas</span>
    </lib-card>
    <lib-card variant="kintsugi">
      <span slot="tag">01–05 · Botones</span>
      <h3 slot="title">Buttons</h3>
      <p>Primary, outline, ghost, liquid, group y speed dial. Kintsugi y glitch como variantes adicionales.</p>
      <span slot="footer">Atom</span>
    </lib-card>
    <lib-card variant="kintsugi">
      <span slot="tag">28–29 · Formularios</span>
      <h3 slot="title">Inputs</h3>
      <p>Text inputs, select, checkbox, radio, switch, pin code y rich text editor.</p>
      <span slot="footer">Molecule</span>
    </lib-card>
    <lib-card variant="kintsugi">
      <span slot="tag">53 · 65 · 66 · Layout</span>
      <h3 slot="title">Nav</h3>
      <p>Header, sidebar y tabs. Mega-nav, colapsable, icon rail, centrado editorial y kintsugi.</p>
      <span slot="footer">Organism</span>
    </lib-card>
  </lib-component-grid>
</section>

<!-- ── PhilosophySection ─────────────────────────────────────────────────── -->
<section class="philosophy-section">
  <div class="philosophy-inner">
    <div class="philosophy-left">
      <lib-eyebrow tone="accent" size="sm" style="margin-bottom:1.5rem;display:inline-flex;">Filosofía</lib-eyebrow>
      <div class="philosophy-quote">
        <span>Lo bello no se anuncia.</span>
        <em>Se descubre con pausa.</em>
      </div>
      <cite class="philosophy-cite">— Principio Shibui · 渋い</cite>
    </div>

    <div class="philosophy-right">
      {#each PILLARS as pillar}
        <div class="pillar-row">
          <div class="pillar-kanji">{pillar.kanji}</div>
          <div>
            <p class="pillar-label">{pillar.label}</p>
            <p class="pillar-desc">{pillar.description}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ── ContentSection: Variantes estéticas ───────────────────────────────── -->
<section class="content-section">
  <lib-eyebrow>Variantes estéticas</lib-eyebrow>
  <lib-display-heading
    tag="h2" size="md" surface="dark"
    line1="Un sistema"
    accent="seis pieles"
    description="Cada componente existe en múltiples superficies. La misma lógica, la misma API, seis expresiones visuales coherentes."
  ></lib-display-heading>
</section>

<!-- ── CardsShowcase ─────────────────────────────────────────────────────── -->
<section class="cards-bg">
  <lib-component-grid style="--cg-cols:repeat(3,1fr);">
    {#each SHOWCASE_CARDS as card}
      <lib-card variant={card.variant} kanji={card.kanji}>
        <span slot="tag">{card.tag}</span>
        <h3 slot="title">{card.title}</h3>
        <p>{card.description}</p>
      </lib-card>
    {/each}
  </lib-component-grid>
</section>

<!-- ── ContentSection: Design Tokens ─────────────────────────────────────── -->
<section class="content-section">
  <lib-eyebrow>Design Tokens</lib-eyebrow>
  <lib-display-heading
    tag="h2" size="md" surface="dark"
    line1="La gramática"
    line2Prefix="del "
    accent="sistema"
    description="Colores, tipografías y espaciado como variables CSS. Cambia un token, transforma todo el sistema."
  ></lib-display-heading>
</section>

<!-- ── TokensPreview ─────────────────────────────────────────────────────── -->
<section class="tokens-preview">
  <div class="tokens-grid">
    <!-- Color column -->
    <div class="token-col">
      <p class="token-col-label">Color · Paleta Kaki</p>
      <div class="color-swatches">
        {#each [50,100,200,300,400,500,600,700,800,900,950] as step}
          <div class="swatch" style="background: var(--color-kaki-{step});" title="--color-kaki-{step}"></div>
        {/each}
      </div>
      <p class="token-col-label" style="margin-top:1.5rem;">Color · Paleta Washi</p>
      <div class="color-swatches">
        {#each [50,100,200,300,400,500,600,700,800,900,950] as step}
          <div class="swatch" style="background: var(--color-washi-{step});" title="--color-washi-{step}"></div>
        {/each}
      </div>
    </div>

    <!-- Typography column -->
    <div class="token-col">
      <p class="token-col-label">Tipografía</p>
      <p class="typo-display">La belleza</p>
      <p class="typo-body">El diseño que perdura no sigue tendencias: las anticipa con pausa y convicción.</p>
      <p class="typo-mono">--lib-font-mono · 0.875rem</p>
    </div>

    <!-- Space column -->
    <div class="token-col">
      <p class="token-col-label">Espaciado</p>
      <div class="space-bars">
        {#each [['xs','4px'],['sm','8px'],['md','12px'],['lg','16px'],['xl','24px'],['2xl','40px'],['3xl','64px']] as [name, val]}
          <div class="space-row">
            <span class="space-name">--lib-space-{name}</span>
            <div class="space-bar" style="width: var(--lib-space-{name}, {val});"></div>
            <span class="space-val">{val}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  /* ── HeroIntro ── */
  .hero-intro {
    padding: 90px 60px 30px;
    display: flex;
    flex-direction: column;
    gap: var(--lib-space-xl);
  }

  .eyebrow-row {
    display: flex;
    align-items: center;
    gap: var(--lib-space-md);
    font-family: var(--lib-font-mono);
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-widest);
    text-transform: uppercase;
    color: color-mix(in oklch, var(--color-kaki-500), transparent 45%);
    animation: fadeUp 0.8s 0.1s cubic-bezier(0,0,.2,1) both;
  }
  .eyebrow-line {
    display: block;
    width: 32px;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--color-kaki-400));
    flex-shrink: 0;
  }

  .hero-title {
    font-family: var(--lib-font-display);
    font-size: var(--text-5xl);
    font-weight: var(--weight-light);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    color: var(--text-primary);
    margin: 0;
    animation: fadeUp 0.9s 0.2s cubic-bezier(0,0,.2,1) both;
  }
  .hero-title em {
    font-style: italic;
    color: var(--color-kaki-400);
    display: block;
  }

  .hero-subtitle {
    font-family: var(--lib-font-body);
    font-size: var(--text-sm);
    color: var(--text-secondary);
    line-height: var(--leading-relaxed);
    max-width: 520px;
    margin: 0;
    animation: fadeUp 0.9s 0.35s cubic-bezier(0,0,.2,1) both;
  }
  .hero-subtitle strong {
    color: var(--text-primary);
    font-weight: var(--weight-semibold);
  }

  /* ── HeroStats ── */
  .hero-stats {
    display: flex;
    align-items: stretch;
    flex-wrap: wrap;
    height: 70px;
    border-top: 1px solid color-mix(in oklch, var(--text-primary), transparent 94%);
    padding: 0 60px;
    animation: fadeUp 0.9s 0.6s cubic-bezier(0,0,.2,1) both;
  }
  .stat {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    justify-content: center;
  }
  .stat-text {
    font-family: var(--lib-font-display);
    font-size: 2.8rem;
    font-weight: var(--weight-light);
    letter-spacing: -0.02em;
    line-height: 1;
    color: var(--text-secondary);
  }
  .stat-label {
    font-family: var(--lib-font-mono);
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: color-mix(in oklch, var(--text-primary), transparent 82%);
  }

  /* ── ContentSection ── */
  .content-section {
    padding: 30px 60px;
    display: flex;
    flex-direction: column;
    gap: var(--lib-space-md);
  }

  /* ── CardsSection / Showcase ── */
  .cards-bg {
    background: var(--color-washi-950);
  }

  /* ── PhilosophySection ── */
  .philosophy-section {
    background: var(--color-washi-950);
    border-top: 1px solid var(--border-subtle);
    border-bottom: 1px solid var(--border-subtle);
    padding: clamp(4rem, 10vh, 7rem) clamp(1.5rem, 5vw, 5rem);
  }
  .philosophy-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(3rem, 6vw, 5rem);
    align-items: center;
  }
  .philosophy-quote {
    font-family: var(--lib-font-display);
    font-size: clamp(1.6rem, 3vw, 2.8rem);
    font-weight: var(--weight-light);
    letter-spacing: -0.02em;
    line-height: 1.35;
    color: var(--text-secondary);
  }
  .philosophy-quote em {
    display: block;
    font-style: italic;
    color: var(--color-kaki-400);
    margin-top: 0.25rem;
  }
  .philosophy-cite {
    display: block;
    font-style: normal;
    font-family: var(--lib-font-mono);
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: color-mix(in oklch, var(--text-primary), transparent 82%);
    margin-top: 1.5rem;
  }
  .philosophy-right {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  .pillar-row {
    display: flex;
    gap: 1.25rem;
    align-items: flex-start;
  }
  .pillar-kanji {
    font-family: var(--lib-font-display);
    font-size: 2rem;
    font-weight: var(--weight-light);
    color: color-mix(in oklch, var(--color-kaki-500), transparent 65%);
    line-height: 1;
    flex-shrink: 0;
    width: 2.5rem;
    text-align: center;
  }
  .pillar-label {
    font-family: var(--lib-font-mono);
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: color-mix(in oklch, var(--color-kaki-500), transparent 50%);
    margin: 0 0 0.35rem 0;
  }
  .pillar-desc {
    font-family: var(--lib-font-body);
    font-size: 0.82rem;
    color: var(--text-muted);
    line-height: 1.8;
    margin: 0;
  }

  /* ── TokensPreview ── */
  .tokens-preview {
    padding: 30px 60px 60px;
  }
  .tokens-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: clamp(2rem, 4vw, 3rem);
  }
  .token-col-label {
    font-family: var(--lib-font-mono);
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: color-mix(in oklch, var(--color-kaki-500), transparent 45%);
    margin: 0 0 0.75rem 0;
  }
  .color-swatches {
    display: flex;
    gap: 2px;
    height: 24px;
  }
  .swatch {
    flex: 1;
    height: 100%;
  }
  .typo-display {
    font-family: var(--lib-font-display);
    font-size: 3rem;
    font-weight: var(--weight-light);
    color: var(--text-primary);
    margin: 0 0 1rem 0;
    line-height: 1;
  }
  .typo-body {
    font-family: var(--lib-font-body);
    font-size: var(--text-sm);
    color: var(--text-secondary);
    line-height: var(--leading-relaxed);
    margin: 0 0 1rem 0;
  }
  .typo-mono {
    font-family: var(--lib-font-mono);
    font-size: var(--text-xs);
    color: var(--text-muted);
    margin: 0;
    letter-spacing: 0.05em;
  }
  .space-bars {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .space-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .space-name {
    font-family: var(--lib-font-mono);
    font-size: 0.55rem;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    width: 120px;
    flex-shrink: 0;
  }
  .space-bar {
    height: 4px;
    background: color-mix(in oklch, var(--color-kaki-500), transparent 50%);
    min-width: 4px;
  }
  .space-val {
    font-family: var(--lib-font-mono);
    font-size: 0.55rem;
    color: var(--text-muted);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
</style>
