import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tokens } from './tokens';
import { provideHttpClient } from '@angular/common/http';

describe('Tokens', () => {
  let component: Tokens;
  let fixture: ComponentFixture<Tokens>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tokens],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(Tokens);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
