import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';

export type ContentSectionSurface = 'dark' | 'light' | 'washi' | 'transparent';

@Component({
  selector: 'app-content-section',
  imports: [CommonModule],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './content-section.html',
  styleUrl: './content-section.scss',
})
export class ContentSectionComponent {

  eyebrow = input<string>('66 · Componentes');
  headingLine1 = input<string>('Todo lo que');
  headingLine2Prefix = input<string>('necesitas,');
  headingAccent = input<string>('nada más');
  description = input<string>('Cada componente existe porque tiene un propósito claro...');
  surface = input<ContentSectionSurface>('transparent');

  readonly SURFACES: Record<ContentSectionSurface, string> = {
    dark: 'var(--color-washi-950)',
    light: 'var(--color-white)',
    washi: 'var(--color-washi-100)',
    transparent: 'none'
  };

  get currentSurfaceStyle() {
    return { 'background': this.SURFACES[this.surface()] };
  }

  get toDisplaySurface(): 'dark' | 'light' | 'washi' {
    const s = this.surface();
    return s === 'transparent' ? 'light' : s;
  }
}
