import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ContentSectionComponent } from '@components/content-section/content-section';
import { HeroStatsComponent } from '@components/hero/hero-stats/hero-stats';
import { FeaturesComponent } from '@components/hero/features/features';
import { CardsSectionComponent } from '@components/hero/cards-section/cards-section';
import { InstallSectionComponent } from '@components/hero/install-section/install-section';
import { PhilosophySectionComponent } from '@components/hero/philosophy-section/philosophy-section';
import { CardsShowcaseComponent } from '@components/hero/cards-showcase/cards-showcase';
import { TokensSectionComponent } from '@components/hero/tokens-section/tokens-section';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [
    ContentSectionComponent,
    HeroStatsComponent,
    FeaturesComponent,
    CardsSectionComponent,
    InstallSectionComponent,
    PhilosophySectionComponent,
    CardsShowcaseComponent,
    TokensSectionComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
