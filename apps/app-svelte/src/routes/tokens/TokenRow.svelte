<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { DesignTokenDto } from '../../lib/api/tokens';

  interface Props {
    token: DesignTokenDto;
    /** Muestra visual opcional a la izquierda (swatch, sombra, radio…). */
    preview?: Snippet;
  }
  let { token, preview }: Props = $props();
</script>

<div class="row" class:row--preview={preview}>
  {#if preview}
    <div class="preview">{@render preview()}</div>
  {/if}
  <code class="var">{token.cssVar}</code>
  <code class="value">{token.value}</code>
  <span class="desc">{token.description}</span>
</div>

<style>
  .row {
    display: grid;
    grid-template-columns: 1fr 1.2fr 2fr;
    gap: 1rem;
    align-items: center;
    padding: 0.6rem 0;
    border-bottom: 1px solid var(--border-subtle);
  }
  .row--preview {
    grid-template-columns: 48px 1fr 1.2fr 2fr;
  }

  .preview {
    flex-shrink: 0;
    display: flex;
  }

  .var {
    font-family: var(--lib-font-mono);
    font-size: 0.68rem;
    color: var(--text-accent);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .value {
    font-family: var(--lib-font-mono);
    font-size: 0.65rem;
    color: var(--text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .desc {
    font-family: var(--lib-font-body);
    font-size: 0.75rem;
    color: var(--text-muted);
    line-height: 1.4;
  }
</style>
