<script lang="ts">
  import AtomPreviews, { ATOM_PREVIEW_TAGS } from './AtomPreviews.svelte';
  import MoleculePreviews, { MOLECULE_PREVIEW_TAGS } from './MoleculePreviews.svelte';
  import OrganismPreviews, { ORGANISM_PREVIEW_TAGS } from './OrganismPreviews.svelte';

  interface Props { tagName: string }
  let { tagName }: Props = $props();

  const ATOMS = new Set(ATOM_PREVIEW_TAGS);
  const MOLECULES = new Set(MOLECULE_PREVIEW_TAGS);
  const ORGANISMS = new Set(ORGANISM_PREVIEW_TAGS);
</script>

<!--
  Mini-preview en vivo del catálogo, congelada (sin interacción) para que la
  card siga siendo un único click. Los tags sin preview registrada muestran un
  placeholder de la misma altura y NUNCA se montan: los componentes
  data-driven de @shibui-ui/ui revientan si se montan sin datos válidos.
-->
{#if ATOMS.has(tagName)}
  <div class="frame" aria-hidden="true"><AtomPreviews tag={tagName} /></div>
{:else if MOLECULES.has(tagName)}
  <div class="frame" aria-hidden="true"><MoleculePreviews tag={tagName} /></div>
{:else if ORGANISMS.has(tagName)}
  <div class="frame" aria-hidden="true"><OrganismPreviews tag={tagName} /></div>
{:else}
  <div class="frame frame--placeholder" aria-hidden="true">
    <lib-icon name="atom" size="lg"></lib-icon>
    <span class="placeholder-tag">&lt;{tagName}&gt;</span>
  </div>
{/if}

<style>
  .frame {
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    pointer-events: none;
    user-select: none;
    content-visibility: auto;
    contain-intrinsic-size: auto 120px;
    margin-top: var(--lib-space-sm);
  }

  .frame--placeholder {
    flex-direction: column;
    gap: var(--lib-space-xs);
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
  }

  .placeholder-tag {
    font-family: var(--lib-font-mono);
    font-size: 0.7rem;
    color: var(--text-muted);
  }
</style>
