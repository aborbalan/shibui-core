import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TokenSectionComponent } from './token-section';

describe('TokenSectionComponent', () => {
  let component: TokenSectionComponent;
  let fixture: ComponentFixture<TokenSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TokenSectionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tokens', []);
    fixture.componentRef.setInput('title', 'Test');
    fixture.componentRef.setInput('anchor', 'test');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
