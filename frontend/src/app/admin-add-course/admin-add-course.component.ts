import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-admin-add-course',
  templateUrl: './admin-add-course.component.html',
  styleUrls: ['./admin-add-course.component.scss']
})
export class AdminAddCourseComponent {
  @Output() courseAdded = new EventEmitter<boolean>();

  constructor(private apiService: ApiService) {}

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const courseData = {
      courseId: form.value.courseId,
      courseName: form.value.courseName,
      startDate: form.value.startDate,
      endDate: form.value.endDate
    };
    this.apiService.addCourse(courseData).subscribe({
      next: (response) => {
        console.log('Course added:', response);
        this.courseAdded.emit(true);  // Emit an event to update the parent component
        form.reset();  // Reset form after submission
      },
      error: (error) => {
        console.error('Failed to add course:', error);
      }
    });
  }
}
