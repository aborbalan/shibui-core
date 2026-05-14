import { Component, CUSTOM_ELEMENTS_SCHEMA, input, output } from '@angular/core';
import { ComponentDto } from '@data/models/components.models';

@Component({
  selector: 'app-component-card',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './component-card.html',
  styleUrl: './component-card.scss',
})
export class ComponentCardComponent {
  component = input.required<ComponentDto>();
  select = output<string>();

  onSelect(): void {
    this.select.emit(this.component().slug);
  }
}
