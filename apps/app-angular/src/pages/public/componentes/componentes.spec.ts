import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Componentes } from './componentes';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('Componentes', () => {
  let component: Componentes;
  let fixture: ComponentFixture<Componentes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Componentes],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Componentes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
