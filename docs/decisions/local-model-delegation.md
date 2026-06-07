# Decisión: delegación de tareas a modelo local (Gemma)

**Estado:** Descartado — demasiado pronto  
**Fecha:** 2026-06-07

---

## Qué se exploró

Se analizó el repositorio para identificar tareas mecánicas y repetitivas (96 componentes, patrón de 5 archivos) que pudieran delegarse a un modelo local pequeño (Gemma 3 12B via Ollama) con contexto de 1-2 archivos por llamada.

## Por qué se descarta por ahora

**1. Las tareas verdaderamente delegables no necesitan un LLM**

Los checks que tienen una respuesta binaria y verificable con grep (`@layer` en línea 1, 6 exports Katachi, `declare global` presente/ausente) son más fiables y más rápidos ejecutados como scripts Bash. Invocar a Gemma para estas tareas añade latencia y un vector de error sin aportar capacidad real.

**2. Las tareas que sí necesitan juicio son propensas a errores sutiles**

Al auditar el propio documento de análisis, apareció un error técnico concreto: se sugería reemplazar `rgb(18, 14, 10, 0)` en `dialog::backdrop` por `var(--bg-overlay)`, sin tener en cuenta que (a) ese valor es el estado inicial transparente de una transición CSS, (b) `--bg-overlay` es negro frío al 70% — diferente color e intención — y (c) `::backdrop` tiene comportamiento de herencia de custom properties distinto del shadow DOM. Este tipo de error requiere conocimiento del design system completo, que un modelo de 12B con ventana de contexto limitada no puede mantener de forma fiable.

**3. La capa de invocación no existe**

El patrón `FILE=$(cat archivo.ts)` incrustado en un JSON de curl es no ejecutable con archivos TypeScript reales (comillas, backticks, saltos de línea rompen el string JSON). Antes de delegar cualquier tarea, sería necesario construir un wrapper de invocación con encoding correcto (`jq` o Python). Ese trabajo no se ha hecho.

## Condiciones para retomarlo

- Wrapper de invocación con `jq`/Python validado contra archivos reales del repo
- Catálogo reducido a tareas donde la salida del modelo es verificable por herramienta, no por criterio humano
- Evaluación empírica: ejecutar Gemma sobre 5-10 archivos reales y comparar output contra ground truth antes de aplicar en bulk
