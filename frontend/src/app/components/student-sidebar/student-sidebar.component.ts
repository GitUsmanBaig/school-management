import { Component, OnInit } from '@angular/core';
import { StudentApiService } from '../../student-api.service';

@Component({
  selector: 'app-student-sidebar',
  templateUrl: './student-sidebar.component.html',
  styleUrls: ['./student-sidebar.component.scss']
})
export class StudentSidebarComponent implements OnInit {
  unreadCount: number = 0;

  constructor(private studentApiService: StudentApiService) {}

  ngOnInit(): void {
  }

}
