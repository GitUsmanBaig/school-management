import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.scss']
})
export class StudentHomeComponent implements OnInit {
  studentName: string = '';

  ngOnInit(): void {
    this.studentName = localStorage.getItem('studentName') || 'Student';
  }
}
