# core — Crate Rust de lógica del sistema

Esta carpeta es una **crate de Rust independiente** llamada `app-tauri-core`. Contiene toda la lógica que lee el sistema operativo (CPU, RAM, disco, red, ficheros, git) **sin depender de Tauri**.

> ¿Por qué separada de `src-tauri/`? Para que la lógica sea testeable con `cargo test` sin arrancar la app, y reutilizable. `src-tauri/` solo la "enchufa" a Tauri.

---

## Si vienes de JavaScript/TypeScript

Una "crate" en Rust es como un paquete npm: una unidad de código con su propio `Cargo.toml` (el equivalente a `package.json`). Aquí:

| Rust | Equivalente JS |
|------|----------------|
| `Cargo.toml` | `package.json` |
| `src/lib.rs` | `index.ts` (punto de entrada que re-exporta) |
| `pub mod system;` | `export * from './system'` |
| `cargo test` | `npm test` |

---

## Estructura

```
core/
├── Cargo.toml          ← nombre de la crate (app-tauri-core) y dependencias (sysinfo)
└── src/
    ├── lib.rs          ← re-exporta los módulos: pub mod system; pub mod fs; pub mod git;
    ├── system.rs       ← métricas de hardware (CPU, RAM, disco, red) con la crate `sysinfo`
    ├── fs.rs           ← listar directorios y obtener el home del usuario
    ├── git.rs          ← ejecuta `git log` y parsea el historial de commits
    └── project.rs      ← detecta metadata de un proyecto (tipo + rama git)
```

---

## Qué hace cada módulo

| Módulo | Funciones principales | Para qué |
|--------|----------------------|----------|
| `system.rs` | `get_system_info`, `get_cpu_detail`, `get_memory_detail`, `get_disk_detail`, `get_network_detail` | Leer el estado del hardware. Lo consumen los gadgets de monitorización. |
| `fs.rs` | `list_dir`, `home_dir`, `read_file`, `write_file` | Navegar el FS y leer/escribir ficheros de texto. Lo consumen el explorador y el editor (área Code). |
| `git.rs` | `get_git_log` | Leer el historial de un repositorio git. Lo consume el visualizador de git. |
| `project.rs` | `get_project_info` | Detectar metadata de un proyecto (tipo por marcadores + rama git). Lo consume el servicio de proyecto del frontend. |

Las **estructuras de datos** que devuelven (p. ej. `SystemInfo`, `FsEntry`, `GitCommit`) están documentadas con detalle en [`../src-tauri/README.md`](../src-tauri/README.md).

---

## Punto clave: esta crate NO conoce Tauri

`core/` no importa nada de Tauri. Solo expone funciones Rust normales. Es `src-tauri/src/lib.rs` quien las envuelve en comandos `#[tauri::command]` para exponerlas al frontend.

```
Frontend React
  └─ invoke('get_cpu_detail')        ← llamada desde TypeScript
       └─ src-tauri/src/lib.rs       ← comando Tauri (el "puente")
            └─ app_tauri_core::system::get_cpu_detail()   ← ESTA crate
                 └─ sysinfo::System  ← lectura real del SO
```

---

## Trabajar con la crate

```bash
# Desde apps/app-tauri/ o apps/app-tauri/core/
cargo test      # ejecuta los tests unitarios
cargo fmt       # formatea el código (obligatorio antes de commit)
cargo clippy    # linter — el CI lo exige sin warnings
```

El CI (`ci-tauri.yml`) corre `cargo fmt --check`, `cargo clippy` y `cargo test` sobre esta crate.

---

## Añadir lógica nueva

1. Escribe la función en el módulo que corresponda (`system.rs`, `fs.rs`, `git.rs`) o crea un módulo nuevo y decláralo en `lib.rs` con `pub mod mi_modulo;`.
2. Si devuelve datos al frontend, define un `struct` con `#[derive(serde::Serialize)]` para que se pueda convertir a JSON.
3. Expón la función como comando Tauri en `../src-tauri/src/lib.rs` (ver su README).
