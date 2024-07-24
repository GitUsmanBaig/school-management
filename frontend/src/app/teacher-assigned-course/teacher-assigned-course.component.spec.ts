import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherAssignedCourseComponent } from './teacher-assigned-course.component';

describe('TeacherAssignedCourseComponent', () => {
  let component: TeacherAssignedCourseComponent;
  let fixture: ComponentFixture<TeacherAssignedCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherAssignedCourseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherAssignedCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
