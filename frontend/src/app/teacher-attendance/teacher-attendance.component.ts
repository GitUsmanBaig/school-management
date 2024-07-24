import { Component, OnInit } from '@angular/core';
import { TeacherApiService } from '../teacher-api.service';

interface AttendanceRecord {
  studentId: {
    _id: string;
    name: string;
    email: string;
  };
  present: boolean;
}

@Component({
  selector: 'app-teacher-attendance',
  templateUrl: './teacher-attendance.component.html',
  styleUrls: ['./teacher-attendance.component.scss']
})
export class TeacherAttendanceComponent implements OnInit {
  students: any[] = [];
  attendance: { [key: string]: boolean } = {};
  selectedCourseId: string = '';
  selectedDate: string = '';
  courses: any[] = [];
  showSuccessMessage: boolean = false;
  applied: boolean = false;

  constructor(private teacherApiService: TeacherApiService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    this.teacherApiService.getAssignedCourses().subscribe(
      (data) => {
        this.courses = data;
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }

  applySelection() {
    this.applied = true;
    this.loadStudents();
  }

  loadStudents() {
    if (this.selectedCourseId && this.selectedDate) {
      this.teacherApiService.getAttendance(this.selectedCourseId, this.selectedDate).subscribe(
        (data: AttendanceRecord[]) => {
          this.students = data.map((record: AttendanceRecord) => ({
            ...record.studentId,
            present: record.present
          }));

          this.attendance = data.reduce((acc: { [key: string]: boolean }, record: AttendanceRecord) => {
            acc[record.studentId._id] = record.present;
            return acc;
          }, {});
        },
        (error) => {
          console.error('Error fetching attendance:', error);
        }
      );
    }
  }

  markAttendance() {
    if (this.selectedCourseId && this.selectedDate) {
      this.teacherApiService.markAttendance(this.selectedCourseId, this.selectedDate, this.attendance).subscribe(
        () => {
          console.log('Attendance marked successfully');
          this.showSuccessMessage = true;
          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 3000);
        },
        (error) => {
          console.error('Error marking attendance:', error);
        }
      );
    }
  }
}
