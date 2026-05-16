<script lang="ts">
  import type { Snippet } from 'svelte';
  import StatusBadge from './StatusBadge.svelte';

  interface Props { name: string; note?: string; children: Snippet; }
  let { name, note = '', children }: Props = $props();
</script>

<article class="item">
  <header>
    <h4>{name}</h4>
    <StatusBadge {name} />
    {#if note}<small>{note}</small>{/if}
  </header>
  <div class="body">{@render children()}</div>
</article>

<style>
  .item {
    display: flex; flex-direction: column; gap: var(--lib-space-sm);
    padding: var(--lib-space-md);
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-sm, 2px);
  }
  header { display: flex; align-items: center; gap: var(--lib-space-sm); flex-wrap: wrap; }
  h4 { margin: 0; font-family: var(--lib-font-mono, monospace); font-size: 0.9rem; color: var(--text-primary); }
  small { color: var(--text-muted); }
  .body { display: flex; flex-wrap: wrap; gap: var(--lib-space-sm); align-items: flex-start; }
</style>
