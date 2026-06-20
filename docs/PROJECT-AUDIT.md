# Auditoría del proyecto — fallos y revisión

> Documento **vivo** para revisar y auditar todo el proyecto (API, librería y las 3 apps
> consumidoras) y registrar sus fallos: funcionales, de integración, de despliegue y **visuales**.
>
> **Baseline de referencia: React.** Es el consumidor más completo y el que está funcionando
> correctamente end-to-end. Cuando una app diverja en comportamiento o aspecto, se compara contra
> React como "verdad" y se anota la diferencia aquí.

---

## Cómo auditar (método)

Para cada app, contra la **API local de `develop`** (que ya incluye la Fase 1 del manifiesto):

```bash
pnpm start:api          # API NestJS en localhost:3000 (datos nuevos: 102 comp., Charts, bloque api)
pnpm start:react        # baseline de referencia
pnpm start:angular
pnpm start:svelte
```

Checklist por app:
1. **Build/checks**: `tsc`/`ng build`/`vite build` + lint/`svelte-check` sin errores nuevos.
2. **Datos**: la lista trae 102 componentes y la categoría **Charts**; el detalle (`/componentes/<slug>`)
   trae el bloque `api` (props/slots/events).
3. **Dev vs desplegado**: confirmar a qué API apunta cada build (dev suele ser `localhost`,
   desplegado debe apuntar a la API real).
4. **Visual**: comparar página a página contra React (hero, listado, cabeceras de categoría,
   cards, detalle, estados loading/empty/error, responsive).

---

## Registro de hallazgos

Severidad: 🔴 alta · 🟠 media · 🟡 baja · Estado: ⬜ pendiente · 🔧 en curso · ✅ resuelto

| # | Área | Hallazgo | Sev. | Estado | Evidencia / nota |
|---|---|---|---|---|---|
| A1 | Angular · deploy | El build **desplegado** no recibe la URL de la API → `environment.ts` cae a `http://localhost:3000`. Como el service hace `catchError(() => of([]))`, la página sale **vacía sin error**. | 🔴 | ⬜ (apuntado) | `ci-apps.yml` `build-angular` no pasa `env`; React sí (`VITE_API_URL: secrets.VITE_API_URL`). Falta también `define __API_URL__` en `angular.json`. Fix: `env` en el step + `ng build --define __API_URL__="'…'"`. |
| A2 | Angular · UI | "Más fallos, incluidos visuales" detectados en revisión manual. **Pendiente de detallar.** | 🟠 | ⬜ | Targets: `src/components/componentes/{component-card,components-grid,component-detail-view}` y `src/pages/public/componentes{,-detail}`. Comparar contra React. |
| X1 | API · datos | **Ejemplos rotos**: los `componentId` de los ejemplos no casan con los `id` de componentes (ahora `cmp-<slug>`; ya no casaban antes tampoco) → el detalle de TODAS las apps muestra "sin ejemplos". | 🟠 | ⬜ | Re-keyar los ejemplos en `examples.service.ts` a los nuevos `id`. Afecta React/Angular/Svelte por igual. |
| S1 | Svelte · check | `svelte-check` falla en `Hero.svelte` (`'slot' does not exist in type HTMLProps<svg>`). **Preexistente**, ajeno a los cambios de datos. | 🟡 | ⬜ | No bloquea CI (apps corren `build`, no `check`). Arreglar tipado del `slot` en el svg. |
| D1 | API · deploy | Frescura de la API en producción (onrender) depende de la rama que despliega **Render** (config fuera del repo). Los datos nuevos solo se ven cuando esa rama tiene la Fase 1. | 🟠 | ⬜ | Confirmar rama de auto-deploy de Render. `ci-api.yml` solo despliega los *docs* (firebase), no el servidor. |
| A3 | Angular · build | Aviso de presupuesto de bundle (initial > 1 MB por ~19 kB). | 🟡 | ⬜ | Subir `budgets` en `angular.json` o code-split. Menor. |

> Añade filas conforme aparezcan hallazgos (sobre todo los visuales de Angular de la revisión
> manual). Mantener el ID estable para referenciarlo en commits/PRs.

---

## Checklist de auditoría por área

### API (NestJS · `apps/shibui-api`)
- [ ] `GET /categories/with-components` → 7 categorías, 102 componentes, **sin** bloque `api`.
- [ ] `GET /components/slug/:slug` → incluye `api` (props/slots/events).
- [ ] Ejemplos: `GET /examples/component/:id` enlaza con los `id` reales (**X1**).
- [ ] Drift-guard del manifiesto activo en CI (`ci-lib.yml`).

### Librería (`packages/shibui-ui`)
- [ ] `svelte-check`/consumidores no rompen por tipos de web components.
- [ ] Manifiesto (`dist/custom-elements.json`) al día (lo asegura el githook + CI).

### React (`apps/app-react`) — **baseline**
- [ ] Listado + detalle traen datos nuevos (Charts, bloque `api`).
- [ ] `tsc -b` limpio. Sirve de referencia visual para las otras apps.

### Angular (`apps/app-angular`)
- [ ] **A1** URL de API en build desplegado.
- [ ] **A2** Revisión visual página a página vs React.
- [ ] Detalle consume `getBySlug` con `api` tipado.

### Svelte (`apps/app-svelte`)
- [ ] Listado/detalle consumen la API (hecho en Fase 2).
- [ ] **S1** error de `Hero.svelte`.
- [ ] Revisión visual vs React.

### CI/CD y despliegue
- [ ] **A1** paridad de inyección de URL de API entre React/Svelte/Angular.
- [ ] **D1** rama de deploy de Render para la API.
- [ ] Targets firebase (`hosting:react|angular|svelte|cv`) sirven el build correcto.

### Transversal
- [ ] DTOs duplicados en las 3 apps (sin `api-contract`): ¿tests de capa de datos para fijar el
      contrato? (ver `apps/app-angular/src/data/DATA-LAYER-TESTING.poc.md`).
- [ ] **X1** ejemplos re-keyados.

---

## Notas

- Este audit nació al alinear los consumidores con la API derivada del manifiesto
  (PR #479 datos, PR #480 consumidores). Varias filas son **pre-existentes**, no regresiones de
  esos PRs; se registran igual para no perderlas.
- Mantener React como vara de medir hasta que las 3 apps converjan; entonces revisar si esta
  auditoría puede cerrarse o convertirse en checklist de release.
