import { Component, OnInit } from '@angular/core';
import { TeacherApiService } from '../teacher-api.service';

interface Student {
  _id: string;
  name: string;
  email?: string;  
}

interface QuizMark {
  studentId: {
    _id: string;
    name: string;
  };
  quiz1: number;
  quiz2: number;
}

interface MappedStudent extends Student {
  quiz1: number;
  quiz2: number;
}

@Component({
  selector: 'app-teacher-marking',
  templateUrl: './teacher-marking.component.html',
  styleUrls: ['./teacher-marking.component.scss']
})
export class TeacherMarkingComponent implements OnInit {
  courses: any[] = [];  
  students: MappedStudent[] = [];
  selectedCourseId: string = '';
  filter: string = '';

  constructor(private teacherService: TeacherApiService) { }

  ngOnInit(): void {
    this.teacherService.getAssignedCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
      },
      error: (error) => console.error('Error fetching courses:', error)
    });
  }

  fetchEnrolledStudents(): void {
    if (this.selectedCourseId) {
      this.teacherService.getAllStudents(this.selectedCourseId).subscribe({
        next: (students: Student[]) => {
          this.teacherService.getStudentMarks(this.selectedCourseId).subscribe({
            next: (marks: QuizMark[]) => {
              this.students = students.map((student: Student) => {
                const studentMarks = marks.find((mark: QuizMark) => mark.studentId._id === student._id);
                return {
                  ...student,
                  quiz1: studentMarks ? studentMarks.quiz1 : 0,
                  quiz2: studentMarks ? studentMarks.quiz2 : 0
                } as MappedStudent;
              });
            },
            error: (error) => {
              if (error.status === 404 || error.status === 204) { 
                console.warn('No quiz marks found for this course, initializing with defaults.');
                this.students = students.map((student: Student) => ({
                  ...student,
                  quiz1: 0,
                  quiz2: 0
                }));
              } else {
                console.error('Error fetching quiz marks:', error);
              }
            }
          });
        },
        error: (error) => {
          console.error('Error fetching students:', error);
          alert('Failed to fetch students. Please try again.');
        }
      });
    }
  }

  addAllMarks() {
    this.students.forEach(student => {
      const marksData = {
        courseId: this.selectedCourseId,
        studentId: student._id,
        quiz1: student.quiz1,
        quiz2: student.quiz2
      };
      this.teacherService.addOrUpdateMarks(marksData).subscribe({
        next: (response) => {
          console.log(`Marks updated for student ${student._id}:`, response);
        },
        error: (error) => {
          console.error(`Error updating marks for student ${student._id}:`, error);
        }
      });
    });
    alert('All marks update process initiated. Check console for details.');
  }
}
