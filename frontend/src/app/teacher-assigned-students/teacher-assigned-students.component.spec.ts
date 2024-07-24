import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherAssignedStudentsComponent } from './teacher-assigned-students.component';

describe('TeacherAssignedStudentsComponent', () => {
  let component: TeacherAssignedStudentsComponent;
  let fixture: ComponentFixture<TeacherAssignedStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherAssignedStudentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherAssignedStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
