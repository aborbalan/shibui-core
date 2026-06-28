# Fase actual

**F0 — Andamiaje** ✅
**F1 — Núcleo de composición de capas** ✅ <sub>(18 tests)</sub>
**F2 — Ingestión de motivo** ✅ <sub>(8 tests)</sub>
**F3 — Web component `<shibui-sukashi>` + web de demo** ✅ <sub>(en vivo en sukashi.web.app)</sub>
**F4 — Patrones decorativos (covers generativos)** ✅ <sub>(seigaiha · asanoha · sashiko · mon · moiré + capas con cover + métrica)</sub>
**F5 — Weaves multi-motivo** ✅ <sub>(`kasaneMultiWeave`: pivote **independiente por secreto** por defecto, `sharedPivot` opt-in; 7 tests, sin fuga cruzada verificada)</sub>
**F6 — (stretch) Refinado** ✅ <sub>(`kasaneMultiCoverWeave`: covers de F4 sobre multi-motivo de F5 + métrica contraste/fidelidad + fallback a ruido; pivote independiente por defecto; reporte HTML en `docs/contrast-report.html`; 11 tests)</sub>

Siguiente: ninguna fase del **camino crítico** pendiente (F0→F6 completas). Opcionales enchufables: **F4½** (deformación uzumaki) · **F7** (semilla del cielo / kumo).

> Plan de obra completo (F0→F7) en [`phases/README.md`](phases/README.md) · visual en [`phases/roadmap.html`](phases/roadmap.html).
> Detalle de F4 en [`patterns.md`](patterns.md) · reporte de contraste de F6 en [`contrast-report.html`](contrast-report.html).
