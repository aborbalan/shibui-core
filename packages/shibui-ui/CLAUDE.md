# Shibui (lib-ui) — Arquitectura, Convenciones y Contexto

## Visión general

Shibui (渋い) es una librería de **Web Components agnóstica** construida con Lit y TypeScript estricto, con el objetivo de publicarse como **paquete npm**. El nombre y la estética están inspirados en el concepto japonés de belleza simple, sutil y duradera.

El design system se basa en **CSS custom properties (tokens)** organizados en capas: primitivos → compuestos → semánticos. El sistema incluye además dos efectos visuales opcionales que los componentes pueden adoptar cuando tiene sentido: glassmorphism ("Efecto Agua") y spotlight reactivo al cursor ("Kintsugi Digital").

---

## Stack técnico

- **Lit** — Web Components nativos, Shadow DOM
- **TypeScript estricto** — `exactOptionalPropertyTypes`, tipado explícito en todos los métodos
- **Node** — NVM (v22.12.0 LTS)
- **Vite** — bundler y dev server (HMR ultra-rápido)
- **Storybook** — documentación y desarrollo aislado de componentes
- **CSS puro** — sin Tailwind, todo mediante CSS custom properties con `@layer tokens, reset, components`
- **Iconografía** — Phosphor Icons abstraídos en `lib-icon`
- **Testing** — Playwright (E2E + component testing + visual regression)

---

## Estructura del proyecto

Monorepo gestionado con **npm workspaces** (`shibui-ecosystem`).

```
raíz/
  .config/                → Configuración compartida raíz (eslint, prettier, commitlint)
  .github/                → GitHub Actions (CI/CD)
  .husky/                 → Git hooks raíz (pre-commit, commit-msg)
  apps/
    app-react/            → App de testing con React
    app-svelte/           → App de testing con Svelte
    app-angular/          → App de testing con Angular
  packages/
    shibui-ui/            → Paquete principal (@shibui/ui)
  package.json            → Raíz del workspace — scripts orquestados con -w
```

### Estructura interna de `packages/shibui-ui/`

```
packages/shibui-ui/
  .config/                → Configuración local del paquete
  .firebase/              → Configuración de Firebase Hosting
  .husky/                 → Git hooks del paquete
  .lighthouseci/          → Configuración de Lighthouse CI
  .storybook/             → Configuración visual de Storybook
  architecture/           → Documentación de arquitectura
  dist/                   → Build de producción (generado)
  docs/                   → Documentación adicional
  models/                 → Única fuente de verdad para tipos compartidos
    ui/                   → Tokens de interfaz (LibVariant, LibSize...)
    storybook/            → Interfaces auxiliares para stories
  src/
    components/
      atoms/              → lib-button, lib-icon, lib-label
      molecules/          → lib-input
      organisms/          → lib-sidebar
    styles/
      shared/
        tokens.css        → Tokens del sistema (--lib-*)
        glass.css         → Mixin glassmorphism (en desarrollo)
        index.css         → Re-exportaciones de estilos compartidos
      index.css           → Entry point de estilos
  .config/                → Toda la configuración del paquete centralizada aquí
    .eslintignore
    .eslintrc.json
    .prettierrc.json
    .stylelintrc.json
    commitlint.config.cjs
    lighthouserc.cjs
  firebase.json           → Config de Firebase Hosting
  vite.config.ts          → Bundler
  tsconfig.json           → TypeScript del paquete
```

### Scripts principales (desde la raíz)

```bash
npm run storybook        # Arranca Storybook en shibui-ui
npm run start:react      # App de testing React
npm run start:svelte     # App de testing Svelte
npm run start:angular    # App de testing Angular
npm run dev:all          # Las tres apps en paralelo
npm run build            # Build de @shibui/ui
npm run type-check       # TypeScript check sobre shibui-ui
npm run lint             # ESLint global
```

---

## Estructura de cada componente

Cada componente sigue obligatoriamente esta estructura de 5 ficheros:

```
lib-[nombre]/
  index.ts                   → Re-exportaciones (barrel export)
  lib-[nombre].component.ts  → LitElement, @customElement, @property, render()
  lib-[nombre].html.ts       → Template function separada (TemplateResult)
  lib-[nombre].css           → Estilos scoped con @layer
  lib-[nombre].stories.ts    → Historia de Storybook
```

Los tokens compartidos se importan como:
```typescript
import sharedTokens from '../../../styles/shared/tokens.css?inline';
```

Y se aplican en el componente con:
```typescript
static override styles = [
  css`${unsafeCSS(sharedTokens)}`,
  css`${unsafeCSS(componentCss)}`,
];
```

### Registro del componente (obligatorio)

Al crear un componente nuevo, añadirlo al barrel principal del paquete:

```typescript
// packages/shibui-ui/src/index.ts
export * from './components/[atoms|molecules|organisms]/lib-[nombre]/index';
```

---

## Convenciones de código

**Estructura:**
- Los templates van en ficheros `.html.ts` separados, nunca inline en el componente
- Los tipos e interfaces se importan siempre desde `src/models/`, nunca se definen inline
- No se inicia un componente nuevo sin haber integrado el anterior en `develop`

