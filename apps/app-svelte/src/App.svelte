<script lang="ts">

  import Counter from './lib/Counter.svelte'
  import { onMount } from 'svelte';

onMount(async () => {
  // Esto asegura que el código de Lit solo se ejecute cuando el DOM esté listo
  await import('@shibui/ui');
});
export const ssr = false;
</script>

<main>

  <h1>Prueba en Svelte</h1>
<lib-button variant="primary">Botón Shibui</lib-button>

  <h1>Vite + Svelte</h1>

  <div class="card">
    <Counter />
  </div>

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer">SvelteKit</a>, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">
    Click on the Vite and Svelte logos to learn more
  </p>
</main>

<style>

  .read-the-docs {
    color: #888;
  }
</style>
