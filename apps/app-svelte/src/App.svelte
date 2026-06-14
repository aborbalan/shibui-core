<script lang="ts">
  import { onMount } from 'svelte';
  import { route, navigate } from './lib/router';
  import { isAuthenticated } from './lib/auth';
  import Header from './lib/Header.svelte';
  import Hero from './routes/Hero.svelte';
  import About from './routes/About.svelte';
  import Philosophy from './routes/Philosophy.svelte';
  import Componentes from './routes/Componentes.svelte';
  import ComponenteDetail from './routes/ComponenteDetail.svelte';
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

  const PUBLIC_ROUTES = ['/', '/home', '/about', '/philosophy', '/componentes', '/tokens'];

  $effect(() => {
    if (path === '/admin/kitchen-sink' && !authed) navigate('/admin/login');
    if (path === '/admin') navigate('/admin/kitchen-sink');
  });

  let isPublic = $derived(
    PUBLIC_ROUTES.includes(path) || path === '/' || path.startsWith('/componentes/')
  );
  let isAdmin = $derived(path.startsWith('/admin'));

  // Detalle de componente: /componentes/<slug>
  let componentSlug = $derived(
    path.startsWith('/componentes/') ? path.slice('/componentes/'.length) : null
  );
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
  <lib-background theme="washi" style="min-height:100vh;">
    {#if path === '/about'}
      <About />
    {:else if path === '/philosophy'}
      <Philosophy />
    {:else if componentSlug}
      <ComponenteDetail slug={componentSlug} />
    {:else if path === '/componentes'}
      <Componentes />
    {:else if path === '/tokens'}
      <Tokens />
    {:else}
      <Hero />
    {/if}
  </lib-background>
{/if}
