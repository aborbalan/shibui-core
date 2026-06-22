# Spec · Emisor de issues de GitHub (opt-in)

> **Estado:** v0 — implementado en `src/report/github-issues.ts` + `src/report/issues-run.ts`.
> **Fase:** F6 (sobre el Trust Report). Depende de [`trust-report.md`](trust-report.md).
> **No es comportamiento por defecto** — opt-in en CLI y CI.

---

## Propósito

Convertir el Trust Report en **trabajo accionable**: por cada componente **sin sello**
(`trusted:false`), crear/actualizar un **issue de GitHub** con sus hallazgos. El report
en sí sigue intacto y puro; esto es una capa de tooling encima del `trust-report.json` ya
emitido por [`run.ts`](trust-report.md). No toca shibui (respeta `genericity.test.ts`).

## Pestillos opt-in (no se dispara solo)

1. **Pipeline:** el script `issues` **no** lo invocan `report` ni `report:full`. Hay que
   llamarlo explícitamente.
2. **CI:** el step `判 Crear/actualizar issues de hanko` en `ci-lib.yml` está gateado por
   `if: inputs.github_issues == 'true'`. Solo el orchestrator lo pone a `'true'`, vía
   `workflow_dispatch` con el flag `force_hanko_issues`. El deploy normal de cada `main`
   **no** crea issues.

## Superficie pública

```ts
toIssueDrafts(report): IssueDraft[]                       // PURO: report → borradores
syncGithubIssues(report, client, opts?): SyncSummary      // diff idempotente
parseMarker(body): string | undefined                     // tagName desde el marcador
class RestGithubClient implements GithubClient            // fetch global, cero deps
HANKO_LABEL = 'hanko'
```

## Alcance — qué genera issue

Solo **violations**: un borrador por componente con `trusted === false` y `findings.length > 0`.
Los componentes sellados y los que solo acumulan **warnings** no generan trabajo.

## Forma del issue

- **Título:** `[hanko] <tagName> — N violación(es) de confianza`.
- **Marcador:** `<!-- hanko:component=<tagName> -->` como primera línea del cuerpo. Es la
  **clave de deduplicación**; no debe editarse.
- **Cuerpo:** capas que fallan + lista de `findings` (ya prefijados `capa/faceta: mensaje`) +
  enlace a `https://hanko-report.web.app`.
- **Labels:** `hanko` + una por capa fallida (`hanko:floor` · `hanko:contract` · `hanko:a11y` ·
  `hanko:resilience`).

## Idempotencia (`syncGithubIssues`)

Lista los issues **abiertos** con label `hanko`, los indexa por marcador, y por cada componente:

| Situación | Acción |
|---|---|
| Sin sello, sin issue abierto | `createIssue` |
| Sin sello, con issue abierto | `updateIssue` (refresca cuerpo/labels) |
| Issue de hanko cuyo componente ya no aparece (volvió a sellar / desapareció) | `closeIssue` + comentario |

Re-correrlo **no duplica**: el casamiento es por el marcador, no por título. Issues abiertos
sin marcador de hanko se ignoran.

### Limitaciones conocidas (v0)

- **`updateIssue` reescribe el set de labels.** El `PATCH` manda las labels de hanko, lo que
  sustituye TODAS las del issue: una label añadida a mano (p.ej. `priority:high`) se pierde en la
  siguiente sync. hanko «posee» estos issues; si se necesita triaje manual persistente, conviene
  cambiar `updateIssue` para omitir `labels` (a costa de no refrescar las de capa).
- **Solo se listan issues ABIERTOS.** Un issue cerrado a mano (wontfix) de un componente que
  sigue sin sello se **recreará** en la siguiente corrida. Si se quiere respetar el cierre manual,
  habría que listar también cerrados y reabrir/saltar según política.

## Runner / CLI (`issues-run.ts`)

Lee el `trust-report.json` (no recalcula). Script: `pnpm --filter @shibui-ui/hanko issues`.

```bash
pnpm --filter @shibui-ui/hanko report            # genera trust-report.json
GITHUB_REPOSITORY=owner/name GITHUB_TOKEN=*** \
  pnpm --filter @shibui-ui/hanko issues          # crea/actualiza/cierra
pnpm --filter @shibui-ui/hanko issues --dry-run  # ensayo sin red (imprime el plan)
pnpm --filter @shibui-ui/hanko issues [report.json] [--repo owner/name]
```

- **Entorno:** `GITHUB_TOKEN` (permiso `issues: write`) obligatorio salvo `--dry-run`;
  `GITHUB_REPOSITORY` (lo expone Actions) o `--repo`.
- Falta de token / repo → `console.error` claro + `exit 2` (falla ruidosa, no silenciosa).

## Cliente REST

`RestGithubClient` usa `fetch` global (Node 22) contra `https://api.github.com`, headers
`Authorization: Bearer`, `Accept: application/vnd.github+json`, **`User-Agent`** (GitHub
**rechaza con 403** toda petición sin él) y `X-GitHub-Api-Version`. Lista con paginación y
descarta PRs (el endpoint de issues los incluye). **Cero dependencias nuevas.**

> **Entorno local con TLS interceptado** (antivirus/proxy corporativo): el `fetch` de Node usa
> su propio almacén de CAs y puede fallar con `UNABLE_TO_VERIFY_LEAF_SIGNATURE` aunque `gh`
> funcione (este usa el almacén del SO). Solución: `NODE_EXTRA_CA_CERTS=<raíz-corp.pem>` (o, en
> un test puntual, `NODE_TLS_REJECT_UNAUTHORIZED=0`). **CI (runners Ubuntu) no se ve afectado.**

### Smoke test (validado contra GitHub real)

Plumbing verificado con un report mínimo de un componente de prueba (`issues <report.json>`):
**create** → **update** (re-corrida, no duplica) → **close** (componente de nuevo `trusted`),
labels auto-creadas y dedup por marcador. Sin tocar componentes reales.

## Criterios de aceptación

1. `toIssueDrafts` incluye solo `trusted:false` con findings; el cuerpo lleva marcador estable +
   todos los findings; labels derivan de las capas fallidas.
2. `syncGithubIssues`: create en alta, update en re-corrida (no duplica), close cuando vuelve a
   sellar; `dryRun` no muta.
3. Tests verdes en `src/report/github-issues.test.ts` (con fake client, sin red).
4. `genericity.test.ts` sigue verde (el módulo no importa shibui).

## CI

- `ci-lib.yml` · job `deploy-hanko-report`: `permissions: issues: write` + step opt-in tras `report`,
  con `GITHUB_TOKEN`/`GITHUB_REPOSITORY`.
- `orchestrator.yml`: input `workflow_dispatch` `force_hanko_issues` (default `false`), pasado a
  `ci-lib` como `github_issues`. `secrets: inherit` ya provee `GITHUB_TOKEN`.

> **Lockfile:** el `pnpm-lock.yaml` **ya incluye `@shibui-ui/hanko`** con sus deps (importer por ruta;
> `--frozen-lockfile` pasa), así que CI corre el step sin pasos extra.
