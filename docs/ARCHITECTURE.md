🏗️ Arquitectura del Ecosistema Shibui UI
Este documento explica la infraestructura técnica de la librería de componentes, diseñada para ser agnóstica, escalable y multi-framework.

1. Filosofía de Desarrollo: "Write Once, Run Everywhere"
En lugar de escribir componentes por separado para React, Angular y Svelte, utilizamos Web Components nativos como fuente de verdad única.

Core: Basado en Lit, que proporciona una capa ligera sobre el estándar de Web Components.

Agnosticismo: El código base no depende de ningún framework externo.

2. Para mantener el código limpio y mantenible, cada componente sigue 
obligatoriamente una estructura de 5 ficheros:

lib-[nombre]/
  index.ts                   → Barrel export (re-exportaciones)
  lib-[nombre].component.ts  → LitElement, @customElement, @property, render()
  lib-[nombre].html.ts       → Template function separada (TemplateResult)
  lib-[nombre].css           → Estilos scoped con @layer tokens, reset, components
  lib-[nombre].stories.ts    → Historia de Storybook

Los estilos son ficheros .css planos (no .css.ts) importados con el sufijo 
?inline de Vite y aplicados vía unsafeCSS() en el componente.

*.component.ts: Lógica, propiedades (@property) y estados.

*.html.ts: El template (HTML-in-TS) usando la sintaxis html de Lit.

*.css.ts: Estilos encapsulados mediante Shadow DOM.

3. El Motor de Metadatos (JSDoc + CEM)
Para que otros frameworks "entiendan" nuestros Web Components, extraemos metadatos automáticamente.

Anotaciones JSDoc: Usamos etiquetas como @tag, @event (o @fires) y @slot encima de las clases y propiedades.

Custom Elements Manifest (CEM): Un script analiza el código y genera un archivo custom-elements.json. Este archivo es el "contrato" que describe todo lo que el componente puede hacer.

4. Pipeline de Generación de Wrappers (Mappers)
Contamos con un sistema de "mapeo" automatizado que transforma el custom-elements.json en código nativo para otros frameworks:

React: Genera componentes funcionales usando @lit/react.

Angular: Crea directivas para permitir el two-way binding y tipado estricto.

Svelte: Genera archivos de definición de tipos (.d.ts) para el autocompletado en el HTML de Svelte.

5. El Pipeline de Build (Ciclo de Vida)
El orden de los comandos es crítico para evitar colisiones entre herramientas (especialmente con la limpieza de dist de Vite):

clean: Borra el directorio dist antiguo (rimraf).

vite build: Compila el núcleo de la librería y genera los bundles JS/CSS.

tsc: Genera las declaraciones de tipos de TypeScript.

analyze: Escanea el código fuente y actualiza el custom-elements.json.

generate:wrappers: (Usando tsx) Ejecuta los mappers que inyectan los wrappers de React, Angular y Svelte en la carpeta dist.

6. Distribución (Exports)
El package.json actúa como un mapa de rutas, permitiendo importar solo lo que necesitas:

@shibui-ui/ui: Web Components estándar.

@shibui-ui/ui/react: Wrappers tipados para React.

@shibui-ui/ui/svelte: Definiciones de tipos para Svelte.

7. Capa Desktop — app-tauri
Además de las apps web, el ecosistema incluye una aplicación de escritorio nativa construida con Tauri 2.

Stack:
- Frontend: React 19 + TypeScript 5 + Vite 7 (consume @shibui-ui/ui igual que las otras apps)
- Desktop runtime: Tauri 2 (WebView nativa, sin Electron)
- Backend: Rust 2021, crate independiente `app-tauri-core`

Arquitectura en dos capas:

  src-tauri/src/lib.rs   ← puente Tauri: registra y despacha comandos
  core/src/
    system.rs            ← métricas del sistema (CPU, RAM, disco, red) vía `sysinfo`
    fs.rs                ← operaciones de sistema de ficheros (listado de directorios)

Flujo de datos:

  Frontend (React)
    └─ invoke('get_cpu_detail')         ← @tauri-apps/api/core
         └─ src-tauri/src/lib.rs        ← comando Tauri
              └─ app_tauri_core::system::get_cpu_detail()
                   └─ sysinfo::System   ← lectura del SO

Principio de diseño: la crate `core/` es independiente de Tauri — contiene
solo lógica pura de sistema, testeable con `cargo test` sin necesidad de
levantar la app. `lib.rs` actúa únicamente como capa de serialización y
despacho hacia el frontend.

Comandos disponibles: `get_system_info`, `get_cpu_detail`, `get_memory_detail`,
`get_disk_detail`, `get_network_detail`, `list_dir`, `get_home_dir`.
Ver referencia completa en `apps/app-tauri/src-tauri/README.md`.