import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PillarsSectionComponent } from './pillars-section';

describe('PillarsSectionComponent', () => {
  let component: PillarsSectionComponent;
  let fixture: ComponentFixture<PillarsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PillarsSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PillarsSectionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
