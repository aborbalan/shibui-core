# capabilities — Permisos de Tauri 2

Esta carpeta define **qué puede hacer cada ventana** de la app. Tauri 2 es seguro por defecto: una ventana **no puede** crear otras ventanas, leer ficheros, abrir enlaces, etc., a menos que un fichero de aquí le conceda explícitamente ese permiso.

> Piensa en esto como los permisos de una app de móvil: hay que declarar "esta app puede usar la cámara" antes de poder usarla. Aquí es igual, pero para APIs del escritorio.

---

## Si vienes de Tauri 1 o no conoces el modelo

En Tauri 1 los permisos se configuraban con una "allowlist" en `tauri.conf.json`. En **Tauri 2** se hace con **capabilities**: ficheros JSON en esta carpeta que asocian un conjunto de *permisos* a un conjunto de *ventanas*.

---

## El fichero `default.json`

```jsonc
{
  "identifier": "default",
  "windows": ["main", "secondary"],   // a qué ventanas aplica
  "permissions": [
    "core:default",                          // permisos básicos de Tauri
    "opener:default",                        // abrir URLs/ficheros con la app del sistema
    "core:webview:allow-create-webview-window" // crear ventanas nuevas en runtime
  ]
}
```

| Campo | Qué significa |
|-------|---------------|
| `identifier` | Nombre único de este set de permisos. |
| `windows` | Lista de **labels** de ventana a las que se aplican estos permisos. El label se define al crear la ventana (ver abajo). |
| `permissions` | Lista de capacidades concedidas. Cada plugin aporta las suyas (`core:*`, `opener:*`…). |

---

## Por qué aparece `secondary` y `allow-create-webview-window`

La app es un **macro entorno multi-ventana**: tras el login, la ventana principal (`main`) abre una segunda ventana (`secondary`) con el workspace. Para que eso funcione hicieron falta dos cosas aquí:

1. **`"secondary"` en `windows`** → para que la segunda ventana también tenga permiso de leer el sistema (CPU, ficheros, git…). Si no estuviera, sus `invoke()` fallarían.
2. **`core:webview:allow-create-webview-window`** → para que `main` pueda **crear** la ventana `secondary` en tiempo de ejecución (lo hace `src/core/windows.ts`).

> El **label** de cada ventana se decide así: `main` viene de `tauri.conf.json`; `secondary` se asigna al crearla con `new WebviewWindow('secondary', …)`.

---

## Añadir un permiso nuevo

Si una API de Tauri falla con un error tipo *"not allowed / forbidden"*, casi siempre es que falta el permiso aquí.

1. Busca el permiso en la documentación del plugin correspondiente (p. ej. `core:event:default`, `fs:allow-read`…).
2. Añádelo al array `permissions` de `default.json`.
3. Si una ventana concreta necesita permisos distintos, puedes crear **otro fichero** `.json` en esta carpeta con su propio `identifier` y su propia lista de `windows`.
