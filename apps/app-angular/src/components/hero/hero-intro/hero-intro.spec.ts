import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroIntro } from './hero-intro';

describe('HeroIntro', () => {
  let component: HeroIntro;
  let fixture: ComponentFixture<HeroIntro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroIntro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroIntro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
