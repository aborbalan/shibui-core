import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentesDetail } from './componentes-detail';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ComponentesDetail', () => {
  let component: ComponentesDetail;
  let fixture: ComponentFixture<ComponentesDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentesDetail],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(new Map([['slug', 'button']])) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentesDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
