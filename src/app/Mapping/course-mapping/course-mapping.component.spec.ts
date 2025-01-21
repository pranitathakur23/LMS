import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseMappingComponent } from './course-mapping.component';

describe('CourseMappingComponent', () => {
  let component: CourseMappingComponent;
  let fixture: ComponentFixture<CourseMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseMappingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
