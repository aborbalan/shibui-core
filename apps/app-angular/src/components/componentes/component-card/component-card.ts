import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, input, output } from '@angular/core';
import { ComponentDto } from '@data/models/components.models';

/** Estado del componente → tono semántico del lib-badge (igual que el showcase React). */
const STATUS_TONE: Record<string, string> = {
  stable: 'success',
  draft: 'warning',
  deprecated: 'error',
};

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

  readonly statusTone = computed(() => STATUS_TONE[this.component().status] ?? 'default');

  onSelect(): void {
    this.select.emit(this.component().slug);
  }
}
