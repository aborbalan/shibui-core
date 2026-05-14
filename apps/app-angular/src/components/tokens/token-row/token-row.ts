import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { DesignTokenDto } from '@data/models/tokens.models';

@Component({
  selector: 'app-token-row',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './token-row.html',
  styleUrl: './token-row.scss',
})
export class TokenRowComponent {
  token = input.required<DesignTokenDto>();

  get isColor(): boolean {
    return this.token().category.startsWith('color');
  }
}
