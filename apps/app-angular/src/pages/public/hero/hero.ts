import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ContentSectionComponent } from '@components/content-section/content-section';

@Component({
  selector: 'app-hero',
  standalone:true,
  imports: [ContentSectionComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {

}
