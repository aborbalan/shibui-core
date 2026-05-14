import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TokensSidebarComponent } from './tokens-sidebar';

describe('TokensSidebarComponent', () => {
  let component: TokensSidebarComponent;
  let fixture: ComponentFixture<TokensSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokensSidebarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TokensSidebarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
