import { apiGet } from './client';

// ─── Modelos ──────────────────────────────────────────────────────────────────

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

// ─── Llamadas ───────────────────────────────────────────────────────────────────

/** GET /api/v1/categories/with-components — categorías con sus componentes embebidos. */
export const getCategoriesWithComponents = (): Promise<CategoryWithComponentsDto[]> =>
  apiGet<CategoryWithComponentsDto[]>('/api/v1/categories/with-components');

/** GET /api/v1/components/slug/:slug — componente individual (incluye bloque `api`). */
export const getBySlug = (slug: string): Promise<ComponentDto> =>
  apiGet<ComponentDto>(`/api/v1/components/slug/${slug}`);

/** GET /api/v1/examples/component/:componentId — ejemplos de un componente. */
export const getExamplesByComponent = (componentId: string): Promise<ExampleDto[]> =>
  apiGet<ExampleDto[]>(`/api/v1/examples/component/${componentId}`);
