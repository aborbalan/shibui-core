# 📕 Lib-UI | Arquitectura, Calidad y Reglas de Oro

## 🏗️ Visión Técnica & Stack
Sistema de componentes agnóstico basado en **Web Components** (Lit + TypeScript).
- **Node Management**: NVM (v22.12.0 LTS).
- **Runtime**: Vite (HMR ultra-rápido).
- **Documentación**: Storybook (Escenario de pruebas y catálogo).
- **Estilos**: OKLCH + CSS Layers (`@layer tokens, reset, components`).
- **Iconografía**: Phosphor Icons (abstraídos en `lib-icon`).

## 📁 Estructura de Proyecto (Clean Root)
La configuración se centraliza para evitar ruido en el desarrollo:
- `.config/`: Cerebro de las herramientas (`playwright.config.ts`, `.eslintrc.json`, `.prettierrc.json`, `commitlint.config.cjs`).
- `.storybook/`: Configuración visual de la librería.
- `.husky/`: Git hooks (Pre-commit y Commit-msg).
- `src/`: Código fuente por niveles (Atoms, Molecules, Organisms).
- **Root**: Solo archivos críticos de entrada y orquestación (`package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `.gitignore`).

## 🏗️ Arquitectura de Tipos y Modelos
- **Directorio Centralizado**: Se utiliza `src/models/` como única fuente de verdad para interfaces y tipos compartidos (ej. `LibVariant`, `LibSize`).
- **Segmentación**:
  - `ui/`: Define el diseño sistémico y tokens de interfaz.
  - `storybook/`: Contiene interfaces auxiliares para los argumentos de las historias.
- **Importación**: Se debe priorizar la importación de modelos externos sobre el tipado inline para garantizar la consistencia en toda la librería.

## 🧪 Estrategia de Testing & Calidad
1. **E2E & Component Testing**: **Playwright** para garantizar funcionalidad en todos los navegadores.
2. **Visual Regression**: Capturas automáticas para evitar cambios inesperados en el diseño.
3. **Guardianes (Husky)**:
   - **Pre-commit**: `npm run type-check` + `lint-staged`.
   - **Commit-msg**: `commitlint` (Ruta: `.config/commitlint.config.cjs`).

## 🛠️ Estándares Innegociables
1. **Estructura de Archivos**: Separación por componente: `index.ts`, `.component.ts`, `.html.ts`, `.css`, `.stories.ts`.
2. **Tipado Estricto**: 
   - Retornos explícitos obligatorios (`: TemplateResult`, `: void`).
   - Uso de `override` en métodos de Lit.
3. **Configuraciones Críticas (Solución de Conflictos)**: 
   - `vite.config.ts`: Para evitar colisiones de tipos entre Vite, Vitest y Terser, definir la configuración en una constante externa con tipo `UserConfig & { test?: any }` y usar aserción `as any` en propiedades de terceros (`terserOptions.compress`) si es necesario para el pre-commit.
   - `tsconfig.json`: Mantener `rootDir: "./"` para permitir la validación de archivos de configuración situados en la raíz y fuera de `src`.
4. **Accesibilidad (A11y)**: IDs únicos para vinculación label/input y atributos ARIA dinámicos.
5. **Composición**: Uso intensivo de `slots` (prefix, suffix) para componentes flexibles.
6. **Lighthouse CI**: La configuración reside en `.config/lighthouserc.cjs`. El comando `npm run lighthouse` requiere un build previo de Storybook (`storybook-static`).
7. **Integración Continua**: Ningún código entra en `main` sin pasar el control de Lighthouse y el linter en la nube. El estado del build es el único indicador de "salud" del proyecto.
8. **Integración Continua**: No se inicia un nuevo componente sin haber integrado el anterior en `develop` y sincronizado el entorno local.

## 🌿 Flujo de Trabajo & Despliegue
- **GitFlow**: `main` (Producción), `develop` (Integración), `feature/*` (Desarrollo).
- **CI/CD (GitHub Actions)**: 
  - Automatizado mediante el workflow `.github/workflows/deploy.yml`.
  - El flujo incluye: `npm ci` -> `lint` -> `build-storybook` -> `lighthouse` -> `firebase deploy`.
  - **Secretos**: Se utiliza `FIREBASE_TOKEN` gestionado en los secretos del repositorio de GitHub.
  - **Firebase Hosting**: Preview de Storybook en cada PR.
  - **Semantic Release**: Automatización de versiones en NPM.
  - **Lighthouse**: Auditoría de rendimiento y accesibilidad en CI.
  - **Ritual de Cierre**: Al finalizar cada tarea, feature o componente, es obligatorio realizar el push de la rama actual e integrar los cambios en `develop` mediante un merge (preferiblemente con `--no-ff`).
  - **Recordatorio Automático**: El sistema recordará activamente al desarrollador estos pasos al concluir una iteración para evitar el desfase de ramas.

## 🎨 Sistema de Diseño & UI
- **Fidelidad de Storybook**: 
  - Se utiliza `.storybook/preview.ts` para inyectar tokens globales.
  - Mapeo de componentes mediante **Args** para permitir pruebas de estado dinámicas (variant, size, disabled).


## 📦 Inventario de Componentes
### 🟢 Átomos
- **lib-button**: Accionadores con variantes.
- **lib-icon**: Wrapper dinámico para Phosphor Icons.
- **lib-label**: Etiquetado semántico y accesible.
### 🟡 Moléculas
- **lib-input**: Campo con slots `prefix`/`suffix` y estados de validación.
### 🔴 Organismos
- **lib-sidebar**: Navegación colapsable.