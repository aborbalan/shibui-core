export type ComponentStatus = 'draft' | 'stable' | 'deprecated';

export interface ApiProp {
  name: string;
  type: string;
  default?: string;
  description?: string;
  attribute?: string;
  /** Valores enumerables del prop cuando su tipo es una unión de literales. */
  options?: string[];
}

export interface ApiSlot {
  name: string;
  description?: string;
}

export interface ApiEvent {
  name: string;
  type?: string;
  description?: string;
}

/** Referencia de API técnica (props/slots/events) derivada del manifiesto. */
export interface ComponentApi {
  props: ApiProp[];
  slots: ApiSlot[];
  events: ApiEvent[];
}

export interface ComponentDto {
  id: string;
  name: string;
  slug: string;
  tagName: string;
  description: string;
  version: string;
  status: ComponentStatus;
  categoryId: string;
  packageName: string | null;
  tags: string[];
  docsUrl: string | null;
  /** Presente en el detalle (GET /components/slug/:slug). */
  api?: ComponentApi;
}

export interface CategoryWithComponentsDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  order: number;
  components: ComponentDto[];
}

export type ExampleFramework = 'vanilla' | 'angular' | 'react' | 'vue';

export interface ExampleDto {
  id: string;
  componentId: string;
  title: string;
  description: string | null;
  code: string;
  framework: ExampleFramework;
  order: number;
  isDefault: boolean;
}
