import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

interface Teacher {
  _id?: string; // Ensure ID is optional for adding new teachers
  name: string;
  email: string;
  qualifications: string[];
  isEnabled?: boolean; // Make isEnabled optional and handle it similarly to students
}

@Component({
  selector: 'app-admin-teacher',
  templateUrl: './admin-teacher.component.html',
  styleUrls: ['./admin-teacher.component.scss']
})
export class AdminTeacherComponent implements OnInit {
  teachers: Teacher[] = [];
  filteredTeachers: Teacher[] = [];
  searchTerm: string = '';
  showAddTeacherModal: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.apiService.getAllTeachers().subscribe(data => {
      this.teachers = data.map((teacher: any) => ({
        ...teacher,
        isEnabled: !teacher.disabled  
      }));
      this.filteredTeachers = this.teachers;
    }, error => {
      console.error('There was an error fetching teachers:', error);
    });
  }

  enableTeacher(teacher: any): void {
    if (!teacher._id) {
      console.error('Attempted to enable a teacher without an ID:', teacher);
      return; // Prevent the API call if the ID is undefined
    }

    this.apiService.enableTeacher(teacher._id).subscribe({
      next: () => {
        teacher.isEnabled = true; // Update local teacher state
        console.log('Teacher enabled:', teacher._id);
      },
      error: (error) => {
        console.error('Error enabling teacher', teacher._id, error);
      }
    });
  }

  disableTeacher(teacher: any): void {
    if (!teacher._id) {
      console.error('Attempted to disable a teacher without an ID:', teacher);
      return; // Prevent the API call if the ID is undefined
    }

    this.apiService.disableTeacher(teacher._id).subscribe({
      next: () => {
        teacher.isEnabled = false; // Update local teacher state
        console.log('Teacher disabled:', teacher._id);
      },
      error: (error) => {
        console.error('Error disabling teacher', teacher._id, error);
      }
    });
  }

  onTeacherAdded(): void {
    this.showAddTeacherModal = false;  // Close the modal
    this.loadTeachers();  // Reload teachers to include the newly added teacher
  }

  addTeacher(): void {
    this.showAddTeacherModal = true;
  }

  filterTeachers(): void {
    if (!this.searchTerm) {
      this.filteredTeachers = this.teachers;
    } else {
      this.filteredTeachers = this.teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        teacher.qualifications.join(',').toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
}
