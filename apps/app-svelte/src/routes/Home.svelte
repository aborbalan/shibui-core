<script lang="ts">
  import Counter from '../lib/Counter.svelte';
</script>

<main>
  <h1>Prueba en Svelte</h1>
  <lib-button variant="primary">Botón Shibui</lib-button>

  <h1>Vite + Svelte</h1>

  <div class="card">
    <Counter />
  </div>

  <p>
    Check out
    <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer">SvelteKit</a>,
    the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">
    Ctrl+Shift+A → admin kitchen sink (password: <code>shibui-dev</code>)
  </p>
</main>

<style>
  .read-the-docs { color: #888; }
  code { background: rgba(255, 255, 255, 0.1); padding: 2px 6px; border-radius: 2px; }
</style>
