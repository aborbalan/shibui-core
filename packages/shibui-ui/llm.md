# 📕 Lib-UI | Arquitectura, Calidad y Ecosistema Monorepo

## 🏗️ Visión Técnica & Stack
Sistema de componentes agnóstico basado en **Web Components** (Lit + TypeScript) gestionado mediante **NPM Workspaces**.
- **Arquitectura**: Monorepo orquestado (Librería + Apps de consumo).
- **Node Management**: NVM (v22.13.0 LTS).
- **Runtime**: Vite (HMR ultra-rápido).
- **Documentación**: Storybook (Escenario de pruebas y catálogo).
- **Estilos**: OKLCH + CSS Layers (`@layer tokens, reset, components`).
- **Iconografía**: Phosphor Icons (abstraídos en `lib-icon` con soporte `?raw`).

## 📁 Estructura del Ecosistema (Monorepo)
La configuración se centraliza para evitar ruido y garantizar consistencia:
- `/packages/ui`: Core de la librería (Lit + TS). Fuente de verdad.
- `/apps/`: Aplicaciones de validación y consumo real:
  - `react-app`: React + Vite (Usa `custom-elements.d.ts`).
  - `angular-app`: Angular 18+ (Usa `main.ts` + `typings.d.ts`).
  - `svelte-app`: SvelteKit (Usa `shibui-elements.d.ts`).
- `.config/`: Cerebro de las herramientas (`playwright.config.ts`, `.eslintrc.json`, etc.).
- **Root**: Orquestación de workspaces y scripts globales en `package.json`.

## 🔌 Estrategia de Integración (Contrato de Consumo)
Para garantizar un IntelliSense de nivel senior en los consumidores, seguimos este protocolo:
1. **React**: Extensión del namespace `JSX` en `custom-elements.d.ts`. Es obligatorio importar `React` en el archivo para que el aumento de módulo sea efectivo.
2. **Svelte**: Uso de `shibui-elements.d.ts` extendiendo `svelte/elements` para mapear atributos y eventos personalizados.
3. **Angular**: Habilitación de `CUSTOM_ELEMENTS_SCHEMA`. Uso de `typings.d.ts` para soportar imports con sufijos `?raw` (iconos), `?inline` (CSS) y `.svg`.

## 🏗️ Arquitectura de Tipos y Modelos
- **Directorio Centralizado**: `src/models/` como única fuente de verdad para interfaces compartidas (ej. `LibVariant`, `LibSize`).
- **Segmentación**:
  - `ui/`: Define el diseño sistémico y tokens de interfaz.
  - `storybook/`: Interfaces auxiliares para los argumentos de las historias.

## 🧪 Estrategia de Testing & Calidad
1. **E2E & Component Testing**: **Playwright** para garantizar funcionalidad cross-browser.
2. **Visual Regression**: Capturas automáticas para evitar regresiones de diseño.
3. **Guardianes (Husky)**:
   - **Pre-commit**: `npm run type-check` + `lint-staged`.
   - **Commit-msg**: `commitlint` (Ruta: `.config/commitlint.config.cjs`).

## 🛠️ Estándares Innegociables (Seniority Rules)
1. **Separación de Responsabilidades**: Cada componente debe tener:
   - `index.ts`: Barrel export.
   - `.component.ts`: Lógica y ciclo de vida (LitElement).
   - `.html.ts`: Plantilla funcional pura (TemplateResult).
   - `.css`: Estilos inyectados mediante `?inline`.
2. **Tipado Estricto**: Retornos explícitos obligatorios. Uso de `override` y `exactOptionalPropertyTypes` (usando `| undefined`).
3. **Accesibilidad (A11y)**: Gestión de foco, atributos ARIA dinámicos y generación de IDs únicos (para labels/inputs).
4. **Composición**: Uso de `slots` (prefix, suffix) para máxima flexibilidad.

## 🌿 Flujo de Trabajo & Despliegue
- **GitFlow**: `main` (Producción), `develop` (Integración), `feature/*` (Desarrollo).
- **CI/CD (GitHub Actions)**: `npm ci` -> `lint` -> `build-storybook` -> `lighthouse` -> `firebase deploy`.
- **Semantic Release**: Automatización de versiones y tags en NPM.
- **Ritual de Cierre**: Prohibido iniciar un componente sin integrar el anterior en `develop` y realizar push de la rama.

## 🎨 Sistema de Diseño & UI
- **Tokens**: Uso de `tokens.css` (OKLCH) inyectado globalmente.
- **Storybook**: Mapeo de componentes mediante **Args** para pruebas dinámicas.


### 🚀 Pasos de Registro (Obligatorio)
Para registrar un nuevo componente en el ecosistema:
`Añadir a packages/ui/src/index.ts: export * from './components/[level]/[name]/[name].component';`