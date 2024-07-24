import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TeacherApiService } from '../../teacher-api.service';

@Component({
  selector: 'app-teacher-navbar',
  templateUrl: './teacher-navbar.component.html',
  styleUrls: ['./teacher-navbar.component.scss']
})
export class TeacherNavbarComponent {

  constructor(private router: Router, private apiService: TeacherApiService) {}

  logout() {
    this.apiService.logout().subscribe(
      () => {
        localStorage.removeItem('auth_token');
        this.router.navigateByUrl('/');
      },
      error => {
        console.error('Logout error', error);
      }
    );
  }
}
