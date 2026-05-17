import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrinciplesSectionComponent } from './principles-section';

describe('PrinciplesSectionComponent', () => {
  let component: PrinciplesSectionComponent;
  let fixture: ComponentFixture<PrinciplesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrinciplesSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrinciplesSectionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
