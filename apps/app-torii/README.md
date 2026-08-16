# torii 鳥居 — hub del ecosistema shibui

> El torii es la puerta del recinto. Esta es la puerta al ecosistema.

Las propiedades de shibui —Storybook, los tres showcases espejo, el CV, las docs de la API,
hanko, sukashi, la app de escritorio— viven cada una en su sitio. torii las presenta juntas,
agrega los datos que publican y muestra cuáles responden.

Construida con **[Open Cells](https://www.opencells.dev)** (SPA de BBVA: `startApp` +
routing + page controllers + channels pub/sub). Es el consumidor **nativo** de
`@shibui-ui/ui`: web components directamente, sin wrapper, porque Open Cells y la librería
son ambos Lit.

## Arranque

```bash
pnpm install
pnpm build:shibui      # @shibui-ui/ui necesita su dist
pnpm start:torii
```

## Rutas

| Nombre | Path | Qué muestra |
|---|---|---|
| `home` | `/` | Las propiedades del ecosistema en bento, con KPIs vivos |
| `arquitectura` | `/arquitectura` | El plano: diagrama UML de componentes del monorepo |
| `salud` | `/salud` | El Trust Report de hanko en detalle |
| `deploys` | `/deploys` | Qué sitios responden |
| `not-found` | `/404` | `notFound: true` |

La navegación es **por nombre**, nunca por path: `navigate('salud')`.

## Estructura

| Ruta | Qué es |
|---|---|
| `index.html` | `<torii-chrome>` + `<app-index id="app-content">` (nodo del router) |
| `src/main.ts` | `startApp` + arranque de loaders |
| `src/router/routes.ts` | Mapa de rutas |
| `src/chrome/` | Shell persistente: header, footer, switcher de katachi |
| `src/pages/` | Page controllers |
| `src/data/` | Manifiesto del ecosistema, katachi, tipos y loaders |
| `docs/arquitectura/` | El `.puml` del diagrama de la ruta `/arquitectura` |
| `public/arquitectura/` | Su `.svg` renderizado, servido como asset |

## El diagrama de arquitectura

Se escribe en PlantUML y se renderiza en local con `tools/uml` (sin Java, sin servidor
externo). El `.svg` es salida generada pero **se versiona**: Vite no renderiza PlantUML en
build, así que la app necesita el asset ya hecho.

```bash
pnpm --filter app-torii diagrama    # docs/arquitectura/*.puml → public/arquitectura/*.svg
```

`tools/uml` no está en el workspace de pnpm: sus dependencias se instalan aparte con
`npm install` dentro de su directorio, una sola vez.

## Datos

- **Dev**: fixture local `src/data/trust-report.fixture.json`.
- **Prod**: `https://hanko-report.web.app/trust-report.json` (Trust Report real) y el
  catálogo de `{VITE_API_URL}/components`.
- **Estado de deploys**: Firebase Hosting no manda cabeceras CORS, así que la sonda usa
  `fetch(mode:'no-cors')` para los sitios de Firebase. Eso dice **alcanzable**, no *200*:
  la UI lo etiqueta como lo que es.

## Deploy

Firebase Hosting, target `torii` → **shibui-torii.web.app**.

```bash
pnpm --filter app-torii deploy
```

## Sobre Open Cells

Las convenciones del framework (navegación por nombre, `notFound`, `inbounds` como getters,
reutilización de nodos de página) están en `CLAUDE.md`, y su fuente es el fork propio
**`aborbalan/open-cells`**, que además trae un servidor MCP para analizar rutas y channels.

El currículo del antiguo proyecto guiado de aprendizaje se conserva en
[`docs/opencells-curriculum/`](../../docs/opencells-curriculum/).