**TypeScript:**
- Retornos explícitos obligatorios en todos los métodos (`: TemplateResult`, `: void`)
- Uso de `override` en todos los métodos de Lit
- Nunca se usa `any` salvo en los casos documentados en `vite.config.ts`
- Importar modelos externos sobre tipado inline siempre

**CSS:**
- Se usa `@layer tokens, reset, components` dentro de los componentes Lit
- El orden de capas es crítico — los tokens deben declararse antes de usarse
- Los tokens `--lib-*` se usan para todos los valores visuales, nunca se hardcodean colores ni espaciados
- Los componentes con efectos glass requieren: `overflow: hidden` + `backdrop-filter` + `::before` con `--lib-glass-shine` + `z-index` en el contenido

**Eventos:**
- Siguen el patrón `ui-lib-[acción]` con `bubbles: true, composed: true`
- Los IDs de accesibilidad se generan con `generateUniqueId()` del core

**Composición:**
- Uso intensivo de `slots` (prefix, suffix) para componentes flexibles
- Las props booleanas usan `reflect: true`

**Configuraciones críticas:**
- `vite.config.ts`: Definir config en constante externa con tipo `UserConfig & { test?: any }` y aserción `as any` en `terserOptions.compress` para evitar colisiones de tipos
- `tsconfig.json`: Mantener `rootDir: "./"` para validar ficheros fuera de `src`

---

## Sistema de tokens

Dos familias de tokens, ambas en `tokens.css` dentro de `:host`:

**Tokens de guía de estilos (prefijo `--`):**
Paleta washi, kaki, celadón. Escala tipográfica, espaciado 4pt, sombras, radios, motion.

**Tokens de librería (prefijo `--lib-`):**
- Paleta zen OKLCH: `--lib-shibui-kaki`, `--lib-shibui-water`, `--lib-shibui-paper`, `--lib-shibui-ink`
- Espaciado: `--lib-space-xs/sm/md/lg/xl` (base 4px)
- Glass primitivos: `--lib-glass-blur-amount`, `--lib-glass-bg-opacity`, intensidades low/md/high
- Glass compuestos: `--lib-glass-bg`, `--lib-glass-filter`, `--lib-glass-shine`, `--lib-glass-border`
- Spotlight: `--lib-spotlight-x/y` (actualizados vía JS en mousemove), `--lib-spotlight-gradient` y variantes water/white
- Kintsugi border: `--lib-kintsugi-border` (gradiente diagonal, técnica mask-composite)

---

## Integración por framework (contrato de consumo)

Para garantizar IntelliSense correcto en las apps consumidoras:

- **React** — Extensión del namespace `JSX` en `custom-elements.d.ts`. Es obligatorio importar `React` en el archivo para que el aumento de módulo sea efectivo.
- **Svelte** — `shibui-elements.d.ts` extendiendo `svelte/elements` para mapear atributos y eventos personalizados.
- **Angular** — Habilitación de `CUSTOM_ELEMENTS_SCHEMA` en el módulo. `typings.d.ts` para soportar imports con sufijos `?raw` (iconos), `?inline` (CSS) y `.svg`.

---

## Testing y calidad

- **Playwright** — E2E, component testing y visual regression
- **Husky pre-commit** — `npm run type-check` + `lint-staged`
- **Husky commit-msg** — `commitlint` (`.config/commitlint.config.cjs`)
- **Lighthouse CI** — requiere build previo de Storybook (`storybook-static`). Config en `.config/lighthouserc.cjs`
- Ningún código entra en `main` sin pasar Lighthouse y linter en CI

---

## Flujo de trabajo

**GitFlow:**
- `main` — Producción
- `develop` — Integración
- `feature/*` — Desarrollo

**CI/CD (GitHub Actions — `.github/workflows/deploy.yml`):**
`npm ci` → `lint` → `build-storybook` → `lighthouse` → `firebase deploy`

- **Firebase Hosting** — Preview de Storybook en cada PR
- **Semantic Release** — Automatización de versiones en NPM
- **Secretos** — `FIREBASE_TOKEN` en GitHub repository secrets

**Ritual de cierre obligatorio** al finalizar cada tarea o componente:
1. Push de la rama actual
2. Merge a `develop` (preferiblemente `--no-ff`)

---

## Storybook

- `.storybook/preview.ts` inyecta los tokens globales
- Mapeo de componentes mediante **Args** para pruebas de estado dinámicas (variant, size, disabled)
- Fondo de las stories configurado con gradiente oscuro para que los efectos glass sean visibles

---

## Instrucciones para Claude

- Cuando se pida un componente nuevo, seguir siempre la estructura de 5 ficheros
- Pedir el fichero del componente antes de proponer cambios sobre uno existente
- Usar los tokens `--lib-*` para todos los valores visuales, nunca hardcodear colores ni espaciados
- Proponer siempre la Storybook story junto al componente
- Los efectos glass y spotlight son opcionales — no añadirlos salvo que se pida explícitamente
- Los tipos siempre desde `src/models/`, nunca inline
- Si hay duda sobre convenciones, preguntar antes de asumir
- Recordar el ritual de cierre (push + merge a develop) al finalizar cada componente
- Ofrecer comandos de git con mensaje de commit al finalizar una feature o componente