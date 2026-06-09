export enum ComponentStatus {
  DRAFT = 'draft',
  STABLE = 'stable',
  DEPRECATED = 'deprecated',
}

/** Propiedad pública del componente (derivada del manifiesto). */
export interface ApiProp {
  name: string;
  type: string;
  default?: string;
  description?: string;
  attribute?: string;
}

/** Slot del componente. */
export interface ApiSlot {
  name: string;
  description?: string;
}

/** Evento personalizado emitido por el componente. */
export interface ApiEvent {
  name: string;
  type?: string;
  description?: string;
}

/** Referencia de API técnica de un componente (props/slots/events). */
export interface ComponentApi {
  props: ApiProp[];
  slots: ApiSlot[];
  events: ApiEvent[];
}

export class Component {
  id: string;
  name: string;
  /** URL-friendly identifier, e.g. 'shibui-button' */
  slug: string;
  /** The custom element tag name, e.g. '<shibui-button>' */
  tagName: string;
  description: string;
  /** Semver version of the component, e.g. '1.2.0' */
  version: string;
  status: ComponentStatus;
  categoryId: string;
  /** npm package that exposes this component */
  packageName: string | null;
  /** Searchable tags, e.g. ['form', 'interactive', 'accessible'] */
  tags: string[];
  /** Link to the component's own documentation or design spec */
  docsUrl: string | null;
  /** Technical API reference (props/slots/events) generated from the manifest */
  api?: ComponentApi;
  createdAt: Date;
  updatedAt: Date;
}
