import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { TeacherApiService } from '../teacher-api.service';

@Component({
  selector: 'app-teacher-assigned-students',
  templateUrl: './teacher-assigned-students.component.html',
  styleUrls: ['./teacher-assigned-students.component.scss']
})
export class TeacherAssignedStudentsComponent implements OnChanges {
  @Input() courseId!: string;
  @Input() isActive: boolean = false;
  @Output() close = new EventEmitter<void>();
  students: any[] = [];

  constructor(private teacherApiService: TeacherApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['courseId'] && this.courseId) {
      this.loadStudents();
    }
  }

  loadStudents() {
    this.teacherApiService.getAllStudents(this.courseId).subscribe(
      (data) => {
        this.students = data;
      },
      (error) => {
        console.error('Error fetching students:', error);
      }
    );
  }

  closeModal() {
    this.close.emit();
  }
}
