/* ============================================================
   hanko · Tipos de ENTRADA del Custom Elements Manifest (CEM)

   Forma PARCIAL del `custom-elements.json` (schema 1.0.0) — solo
   los campos que la ingestión usa. NO es el modelo interno de
   hanko: es el formato de cable que `ingestCem` normaliza a
   `ContractSet` (ver src/core/contract.ts).

   Spec: docs/specs/ingest.md
   ============================================================ */

export interface CemType {
  text?: string;
}

export interface CemMember {
  /** 'field' | 'method' (el CEM puede traer otros). */
  kind: string;
  name: string;
  type?: CemType;
  default?: string;
  description?: string;
  attribute?: string;
  reflects?: boolean;
  privacy?: 'public' | 'private' | 'protected';
  static?: boolean;
  inheritedFrom?: { name?: string };
}

export interface CemSlot {
  /** Ausente o '' = slot por defecto. */
  name?: string;
  description?: string;
}

export interface CemEvent {
  name: string;
  type?: CemType;
  description?: string;
}

export interface CemCssPart {
  name: string;
  description?: string;
}

export interface CemCssProperty {
  name: string;
  default?: string;
  description?: string;
}

export interface CemDeclaration {
  /** 'class' | 'mixin' | 'function' | … — solo 'class' + customElement nos interesa. */
  kind: string;
  customElement?: boolean;
  tagName?: string;
  /** Nombre de la clase. */
  name?: string;
  description?: string;
  members?: CemMember[];
  slots?: CemSlot[];
  events?: CemEvent[];
  cssParts?: CemCssPart[];
  cssProperties?: CemCssProperty[];
}

export interface CemModule {
  path?: string;
  declarations?: CemDeclaration[];
}

export interface CustomElementsManifest {
  schemaVersion?: string;
  modules?: CemModule[];
}
