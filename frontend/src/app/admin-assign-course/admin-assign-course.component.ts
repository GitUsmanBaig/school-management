import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-admin-assign-course',
  templateUrl: './admin-assign-course.component.html',
  styleUrls: ['./admin-assign-course.component.scss']
})
export class AdminAssignCourseComponent implements OnInit {
  @Input() course: any;
  @Output() courseAssigned = new EventEmitter<boolean>();
  teachers: any[] = [];
  selectedTeachers: string[] = [];
  assignedTeachers: string[] = []; // To store already assigned teachers

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadTeachers();
    this.assignedTeachers = this.course.assignedTeachers || []; // Assuming course object has assignedTeachers array
  }

  loadTeachers(): void {
    this.apiService.getAllTeachers().subscribe(data => {
      this.teachers = data.sort((a: any, b: any) => a.name.localeCompare(b.name)); // Sort alphabetically
    }, error => {
      console.error('There was an error fetching teachers:', error);
    });
  }

  toggleTeacherSelection(teacherId: string): void {
    const index = this.selectedTeachers.indexOf(teacherId);
    if (index === -1) {
      this.selectedTeachers.push(teacherId);
    } else {
      this.selectedTeachers.splice(index, 1);
    }
  }

  onSubmit(): void {
    if (!this.course || !this.course._id) {
      console.error('Course ID is missing');
      return;
    }

    this.apiService.assignCourse(this.course._id, this.selectedTeachers).subscribe({
      next: (response) => {
        console.log('Course assigned:', response);
        this.courseAssigned.emit(true);  // Emit an event to update the parent component
      },
      error: (error) => {
        console.error('Failed to assign course:', error);
      }
    });
  }

  closeModal(): void {
    this.courseAssigned.emit(false);
  }
}
