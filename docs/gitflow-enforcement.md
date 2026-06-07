# GitFlow Enforcement — por qué `main` está blindado

> Documento de contexto. Explica el _por qué_ detrás del bloque
> "⛔ GitFlow es ABSOLUTO" de [`CLAUDE.md`](../CLAUDE.md) y del hook
> [`.husky/pre-push`](../.husky/pre-push).

## TL;DR

GitFlow en este repo es **no negociable**: el trunk de integración es `develop`,
y `main` solo se actualiza desde `develop` vía Pull Request. Para que esto se
cumpla **siempre** —incluso cuando un agente de IA opera el repositorio— lo
reforzamos en dos capas: una instrucción de máxima prioridad en `CLAUDE.md` y un
hook de git determinista que bloquea el push directo a `main`.

## El detonante

El ecosistema usa **plugins de skills para agentes de IA** (p.ej. GodMode). Estos
frameworks traen sus propios protocolos de integración. En concreto,
`godmode:merge-protocol` asume que el trunk de destino es `main`/`master` y lo
detecta así:

```bash
git merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null
```

Su ruta de "merge local" hace, sin más:

```bash
git checkout main
git merge <feature-branch>      # sin --no-ff
git branch -d <feature-branch>  # borra la rama
```

Eso es **exactamente lo que nuestro GitFlow prohíbe**:

- Mergea `feature/*` directo a `main`, saltándose `develop`.
- No usa `--no-ff`.
- Borra la rama automáticamente.

El problema no es el plugin en sí, sino que su convención por defecto choca con la
nuestra. Un descuido (dejar correr la fase de "ship" en automático) podía llevar
trabajo a `main` por la vía equivocada.

## Por qué un override de skill no bastaba

La tentación inicial fue crear una skill de proyecto en `.claude/skills/` que
"ensombreciera" a la del plugin. No funciona de forma fiable:

- La skill de activación de GodMode invoca **siempre** `Skill("godmode:merge-protocol")`,
  con el namespace del plugin.
- Una skill de proyecto se registra como `merge-protocol` (sin namespace): es una
  entrada **distinta**, no intercepta la llamada con namespace.
- La "prioridad de 3 niveles" (PROJECT > PERSONAL > GODMODE) que documentan estos
  frameworks es una **convención de comportamiento** que el agente debe respetar,
  no algo que el harness imponga a nivel de resolución de herramientas.

Conclusión: hace falta un lever que no dependa del sistema de resolución de skills
del plugin.

## Las dos capas de defensa

### Capa 1 — Instrucción de máxima prioridad (`CLAUDE.md`)

El contrato del harness establece que las instrucciones de proyecto en `CLAUDE.md`
**anulan** el comportamiento por defecto y deben seguirse al pie de la letra. Eso
pesa por encima del contenido que un plugin inyecta vía hook de sesión. Por eso el
bloque "⛔ GitFlow es ABSOLUTO" declara explícitamente:

- Trunk de integración por defecto = `develop`, nunca `main`/`master`.
- Si una skill detecta el trunk con `git merge-base HEAD main`, se ignora.
- Todo merge a `develop` es `--no-ff`.
- `main` solo desde `develop` y solo vía PR.
- Prohibido `git branch -d/-D` automático sin confirmación.

Esta capa **guía al agente**. Es fuerte, pero sigue siendo una instrucción que un
modelo interpreta.

### Capa 2 — Hook determinista (`.husky/pre-push`)

Para una garantía **infranqueable**, el hook `pre-push` lo ejecuta **git**, no el
modelo. Rechaza cualquier intento de push cuyo ref de destino sea
`refs/heads/main`:

```sh
while read -r local_ref local_sha remote_ref remote_sha; do
  if [ "$remote_ref" = "refs/heads/main" ]; then
    exit 1   # bloqueado
  fi
done
```

No importa quién dispare el push (humano despistado, agente de IA, script): si va
directo a `main`, falla.

## Por qué es seguro para el flujo legítimo

El camino válido `develop → main` se hace mediante **Pull Request**, y el merge del
PR ocurre **en el servidor** (GitHub), no por un push local a `main`. Por tanto el
hook **no estorba** el flujo correcto — solo corta el atajo prohibido.

## Lo que esto NO cubre

- **Branch protection del lado servidor (GitHub).** El hook protege la máquina
  local. La protección de rama en el remoto (requerir PR, status checks, revisores)
  es el cierre complementario y se configura en GitHub, no aquí.
- **`--no-ff` en `develop`.** Esto sigue siendo responsabilidad del operador / del
  agente guiado por `CLAUDE.md`; no lo fuerza el hook.

## Referencias

- [`CLAUDE.md`](../CLAUDE.md) — sección "GitFlow" y "GitFlow es ABSOLUTO".
- [`.husky/pre-push`](../.husky/pre-push) — el guard.
- `CONTRIBUTING.md` — convenciones GitFlow orientadas a humanos.
