import { apiClient } from "../../../client";

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  meta: { timestamp: string; path: string };
}

// ─── DTOs ────────────────────────────────────────────────────────────────────

export type ComponentStatus = "draft" | "stable" | "deprecated";

export interface ApiPropDto {
  name: string;
  type: string;
  default?: string;
  description?: string;
  attribute?: string;
}

export interface ApiSlotDto {
  name: string;
  description?: string;
}

export interface ApiEventDto {
  name: string;
  type?: string;
  description?: string;
}

/** Referencia de API técnica (props/slots/events) derivada del manifiesto. */
export interface ComponentApiDto {
  props: ApiPropDto[];
  slots: ApiSlotDto[];
  events: ApiEventDto[];
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
  api?: ComponentApiDto;
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

export type ExampleFramework = "vanilla" | "angular" | "react" | "vue";

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

// ─── API calls ────────────────────────────────────────────────────────────────

export const componentsApi = {
  /** GET /api/v1/categories/with-components — categorías con sus componentes embebidos */
  getCategoriesWithComponents: (): Promise<CategoryWithComponentsDto[]> =>
    apiClient
      .get<ApiEnvelope<CategoryWithComponentsDto[]>>(
        "/api/v1/categories/with-components",
        { public: true }
      )
      .then((r) => r.data),

  /** GET /api/v1/components/slug/:slug — componente individual por slug */
  getBySlug: (slug: string): Promise<ComponentDto> =>
    apiClient
      .get<ApiEnvelope<ComponentDto>>(`/api/v1/components/slug/${slug}`, {
        public: true,
      })
      .then((r) => r.data),
};

export const examplesApi = {
  /** GET /api/v1/examples/component/:componentId — ejemplos de un componente */
  getByComponent: (componentId: string): Promise<ExampleDto[]> =>
    apiClient
      .get<ApiEnvelope<ExampleDto[]>>(
        `/api/v1/examples/component/${componentId}`,
        { public: true }
      )
      .then((r) => r.data),
};
