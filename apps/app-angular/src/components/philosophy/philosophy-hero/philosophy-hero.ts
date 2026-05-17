import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-philosophy-hero',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './philosophy-hero.html',
  styleUrl: './philosophy-hero.scss',
})
export class PhilosophyHeroComponent {}
