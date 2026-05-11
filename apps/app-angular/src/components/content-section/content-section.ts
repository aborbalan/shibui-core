import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, input, Input } from '@angular/core';

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
  surface = input<ContentSectionSurface>('dark');

constructor() {
    // Se ejecuta cada vez que 'surface' cambia
    effect(() => {
      console.log(this.headingLine2Prefix());
    });
  }


 

  // Mapas de configuración similares a React
  readonly SURFACES: Record<ContentSectionSurface, string> = {
    dark: 'var(--color-washi-950, #120E0A)',
    light: '#ffffff',
    washi: 'var(--color-washi-100, #F2EDE6)',
    transparent: 'none'
  };

  readonly HEADING_COLORS: Record<ContentSectionSurface, string> = {
    dark: 'rgba(250, 247, 244, 0.65)',
    light: 'var(--color-washi-800, #3D332A)',
    washi: 'var(--color-washi-800, #3D332A)',
    transparent: 'var(--color-washi-800, #3D332A)'
  };

  readonly DESC_COLORS: Record<ContentSectionSurface, string> = {
    dark: 'rgba(250, 247, 244, 0.28)',
    light: 'var(--color-washi-500, #9A8878)',
    washi: 'var(--color-washi-600, #7A6A5C)',
    transparent: 'var(--color-washi-800, #3D332A)'
  };

  get currentSurfaceStyle() {
    return { 'background': this.SURFACES[this.surface()] };
  }

  get headingColor() {
    return this.HEADING_COLORS[this.surface()];
  }

  get descColor() {
    return this.DESC_COLORS[this.surface()];
  }
  
}
