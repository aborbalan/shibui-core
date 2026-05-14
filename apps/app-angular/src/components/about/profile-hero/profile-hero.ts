import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { ProfileDto } from '../about.models';

@Component({
  selector: 'app-profile-hero',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './profile-hero.html',
  styleUrl: './profile-hero.scss',
})
export class ProfileHeroComponent {
  profile = input.required<ProfileDto>();
  openToWork = input(false);

  openUrl(url: string): void {
    window.open(url, '_blank');
  }
}
