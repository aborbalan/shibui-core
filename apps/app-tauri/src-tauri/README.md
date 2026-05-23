# src-tauri — Backend Tauri y crate `core`

El backend se divide en dos piezas: `src-tauri/src/lib.rs` (puente de comandos Tauri) y la crate `core/` (lógica del sistema, reutilizable e independiente de Tauri).

---

## Estructura

```
src-tauri/
├── src/
│   ├── lib.rs          ← registra y despacha los comandos Tauri
│   └── main.rs         ← entry point, llama a lib::run()
├── capabilities/       ← permisos de la app (Tauri v2)
├── tauri.conf.json     ← configuración: nombre, ventana, bundle ID
└── build.rs

core/                   ← crate Rust independiente (app-tauri-core)
└── src/
    ├── lib.rs          ← re-exporta módulos
    ├── system.rs       ← métricas del sistema con sysinfo
    └── fs.rs           ← operaciones de sistema de ficheros
```

---

## Comandos Tauri

Todos se invocan desde el frontend con `invoke('<nombre>', { ...args })` de `@tauri-apps/api/core`.

| Comando | Función Rust | Retorno | Descripción |
|---|---|---|---|
| `get_system_info` | `system::get_system_info()` | `SystemInfo` | Resumen global: CPU %, RAM y disco |
| `get_cpu_detail` | `system::get_cpu_detail()` | `CpuDetail` | Por núcleo, marca, frecuencia |
| `get_memory_detail` | `system::get_memory_detail()` | `MemoryDetail` | RAM + SWAP usada/total |
| `get_disk_detail` | `system::get_disk_detail()` | `Vec<DiskDetail>` | Espacio por partición |
| `get_network_detail` | `system::get_network_detail()` | `Vec<NetworkInterface>` | RX/TX por interfaz |
| `list_dir` | `fs::list_dir(path)` | `Result<Vec<FsEntry>, String>` | Contenido de un directorio |
| `get_home_dir` | `fs::home_dir()` | `Result<String, String>` | Directorio home del usuario |

---

## Estructuras de datos

### `SystemInfo`
```rust
pub struct SystemInfo {
    pub cpu_usage: f32,       // uso global CPU en %
    pub ram_used_gb: f64,
    pub ram_total_gb: f64,
    pub disk_used_gb: f64,    // suma de todas las particiones
    pub disk_total_gb: f64,
}
```

### `CpuDetail`
```rust
pub struct CpuDetail {
    pub brand: String,          // p.ej. "Intel(R) Core(TM) i7-..."
    pub physical_cores: usize,
    pub logical_cores: usize,
    pub global_usage: f32,
    pub frequency_mhz: u64,
    pub per_core: Vec<f32>,     // uso en % por núcleo lógico
}
```

### `MemoryDetail`
```rust
pub struct MemoryDetail {
    pub ram_used_gb: f64,
    pub ram_total_gb: f64,
    pub swap_used_gb: f64,
    pub swap_total_gb: f64,
}
```

### `DiskDetail`
```rust
pub struct DiskDetail {
    pub name: String,     // nombre del dispositivo
    pub mount: String,    // punto de montaje
    pub total_gb: f64,
    pub used_gb: f64,
}
```

### `NetworkInterface`
```rust
pub struct NetworkInterface {
    pub name: String,
    pub rx_bytes: u64,
    pub tx_bytes: u64,
}
```

### `FsEntry`
```rust
pub struct FsEntry {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub extension: Option<String>,
    pub size: Option<u64>,   // None para directorios
}
```

---

## Notas de implementación

### `core/src/system.rs`

- Usa la crate `sysinfo` v0.33.
- Cada función crea un `System::new_all()` y llama a `refresh_all()` — no hay estado global entre llamadas. Esto simplifica el código a costa de re-inicializar en cada poll (aceptable dado que el frontend llama cada ~1 s).
- `Disks` y `Networks` se crean con `new_with_refreshed_list()` de forma independiente.

### `core/src/fs.rs`

- `list_dir` devuelve entradas ordenadas: **directorios primero**, luego ficheros en orden alfabético case-insensitive.
- `home_dir` lee la variable de entorno `USERPROFILE` (Windows) o `HOME` (Unix/macOS).
- Ambas funciones retornan `Result<_, String>` para propagar errores al frontend como strings.

---

## Añadir un comando nuevo

1. Añadir la función en `core/src/system.rs` o `core/src/fs.rs` con los structs serializables necesarios.
2. Declarar el comando en `src-tauri/src/lib.rs`:
   ```rust
   #[tauri::command]
   fn mi_comando() -> MiStruct {
       app_tauri_core::system::mi_funcion()
   }
   ```
3. Registrarlo en `.invoke_handler(tauri::generate_handler![..., mi_comando])`.
4. Invocar desde el frontend: `await invoke<MiStruct>('mi_comando')`.
