<script lang="ts">
  import { coverageOf, type Coverage } from './catalog';

  interface Props { name: string; }
  let { name }: Props = $props();

  let cov = $derived<Coverage>(coverageOf(name));
  let dot = $derived(cov === 'semantic' ? '🟢' : cov === 'marker' ? '🔵' : '⚪');
</script>

<span class="badge {cov}" title="Katachi coverage: {cov}">{dot} {cov}</span>

<style>
  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 2px 8px; border-radius: 4px;
    font-family: var(--lib-font-mono, monospace);
    font-size: 0.7rem; letter-spacing: 0.04em; white-space: nowrap;
  }
  .semantic { background: oklch(70% 0.15 145deg / 0.18); color: oklch(80% 0.18 145deg); }
  .marker   { background: oklch(70% 0.15 230deg / 0.18); color: oklch(80% 0.18 230deg); }
  .effect   { background: oklch(60% 0.02 270deg / 0.18); color: oklch(80% 0.02 270deg); }
</style>
