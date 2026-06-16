/* ============================================================
   hanko · Modelo de datos del contrato (F0)

   Representación de trabajo NORMALIZADA de un componente.
   NO es el CEM: el CEM es el formato de cable; esto es lo que
   consumen los `checks` (contrato/a11y/resiliencia/drift) y el
   `report`.

   Representa el contrato DECLARADO (lo que dice el manifest).
   La observación del runtime es una estructura separada que se
   compara contra este modelo en F3.

   Spec: docs/specs/data-model.md
   ============================================================ */

/* ─────────────────────────────────────────────────────────────
   Semántica de presencia (regla de oro: ausencia ≠ incumplimiento)

   Para cada faceta de un componente (properties, events, slots…):
     undefined → el manifest NO la declaró   → NO verificable (no es fallo)
     []        → declaró explícitamente "ninguno" → SÍ verificable (debe estar vacío)
     [ … ]     → declaró estos elementos      → SÍ verificable (deben coincidir)

   Un check NUNCA mira un campo `undefined`.
   ───────────────────────────────────────────────────────────── */

/**
 * Procedencia del contrato. Alimenta la fuerza del sello en el Trust Report.
 * Presente desde el día 1 aunque F0 solo maneje `cem`: el caso especial
 * (adapters/inferred) y el reporte dependen de ella.
 */
export type ContractSource =
  | { kind: 'cem' } //                         CEM nativo  → sello pleno
  | { kind: 'adapter'; format: string } //     formato custom normalizado
  | { kind: 'inferred' }; //                   inferido del runtime (caso especial)

/**
 * Discriminador de tipo. ABIERTO por diseño: fases futuras (camino sin-CEM)
 * añaden kinds (`object-shape`, `array`, `function-sig`…) sin reformar el modelo.
 */
export type TypeKind =
  | 'boolean'
  | 'number'
  | 'string'
  | 'string-union'
  | 'object'
  | 'unknown';

/**
 * Tipo de una propiedad, normalizado y preparado para extensión.
 * - `raw` SIEMPRE presente y lossless: un parser futuro lo enriquece sin pérdida.
 * - Lo que F0 no entiende cae a `kind: 'unknown'` + `raw`.
 */
export interface TypeModel {
  /** Texto original del CEM, p.ej. `"'solid' | 'outlined' | 'ghost'"`. Lossless. */
  raw: string;
  kind: TypeKind;
  /** Valores literales si es `string-union`, p.ej. `['solid','outlined','ghost']`. */
  literals?: string[];
}

/**
 * Una propiedad del componente. Unifica prop JS + atributo HTML mapeado.
 * `required` queda fuera a propósito: el CEM no lo expresa.
 */
export interface PropertyContract {
  /** Nombre de la prop JS. */
  property: string;
  /** Atributo HTML mapeado, si existe. */
  attribute?: string;
  /** prop ⇄ attribute. Clave para el nivel Floor. */
  reflects: boolean;
  type: TypeModel;
  /** Valor por defecto RAW, tal cual lo declara el CEM (`"false"`, `"'md'"`, `"4"`). */
  default?: string;
  description?: string;
  /** Clase base de origen si es heredada; `undefined` = propia. Lo propio gana en colisión. */
  inheritedFrom?: string;
}

export interface EventContract {
  name: string;
  /** Tipo del detalle (CustomEvent), raw. */
  type?: string;
  description?: string;
}

export interface SlotContract {
  /** `''` = slot por defecto. */
  name: string;
  description?: string;
}

export interface CssPartContract {
  name: string;
  description?: string;
}

export interface CssPropContract {
  name: string;
  default?: string;
  description?: string;
}

/**
 * Método público (API imperativa). Poblado por la ingestión y verificado
 * contra el runtime desde F3. `signature` queda pendiente (el CEM parcial
 * no modela parámetros/retorno todavía).
 */
export interface MethodContract {
  name: string;
  signature?: string;
  description?: string;
}

/**
 * La unidad que hanko sella: un custom element.
 * Clave primaria = `tagName` (el elemento, no la clase).
 *
 * Las facetas opcionales siguen la semántica de presencia descrita arriba.
 */
export interface ComponentContract {
  /** Clave primaria. */
  tagName: string;
  /** Clase que lo implementa. */
  className?: string;
  /** Traza de vuelta al módulo del manifest. */
  modulePath: string;
  description?: string;
  source: ContractSource;

  // — facetas con semántica de presencia (undefined / [] / [...]) —
  properties?: PropertyContract[];
  events?: EventContract[];
  slots?: SlotContract[];
  cssParts?: CssPartContract[];
  cssProps?: CssPropContract[];
  /** Métodos públicos declarados (poblados por la ingestión desde F3). */
  methods?: MethodContract[];
}

/**
 * Contenedor raíz de una ingestión. Índice por `tagName` para lookup O(1).
 * Las declaraciones del manifest que no son custom elements se filtran antes
 * de llegar aquí (no son unidades de sellado).
 */
export interface ContractSet {
  components: Map<string, ComponentContract>;
}
