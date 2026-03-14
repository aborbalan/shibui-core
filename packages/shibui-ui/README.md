# @shibui/ui 🎌

Librería de componentes UI agnóstica construida con **Web Components** y **Lit**.  
Inspirada en el concepto japonés *shibui* (渋い) — belleza simple, sutil y duradera.

## 🎯 Visión

Arquitectura Senior ejecutada en etapas Junior-friendly.

## 🏗️ Pilares Técnicos

1. **TypeScript Estricto** — `exactOptionalPropertyTypes`, tipado explícito en todos los métodos.
2. **CSS Nativo Moderno** — CSS custom properties con `@layer` sin dependencias pesadas.
3. **Arquitectura Modular** — Tree-shaking real mediante `preserveModules`.
4. **Agnóstica** — Sin dependencias de framework. Funciona en React, Angular, Svelte y Vanilla JS.
5. **Accesibilidad (a11y)** — WAI-ARIA desde el inicio.

## ✨ Características

- **Ligera** — Solo ~5-6 KB (Lit como peer dependency).
- **Modular** — Importa solo lo que uses.
- **Tokens** — Sistema de design tokens `--lib-*` con paleta OKLCH y efectos glass/spotlight.

## 📦 Instalación

`lit` es una **peer dependency** obligatoria.

```bash
# npm
npm install @shibui/ui lit

# yarn
yarn add @shibui/ui lit

# pnpm
pnpm add @shibui/ui lit
```

## 🎨 Configuración de estilos

Importa los tokens globales en tu punto de entrada:

```ts
import '@shibui/ui/styles';
// o solo los tokens CSS
import '@shibui/ui/tokens';
```

## 🚀 Uso básico

```ts
// Web Components estándar
import '@shibui/ui';

// Wrappers por framework
import { LibButton } from '@shibui/ui/react';
import { LibButton } from '@shibui/ui/angular';
// Svelte — los tipos se cargan automáticamente desde @shibui/ui/svelte
```

```html
<lib-button variant="primary">Hola Shibui</lib-button>
```

## 📤 Exports disponibles

| Import | Descripción |
|---|---|
| `@shibui/ui` | Web Components estándar |
| `@shibui/ui/react` | Wrappers tipados para React |
| `@shibui/ui/angular` | Wrappers para Angular |
| `@shibui/ui/svelte` | Definiciones de tipos para Svelte |
| `@shibui/ui/tokens` | Solo tokens CSS (`--lib-*`) |
| `@shibui/ui/styles` | Estilos globales completos |

## 📖 Documentación

Storybook desplegado en Firebase Hosting — disponible en cada PR vía CI/CD.

## 📄 Licencia

MIT