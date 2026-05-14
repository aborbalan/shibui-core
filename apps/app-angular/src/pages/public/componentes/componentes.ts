import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ComponentsService } from '@data/services/components.service';
import { CategoryWithComponentsDto } from '@data/models/components.models';
import { ComponentsGridComponent } from '@components/componentes/components-grid/components-grid';

function filterCategories(
  categories: CategoryWithComponentsDto[],
  query: string
): CategoryWithComponentsDto[] {
  if (!query.trim()) return categories;
  const q = query.toLowerCase();
  return categories
    .map((cat) => ({
      ...cat,
      components: cat.components.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.tagName.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      ),
    }))
    .filter((cat) => cat.components.length > 0);
}

@Component({
  selector: 'app-componentes',
  standalone: true,
  imports: [ComponentsGridComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './componentes.html',
  styleUrl: './componentes.scss',
})
export class Componentes {
  private svc = inject(ComponentsService);
  private router = inject(Router);

  readonly categories = toSignal(this.svc.getCategoriesWithComponents(), { initialValue: [] });
  readonly query = signal('');
  readonly loading = signal(false);

  readonly filtered = computed(() => filterCategories(this.categories(), this.query()));
  readonly totalComponents = computed(() =>
    this.categories().reduce((acc, c) => acc + c.components.length, 0)
  );
  readonly emptySearch = computed(
    () => this.query().trim().length > 0 && this.filtered().length === 0
  );

  onQueryChange(event: Event): void {
    const value = (event as CustomEvent<{ value: string }>).detail?.value ?? '';
    this.query.set(value);
  }

  onComponentSelect(slug: string): void {
    this.router.navigate(['/componentes', slug]);
  }
}
