import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PhilosophyHeroComponent } from '@components/filosofia/philosophy-hero/philosophy-hero';
import { PillarsSectionComponent } from '@components/filosofia/pillars-section/pillars-section';
import { PrinciplesSectionComponent } from '@components/filosofia/principles-section/principles-section';

@Component({
  selector: 'app-filosofia',
  standalone: true,
  imports: [PhilosophyHeroComponent, PillarsSectionComponent, PrinciplesSectionComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './filosofia.html',
  styleUrl: './filosofia.scss',
})
export class Filosofia {}
