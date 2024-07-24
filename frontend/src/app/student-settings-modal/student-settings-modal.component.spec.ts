import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSettingsModalComponent } from './student-settings-modal.component';

describe('StudentSettingsModalComponent', () => {
  let component: StudentSettingsModalComponent;
  let fixture: ComponentFixture<StudentSettingsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentSettingsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentSettingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
