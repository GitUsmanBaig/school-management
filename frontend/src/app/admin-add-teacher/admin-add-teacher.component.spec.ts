import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddTeacherComponent } from './admin-add-teacher.component';

describe('AdminAddTeacherComponent', () => {
  let component: AdminAddTeacherComponent;
  let fixture: ComponentFixture<AdminAddTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAddTeacherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
