<script lang="ts">
  import { route, navigate } from './router';
  import { libProps } from './lib-props';

  /* Ids del header que son anclas de la landing, no rutas. */
  const SCROLL_SECTIONS = new Set(['install']);

  const LINKS = [
    { id: 'componentes', label: 'Componentes' },
    { id: 'tokens',      label: 'Tokens'      },
    { id: 'install',     label: 'Instalación' },
    { id: 'philosophy',  label: 'Filosofía'   },
    { id: 'about',       label: 'Sobre mí'    },
  ];

  const ACTIONS = [{ label: 'Empezar →', variant: 'sabi' }];

  let path = $derived($route);
  let activeId = $derived(path === '/' ? 'home' : path.slice(1).split('/')[0]);
  let links = $derived(LINKS.map((link) => ({ ...link, active: link.id === activeId })));

  /* Reintenta hasta que la sección esté montada (cambiar de ruta repinta). */
  function scrollToSection(id: string, tries = 20): void {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (tries > 0) {
      setTimeout(() => scrollToSection(id, tries - 1), 100);
    }
  }

  /* `lib-header` hace preventDefault sobre sus links y delega en el evento:
     sin este handler la navegación desde el header no ocurre. */
  function onLink(e: Event): void {
    const { id } = (e as CustomEvent<{ id: string }>).detail;
    if (SCROLL_SECTIONS.has(id)) {
      if (path !== '/' && path !== '/home') navigate('/');
      scrollToSection(id);
      return;
    }
    navigate(id === 'home' ? '/' : `/${id}`);
  }
</script>

<lib-header
  theme="sabi"
  logo-mark="渋"
  brand-name="shibui"
  logo-href="#/"
  show-search={activeId === 'componentes'}
  search-placeholder="Buscar…"
  use:libProps={{ links, actions: ACTIONS }}
  onui-lib-header-link={onLink}
  onui-lib-header-action={() => navigate('/componentes')}
  style="position: fixed; top: 0; left: 0; right: 0; z-index: var(--z-overlay);"
></lib-header>
