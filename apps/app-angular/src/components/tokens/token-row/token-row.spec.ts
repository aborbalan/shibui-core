import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TokenRowComponent } from './token-row';

describe('TokenRowComponent', () => {
  let component: TokenRowComponent;
  let fixture: ComponentFixture<TokenRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenRowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TokenRowComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('token', {
      id: '1', name: 'test', cssVar: '--test', value: '#fff',
      category: 'color-primitive', description: '', darkValue: null,
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
