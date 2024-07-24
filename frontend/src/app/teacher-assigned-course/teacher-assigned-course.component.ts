import { Component, OnInit } from '@angular/core';
import { TeacherApiService } from '../teacher-api.service';

@Component({
  selector: 'app-teacher-assigned-course',
  templateUrl: './teacher-assigned-course.component.html',
  styleUrls: ['./teacher-assigned-course.component.scss']
})
export class TeacherAssignedCourseComponent implements OnInit {
  searchTerm: string = '';
  courses: any[] = [];
  filteredCourses: any[] = [];
  selectedCourseId: string = '';
  isStudentModalActive: boolean = false;

  constructor(private teacherApiService: TeacherApiService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    this.teacherApiService.getAssignedCourses().subscribe(
      (data) => {
        this.courses = data;
        this.filteredCourses = this.courses;
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }

  filterCourses() {
    this.filteredCourses = this.courses.filter(course =>
      course.courseName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      course.courseId.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openStudentModal(courseId: string) {
    this.selectedCourseId = courseId;
    this.isStudentModalActive = true;
  }

  closeStudentModal() {
    this.isStudentModalActive = false;
  }
}
