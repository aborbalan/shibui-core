import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentDetailViewComponent } from './component-detail-view';

describe('ComponentDetailViewComponent', () => {
  let component: ComponentDetailViewComponent;
  let fixture: ComponentFixture<ComponentDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentDetailViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentDetailViewComponent);
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
