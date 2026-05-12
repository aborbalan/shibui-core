export enum ComponentStatus {
  DRAFT = 'draft',
  STABLE = 'stable',
  DEPRECATED = 'deprecated',
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
  createdAt: Date;
  updatedAt: Date;
}
