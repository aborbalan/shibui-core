<script lang="ts">
  import { onMount } from 'svelte';
  import { route, navigate } from './lib/router';
  import { isAuthenticated } from './lib/auth';
  import Header from './lib/Header.svelte';
  import Hero from './routes/Hero.svelte';
  import About from './routes/About.svelte';
  import Filosofia from './routes/Filosofia.svelte';
  import Componentes from './routes/Componentes.svelte';
  import Tokens from './routes/Tokens.svelte';
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

  const PUBLIC_ROUTES = ['/', '/home', '/about', '/filosofia', '/componentes', '/tokens'];

  $effect(() => {
    if (path === '/admin/kitchen-sink' && !authed) navigate('/admin/login');
    if (path === '/admin') navigate('/admin/kitchen-sink');
  });

  let isPublic = $derived(PUBLIC_ROUTES.includes(path) || path === '/');
  let isAdmin = $derived(path.startsWith('/admin'));
</script>

<svelte:window onkeydown={onKeydown} />

{#if isAdmin}
  {#if path === '/admin/login'}
    <Login />
  {:else if path === '/admin/kitchen-sink' && authed}
    <Kitchen />
  {/if}
{:else}
  <Header />
  <lib-background variant="ash-grid" style="min-height:100vh;">
    {#if path === '/about'}
      <About />
    {:else if path === '/filosofia'}
      <Filosofia />
    {:else if path === '/componentes'}
      <Componentes />
    {:else if path === '/tokens'}
      <Tokens />
    {:else}
      <Hero />
    {/if}
  </lib-background>
{/if}
