import { Component, OnInit } from '@angular/core';
import { StudentApiService } from '../student-api.service';

interface AttendanceRecord {
  date: string;
  present: boolean;
}

@Component({
  selector: 'app-student-attendance',
  templateUrl: './student-attendance.component.html',
  styleUrls: ['./student-attendance.component.scss']
})
export class StudentAttendanceComponent implements OnInit {
  courses: any[] = [];
  selectedCourseId: string = '';
  attendanceRecords: AttendanceRecord[] = [];
  applied: boolean = false;

  constructor(private studentApiService: StudentApiService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    this.studentApiService.getEnrolledCourses().subscribe(
      (data) => {
        this.courses = data;
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }

  applySelection() {
    this.attendanceRecords = []; // Clear previous records
    this.applied = true;
    this.loadAttendance();
  }

  loadAttendance() {
    if (this.selectedCourseId) {
      this.studentApiService.getAttendance(this.selectedCourseId).subscribe(
        (data: AttendanceRecord[]) => {
          this.attendanceRecords = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        },
        (error) => {
          console.error('Error fetching attendance:', error);
        });
    }
  }
}
