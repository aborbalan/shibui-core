import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Filosofia } from './filosofia';

describe('Filosofia', () => {
  let component: Filosofia;
  let fixture: ComponentFixture<Filosofia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Filosofia],
    }).compileComponents();

    fixture = TestBed.createComponent(Filosofia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
