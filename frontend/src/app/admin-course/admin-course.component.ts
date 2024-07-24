import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

interface Course {
  _id?: string;
  courseId: string;
  courseName: string;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-admin-course',
  templateUrl: './admin-course.component.html',
  styleUrls: ['./admin-course.component.scss']
})
export class AdminCourseComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  searchTerm: string = '';
  showAddCourseModal: boolean = false;
  showDeleteCourseModal: boolean = false;
  courseToDelete: Course | null = null;
  showAssignCourseModal: boolean = false;
  selectedCourse: Course | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.apiService.getAllCourses().subscribe(data => {
      this.courses = data;
      this.filteredCourses = this.courses;
    }, error => {
      console.error('There was an error fetching courses:', error);
    });
  }

  onCourseAdded(): void {
    this.showAddCourseModal = false;  // Close the modal
    this.loadCourses();  // Reload courses to include the newly added course
  }

  addCourse(): void {
    this.showAddCourseModal = true;
  }

  onCourseAssigned(): void {
    this.showAssignCourseModal = false;  // Close the modal
    this.loadCourses();  // Reload courses to reflect assignments
  }

    assignTeachers(course: Course): void {
    this.selectedCourse = course;
    this.showAssignCourseModal = true;
  }

  confirmDeleteCourse(course: Course): void {
    this.courseToDelete = course;
    this.showDeleteCourseModal = true;
  }

  deleteCourse(): void {
    if (this.courseToDelete && this.courseToDelete._id) {
      this.apiService.deleteCourse(this.courseToDelete._id).subscribe({
        next: () => {
          console.log('Course deleted:', this.courseToDelete?._id);
          this.showDeleteCourseModal = false;
          this.loadCourses();  // Reload courses to reflect deletion
        },
        error: (error) => {
          console.error('Failed to delete course:', error);
        }
      });
    }
  }

  filterCourses(): void {
    if (!this.searchTerm) {
      this.filteredCourses = this.courses;
    } else {
      this.filteredCourses = this.courses.filter(course =>
        course.courseName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        course.courseId.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
}
