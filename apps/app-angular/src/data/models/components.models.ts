export type ComponentStatus = 'draft' | 'stable' | 'deprecated';

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
