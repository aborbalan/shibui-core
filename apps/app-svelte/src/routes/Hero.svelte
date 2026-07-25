<script lang="ts">
  import { navigate } from '../lib/router';

  const FEATURES = [
    { icon: 'globe',  title: 'Agnóstico y Ligero',   description: 'Construido con Web Components nativos. Funciona en React, Vue, Svelte o HTML puro sin dependencias pesadas.' },
    { icon: 'shield', title: 'Accesibilidad Nativa', description: 'Cumple con los estándares WCAG desde el núcleo. Gestión de foco, ARIA y navegación por teclado out-of-the-box.' },
    { icon: 'atom',   title: 'Tokens de Autor',      description: 'Sistema basado en OKLCH para colores perceptualmente uniformes y una escala editorial japonesa.' },
    { icon: 'plugin', title: 'Composición Total',    description: 'Uso extensivo de Slots para que puedas insertar lo que quieras donde quieras sin romper el diseño.' },
  ];

  const INSTALL_STEPS = [
    { step: '01', code: 'pnpm add @shibui-ui/ui',                        language: 'bash', filename: ''        },
    { step: '02', code: "import '@shibui-ui/ui';",                       language: 'ts',   filename: 'main.ts' },
    { step: '03', code: '<lib-button variant="accent">Empezar</lib-button>', language: 'html', filename: ''    },
  ];

  const PILLARS = [
    { kanji: '侘', label: 'Wabi · Imperfección',     description: 'La belleza en lo incompleto e impermanente. Los componentes embracen el estado de transición como parte de la experiencia, no como error a corregir.' },
    { kanji: '寂', label: 'Sabi · Pátina',           description: 'La belleza que solo aparece con el tiempo. El papel washi que amarillea, la tinta que se asienta, la sombra sólida que delata el grosor de la página.' },
    { kanji: '間', label: 'Ma · El espacio',         description: 'El silencio entre notas. El espacio vacío no es ausencia — es presencia. Los tokens de espaciado están calibrados para crear respiración visual intencional.' },
  ];

  /* Las seis pieles son contextos `data-katachi`, no variantes de card: la
     misma `lib-card` cambia de piel según el contexto que la envuelve. */
  const SHOWCASE_CARDS = [
    { katachi: 'shizen',   kanji: '自', tag: 'Shizen · 自然',   title: 'Shizen',   description: 'Natural, limpio, sin adorno. El punto cero del sistema: los tokens semánticos en su valor por defecto.' },
    { katachi: 'sabi',     kanji: '寂', tag: 'Sabi · 寂び',     title: 'Sabi',     description: 'Papel washi envejecido, tinta y sombra brutal de 4px. Sin glass, sin spotlight. El katachi de esta app.' },
    { katachi: 'celadon',  kanji: '青', tag: 'Celadón · 青磁',  title: 'Celadón',  description: 'Cerámica jade honda y fría. Seam jade, spotlight de agua y diez decoraciones de esmalte.' },
    { katachi: 'kintsugi', kanji: '金', tag: 'Kintsugi · 金継ぎ', title: 'Kintsugi', description: 'Reparación con oro. Seam animada kaki → gold y anillo cónico sobre superficie nocturna.' },
    { katachi: 'wabi',     kanji: '侘', tag: 'Wabi · 侘び',     title: 'Wabi',     description: 'Oscuridad pura, el anti-kintsugi. Casi negro con un glow tenue: la belleza de lo incompleto.' },
    { katachi: 'terminal', kanji: '⌗', tag: 'Terminal · >_',   title: 'Terminal', description: 'Scanlines CRT, viñeta y fósforo. La estética de la consola llevada al sistema.' },
  ];

  /* Specimen de tokens — mismas muestras que la home de React. */
  const WASHI_SWATCHES = [
    { name: 'Washi-50',    value: '#FAF7F4', label: '#FAF7F4' },
    { name: 'Washi-200',   value: '#E5DDD3', label: '#E5DDD3' },
    { name: 'Washi-500',   value: '#9A8878', label: '#9A8878' },
    { name: 'Washi-800',   value: '#3D332A', label: '#3D332A' },
    { name: 'Washi-950',   value: '#120E0A', label: '#120E0A' },
    { name: 'Kaki-500',    value: '#B85A1E', label: '#B85A1E' },
    { name: 'Celadón-400', value: '#4E9482', label: '#4E9482' },
    { name: 'Kintsugi',    value: 'linear-gradient(90deg, #8C4115, #F5D08A, #D97234, #F5D08A, #8C4115)', label: 'gradient' },
  ];

  const SPACING_ITEMS = [
    { name: 'SP-1 · 0.25rem', width: '4px'  },
    { name: 'SP-2 · 0.5rem',  width: '8px'  },
    { name: 'SP-4 · 1rem',    width: '16px' },
    { name: 'SP-6 · 1.5rem',  width: '24px' },
    { name: 'SP-8 · 2rem',    width: '32px' },
    { name: 'SP-12 · 3rem',   width: '48px' },
    { name: 'SP-16 · 4rem',   width: '64px' },
    { name: 'SP-24 · 6rem',   width: '96px' },
  ];

  const TYPE_SIZES = [
    { label: 'xs',   size: '0.6875rem', mono: true  },
    { label: 'sm',   size: '0.8125rem', mono: true  },
    { label: 'base', size: '0.9375rem', mono: true  },
    { label: 'xl',   size: '1.5rem',    mono: false },
    { label: '3xl',  size: '2.75rem',   mono: false },
  ];

  function scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
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

  <lib-button-group>
    <lib-button
      variant="solid"
      size="lg"
      onui-lib-click={() => scrollTo('componentes')}
    >
      <!-- El slot va en el wrapper: los tipos SVG de Svelte no admiten `slot`. -->
      <span slot="prefix" class="btn-glyph-slot">
        <svg viewBox="0 0 16 16" class="btn-glyph" aria-hidden="true">
          <rect x="1" y="1" width="6" height="6" /><rect x="9" y="1" width="6" height="6" />
          <rect x="1" y="9" width="6" height="6" /><rect x="9" y="9" width="6" height="6" />
        </svg>
      </span>
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
    <lib-counter value={66} suffix="+" size="md" play-on-visible></lib-counter>
    <span class="stat-label">Componentes</span>
  </div>
  <lib-divider orientation="vertical" style-variant="hairline" style="height:3.25rem;margin:0 2.5rem;opacity:.5;"></lib-divider>
  <div class="stat">
    <lib-counter value={0} size="md" play-on-visible></lib-counter>
    <span class="stat-label">Dependencias</span>
  </div>
  <lib-divider orientation="vertical" style-variant="hairline" style="height:3.25rem;margin:0 2.5rem;opacity:.5;"></lib-divider>
  <div class="stat">
    <lib-counter value={4} suffix="×" size="md" play-on-visible></lib-counter>
    <span class="stat-label">Variantes cada uno</span>
  </div>
  <lib-divider orientation="vertical" style-variant="hairline" style="height:3.25rem;margin:0 2.5rem;opacity:.5;"></lib-divider>
  <div class="stat">
    <span class="stat-text">MIT</span>
    <span class="stat-label">Licencia</span>
  </div>
