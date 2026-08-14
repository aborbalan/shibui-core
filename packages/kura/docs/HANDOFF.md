# kura — handoff (2026-08-12)

`kura` (蔵) es el CLI de Firebase Hosting del ecosistema, pensado para que lo usen por igual
un humano en la terminal y un agente por Bash.

**Rama:** `feature/kura-f0-recon`, ramificada de `origin/develop` en `4a35fc0`. Diez commits,
sin PR. **Destino: `develop`, con `--no-ff`. Nunca `main`.**

```
bb2c29b  feat(kura): servidor MCP sobre el mismo nucleo (F7)
2b03732  docs: anunciar kura en el contexto raiz
84a3237  feat(kura): cablear el pipeline de CI y documentar el paquete (F6)
8092558  feat(kura): inventario y aprovisionamiento de sitios + spec maquinable (F5)
951618e  docs(kura): handoff con el estado tras cerrar F4
dbe64b9  feat(kura): comando deploy con guardarrailes (F4)
d45b0c9  feat(kura): comando verify contra lo publicado (F3)
9ea1734  feat(kura): comando status sobre los nueve sitios (F2)
5611dd8  feat(kura): contrato de E/S y comando targets (F1)
282d2ae  docs(kura): registrar los hallazgos del reconocimiento F0
```

Plan original: `C:\Users\aborb\.claude\plans\haz-primero-el-planing-crispy-wave.md`.

---

## Estado: el plan está completo

| Fase | Estado | Qué entrega |
|---|---|---|
| F0 reconocimiento | ✅ | `docs/f0-hallazgos.md`, con su propia corrección |
| F1 contrato de E/S | ✅ | Sobre, códigos de salida, formatos, `kura targets` |
| F2 `status` | ✅ | Adaptador por subproceso, `kura status` |
| F3 `verify` | ✅ | Comprobaciones HTTP con rastreo de chunks diferidos |
| F4 `deploy` | ✅ | Guardarraíles + deploy real validado a canal de preview |
| F5 superficie de agente | ✅ | `src/spec.ts`, `--help --json`, y `kura sites` |
| F6 CI y documentación | ✅ | `ci-kura.yml`, orchestrator, `CLAUDE.md`, `README.md` |
| F7 servidor MCP | ✅ | `src/mcp.ts`, lanzadera y entrada en `.mcp.json` |

**129 tests en verde y type-check limpio.** Ninguna prueba sale a la red ni usa credenciales.

**F7 no estaba en el plan**; salió de preguntar cómo hacer kura más accesible para un agente.
Es un segundo transporte sobre el mismo núcleo: las seis operaciones llegan como herramientas
MCP con el mismo sobre de salida, y las anotaciones (`readOnlyHint`, `destructiveHint`…) se
derivan de las banderas de `src/spec.ts` en vez de escribirse a mano. Verificado con un
cliente MCP real y, aparte, hablando JSON-RPC por stdio contra la lanzadera.

**Fuera del plan, a petición explícita del usuario:** `kura sites` y `kura sites create`. El
argumento fue que un CLI cuyo objetivo es que futuras sesiones manejen Firebase sin que él
intervenga no puede limitarse a *señalar* que falta un sitio; tiene que poder crearlo.

**Validado de extremo a extremo el 2026-08-12:** deploy real de `react` al canal `kura-f4`
(`https://shibui-showcase-react--kura-f4-sxy8hsxl.web.app`, caduca el 19/08) con las cuatro
comprobaciones en verde.

---

## Cómo se ejecuta

```bash
pnpm --silent kura targets
```

`--silent` no es opcional para uso maquinal: sin él, pnpm escribe su banner **en stdout** y
rompe el NDJSON. En desarrollo va mejor invocar directo:

```bash
pnpm exec tsx packages/kura/src/cli.ts status --format table
```

Verificación del paquete:

```bash
pnpm --filter @shibui-ui/kura type-check && pnpm --filter @shibui-ui/kura test
```

---

## Lo que costó caro aprender

**1. La API programática de `firebase-tools` solo aguanta dos llamadas por proceso.**
A la tercera lanza `Cannot read properties of undefined (reading 'indexOf')` desde
`commander@5.1.0`: los comandos se registran de forma perezosa en un programa compartido y el
registro repetido corrompe ese estado. En serie funcionan dos de nueve llamadas; en paralelo
fallan las nueve en 1 ms, antes de tocar la red.

