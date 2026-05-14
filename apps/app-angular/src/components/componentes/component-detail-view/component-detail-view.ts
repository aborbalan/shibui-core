import { Component, CUSTOM_ELEMENTS_SCHEMA, input, output } from '@angular/core';
import { ComponentDto } from '@data/models/components.models';

@Component({
  selector: 'app-component-detail-view',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './component-detail-view.html',
  styleUrl: './component-detail-view.scss',
})
export class ComponentDetailViewComponent {
  component = input.required<ComponentDto>();
  back = output<void>();
}
