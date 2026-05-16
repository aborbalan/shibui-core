<script lang="ts">
  import { onMount } from 'svelte';
  import { route, navigate } from './lib/router';
  import { isAuthenticated } from './lib/auth';
  import Home from './routes/Home.svelte';
  import Login from './routes/Login.svelte';
  import Kitchen from './routes/Kitchen.svelte';

  onMount(async () => {
    await import('@shibui-ui/ui');
  });

  function onKeydown(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      navigate('/admin/login');
    }
  }

  let authed = $derived($isAuthenticated);
  let path = $derived($route);

  $effect(() => {
    if (path === '/admin/kitchen-sink' && !authed) navigate('/admin/login');
    if (path === '/admin') navigate('/admin/kitchen-sink');
  });
</script>

<svelte:window on:keydown={onKeydown} />

{#if path === '/admin/login'}
  <Login />
{:else if path === '/admin/kitchen-sink' && authed}
  <Kitchen />
{:else}
  <Home />
{/if}
