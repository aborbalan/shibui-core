<script lang="ts">
  import { navigate } from '../lib/router';
  import {
    getBySlug,
    getExamplesByComponent,
    type ComponentDto,
    type ExampleDto,
  } from '../lib/api/components';

  let { slug }: { slug: string } = $props();

  const STATUS_VARIANT: Record<string, string> = {
    stable: 'success',
    draft: 'warning',
    deprecated: 'error',
  };

  let component = $state<ComponentDto | null>(null);
  let examples = $state<ExampleDto[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  $effect(() => {
    const currentSlug = slug;
    loading = true;
    error = null;
    component = null;
    examples = [];

    getBySlug(currentSlug)
      .then((c) => {
        if (currentSlug !== slug) return; // slug cambió mientras cargaba
        component = c;
        return getExamplesByComponent(c.id);
      })
      .then((ex) => {
        if (ex && currentSlug === slug) examples = ex;
      })
      .catch((e) => {
        if (currentSlug === slug) error = e instanceof Error ? e.message : 'No encontrado';
      })
      .finally(() => {
        if (currentSlug === slug) loading = false;
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

    <section class="examples">
      <h2 class="section-title">Ejemplos</h2>
      <lib-divider style="margin:0 0 1.25rem;"></lib-divider>

      {#if examples.length === 0}
        <lib-empty-state
          title="Sin ejemplos"
          description="Este componente no tiene ejemplos de código disponibles aún."
          icon="code"
        ></lib-empty-state>
      {:else}
        {#each examples as ex (ex.id)}
          <div class="example">
            {#if ex.title}<p class="example-title">{ex.title}</p>{/if}
            {#if ex.description}<p class="example-desc">{ex.description}</p>{/if}
            <lib-code-block code={ex.code} language="html"></lib-code-block>
          </div>
        {/each}
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
    color: var(--color-kaki-700);
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
    color: var(--color-kaki-600);
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
    color: var(--color-kaki-700);
    margin: 0 0 0.75rem;
  }

  .example {
    margin-bottom: 1.5rem;
  }

  .example-title {
    font-family: var(--lib-font-mono);
    font-size: 0.72rem;
    color: var(--color-kaki-700);
    margin: 0 0 0.5rem;
  }

  .example-desc {
    font-family: var(--lib-font-body);
    font-size: 0.85rem;
    color: var(--text-muted);
    margin: 0 0 0.75rem;
  }
</style>
