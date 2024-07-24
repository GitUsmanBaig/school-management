import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-admin-add-teacher',
  templateUrl: './admin-add-teacher.component.html',
  styleUrls: ['./admin-add-teacher.component.scss']
})
export class AdminAddTeacherComponent {
  @Output() teacherAdded = new EventEmitter<boolean>();

  constructor(private apiService: ApiService) {}

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const teacherData = {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      CNIC: form.value.CNIC,
      contact: form.value.contact,
      subject: form.value.subject,
      qualifications: form.value.qualifications
    };
    this.apiService.addTeacher(teacherData).subscribe({
      next: (response) => {
        console.log('Teacher added:', response);
        this.teacherAdded.emit(true);  // Emit an event to update the parent component
        form.reset();  // Reset form after submission
      },
      error: (error) => {
        console.error('Failed to add teacher:', error);
      }
    });
  }
}
