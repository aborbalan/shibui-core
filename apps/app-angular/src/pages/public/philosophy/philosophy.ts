import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PhilosophyHeroComponent } from '@components/philosophy/philosophy-hero/philosophy-hero';
import { PillarsSectionComponent } from '@components/philosophy/pillars-section/pillars-section';
import { PrinciplesSectionComponent } from '@components/philosophy/principles-section/principles-section';

@Component({
  selector: 'app-philosophy',
  standalone: true,
  imports: [PhilosophyHeroComponent, PillarsSectionComponent, PrinciplesSectionComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './philosophy.html',
  styleUrl: './philosophy.scss',
})
export class Philosophy {}
