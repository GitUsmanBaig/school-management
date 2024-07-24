import { Component, OnInit } from '@angular/core';
import { StudentApiService } from '../student-api.service';

interface Course {
  _id: string;
  courseId: string;
  courseName: string;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-student-my-courses',
  templateUrl: './student-my-courses.component.html',
  styleUrls: ['./student-my-courses.component.scss']
})
export class StudentMyCoursesComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  searchTerm: string = '';

  constructor(private apiService: StudentApiService) {}

  ngOnInit(): void {
    this.loadEnrolledCourses();
  }

  loadEnrolledCourses(): void {
    this.apiService.getEnrolledCourses().subscribe(data => {
      this.courses = data;
      this.filteredCourses = this.courses;
    }, error => {
      console.error('There was an error fetching enrolled courses:', error);
    });
  }

  filterCourses(): void {
    if (!this.searchTerm) {
      this.filteredCourses = this.courses;
    } else {
      this.filteredCourses = this.courses.filter(course =>
        course.courseId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        course.courseName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  unenrollCourse(course: Course): void {
    this.apiService.unenrollCourse(course._id).subscribe(() => {
      this.courses = this.courses.filter(c => c._id !== course._id);
      this.filteredCourses = this.filteredCourses.filter(c => c._id !== course._id);
    }, error => {
      console.error('There was an error unenrolling from the course:', error);
    });
  }
}
