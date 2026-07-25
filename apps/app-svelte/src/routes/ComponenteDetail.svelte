<script lang="ts">
  import { navigate } from '../lib/router';
  import {
    getBySlug,
    getExamplesByComponent,
    type ComponentDto,
    type ExampleDto,
  } from '../lib/api/components';
  import ComponentApi from './componentes/ComponentApi.svelte';
  import ComponentExamples from './componentes/ComponentExamples.svelte';

  let { slug }: { slug: string } = $props();

  const STATUS_VARIANT: Record<string, string> = {
    stable: 'success',
    draft: 'warning',
    deprecated: 'error',
  };

  let component = $state<ComponentDto | null>(null);
  let examples = $state<ExampleDto[]>([]);
  let loading = $state(true);
  let loadingExamples = $state(true);
  let error = $state<string | null>(null);

  /** Los ejemplos son accesorios: si fallan, la ficha se muestra igual. */
  function loadExamples(componentId: string, forSlug: string): void {
    getExamplesByComponent(componentId)
      .then((ex) => {
        if (forSlug === slug) examples = ex;
      })
      .catch(() => {
        if (forSlug === slug) examples = [];
      })
      .finally(() => {
        if (forSlug === slug) loadingExamples = false;
      });
  }

  $effect(() => {
    const currentSlug = slug;
    loading = true;
    loadingExamples = true;
    error = null;
    component = null;
    examples = [];

    getBySlug(currentSlug)
      .then((c) => {
        if (currentSlug !== slug) return; // slug cambió mientras cargaba
        component = c;
        loading = false;
        loadExamples(c.id, currentSlug);
      })
      .catch((e) => {
        if (currentSlug !== slug) return;
        error = e instanceof Error ? e.message : 'No encontrado';
        loading = false;
        loadingExamples = false;
      });
  });
</script>

<div class="detail-wrapper">
  <div class="back">
    <lib-button variant="ghost" size="sm" onui-lib-click={() => navigate('/componentes')}>
      ← Componentes
    </lib-button>
  </div>

  {#if loading}
    <div class="status-state"><lib-spinner size="lg"></lib-spinner></div>
  {:else if error || !component}
    <lib-alert type="error" heading="Componente no encontrado">{error ?? slug}</lib-alert>
  {:else}
    <header class="detail-header">
      <div class="meta-row">
        <lib-badge tone={STATUS_VARIANT[component.status] ?? 'default'} size="sm" pill>
          {component.status.toUpperCase()}
        </lib-badge>
        <span class="meta">v{component.version}</span>
        {#if component.packageName}<span class="meta">{component.packageName}</span>{/if}
        {#if component.docsUrl}
          <a class="meta docs-link" href={component.docsUrl} target="_blank" rel="noreferrer">
            Documentación ↗
          </a>
        {/if}
      </div>

      <h1 class="title">{component.name}</h1>
      <p class="tag">&lt;{component.tagName}&gt;</p>
      <p class="description">{component.description}</p>

      {#if component.tags.length > 0}
        <div class="tags">
          {#each component.tags as tag (tag)}
            <lib-chip kind="static" size="xs" color="default">{tag}</lib-chip>
          {/each}
        </div>
      {/if}
    </header>

    <ComponentApi api={component.api} />

    <section class="examples">
      <h2 class="section-title">Ejemplos</h2>
      <lib-divider style="margin:0 0 1.25rem;"></lib-divider>

      {#if loadingExamples}
        <div class="status-state"><lib-spinner size="md"></lib-spinner></div>
      {:else}
        <ComponentExamples {examples} />
      {/if}
    </section>
  {/if}
</div>

<style>
  .detail-wrapper {
    max-width: 860px;
    margin: 0 auto;
    padding: calc(80px + 3rem) clamp(1.5rem, 5vw, 3.5rem) 6rem;
  }

  .back {
    margin-bottom: 2rem;
  }

  .status-state {
    display: flex;
    justify-content: center;
    padding: clamp(4rem, 8vh, 6rem) 0;
  }

  .detail-header {
    margin-bottom: 2.5rem;
  }

  .meta-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
    margin-bottom: 0.75rem;
  }

  .meta {
    font-family: var(--lib-font-mono);
    font-size: 0.65rem;
    color: var(--text-accent);
  }

  .title {
    font-family: var(--lib-font-display);
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: var(--weight-light);
    margin: 0 0 0.5rem;
    color: var(--text-primary);
  }

  .tag {
    font-family: var(--lib-font-mono);
    font-size: 0.85rem;
    color: var(--text-accent);
    margin: 0 0 1rem;
  }

  .description {
    font-family: var(--lib-font-body);
    font-size: 1rem;
    line-height: var(--leading-relaxed);
    color: var(--text-secondary);
    max-width: 60ch;
    margin: 0;
  }

  .tags {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
    margin-top: 1.5rem;
  }

  .examples {
    margin-top: 1rem;
  }

  .section-title {
    font-family: var(--lib-font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-accent);
    margin: 0 0 0.75rem;
  }

  .docs-link {
    text-decoration: none;
    border-bottom: 1px solid currentcolor;
    padding-bottom: 1px;
  }
</style>
