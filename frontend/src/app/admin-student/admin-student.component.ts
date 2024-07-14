// src/app/admin-student/admin-student.component.ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-admin-student',
  templateUrl: './admin-student.component.html',
  styleUrls: ['./admin-student.component.scss']
})
export class AdminStudentComponent implements OnInit {
  students: any[] = []; // Original list of students
  filteredStudents: any[] = []; // Filtered list for display
  searchTerm: string = ''; // Search term for filtering

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.apiService.getAllStudents().subscribe({
      next: (data) => {
        this.students = data;
        this.filteredStudents = data; // Initialize filteredStudents with all students
      },
      error: (error) => {
        console.error('There was an error!', error);
      }
    });
  }

  enableStudent(id: string): void {
    console.log('Enabling student with ID:', id);
    // Add your enable logic here, possibly update backend via ApiService
  }
  
  disableStudent(id: string): void {
    console.log('Disabling student with ID:', id);
    // Add your disable logic here, possibly update backend via ApiService
  }


  addStudent(): void {
    console.log('Adding a new student');
    // Add your add logic here, possibly update backend via ApiService
  }

  filterStudents(): void {
    if (!this.searchTerm) {
      this.filteredStudents = this.students; // No search term, show all students
    } else {
      this.filteredStudents = this.students.filter(student =>
        student.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.CNIC.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.contact.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
}
