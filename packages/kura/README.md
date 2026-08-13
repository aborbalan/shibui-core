# kura 蔵

CLI de Firebase Hosting para el ecosistema shibui. Responde de un vistazo lo que hoy exige
abrir la consola de Firebase: qué hay publicado en cada sitio, si tu build local coincide con
lo servido, y si lo que está en producción se llevó por delante alguna configuración.

Es una capa fina sobre `firebase-tools`, no un reemplazo. Existe porque `firebase-tools` está
hecho para un humano en una terminal —pregunta cosas, imprime prosa— y aquí hace falta algo
que también pueda conducir un agente.

## Comandos

| Comando | Qué hace | Red | Credenciales |
|---|---|:--:|:--:|
| `kura targets` | Targets declarados y estado de su build local | no | no |
| `kura status` | Añade qué hay publicado y si falta desplegar | sí | sí |
| `kura verify` | Comprueba por HTTP lo que se está sirviendo | sí | no |
| `kura sites` | Inventario: declarados sin crear y huérfanos | sí | sí |
| `kura sites create` | Aprovisiona los sitios que faltan | sí | sí |
| `kura deploy` | Publica un target | sí | sí |

```bash
pnpm --silent kura targets
pnpm --silent kura status --target cv
pnpm --silent kura verify --expect-origin shibui-core.onrender.com
```

`--silent` no es cosmético: sin él, pnpm escribe su banner en stdout y rompe el NDJSON.

## Qué comprueba `verify`

Sobre la URL pública, sin credenciales: que la raíz responda `200` con HTML, que el reescrito
de SPA funcione, y —la que justifica el comando— **que el bundle servido no lleve dentro un
origen de desarrollo**. Ese fallo ya ocurrió en este ecosistema: sin `VITE_API_URL`, los
showcases quedaron apuntando a `localhost:3000` y las páginas de componentes y tokens salieron
vacías en producción sin que nada fallara en CI.

Sigue los `import()` ya construidos, así que ve también los chunks diferidos. Mirar solo lo que
cuelga de `index.html` no basta: en React y Angular el módulo que llama a la API vive en un
chunk que se carga después.

## Publicar

La forma corta del comando es la inofensiva. `deploy` **simula por defecto**; hace falta
`--execute` para subir algo, y el destino por defecto es un canal de preview.

```bash
kura deploy --target cv                                  # simula
kura deploy --target cv --execute                        # canal de preview
kura deploy --target cv --live --confirm cv --execute    # producción
```

Antes de tocar la red comprueba que el build existe: publicar un directorio vacío deja el sitio
roto y el deploy sale verde. Después de subir, verifica la URL resultante y sale con código 6
si algo no cuadra: un deploy no es un éxito por haber terminado, sino por servir algo sano.

## Salida

Tabla con TTY delante, NDJSON sin él. Un sobre por fila, para que un listado que falle a la
mitad siga siendo parseable.

```json
{"ok":true,"data":{"target":"cv","site":"shibui-cv","drift":"in-sync"}}
{"ok":false,"error":{"code":"AUTH","message":"…","hint":"pnpm exec firebase login"}}
```

| Código | Significado |
|:--:|---|
| 0 | ok |
| 1 | error inesperado |
| 2 | uso incorrecto |
| 3 | no encontrado |
| 4 | credenciales o permisos |
| 5 | precondición incumplida |
| 6 | verificación fallida |

`kura --help --format json` devuelve la superficie completa —comandos, flags y códigos— con
banderas `network`, `credentials` y `mutates`, para decidir qué es seguro ejecutar sin leer
prosa.

## Servidor MCP

Las mismas seis operaciones se exponen como herramientas MCP, declaradas en el `.mcp.json` de
la raíz. Para un agente es la vía preferente: llegan descritas, con esquema de entrada tipado
y con anotaciones que dicen cuáles salen a la red, cuáles piden credenciales y cuáles mutan
algo. Mismo núcleo, mismos guardarraíles y el mismo sobre de salida que el CLI.

```bash
pnpm --filter @shibui-ui/kura mcp   # arranque manual por stdio
```

## Autenticación

Por la sesión de `firebase-tools`, fuera de banda:

```bash
pnpm exec firebase login
```

kura nunca pide ni almacena credenciales.
