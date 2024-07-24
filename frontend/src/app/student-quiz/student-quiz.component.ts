import { Component, OnInit } from '@angular/core';
import { StudentApiService } from '../student-api.service';

@Component({
  selector: 'app-student-quiz',
  templateUrl: './student-quiz.component.html',
  styleUrls: ['./student-quiz.component.scss']
})
export class StudentQuizComponent implements OnInit {
  courses: any[] = [];
  selectedCourse: string = '';
  quizScores: any = null;

  constructor(private studentService: StudentApiService) { }

  ngOnInit() {
    this.fetchEnrolledCourses();
  }

  fetchEnrolledCourses() {
    this.studentService.getEnrolledCourses().subscribe(courses => {
      this.courses = courses;
    });
  }

  viewQuizScores() {
    if (this.selectedCourse) {
      this.studentService.getQuizScores(this.selectedCourse).subscribe(response => {
        this.quizScores = response;
      }, error => {
        this.quizScores = { message: 'No quiz scores available' };
      });
    }
  }
}
