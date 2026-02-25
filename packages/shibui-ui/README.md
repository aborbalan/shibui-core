# UI Library 🚀

Librería de componentes UI agnóstica construida con **Web Components** y **Lit**.

## 🎯 Visión
Arquitectura Senior ejecutada en etapas Junior-friendly.

## 🏗️ Pilares Técnicos
1. **TypeScript Estricto**: Código tipado para evitar errores en desarrollo.
2. **CSS Nativo Moderno**: Uso de CSS Variables y Layers sin dependencias pesadas.
3. **Arquitectura Modular**: Enfocada en **Tree-shaking real** (Zero-Bloat) mediante `preserveModules`.
4. **Patrón Híbrido**: Lógica sólida con diseño base elegante y fácil de personalizar.
5. **Accesibilidad (a11y)**: WAI-ARIA desde el inicio.

## ✨ Características
- **Agnóstica**: Funciona en React, Vue, Angular, Svelte y Vanilla JS.
- **Ligera**: Solo ~5-6 KB (Lit como peer dependency).
- **Modular**: Importa solo lo que uses gracias a la estructura de módulos preservados.

## 📦 Instalación

Puedes usar tu gestor de paquetes favorito. Recuerda que `lit` es una **peer dependency**.

```bash
# npm
npm install ui-library lit

# yarn
yarn add ui-library lit

# pnpm
pnpm add ui-library lit



🎨 Configuración de Estilos
Para que los componentes luzcan correctamente, importa los estilos globales en tu punto de entrada (ej. main.ts o app.js):

import 'ui-library/styles';