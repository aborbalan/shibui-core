import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentCardComponent } from './component-card';

describe('ComponentCardComponent', () => {
  let component: ComponentCardComponent;
  let fixture: ComponentFixture<ComponentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('component', {
      id: '1', name: 'Button', slug: 'button', tagName: 'lib-button',
      description: 'Test', version: '1.0', status: 'stable',
      categoryId: 'cat-1', packageName: null, tags: [], docsUrl: null,
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
