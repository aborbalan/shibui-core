<script lang="ts">
  import { onMount } from 'svelte';
  import { navigate } from '../lib/router';
  import {
    getCategoriesWithComponents,
    type CategoryWithComponentsDto,
  } from '../lib/api/components';

  // Kanji decorativo por categoría (fallback 形).
  const CATEGORY_KANJI: Record<string, string> = {
    'inputs-forms': '入',
    navigation: '導',
    feedback: '応',
    layout: '構',
    'data-display': '表',
    'visual-effects': '効',
    charts: '図',
  };

  let categories = $state<CategoryWithComponentsDto[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let query = $state('');

  onMount(async () => {
    try {
      categories = await getCategoriesWithComponents();
    } catch (e) {
      error = e instanceof Error ? e.message : 'Error al cargar componentes';
    } finally {
      loading = false;
    }
  });

  function matches(c: { name: string; tagName: string; description: string; tags: string[] }, q: string) {
    const t = q.toLowerCase();
    return (
      c.name.toLowerCase().includes(t) ||
      c.tagName.toLowerCase().includes(t) ||
      c.description.toLowerCase().includes(t) ||
      c.tags.some((tag) => tag.toLowerCase().includes(t))
    );
  }

  let filtered = $derived(
    query.trim()
      ? categories
          .map((cat) => ({ ...cat, components: cat.components.filter((c) => matches(c, query)) }))
          .filter((cat) => cat.components.length > 0)
      : categories
  );

  let totalCount = $derived(categories.reduce((acc, cat) => acc + cat.components.length, 0));
  let hasResults = $derived(filtered.some((cat) => cat.components.length > 0));
</script>

<!-- ── Hero ───────────────────────────────────────────────────────────────── -->
<section class="components-hero">
  <lib-display-heading
    tag="h1"
    size="md"
    surface="light"
    line1="Librería de"
    accent="componentes"
    description={loading ? '' : `${totalCount} componentes · ${categories.length} categorías`}
  ></lib-display-heading>
</section>

<!-- ── Search ─────────────────────────────────────────────────────────────── -->
<div class="search-wrapper">
  <div class="search-inner">
    <lib-input
      placeholder="Buscar por nombre, tag o descripción…"
      value={query}
      onui-lib-input={(e: Event) => { query = (e as CustomEvent<{ value: string }>).detail.value; }}
    >
      <lib-icon slot="prefix" name="magnifying-glass" size="sm"></lib-icon>
    </lib-input>
  </div>
</div>

<lib-divider style-variant="hairline" style="margin:0;"></lib-divider>

<!-- ── Catalog ────────────────────────────────────────────────────────────── -->
<div class="catalog-wrapper">
  {#if loading}
    <div class="status-state"><lib-spinner size="lg"></lib-spinner></div>
  {:else if error}
    <lib-alert type="error" heading="Error al cargar componentes">{error}</lib-alert>
  {:else}
    {#each filtered as cat (cat.id)}
      {#if cat.components.length > 0}
        <section class="category-section" id={cat.slug}>
          <div class="category-header">
            <span class="category-kanji">{CATEGORY_KANJI[cat.slug] ?? '形'}</span>
            <div>
              <p class="category-label">{cat.name}</p>
              {#if cat.description}<p class="category-desc">{cat.description}</p>{/if}
            </div>
            <span class="category-count">{cat.components.length}</span>
          </div>

          <div class="components-grid">
            {#each cat.components as comp (comp.id)}
              <button
                class="component-card"
                type="button"
                onclick={() => navigate(`/componentes/${comp.slug}`)}
              >
                <p class="component-name">{comp.name}</p>
                <p class="component-tag">&lt;{comp.tagName}&gt;</p>
              </button>
            {/each}
          </div>
        </section>

        <lib-divider style-variant="hairline" style="margin:0;"></lib-divider>
      {/if}
    {/each}

    {#if !hasResults}
      <div class="empty-state">
        <p class="empty-kanji">空</p>
        <p class="empty-message">Ningún componente coincide con "{query}"</p>
      </div>
    {/if}
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

  .status-state {
    display: flex;
    justify-content: center;
    padding: clamp(4rem, 8vh, 6rem) 0;
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
    max-width: 60ch;
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
    cursor: pointer;
    border: none;
    text-align: left;
    width: 100%;
    font: inherit;
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
