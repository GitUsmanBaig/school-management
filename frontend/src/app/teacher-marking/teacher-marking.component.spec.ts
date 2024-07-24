import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherMarkingComponent } from './teacher-marking.component';

describe('TeacherMarkingComponent', () => {
  let component: TeacherMarkingComponent;
  let fixture: ComponentFixture<TeacherMarkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherMarkingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherMarkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