</section>

<!-- ── Features ──────────────────────────────────────────────────────────── -->
<section class="band features" id="features">
  <div class="band-inner">
    <lib-display-heading
      tag="h2" size="md" surface="light" centered
      line1="Diseñado para el"
      accent="desarrollador moderno"
      description="Una base técnica sólida para que te centres en la experiencia, no en la configuración."
    ></lib-display-heading>

    <lib-component-grid transparent style="--cg-cols:repeat(auto-fit,minmax(240px,1fr));--cg-gap:var(--lib-space-lg);">
      {#each FEATURES as feature (feature.title)}
        <lib-card variant="solid">
          <span slot="tag"><lib-icon name={feature.icon} size="lg"></lib-icon></span>
          <h3 slot="title">{feature.title}</h3>
          <p>{feature.description}</p>
        </lib-card>
      {/each}
    </lib-component-grid>
  </div>
</section>

<!-- ── ContentSection: Proyectos ─────────────────────────────────────────── -->
<section class="content-section">
  <lib-eyebrow>03 · Proyectos</lib-eyebrow>
  <lib-display-heading
    tag="h2" size="md" surface="light"
    line1="Arquitectura que"
    line2Prefix="perdura,"
    accent="zero deps"
    description="Cada decisión técnica tiene un porqué."
  ></lib-display-heading>
</section>

<!-- ── CardsSection ──────────────────────────────────────────────────────── -->
<section class="band cards" id="componentes">
  <lib-component-grid style="--cg-gap:0;">
    <lib-card variant="featured" style="grid-column:span 2;">
      <span slot="tag">寂 Sabi · Firma</span>
      <h3 slot="title">El papel<br /><em>que envejece</em></h3>
      <p>Sabi (寂び) es la belleza que solo llega con el tiempo: el washi que amarillea, la tinta que se asienta en la fibra, el canto del papel que proyecta una sombra sólida. En Shibui, el katachi sabi apaga el brillo —nada de glass, nada de spotlight— y deja una única firma: la sombra brutal de 4px que delata el grosor de cada pieza.</p>
      <span slot="footer">Featured · 2 columnas</span>
    </lib-card>
    <lib-card>
      <span slot="tag">01–05 · Botones</span>
      <h3 slot="title">Buttons</h3>
      <p>Primary, outline, ghost, liquid, group y speed dial. Kintsugi y glitch como variantes adicionales.</p>
      <span slot="footer">Atom</span>
    </lib-card>
    <lib-card>
      <span slot="tag">28–29 · Formularios</span>
      <h3 slot="title">Inputs</h3>
      <p>Text inputs, select, checkbox, radio, switch, pin code y rich text editor.</p>
      <span slot="footer">Molecule</span>
    </lib-card>
    <lib-card>
      <span slot="tag">53 · 65 · 66 · Layout</span>
      <h3 slot="title">Nav</h3>
      <p>Header, sidebar y tabs. Mega-nav, colapsable, icon rail, centrado editorial y kintsugi.</p>
      <span slot="footer">Organism</span>
    </lib-card>
  </lib-component-grid>
</section>

<!-- ── InstallSection ────────────────────────────────────────────────────── -->
<section class="install" id="install">
  <div class="install-head">
    <lib-eyebrow size="sm">Inicio rápido</lib-eyebrow>
    <h2 class="install-title">
      De npm a componente <em>en tres pasos</em>
    </h2>
  </div>

  <div class="install-steps">
    {#each INSTALL_STEPS as { step, code, language, filename } (step)}
      <div class="install-step">
        <span class="install-step-num">{step}</span>
        <lib-code-block {code} {language} {filename} copyable variant="solid"></lib-code-block>
      </div>
    {/each}
  </div>
</section>

<!-- ── PhilosophySection ─────────────────────────────────────────────────── -->
<section class="band philosophy-section" id="philosophy">
  <div class="philosophy-inner">
    <div>
      <lib-eyebrow tone="accent" size="sm" style="margin-bottom:1.5rem;display:inline-flex;">Filosofía</lib-eyebrow>
      <div class="philosophy-quote">
        <span>Lo bello no se anuncia.</span>
        <em>Se descubre con pausa.</em>
      </div>
      <cite class="philosophy-cite">— Principio Shibui · 渋い</cite>
    </div>

    <div class="philosophy-right">
      {#each PILLARS as pillar (pillar.kanji)}
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
    tag="h2" size="md" surface="light"
    line1="Un sistema"
    accent="seis pieles"
    description="La misma card, seis veces. Lo único que cambia es el contexto data-katachi que la envuelve: misma lógica, misma API, seis expresiones visuales coherentes."
  ></lib-display-heading>
</section>

<!-- ── CardsShowcase ─────────────────────────────────────────────────────── -->
<section class="band cards">
  <lib-component-grid style="--cg-cols:repeat(3,1fr);--cg-gap:0;">
    {#each SHOWCASE_CARDS as card (card.katachi)}
      <div class="skin" data-katachi={card.katachi}>
        <lib-card kanji={card.kanji}>
          <span slot="tag">{card.tag}</span>
          <h3 slot="title">{card.title}</h3>
          <p>{card.description}</p>
        </lib-card>
      </div>
    {/each}
  </lib-component-grid>
</section>

<!-- ── ContentSection: Design Tokens ─────────────────────────────────────── -->
<section class="content-section">
  <lib-eyebrow>Design Tokens</lib-eyebrow>
  <lib-display-heading
    tag="h2" size="md" surface="light"
    line1="La gramática"
    line2Prefix="del "
    accent="sistema"
    description="Colores, tipografías y espaciado como variables CSS. Cambia un token, transforma todo el sistema."
  ></lib-display-heading>
</section>

<!-- ── TokensSection ─────────────────────────────────────────────────────── -->
<section class="band tokens-specimen">
  <div class="specimen-grid">

    <!-- Col 1 · Color -->
    <div class="specimen-col">
      <span class="specimen-label">Color · Washi</span>
      {#each WASHI_SWATCHES as swatch (swatch.name)}
        <div class="swatch-row">
          <span class="swatch-chip" style="background:{swatch.value};"></span>
          <span class="swatch-name">{swatch.name}</span>
          <span class="swatch-value">{swatch.label}</span>
        </div>
      {/each}
    </div>

    <!-- Col 2 · Tipografía -->
    <div class="specimen-col">
      <span class="specimen-label">Display · Cormorant Garamond</span>
      <p class="typo-display">La belleza <em>austera</em></p>

      <span class="specimen-label">Body · Shippori Mincho</span>
      <p class="typo-body">Sistema de diseño basado en principios japoneses de austeridad y precisión.</p>

      <span class="specimen-label">Mono · DM Mono</span>
      <p class="typo-mono">COMPONENT · 66 · v0.1.0</p>

      <span class="specimen-label">Tamaños</span>
      <div class="typo-sizes">
        {#each TYPE_SIZES as t (t.label)}
          <span
            class="typo-size"
            class:is-mono={t.mono}
            style="font-size:{t.size};"
          >{t.label}</span>
        {/each}
      </div>
    </div>

    <!-- Col 3 · Espaciado + easing -->
    <div class="specimen-col">
      <span class="specimen-label">Espaciado · Scale</span>
      <div class="space-bars">
        {#each SPACING_ITEMS as item (item.name)}
          <div class="space-row">
            <span class="space-bar" style="width:{item.width};"></span>
            <span class="space-name">{item.name}</span>
          </div>
        {/each}
      </div>

      <span class="specimen-label">Easing</span>
      <div class="ease-rows">
        <div class="ease-row">
          <span class="ease-track"><span class="ease-fill ease-out"></span></span>
          <span class="space-name">ease-out</span>
        </div>
        <div class="ease-row">
          <span class="ease-track"><span class="ease-fill ease-bounce"></span></span>
          <span class="space-name">ease-bounce</span>
        </div>
      </div>
    </div>

  </div>
</section>

<style>
  /* ══════════════════════════════════════════════════════════
     Katachi SABI — papel washi, tinta y sombra brutal.
     Todo el color sale de los tokens semánticos: es el contexto
     data-katachi="sabi" (index.html) el que los resuelve.
     ══════════════════════════════════════════════════════════ */

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
    color: color-mix(in oklch, var(--text-accent), transparent 30%);
    animation: fadeUp 0.8s 0.1s cubic-bezier(0, 0, 0.2, 1) both;
  }
  .eyebrow-line {
    display: block;
    width: 32px;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--text-accent));
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
    animation: fadeUp 0.9s 0.2s cubic-bezier(0, 0, 0.2, 1) both;
  }
  .hero-title em {
    font-style: italic;
    color: var(--text-accent);
    display: block;
  }

  .hero-subtitle {
    font-family: var(--lib-font-body);
    font-size: var(--text-sm);
    color: var(--text-secondary);
    line-height: var(--leading-relaxed);
    max-width: 520px;
    margin: 0;
    animation: fadeUp 0.9s 0.35s cubic-bezier(0, 0, 0.2, 1) both;
  }
  .hero-subtitle strong {
    color: var(--text-primary);
    font-weight: var(--weight-semibold);
  }

  .btn-glyph-slot {
    display: inline-flex;
    align-items: center;
  }
  .btn-glyph {
    width: 14px;
    height: 14px;
    stroke: currentColor;
    fill: none;
    stroke-width: 1.8;
    stroke-linecap: round;
  }

  /* ── HeroStats ── */
  .hero-stats {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    min-height: 70px;
    border-top: 1px solid var(--border-subtle);
    padding: var(--lib-space-lg) 60px;
    animation: fadeUp 0.9s 0.6s cubic-bezier(0, 0, 0.2, 1) both;
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
    color: var(--text-muted);
  }

  /* ── ContentSection ── */
  .content-section {
    padding: 30px 60px;
    display: flex;
    flex-direction: column;
    gap: var(--lib-space-md);
  }

  /* ── Bandas de papel ──
     El fondo `horizon` del layout se lee entre banda y banda; las bandas
     son la hoja opaca sobre la que se imprime el contenido. */
  .band {
    background: var(--bg-surface);
    border-top: 1px solid var(--border-subtle);
    border-bottom: 1px solid var(--border-subtle);
    scroll-margin-top: 90px;
  }

  /* Cada piel pinta su propia superficie: el contexto katachi del wrapper
     alimenta tanto al fondo como a la card que lleva dentro. */
  .skin {
    background: var(--bg-base);
    color: var(--text-primary);
    padding: var(--lib-space-lg);
  }

  .band-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--lib-space-3xl) var(--lib-space-xl);
    display: flex;
    flex-direction: column;
    gap: var(--lib-space-2xl);
  }

  /* ── InstallSection ── */
  .install {
    max-width: 720px;
    margin: 0 auto;
    padding: var(--lib-space-3xl) var(--lib-space-xl);
    display: flex;
    flex-direction: column;
    gap: var(--lib-space-2xl);
    scroll-margin-top: 90px;
  }
  .install-head {
    display: flex;
    flex-direction: column;
    gap: var(--lib-space-sm);
  }
  .install-title {
    font-family: var(--lib-font-display);
    font-size: var(--text-2xl);
    font-weight: var(--weight-light);
    letter-spacing: var(--tracking-tight);
    line-height: var(--leading-tight);
    margin: 0;
    color: var(--text-primary);
  }
  .install-title em {
    font-style: normal;
    color: var(--text-accent);
  }
  .install-steps {
    display: flex;
    flex-direction: column;
    gap: var(--lib-space-md);
  }
  .install-step {
    display: grid;
    grid-template-columns: 2.5rem 1fr;
    gap: var(--lib-space-md);
    align-items: start;
  }
  .install-step-num {
    font-family: var(--lib-font-mono);
    font-size: 0.625rem;
    letter-spacing: var(--tracking-wider);
    color: var(--text-muted);
    padding-top: var(--lib-space-md);
    text-align: right;
  }
  /* Firma sabi: el bloque de código se despega del papel. */
  .install-step lib-code-block {
    display: block;
    box-shadow: var(--lib-effect-brutal-shadow, none);
  }

  /* ── PhilosophySection ── */
  .philosophy-section {
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
    color: var(--text-accent);
    margin-top: 0.25rem;
  }
  .philosophy-cite {
    display: block;
    font-style: normal;
    font-family: var(--lib-font-mono);
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-muted);
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
    color: color-mix(in oklch, var(--text-accent), transparent 45%);
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
    color: var(--text-accent);
    margin: 0 0 0.35rem 0;
  }
  .pillar-desc {
    font-family: var(--lib-font-body);
    font-size: 0.82rem;
    color: var(--text-secondary);
    line-height: 1.8;
    margin: 0;
  }

  /* ── TokensSection · specimen ── */
  .tokens-specimen {
    padding: clamp(3rem, 6vh, 5rem) clamp(1.5rem, 5vw, 3rem);
  }
  .specimen-grid {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--border-subtle);
    box-shadow: var(--lib-effect-brutal-shadow, none);
  }
  .specimen-col {
    background: var(--bg-elevated);
    padding: 1.5rem 1.75rem;
  }
  .specimen-label {
    display: block;
    font-family: var(--lib-font-mono);
    font-size: 0.6rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: color-mix(in oklch, var(--text-accent), transparent 30%);
    margin: 1.25rem 0 0.75rem;
  }
  .specimen-col > .specimen-label:first-child {
    margin-top: 0;
  }

  .swatch-row {
    display: flex;
    align-items: center;
    gap: var(--lib-space-md);
    padding: var(--lib-space-sm) 0;
    border-bottom: 1px solid var(--border-subtle);
  }
  .swatch-chip {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    border: 1px solid var(--border-default);
  }
  .swatch-name {
    font-family: var(--lib-font-mono);
    font-size: 0.62rem;
    letter-spacing: 0.08em;
    color: var(--text-secondary);
  }
  .swatch-value {
    font-family: var(--lib-font-mono);
    font-size: 0.6rem;
    color: var(--text-muted);
    margin-left: auto;
  }

  .typo-display {
    font-family: var(--lib-font-display);
    font-size: clamp(1.6rem, 3vw, 2.2rem);
    font-weight: var(--weight-light);
    letter-spacing: -0.02em;
    line-height: 1.2;
    color: var(--text-primary);
    margin: 0;
  }
  .typo-display em {
    font-style: italic;
    color: var(--text-accent);
  }
  .typo-body {
    font-family: var(--lib-font-body);
    font-size: 0.9375rem;
    color: var(--text-secondary);
    line-height: 1.8;
    margin: 0;
  }
  .typo-mono {
    font-family: var(--lib-font-mono);
    font-size: 0.8125rem;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    margin: 0;
  }
  .typo-sizes {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    align-items: baseline;
  }
  .typo-size {
    font-family: var(--lib-font-display);
    font-weight: var(--weight-light);
    letter-spacing: -0.02em;
    color: var(--text-secondary);
  }
  .typo-size.is-mono {
    font-family: var(--lib-font-mono);
    letter-spacing: 0.1em;
    color: var(--text-muted);
  }

  .space-bars,
  .ease-rows {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }
  .space-row,
  .ease-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .space-bar {
    height: 5px;
    background: color-mix(in oklch, var(--text-accent), transparent 45%);
    flex-shrink: 0;
  }
  .space-name {
    font-family: var(--lib-font-mono);
    font-size: 0.6rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .ease-track {
    width: 64px;
    height: 5px;
    background: var(--border-subtle);
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
  }
  .ease-fill {
    position: absolute;
    inset: 0;
    background: var(--text-accent);
    transform: scaleX(0);
    transform-origin: left;
  }
  .ease-fill.ease-out {
    animation: ease-bar-out 2s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
  .ease-fill.ease-bounce {
    animation: ease-bar-bounce 2s cubic-bezier(0.34, 1.4, 0.64, 1) infinite;
  }

  @keyframes ease-bar-out {
    0%   { transform: scaleX(0); }
    60%  { transform: scaleX(1); }
    100% { transform: scaleX(1); }
  }
  @keyframes ease-bar-bounce {
    0%   { transform: scaleX(0); }
    60%  { transform: scaleX(1.05); }
    80%  { transform: scaleX(0.97); }
    100% { transform: scaleX(1); }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 900px) {
    .philosophy-inner,
    .specimen-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
