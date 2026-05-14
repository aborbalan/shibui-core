import { Component, CUSTOM_ELEMENTS_SCHEMA, input, output } from '@angular/core';
import { CategoryWithComponentsDto } from '@data/models/components.models';
import { ComponentCardComponent } from '../component-card/component-card';

@Component({
  selector: 'app-components-grid',
  standalone: true,
  imports: [ComponentCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './components-grid.html',
  styleUrl: './components-grid.scss',
})
export class ComponentsGridComponent {
  categories = input.required<CategoryWithComponentsDto[]>();
  loading = input(false);
  emptySearch = input(false);
  componentSelect = output<string>();
}
