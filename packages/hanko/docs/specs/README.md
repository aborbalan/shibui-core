# Specs — hanko

Especificaciones por subsistema. Cada spec define **inputs · outputs · restricciones · casos límite ·
criterios de aceptación** antes de escribir implementación.

## Previstas

| Spec | Subsistema | Estado |
|---|---|---|
| [`data-model.md`](data-model.md) | Modelo de datos del contrato (forma normalizada interna) | ✅ v0 (F0) |
| [`ingest.md`](ingest.md) | Ingestión y normalización del manifest (CEM + adapters) | ✅ v0 (F1) |
| [`smoke.md`](smoke.md) | Smoke / primer sello: Floor + cobertura | ✅ v0 (F2) |
| [`checks-contract.md`](checks-contract.md) | Verificación de contrato (props/atributos/métodos/reflect) | 🟡 v0 (F3, incr. 1) |
| [`checks-a11y.md`](checks-a11y.md) | Verificación de accesibilidad (axe + teclado/foco/nombre) | 🟡 v0 (F4, incr. 1) |
| [`checks-resilience.md`](checks-resilience.md) | Verificación de resiliencia (props basura/vacías, RTL, SSR) | 🟡 v0 (F5, incr. 1) |
| [`harness.md`](harness.md) | Harness de runtime (observa elementos vivos) — incr. 2 de F3/F4/F5 | 🟡 v0 (escrito, pend. validar) |
| `trust-report.md` | Formato del Trust Report (JSON + HTML) | ⬜ por escribir (F6) |

> Vacío de momento. Se irán añadiendo conforme avancemos por las [fases](../phases/README.md).
