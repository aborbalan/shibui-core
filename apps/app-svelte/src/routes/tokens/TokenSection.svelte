<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    id: string;
    eyebrow: string;
    /** Título; la parte en `accent` se pinta en itálica con el color de acento. */
    title: string;
    accent: string;
    description: string;
    children: Snippet;
  }
  let { id, eyebrow, title, accent, description, children }: Props = $props();
</script>

<section {id} class="token-section">
  <lib-eyebrow tone="accent" line="left" size="sm" style="margin-bottom:0.75rem;display:inline-flex;">
    {eyebrow}
  </lib-eyebrow>

  <h2 class="title">{title} <em>{accent}</em></h2>
  <p class="description">{description}</p>

  {@render children()}
</section>

<style>
  .token-section {
    margin-bottom: 5rem;
    scroll-margin-top: 80px;
  }

  .title {
    font-family: var(--lib-font-display);
    font-size: clamp(1.8rem, 3vw, 2.8rem);
    font-weight: var(--weight-light);
    letter-spacing: -0.02em;
    line-height: 1.2;
    color: var(--text-primary);
    margin: 0 0 0.75rem;
  }
  .title em {
    font-style: italic;
    color: var(--text-accent);
  }

  .description {
    font-family: var(--lib-font-body);
    font-size: var(--text-sm);
    color: var(--text-secondary);
    max-width: 560px;
    line-height: var(--leading-relaxed);
    margin: 0 0 2.5rem;
  }
</style>
