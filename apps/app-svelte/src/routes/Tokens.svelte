<script lang="ts">
  const COLOR_SECTIONS = [
    {
      label: 'Kaki',
      description: 'Tono terra principal — acento cálido del sistema',
      steps: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      prefix: '--color-kaki-',
    },
    {
      label: 'Washi',
      description: 'Escala neutra — desde papel hasta tinta',
      steps: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      prefix: '--color-washi-',
    },
    {
      label: 'Celadon',
      description: 'Tono frío complementario — serenidad cerámica',
      steps: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      prefix: '--color-celadon-',
    },
  ];

  const SEMANTIC_TOKENS = [
    { token: '--text-primary',   label: 'Texto primario' },
    { token: '--text-secondary', label: 'Texto secundario' },
    { token: '--text-muted',     label: 'Texto apagado' },
    { token: '--text-accent',    label: 'Acento' },
    { token: '--text-link',      label: 'Enlace' },
    { token: '--bg-base',        label: 'Fondo base' },
    { token: '--bg-overlay',     label: 'Fondo overlay' },
    { token: '--border-subtle',  label: 'Borde sutil' },
    { token: '--border-default', label: 'Borde por defecto' },
    { token: '--color-success',  label: 'Éxito' },
    { token: '--color-error',    label: 'Error' },
  ];

  const TYPE_SCALE = [
    { token: '--text-xs',   label: 'xs',  size: '0.6875rem' },
    { token: '--text-sm',   label: 'sm',  size: '0.8125rem' },
    { token: '--text-base', label: 'base',size: '1rem' },
    { token: '--text-lg',   label: 'lg',  size: '1.125rem' },
    { token: '--text-xl',   label: 'xl',  size: '1.25rem' },
    { token: '--text-2xl',  label: '2xl', size: '1.5rem' },
    { token: '--text-3xl',  label: '3xl', size: '1.875rem' },
    { token: '--text-4xl',  label: '4xl', size: '2.25rem' },
    { token: '--text-5xl',  label: '5xl', size: '3rem' },
  ];

  const WEIGHT_SCALE = [
    { token: '--weight-light',    label: 'Light',    value: '300' },
    { token: '--weight-regular',  label: 'Regular',  value: '400' },
    { token: '--weight-semibold', label: 'Semibold', value: '600' },
    { token: '--weight-bold',     label: 'Bold',     value: '700' },
  ];

  const SPACING_SCALE = [
    { token: '--lib-space-xs',   value: '0.25rem' },
    { token: '--lib-space-sm',   value: '0.5rem' },
    { token: '--lib-space-md',   value: '1rem' },
    { token: '--lib-space-lg',   value: '1.5rem' },
    { token: '--lib-space-xl',   value: '2rem' },
    { token: '--lib-space-2xl',  value: '3rem' },
    { token: '--lib-space-3xl',  value: '4rem' },
    { token: '--lib-space-4xl',  value: '6rem' },
  ];

  const RADIUS_SCALE = [
    { token: '--radius-none', value: '0' },
    { token: '--radius-sm',   value: '0.25rem' },
    { token: '--radius-md',   value: '0.5rem' },
    { token: '--radius-lg',   value: '1rem' },
    { token: '--radius-xl',   value: '1.5rem' },
    { token: '--radius-full', value: '9999px' },
  ];

  const Z_SCALE = [
    { token: '--z-base',    value: '0' },
    { token: '--z-raised',  value: '10' },
    { token: '--z-dropdown',value: '50' },
    { token: '--z-sticky',  value: '80' },
    { token: '--z-overlay', value: '100' },
    { token: '--z-modal',   value: '200' },
    { token: '--z-toast',   value: '300' },
    { token: '--z-tooltip', value: '400' },
  ];

  const FONT_FAMILIES = [
    { token: '--lib-font-display', label: 'Display', sample: 'Cormorant Garamond', text: 'La belleza no se anuncia.' },
    { token: '--lib-font-body',    label: 'Body',    sample: 'Outfit',             text: 'Cada decisión codifica intención.' },
    { token: '--lib-font-mono',    label: 'Mono',    sample: 'JetBrains Mono',     text: '--token-value: 1rem' },
  ];

  const SECTIONS = [
    { id: 'colors',     label: 'Colores' },
    { id: 'semantic',   label: 'Semánticos' },
    { id: 'typography', label: 'Tipografía' },
    { id: 'spacing',    label: 'Espaciado' },
    { id: 'radius',     label: 'Radio' },
    { id: 'z-index',    label: 'Z-Index' },
  ];

  let activeSection = $state('colors');

  function scrollTo(id: string) {
    activeSection = id;
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
</script>

<div class="tokens-layout">
  <!-- ── Sidebar ──────────────────────────────────────────────────────────── -->
  <aside class="tokens-sidebar">
    <nav class="sidebar-nav">
      <p class="sidebar-heading">Tokens</p>
      {#each SECTIONS as s}
        <button
          class="sidebar-link"
          class:active={activeSection === s.id}
          onclick={() => scrollTo(s.id)}
        >
          {s.label}
        </button>
      {/each}
    </nav>
  </aside>

  <!-- ── Main ─────────────────────────────────────────────────────────────── -->
  <main class="tokens-main">

    <!-- Page heading -->
    <div class="tokens-page-header">
      <lib-display-heading
        tag="h1"
        size="md"
        surface="light"
        line1="Design"
        accent="tokens"
        description="Variables CSS que codifican cada decisión de diseño del sistema."
      ></lib-display-heading>
    </div>

    <!-- ── Colors ───────────────────────────────────────────────────────── -->
    <section id="section-colors" class="token-section">
      <h2 class="section-title">Paleta de colores</h2>

      {#each COLOR_SECTIONS as cs}
        <div class="color-group">
          <p class="color-group-label">{cs.label}</p>
          <p class="color-group-desc">{cs.description}</p>
          <div class="color-scale">
            {#each cs.steps as step}
              <div class="color-swatch">
                <div
                  class="swatch-block"
                  style="background: var({cs.prefix}{step});"
                ></div>
                <p class="swatch-step">{step}</p>
                <p class="swatch-token">{cs.prefix}{step}</p>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </section>

    <lib-divider style-variant="hairline" style="margin:0;"></lib-divider>

    <!-- ── Semantic ─────────────────────────────────────────────────────── -->
    <section id="section-semantic" class="token-section">
      <h2 class="section-title">Tokens semánticos</h2>
      <p class="section-desc">Valores contextuales que cambian según el tema activo.</p>

      <div class="semantic-grid">
        {#each SEMANTIC_TOKENS as t}
          <div class="semantic-item">
            <div class="semantic-preview" style="background: var({t.token});"></div>
            <div>
              <p class="semantic-label">{t.label}</p>
              <p class="semantic-token">{t.token}</p>
            </div>
          </div>
        {/each}
      </div>
    </section>

    <lib-divider style-variant="hairline" style="margin:0;"></lib-divider>

    <!-- ── Typography ───────────────────────────────────────────────────── -->
    <section id="section-typography" class="token-section">
      <h2 class="section-title">Tipografía</h2>

      <!-- Font families -->
      <div class="sub-section">
        <p class="sub-title">Familias</p>
        <div class="font-list">
          {#each FONT_FAMILIES as ff}
            <div class="font-item">
              <div class="font-sample" style="font-family: var({ff.token});">{ff.text}</div>
              <div class="font-meta">
                <p class="font-label">{ff.label} · {ff.sample}</p>
                <p class="font-token">{ff.token}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Type scale -->
      <div class="sub-section">
        <p class="sub-title">Escala</p>
        <div class="type-scale">
          {#each TYPE_SCALE as ts}
            <div class="type-row">
              <span class="type-label">{ts.label}</span>
              <span class="type-sample" style="font-size: var({ts.token});">La belleza en lo impermanente</span>
              <span class="type-value">{ts.size}</span>
            </div>
          {/each}
        </div>
      </div>

      <!-- Weights -->
      <div class="sub-section">
        <p class="sub-title">Pesos</p>
        <div class="weight-row-list">
          {#each WEIGHT_SCALE as w}
            <div class="weight-row">
              <span class="weight-sample" style="font-weight: var({w.token});">{w.label}</span>
              <span class="weight-token">{w.token}</span>
              <span class="weight-value">{w.value}</span>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <lib-divider style-variant="hairline" style="margin:0;"></lib-divider>

    <!-- ── Spacing ───────────────────────────────────────────────────────── -->
    <section id="section-spacing" class="token-section">
      <h2 class="section-title">Espaciado</h2>
      <div class="spacing-list">
        {#each SPACING_SCALE as sp}
          <div class="spacing-row">
            <div class="spacing-bar-wrapper">
              <div class="spacing-bar" style="width: var({sp.token}); height: var({sp.token}); max-width: 100%; max-height: 4rem;"></div>
            </div>
            <span class="spacing-token">{sp.token}</span>
            <span class="spacing-value">{sp.value}</span>
          </div>
        {/each}
      </div>
    </section>

    <lib-divider style-variant="hairline" style="margin:0;"></lib-divider>

    <!-- ── Radius ────────────────────────────────────────────────────────── -->
    <section id="section-radius" class="token-section">
      <h2 class="section-title">Radio de borde</h2>
      <div class="radius-grid">
        {#each RADIUS_SCALE as r}
          <div class="radius-item">
            <div class="radius-preview" style="border-radius: var({r.token});"></div>
            <p class="radius-token">{r.token}</p>
            <p class="radius-value">{r.value}</p>
          </div>
        {/each}
      </div>
    </section>

    <lib-divider style-variant="hairline" style="margin:0;"></lib-divider>

    <!-- ── Z-Index ───────────────────────────────────────────────────────── -->
    <section id="section-z-index" class="token-section">
      <h2 class="section-title">Z-Index</h2>
      <p class="section-desc">Jerarquía semántica de capas — nunca usar valores literales.</p>
      <div class="z-list">
        {#each Z_SCALE as z}
          <div class="z-row">
            <div class="z-bar" style="width: calc({z.value} * 0.2px + 4px);"></div>
            <span class="z-token">{z.token}</span>
            <span class="z-value">{z.value}</span>
          </div>
        {/each}
      </div>
    </section>

  </main>
</div>

<style>
  .tokens-layout {
    display: flex;
    min-height: calc(100vh - 56px);
    padding-top: 56px;
  }

  /* ── Sidebar ── */
  .tokens-sidebar {
    width: 200px;
    flex-shrink: 0;
    border-right: 1px solid var(--border-subtle);
    padding: 2rem 0;
    position: sticky;
    top: 56px;
    height: calc(100vh - 56px);
    overflow-y: auto;
  }

  .sidebar-nav {
    padding: 0 1.5rem;
  }

  .sidebar-heading {
    font-family: var(--lib-font-mono);
    font-size: 0.58rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin: 0 0 1rem;
  }

  .sidebar-link {
    display: block;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
    font-family: var(--lib-font-body);
    font-size: 0.82rem;
    color: var(--text-muted);
    padding: 0.4rem 0;
    transition: color 200ms ease;
    border-left: 2px solid transparent;
    padding-left: 0.75rem;
    margin-left: -0.75rem;
  }

  .sidebar-link:hover,
  .sidebar-link.active {
    color: var(--text-secondary);
    border-left-color: color-mix(in oklch, var(--color-kaki-500), transparent 50%);
  }

  /* ── Main ── */
  .tokens-main {
    flex: 1;
    padding: 3rem clamp(1.5rem, 4vw, 3.5rem) 6rem;
    max-width: 900px;
  }

  .tokens-page-header {
    margin-bottom: 3rem;
  }

  /* ── Sections ── */
  .token-section {
    padding: clamp(2.5rem, 5vh, 4rem) 0;
  }

  .section-title {
    font-family: var(--lib-font-mono);
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-secondary);
    margin: 0 0 1.5rem;
  }

  .section-desc {
    font-family: var(--lib-font-body);
    font-size: 0.85rem;
    color: var(--text-muted);
    line-height: var(--leading-relaxed);
    margin: -0.75rem 0 1.5rem;
  }

  .sub-section {
    margin-bottom: 2.5rem;
  }

  .sub-title {
    font-family: var(--lib-font-mono);
    font-size: 0.58rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: color-mix(in oklch, var(--color-kaki-500), transparent 50%);
    margin: 0 0 1rem;
  }

  /* ── Color palette ── */
  .color-group {
    margin-bottom: 2.5rem;
  }

  .color-group-label {
    font-family: var(--lib-font-mono);
    font-size: 0.62rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-secondary);
    margin: 0 0 0.3rem;
  }

  .color-group-desc {
    font-family: var(--lib-font-body);
    font-size: 0.78rem;
    color: var(--text-muted);
    margin: 0 0 1rem;
  }

  .color-scale {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .color-swatch {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    min-width: 56px;
  }

  .swatch-block {
    width: 48px;
    height: 48px;
    border: 1px solid var(--border-subtle);
  }

  .swatch-step {
    font-family: var(--lib-font-mono);
    font-size: 0.58rem;
    letter-spacing: 0.05em;
    color: var(--text-secondary);
    margin: 0;
  }

  .swatch-token {
    display: none;
  }

  /* ── Semantic ── */
  .semantic-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 0.75rem;
  }

  .semantic-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    border: 1px solid var(--border-subtle);
  }

  .semantic-preview {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    border: 1px solid var(--border-subtle);
  }

  .semantic-label {
    font-family: var(--lib-font-body);
    font-size: 0.78rem;
    color: var(--text-secondary);
    margin: 0 0 0.2rem;
  }

  .semantic-token {
    font-family: var(--lib-font-mono);
    font-size: 0.58rem;
    letter-spacing: 0.05em;
    color: color-mix(in oklch, var(--color-kaki-500), transparent 45%);
    margin: 0;
  }

  /* ── Typography ── */
  .font-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .font-item {
    border-left: 2px solid var(--border-subtle);
    padding-left: 1.25rem;
  }

  .font-sample {
    font-size: clamp(1.25rem, 3vw, 1.75rem);
    color: var(--text-primary);
    line-height: 1.3;
    margin-bottom: 0.5rem;
  }

  .font-label {
    font-family: var(--lib-font-mono);
    font-size: 0.6rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-secondary);
    margin: 0 0 0.2rem;
  }

  .font-token {
    font-family: var(--lib-font-mono);
    font-size: 0.58rem;
    color: color-mix(in oklch, var(--color-kaki-500), transparent 45%);
    margin: 0;
  }

  .type-scale {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .type-row {
    display: flex;
    align-items: baseline;
    gap: 1.5rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--border-subtle);
  }

  .type-label {
    font-family: var(--lib-font-mono);
    font-size: 0.58rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    width: 2.5rem;
    flex-shrink: 0;
  }

  .type-sample {
    font-family: var(--lib-font-body);
    color: var(--text-primary);
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .type-value {
    font-family: var(--lib-font-mono);
    font-size: 0.6rem;
    color: var(--text-muted);
    flex-shrink: 0;
  }

  .weight-row-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .weight-row {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--border-subtle);
  }

  .weight-sample {
    font-family: var(--lib-font-body);
    font-size: 1rem;
    color: var(--text-primary);
    width: 6rem;
    flex-shrink: 0;
  }

  .weight-token {
    font-family: var(--lib-font-mono);
    font-size: 0.6rem;
    color: color-mix(in oklch, var(--color-kaki-500), transparent 45%);
    flex: 1;
  }

  .weight-value {
    font-family: var(--lib-font-mono);
    font-size: 0.6rem;
    color: var(--text-muted);
  }

  /* ── Spacing ── */
  .spacing-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .spacing-row {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .spacing-bar-wrapper {
    width: 6rem;
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  .spacing-bar {
    background: color-mix(in oklch, var(--color-kaki-500), transparent 60%);
    min-width: 4px;
    min-height: 4px;
  }

  .spacing-token {
    font-family: var(--lib-font-mono);
    font-size: 0.6rem;
    color: color-mix(in oklch, var(--color-kaki-500), transparent 45%);
    flex: 1;
  }

  .spacing-value {
    font-family: var(--lib-font-mono);
    font-size: 0.6rem;
    color: var(--text-muted);
    width: 4rem;
    text-align: right;
  }

  /* ── Radius ── */
  .radius-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .radius-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    min-width: 80px;
  }

  .radius-preview {
    width: 56px;
    height: 56px;
    background: color-mix(in oklch, var(--color-kaki-500), transparent 70%);
    border: 1px solid var(--border-default);
  }

  .radius-token {
    font-family: var(--lib-font-mono);
    font-size: 0.55rem;
    letter-spacing: 0.05em;
    color: color-mix(in oklch, var(--color-kaki-500), transparent 40%);
    margin: 0;
    text-align: center;
  }

  .radius-value {
    font-family: var(--lib-font-mono);
    font-size: 0.55rem;
    color: var(--text-muted);
    margin: 0;
  }

  /* ── Z-Index ── */
  .z-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .z-row {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--border-subtle);
  }

  .z-bar {
    height: 8px;
    background: color-mix(in oklch, var(--color-kaki-500), transparent 55%);
    flex-shrink: 0;
  }

  .z-token {
    font-family: var(--lib-font-mono);
    font-size: 0.6rem;
    color: color-mix(in oklch, var(--color-kaki-500), transparent 40%);
    flex: 1;
  }

  .z-value {
    font-family: var(--lib-font-mono);
    font-size: 0.6rem;
    color: var(--text-muted);
    width: 3rem;
    text-align: right;
  }

  @media (max-width: 640px) {
    .tokens-sidebar {
      display: none;
    }
  }
</style>
