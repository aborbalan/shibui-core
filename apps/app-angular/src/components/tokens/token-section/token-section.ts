import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { DesignTokenDto } from '@data/models/tokens.models';
import { TokenRowComponent } from '../token-row/token-row';

@Component({
  selector: 'app-token-section',
  standalone: true,
  imports: [TokenRowComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './token-section.html',
  styleUrl: './token-section.scss',
})
export class TokenSectionComponent {
  tokens = input.required<DesignTokenDto[]>();
  title = input.required<string>();
  anchor = input.required<string>();
  description = input('');
}
