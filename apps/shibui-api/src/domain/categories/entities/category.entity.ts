export class Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  /** Icon name from the icon set (e.g. 'layout', 'form', 'navigation') */
  icon: string | null;
  /** Controls display order in the sidebar/navigation */
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
