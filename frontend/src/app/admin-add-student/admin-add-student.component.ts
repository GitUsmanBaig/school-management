import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-admin-add-student',
  templateUrl: './admin-add-student.component.html',
  styleUrls: ['./admin-add-student.component.scss']
})
export class AdminAddStudentComponent {
  @Output() studentAdded = new EventEmitter<boolean>();

  constructor(private apiService: ApiService) {}

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.apiService.addStudent(form.value).subscribe({
      next: (response) => {
        console.log('Student added:', response);
        this.studentAdded.emit(true);  // Emit an event to update the parent component
        form.reset();  // Reset form after submission
      },
      error: (error) => {
        console.error('Failed to add student:', error);
      }
    });
  }
}
