<script lang="ts">
  import KatachiSwitcher from './kitchen/KatachiSwitcher.svelte';
  import AtomsSink from './kitchen/AtomsSink.svelte';
  import MoleculesSink from './kitchen/MoleculesSink.svelte';
  import OrganismsSink from './kitchen/OrganismsSink.svelte';
  import type { KatachiId } from './kitchen/catalog';

  let katachi = $state<KatachiId | ''>('');
</script>

<div class="root">
  <KatachiSwitcher bind:value={katachi} />

  <div class="content" data-katachi={katachi || null}>
    <header>
      <h1>Kitchen Sink</h1>
      <p>
        78 componentes <code>lib-*</code> bajo contexto Katachi
        <strong>{katachi || 'none'}</strong>.
        Cambia el switcher arriba para reevaluar la propagación.
      </p>
    </header>

    <AtomsSink />
    <MoleculesSink />
    <OrganismsSink />
  </div>
</div>

<style>
  .root { min-height: 100vh; background: var(--bg-base); color: var(--text-primary); }
  .content { padding: var(--lib-space-xl); display: flex; flex-direction: column; gap: var(--lib-space-2xl); }
  header { display: flex; flex-direction: column; gap: var(--lib-space-xs); }
  h1 { font-size: var(--text-3xl); margin: 0; }
  p { color: var(--text-muted); margin: 0; }
  code { background: var(--bg-elevated); padding: 2px 6px; border-radius: 2px; }
  strong { color: var(--text-primary); }
</style>
