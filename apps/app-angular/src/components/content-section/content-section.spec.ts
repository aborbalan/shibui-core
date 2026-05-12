import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentSectionComponent } from './content-section';

describe('ContentSection', () => {
  let component: ContentSectionComponent;
  let fixture: ComponentFixture<ContentSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentSectionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