Por eso `src/adapter.ts` **invoca el entry JS por subproceso**. No volver a "simplificar" eso
a un import: está medido que no funciona.

**2. Un reconocimiento que solo mira firmas no vale.** F0 comprobó que `hosting.channel.list`
*era* una función, no que se pudiera *llamar* dos veces, y por eso eligió una arquitectura que
hubo que tirar en F2. Hay que ejercitar la API, no inspeccionarla.

**3. Verificar solo los assets ansiosos es no verificar nada.** La primera versión de `verify`
miraba únicamente lo que cuelga de `index.html` y dio dos falsos negativos: react y angular
cargan sus páginas con `lazy()`/`loadComponent`, así que el módulo que llama a la API vive en
un chunk diferido. La comprobación no podía ver el fallo que existe para cazar. Ahora se
siguen los `import()` ya construidos: react pasó de 2 a 17 recursos escaneados, angular de 8
a 22.

**4. El `.bin` de la raíz del repo principal faltaba.** Rompía `commitlint` (y por tanto todo
commit) y `pnpm exec firebase`. **Ojo, no era el fallo de «paquetes destripados» de otras
veces:** los paquetes estaban intactos y bastó `pnpm install --frozen-lockfile` a secas, 20 s,
sin `--force`.

---

## Lo que queda, y por qué no lo hice yo

**1. ~~Registrar `packages/kura` en `pnpm-lock.yaml`~~ — HECHO (commit `4545924`).**

Se dio por imposible desde el worktree y era falso. El bloqueo no era el worktree: era que el
`.modules.yaml` visible describía el árbol del repo principal —porque `node_modules` es un
junction a él— y por eso pnpm proponía purgar los directorios de módulos.

**Receta, por si vuelve a hacer falta:** retirar SOLO el junction raíz de `node_modules`
(`(Get-Item ... -Force).Delete()` guardando por `LinkType -eq 'Junction'`), correr
`pnpm install --lockfile-only` sobre el árbol limpio (16 s, nada descargado) y restaurar el
junction. Verificado después: `--frozen-lockfile` exit 0, repo principal intacto paquete a
paquete y 129 tests en verde.

`--config.node-linker=none` NO sirve: la comprobación de purga corre antes de decidir el
linker.

**2. Crear el sitio `shibui-torii`.** `.firebaserc` declara `torii → shibui-torii` y ese sitio
no existe, así que un deploy de `torii` falla hoy. Lo detectan `kura status` (`drift: no-site`),
`kura verify` (404) y `kura sites` (`declared-missing`). **kura ya sabe arreglarlo**, pero la
ejecución quedó bloqueada por el clasificador de permisos. La orden es:

```bash
pnpm exec tsx packages/kura/src/cli.ts sites create --missing --execute --format table
```

Aditiva y reversible con `hosting:sites:delete`. Después, `kura status --target torii` debería
dejar de reportar deriva.

**3. Abrir el PR a `develop`** cuando lo anterior esté hecho y CI en verde.

Anotado aparte, sin tocar: migrar `FIREBASE_TOKEN` a cuenta de servicio con
`GOOGLE_APPLICATION_CREDENTIALS` en los cuatro workflows que despliegan.

---

## Entorno (Windows, worktree)

Este worktree no tiene `node_modules`. Para trabajar hicieron falta junctions desde el repo
principal, creadas con `New-Item -ItemType Junction`:

```
node_modules
packages\shibui-ui\node_modules
packages\shibui-ui\dist            (para construir app-react)
packages\kura\node_modules         → apunta a packages\hanko\node_modules
packages\node_modules              → dir REAL con @modelcontextprotocol y zod del store
apps\app-react\node_modules
```

`packages\node_modules` merece explicación: es un directorio real, no un junction, y aprovecha
que Node consulta ese nivel al resolver desde `packages/kura/src` **antes** de subir a la raíz.
Fue la forma de alcanzar el SDK de MCP sin escribir dentro de un junction —lo que habría
ensuciado el `node_modules` de hanko en el repo principal— ni tocar la raíz.

`packages\kura\node_modules` es un **andamio**: presta las dependencias de hanko (vitest,
typescript, tsx) porque kura aún no está en el lockfile. En CI, con instalación limpia, se
resuelven de verdad. Si un `import` de kura empieza a resolver algo que su `package.json` no
declara, es por aquí.

Para quitarlos, `cmd /c rmdir <ruta>` respetando el `LinkType`. **Nunca `rm -rf`**: seguiría
el enlace y borraría el contenido real del repo principal.
