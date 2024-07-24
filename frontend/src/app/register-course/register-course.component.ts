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
  selector: 'app-register-course',
  templateUrl: './register-course.component.html',
  styleUrls: ['./register-course.component.scss']
})
export class RegisterCourseComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  searchTerm: string = '';
  enrolledCourses: string[] = [];

  constructor(private apiService: StudentApiService) {}

  ngOnInit(): void {
    this.loadCourses();
    this.loadEnrolledCourses();
  }

  loadCourses(): void {
    this.apiService.getAllCourses().subscribe(data => {
      this.courses = data;
      this.filteredCourses = this.courses;
    }, error => {
      console.error('There was an error fetching courses:', error);
    });
  }

  loadEnrolledCourses(): void {
    this.apiService.getEnrolledCourses().subscribe(data => {
      this.enrolledCourses = data.map((course: Course) => course._id);
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

  isEnrolled(course: Course): boolean {
    return this.enrolledCourses.includes(course._id);
  }

  enrollCourse(course: Course): void {
    this.apiService.enrollCourse(course._id).subscribe(() => {
      this.enrolledCourses.push(course._id);
    }, error => {
      console.error('There was an error enrolling in the course:', error);
    });
  }

  unenrollCourse(course: Course): void {
    this.apiService.unenrollCourse(course._id).subscribe(() => {
      this.enrolledCourses = this.enrolledCourses.filter(id => id !== course._id);
    }, error => {
      console.error('There was an error unenrolling from the course:', error);
    });
  }
}
