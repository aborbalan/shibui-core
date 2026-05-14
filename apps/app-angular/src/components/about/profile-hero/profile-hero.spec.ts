import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileHeroComponent } from './profile-hero';

describe('ProfileHeroComponent', () => {
  let component: ProfileHeroComponent;
  let fixture: ComponentFixture<ProfileHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileHeroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileHeroComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('profile', {
      name: 'Test',
      title: 'Dev',
      location: 'ES',
      email: 'test@test.com',
      bio: 'Bio',
      socials: [],
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
