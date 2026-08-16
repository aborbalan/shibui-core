/**
 * Manifiesto del ecosistema shibui — la fuente de verdad del hub.
 *
 * Cada entrada es una propiedad desplegada (o, en el caso de tauri, deliberadamente
 * no desplegada). El orden de este array es el orden del bento de la home.
 */

/**
 * Cómo se puede comprobar que una propiedad responde.
 *
 * Firebase Hosting no manda cabeceras CORS para un `fetch` cross-origin, así que
 * de sus sitios NO se puede leer el status: solo si el host contesta. Distinguir
 * los dos casos es la diferencia entre decir "alcanzable" y mentir diciendo "OK".
 */
export type ProbeMode =
  /** Hay CORS: se lee el status HTTP real y la latencia. */
  | 'cors'
  /** `fetch(mode:'no-cors')`: la respuesta es opaca. Si resuelve, el host contesta — nada más. */
  | 'opaque'
  /** Nada que sondear: no tiene sitio web. */
  | 'none';

export interface EcosystemEntry {
  id: string;
  kanji: string;
  name: string;
  /** Una frase. Lo que es, no lo que promete. */
  lede: string;
  stack: string;
  url?: string;
  /** Ruta dentro del monorepo, para el que quiera ir al código. */
  repoPath: string;
  probe: ProbeMode;
  /** Anchura en el bento de la home, en columnas de 4. */
  cols: 1 | 2;
}

export const ECOSYSTEM: readonly EcosystemEntry[] = [
  {
    id: 'storybook',
    kanji: '渋い',
    name: 'shibui/ui',
    lede: 'La librería: 102 web components sobre Lit, agnósticos de framework. Las docs canónicas.',
    stack: 'Lit 3 · Storybook',
    url: 'https://shibui-showcase-storybook.web.app',
    repoPath: 'packages/shibui-ui',
    probe: 'opaque',
    cols: 2,
  },
  {
    id: 'react',
    kanji: '反',
    name: 'Showcase React',
    lede: 'La misma app que Angular y Svelte, en React. Consume los wrappers de @lit/react.',
    stack: 'React 19 · Vite',
    url: 'https://shibui-showcase-react.web.app',
    repoPath: 'apps/app-react',
    probe: 'opaque',
    cols: 2,
  },
  {
    id: 'angular',
    kanji: '角',
    name: 'Showcase Angular',
    lede: 'La misma app, en Angular, con los custom elements directos y CUSTOM_ELEMENTS_SCHEMA.',
    stack: 'Angular 21',
    url: 'https://shibui-showcase-angular.web.app',
    repoPath: 'apps/app-angular',
    probe: 'opaque',
    cols: 1,
  },
  {
    id: 'svelte',
    kanji: '滑',
    name: 'Showcase Svelte',
    lede: 'La misma app, en Svelte, con los tags nativos y los tipos generados.',
    stack: 'Svelte 5 · Vite',
    url: 'https://shibui-showcase-svelte.web.app',
    repoPath: 'apps/app-svelte',
    probe: 'opaque',
    cols: 1,
  },
  {
    id: 'hanko',
    kanji: '判子',
    name: 'hanko',
    lede: 'El sello: verifica que cada componente cumple el contrato que declara, y publica el Trust Report.',
    stack: 'TypeScript · axe',
    url: 'https://hanko-report.web.app',
    repoPath: 'packages/hanko',
    probe: 'cors',
    cols: 2,
  },
  {
    id: 'sukashi',
    kanji: '透かし',
    name: 'sukashi',
    lede: 'Patrones por capas: dos texturas que, al alinearse, revelan un motivo.',
    stack: 'TypeScript · Canvas/SVG',
    url: 'https://sukashi.web.app',
    repoPath: 'packages/sukashi',
    probe: 'opaque',
    cols: 1,
  },
  {
    id: 'api',
    kanji: '館',
    name: 'API',
    lede: 'El catálogo de componentes y tokens como servicio, con su OpenAPI navegable.',
    stack: 'NestJS 11 · Scalar',
    url: 'https://shibui-api.web.app',
    repoPath: 'apps/shibui-api',
    probe: 'cors',
    cols: 1,
  },
  {
    id: 'cv',
    kanji: '履',
    name: 'CV',
    lede: 'Un portfolio corriendo sobre el design system, como prueba de que aguanta trabajo real.',
    stack: 'Angular 21',
    url: 'https://shibui-cv.web.app',
    repoPath: 'apps/app-cv',
    probe: 'opaque',
    cols: 1,
  },
  {
    id: 'tauri',
    kanji: '卓',
    name: 'Escritorio',
    lede: 'La librería fuera del navegador: app nativa con backend en Rust. Sin sitio web, se descarga.',
    stack: 'Tauri 2 · Rust',
    repoPath: 'apps/app-tauri',
    probe: 'none',
    cols: 1,
  },
] as const;

/** Las que tienen sitio que sondear. */
export const PROBEABLE = ECOSYSTEM.filter((e) => e.probe !== 'none' && e.url);

/** Frameworks distintos que consumen la librería, para el KPI de la home. */
export const FRAMEWORK_COUNT = 5; // React, Angular, Svelte, Open Cells y Lit a pelo
