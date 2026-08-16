# app-torii — Contexto operativo para Claude

> Se auto-carga al trabajar en `apps/app-torii/`.

## Qué es esto

**torii 鳥居** — el torii es la puerta del recinto; esta app es la puerta al ecosistema
shibui. Un hub que presenta las propiedades desplegadas (Storybook, los tres showcases
espejo, el CV, las docs de la API, hanko, sukashi, la app de escritorio), agrega datos
vivos y muestra el estado de cada deploy.

Construida con **Open Cells** (framework SPA de BBVA: `startApp` + routing + page
controllers + channels pub/sub). Es el consumidor **nativo** de `@shibui-ui/ui`: usa los
web components directamente, sin wrapper, porque Open Cells y la librería son ambos Lit.

> Esta app fue `app-opencells`, un proyecto guiado de aprendizaje con un pacto de tutor
> («Claude no escribe el código Open Cells»). **Ese pacto está derogado**: torii se escribe
> entera. El currículo se conserva en `docs/opencells-curriculum/` para la futura app de
> aprendizaje, que podrá usar torii como referencia.

## Open Cells — convenciones que hay que respetar

Fuente de verdad: el `CLAUDE.md` del fork propio, **`aborbalan/open-cells`**. No BBVA.
Estas cinco son las que se rompen por intuición:

- **Se navega por nombre de ruta, nunca por path**: `navigate('salud')`. Dos rutas con el
  mismo nombre se pisan.
- **La página 404 es la ruta con `notFound: true`.** Sin una, un path desconocido no
  renderiza nada.
- **El estado va por channels**, atados con `static inbounds` / `static outbounds`. Los
  channels reproducen su último valor, así que el orden de suscripción da igual.
- **Los `inbounds` son getters en runtime**, así que TypeScript no los ve en la clase:
  hay que declararlos (`declare _trustReport: TrustReport | null;`) o el build falla.
- **Los nodos de página se reutilizan entre visitas.** `firstUpdated` no vuelve a correr:
  el trabajo por visita va en `onPageEnter`, y la reacción a params en `willUpdate`.
- **El router NO borra la página anterior.** Deja todos los nodos visitados dentro de
  `#app-content` y solo les cambia el atributo `state` (`active` · `cached` · `inactive`).
  Esconder los que no están activos es cosa de la app: la regla vive en `src/styles.css`.
  **Si se toca eso, la navegación parece rota sin estarlo** — el hash cambia y el link se
  marca, pero la página nueva se apila debajo de la anterior, fuera de la vista.

### El header no navega solo

`lib-header` hace `preventDefault()` sobre sus links y delega en el evento
`ui-lib-header-link` (`detail.id`); el `href` es solo destino visible. **Sin handler no
navega ninguna pestaña**, ni en escritorio ni en el drawer móvil. Lo cablea
`torii-chrome`, que llama a `navigate(id)` porque los ids de `NAV_LINKS` son nombres de
ruta. Los showcases de Angular y Svelte hacen lo mismo con sus routers. Los links del pie
y el logo, en cambio, son anclas normales y navegan por el hash sin ayuda.

### El MCP server del fork

`aborbalan/open-cells` tiene un `packages/mcp-server` con `open_cells_api_reference`,
`open_cells_docs_search`, `open_cells_list_routes`, `open_cells_validate_routes`,
`open_cells_list_channels` y `open_cells_scaffold_page`. **Preferirlo a grepear** — y
`validate_routes` + `list_channels` son la verificación de esta app: cazan rutas duplicadas,
`action` que no resuelve, falta de 404 y channels huérfanos.

No está publicado en npm (ficha 6A del backlog del fork), así que se usa desde un checkout:
`npm run build -w @open-cells/mcp-server`, apuntando `project_root` a `apps/app-torii`.

### Nada va a `BBVA/open-cells`

Ni PR, ni issue, ni comentario. Todo, incluidos los defectos que sean suyos, va a
`aborbalan/open-cells`. Es la norma del fork y aplica también desde aquí.

## Estructura

| Ruta | Qué es |
|---|---|
| `index.html` | `<torii-chrome>` (shell persistente) + `<app-index id="app-content">` (nodo del router) |
| `src/main.ts` | `startApp` + arranque de los loaders |
| `src/router/routes.ts` | Mapa de rutas (con nombre) |
| `src/chrome/` | Header, footer y switcher de katachi — fuera del nodo del router |
| `src/pages/` | Page controllers |
| `src/data/` | Manifiesto del ecosistema, katachi, tipos y loaders |
| `docs/arquitectura/` | Fuente `.puml` del diagrama de `/arquitectura` |
| `public/arquitectura/` | Su `.svg` renderizado — generado, pero versionado a propósito |

Convención de ficheros, igual que la librería: `x.component.ts` + `x.html.ts` + `x.css`
+ `x.types.ts`.

## El diagrama de `/arquitectura`

La única página sin datos vivos. El diagrama se escribe en PlantUML y se renderiza
con `tools/uml` (repo raíz): sin Java y sin mandar nada fuera de la máquina.

- Tocar el diagrama = tocar `docs/arquitectura/ecosistema.puml` y **regenerar**:
  `pnpm --filter app-torii diagrama`. Editar el `.svg` a mano es dejarlos desalineados.
- **Mirar el resultado, no solo el fuente.** PlantUML coloca los elementos por su
  cuenta; los solapes y las flechas cruzando texto solo se ven en la imagen. El MCP
  `uml` (`render_uml_file`) la devuelve en la respuesta.
- El fichero debe **abrir** con `@startuml`: un comentario por encima lo rompe.
- El SVG lleva sus colores dentro y no reacciona al katachi. Por eso la página lo
  enmarca en una lámina de papel claro fija en vez de intentar tematizarlo.

## Datos

- **Trust Report de hanko** — dev: `src/data/trust-report.fixture.json`; prod:
  `https://hanko-report.web.app/trust-report.json` (tiene CORS `*`).
- **Catálogo de componentes** — `{VITE_API_URL}/components`. Ojo al *cold start* de Render.
- **Estado de deploys** — sonda propia. Firebase Hosting no manda CORS, así que los sitios
  se comprueban con `fetch(mode:'no-cors')`: eso dice *alcanzable*, no *200*. No pintar como
  health check lo que no lo es.

## Arranque

```bash
pnpm install
pnpm build:shibui   # la app consume el dist/ de la librería
pnpm start:torii
```

## Reglas duras

- **GitFlow absoluto:** ramas desde `develop`, merge `--no-ff`, `main` solo vía PR.
- Antes de dar por bueno markup `lib-*`, pasarlo por `validate_html` del MCP `shibui-cem`.
