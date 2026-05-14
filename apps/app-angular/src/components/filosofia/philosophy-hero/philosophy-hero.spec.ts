import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhilosophyHeroComponent } from './philosophy-hero';

describe('PhilosophyHeroComponent', () => {
  let component: PhilosophyHeroComponent;
  let fixture: ComponentFixture<PhilosophyHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhilosophyHeroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhilosophyHeroComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
