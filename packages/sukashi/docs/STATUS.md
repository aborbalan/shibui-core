# Fase actual

**F0 — Andamiaje** ✅
**F1 — Núcleo de composición de capas** ✅ <sub>(18 tests)</sub>
**F2 — Ingestión de motivo** ✅ <sub>(8 tests)</sub>
**F3 — Web component `<shibui-sukashi>` + web de demo** ✅ <sub>(en vivo en sukashi.web.app)</sub>
**F4 — Patrones decorativos (covers generativos)** ✅ <sub>(seigaiha · asanoha · sashiko · mon · moiré + capas con cover + métrica)</sub>
**F5 — Weaves multi-motivo** ✅ <sub>(`kasaneMultiWeave`: pivote **independiente por secreto** por defecto, `sharedPivot` opt-in; 7 tests, sin fuga cruzada verificada)</sub>
**F6 — (stretch) Refinado** ✅ <sub>(`kasaneMultiCoverWeave`: covers de F4 sobre multi-motivo de F5 + métrica contraste/fidelidad + fallback a ruido; pivote independiente por defecto; reporte HTML en `docs/contrast-report.html`; 11 tests)</sub>
**F4½ — (opcional) Deformación uzumaki (渦)** ✅ <sub>(`warp`/`warpAll`/`unwarpAll`: remolino angular dependiente del radio, reversible con −Ω; cover en espiral `spiral` registrado como `uzumaki`; `compose(warpAll(L,Ω)) === warp(compose(L),Ω)`; Ω = estética, no la clave; 9 tests)</sub>
**F7 — (opcional) Semilla del cielo (kumo 雲)** ✅ <sub>(`openSky`/`mixSeed`: `SeedSource` que mezcla por XOR una foto del cielo —SHA-256— con `systemSeed`, nunca lo reemplaza; health-test (congelado/entropía baja) + fallback; adaptador de cámara `cameraSky` browser-only; 27 tests)</sub>
**F8 — (extensión) Tablilla partida (warifu 割符)** ✅ <sub>(motivo + bytes que solo se componen cuando un manifiesto cumple; `manifestMatch`/`seal`/`open`/`sealBytes`+adaptador `manifestFromTrustReport` de hanko; condición por defecto `allSealed`; puro, no importa hanko/shibui. Incr.2: demo «Candado · tablilla» con selector de manifiesto + e2e contra snapshot real del Trust Report; 14 tests)</sub>

Siguiente: **plan F0→F8 completo** — sin fases pendientes. Posible vNext: render del badge a SVG/PNG independiente + e2e en vivo contra el `report` desplegado de hanko.

> Plan de obra completo (F0→F8) en [`phases/README.md`](phases/README.md) · visual en [`phases/roadmap.html`](phases/roadmap.html).
> Detalle de F4 en [`patterns.md`](patterns.md) · F4½ en [`warp.md`](warp.md) · reporte de contraste de F6 en [`contrast-report.html`](contrast-report.html) · F7 en [`entropy.md`](entropy.md) · F8 en [`warifu.md`](warifu.md).
