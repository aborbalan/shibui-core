import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroStatsComponent } from './hero-stats';

describe('HeroStats', () => {
  let component: HeroStatsComponent;
  let fixture: ComponentFixture<HeroStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroStatsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
