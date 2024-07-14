import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

interface Student {
  id: string;
  name: string;
  email: string;
  CNIC: string;
  contact: string;
  isEnabled?: boolean;
}

@Component({
  selector: 'app-admin-student',
  templateUrl: './admin-student.component.html',
  styleUrls: ['./admin-student.component.scss']
})
export class AdminStudentComponent implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  searchTerm: string = '';
  showAddStudentModal: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.apiService.getAllStudents().subscribe(data => {
      this.students = data.map((student: any) => ({
        ...student,
        isEnabled: !student.disabled  // Set isEnabled based on the negation of the `disabled` property from the backend
      }));
      this.filteredStudents = this.students;
    }, error => {
      console.error('There was an error fetching students:', error);
    });
  }

  enableStudent(student: any): void {
    if (!student._id) {
      console.error('Attempted to enable a student without an ID:', student);
      return; // Prevent the API call if the ID is undefined
    }

    this.apiService.enableStudent(student._id).subscribe({
      next: () => {
        student.isEnabled = true; // Update local student state
        console.log('Student enabled:', student._id);
      },
      error: (error) => {
        console.error('Error enabling student', student._id, error);
      }
    });
  }

  disableStudent(student: any): void {
    if (!student._id) {
      console.error('Attempted to disable a student without an ID:', student);
      return; // Prevent the API call if the ID is undefined
    }

    this.apiService.disableStudent(student._id).subscribe({
      next: () => {
        student.isEnabled = false; // Update local student state
        console.log('Student disabled:', student._id);
      },
      error: (error) => {
        console.error('Error disabling student', student._id, error);
      }
    });
  }

  onStudentAdded(): void {
    this.showAddStudentModal = false;  // Close the modal
    this.loadStudents();  // Reload students to include the newly added student
  }

  addStudent(): void {
    this.showAddStudentModal = true;
  }

  filterStudents(): void {
    if (!this.searchTerm) {
      this.filteredStudents = this.students;
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
