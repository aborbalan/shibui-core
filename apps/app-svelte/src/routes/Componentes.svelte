<script lang="ts">
  import { COVERAGE, type Coverage } from './kitchen/catalog';
  import { navigate } from '../lib/router';

  const ALL_COMPONENTS = Object.entries(COVERAGE).map(([tagName, coverage]) => ({
    tagName,
    coverage,
    name: tagName
      .replace('lib-', '')
      .split('-')
      .map(w => w[0].toUpperCase() + w.slice(1))
      .join(' '),
  })).sort((a, b) => a.tagName.localeCompare(b.tagName));

  const CATEGORIES: Coverage[] = ['semantic', 'marker', 'effect'];

  const CATEGORY_META: Record<Coverage, { label: string; kanji: string; description: string }> = {
    semantic: { label: 'Semánticos',  kanji: '意',  description: 'Comportamiento propio, estados y accesibilidad integrada.' },
    marker:   { label: 'Marcadores',  kanji: '印',  description: 'Primitivas de layout y estructura sin lógica propia.' },
    effect:   { label: 'Efectos',     kanji: '効',  description: 'Capas de animación y efecto visual sobre el contenido.' },
  };

  let query = $state('');

  let filtered = $derived(
    query.trim()
      ? ALL_COMPONENTS.filter(c =>
          c.tagName.includes(query.toLowerCase()) ||
          c.name.toLowerCase().includes(query.toLowerCase())
        )
      : ALL_COMPONENTS
  );

  function byCategory(cat: Coverage) {
    return filtered.filter(c => c.coverage === cat);
  }

  const totalCount = ALL_COMPONENTS.length;
</script>

<!-- ── Hero ───────────────────────────────────────────────────────────────── -->
<section class="components-hero">
  <lib-display-heading
    tag="h1"
    size="md"
    surface="light"
    line1="Librería de"
    accent="componentes"
    description={`${totalCount} componentes · ${CATEGORIES.length} categorías`}
  ></lib-display-heading>
</section>

<!-- ── Search ─────────────────────────────────────────────────────────────── -->
<div class="search-wrapper">
  <div class="search-inner">
    <lib-input
      placeholder="Buscar por nombre o tag…"
      value={query}
      onui-lib-input={(e: Event) => { query = (e as CustomEvent<{ value: string }>).detail.value; }}
    >
      <lib-icon slot="prefix" name="magnifying-glass" size="sm"></lib-icon>
    </lib-input>
  </div>
</div>

<lib-divider style-variant="hairline" style="margin:0;"></lib-divider>

<!-- ── Categories ─────────────────────────────────────────────────────────── -->
<div class="catalog-wrapper">
  {#each CATEGORIES as cat}
    {@const items = byCategory(cat)}
    {#if items.length > 0}
      {@const meta = CATEGORY_META[cat]}
      <section class="category-section">
        <div class="category-header">
          <span class="category-kanji">{meta.kanji}</span>
          <div>
            <p class="category-label">{meta.label}</p>
            <p class="category-desc">{meta.description}</p>
          </div>
          <span class="category-count">{items.length}</span>
        </div>

        <div class="components-grid">
          {#each items as comp}
            <div class="component-card">
              <p class="component-name">{comp.name}</p>
              <p class="component-tag">&lt;{comp.tagName}&gt;</p>
            </div>
          {/each}
        </div>
      </section>

      <lib-divider style-variant="hairline" style="margin:0;"></lib-divider>
    {/if}
  {/each}

  {#if filtered.length === 0}
    <div class="empty-state">
      <p class="empty-kanji">空</p>
      <p class="empty-message">Ningún componente coincide con "{query}"</p>
    </div>
  {/if}
</div>

<style>
  .components-hero {
    padding: clamp(4rem, 10vh, 7rem) clamp(1.5rem, 5vw, 5rem) clamp(2rem, 4vh, 3rem);
    padding-top: calc(80px + clamp(3rem, 8vh, 5rem));
    max-width: 860px;
    margin: 0 auto;
  }

  .search-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: clamp(1.5rem, 3vh, 2.5rem) clamp(1.5rem, 5vw, 5rem);
  }

  .search-inner {
    max-width: 440px;
  }

  .catalog-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 clamp(1.5rem, 5vw, 5rem);
  }

  .category-section {
    padding: clamp(2.5rem, 5vh, 4rem) 0;
  }

  .category-header {
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
    margin-bottom: clamp(2rem, 4vh, 3rem);
  }

  .category-kanji {
    font-family: var(--lib-font-display);
    font-size: clamp(3rem, 6vw, 4.5rem);
    font-weight: var(--weight-light);
    line-height: 1;
    color: color-mix(in oklch, var(--color-kaki-500), transparent 60%);
    flex-shrink: 0;
  }

  .category-label {
    font-family: var(--lib-font-mono);
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-secondary);
    margin: 0 0 0.4rem;
  }

  .category-desc {
    font-family: var(--lib-font-body);
    font-size: clamp(0.82rem, 1.2vw, 0.92rem);
    color: var(--text-muted);
    line-height: var(--leading-relaxed);
    margin: 0;
  }

  .category-count {
    font-family: var(--lib-font-mono);
    font-size: 0.6rem;
    letter-spacing: 0.1em;
    color: color-mix(in oklch, var(--color-kaki-500), transparent 50%);
    border: 1px solid var(--border-subtle);
    padding: 0.25rem 0.6rem;
    margin-left: auto;
    flex-shrink: 0;
    align-self: flex-start;
    margin-top: 0.25rem;
  }

  .components-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1px;
    background: var(--border-subtle);
    border: 1px solid var(--border-subtle);
  }

  .component-card {
    background: var(--bg-base);
    padding: clamp(1rem, 2vw, 1.5rem);
    transition: background 200ms ease;
    cursor: default;
  }

  .component-card:hover {
    background: var(--bg-overlay);
  }

  .component-name {
    font-family: var(--lib-font-body);
    font-size: 0.82rem;
    color: var(--text-secondary);
    margin: 0 0 0.3rem;
  }

  .component-tag {
    font-family: var(--lib-font-mono);
    font-size: 0.6rem;
    letter-spacing: 0.05em;
    color: color-mix(in oklch, var(--color-kaki-500), transparent 45%);
    margin: 0;
  }

  .empty-state {
    padding: clamp(4rem, 8vh, 6rem) 0;
    text-align: center;
  }

  .empty-kanji {
    font-family: var(--lib-font-display);
    font-size: clamp(4rem, 10vw, 7rem);
    font-weight: var(--weight-light);
    color: color-mix(in oklch, var(--color-kaki-500), transparent 80%);
    margin: 0 0 1rem;
    line-height: 1;
  }

  .empty-message {
    font-family: var(--lib-font-body);
    font-size: 0.9rem;
    color: var(--text-muted);
    margin: 0;
  }
</style>
