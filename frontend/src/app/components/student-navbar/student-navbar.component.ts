import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StudentApiService } from '../../student-api.service';

@Component({
  selector: 'app-student-navbar',
  templateUrl: './student-navbar.component.html',
  styleUrls: ['./student-navbar.component.scss']
})
export class StudentNavbarComponent {
  isSettingsModalActive: boolean = false;

  constructor(private router: Router, private apiService: StudentApiService) {}

  logout() {
    this.apiService.logout().subscribe({
      next: (response) => {
        console.log('Logout successful:', response);
        localStorage.removeItem('auth_token'); 
        this.router.navigateByUrl('/');
      },
      error: (error) => {
        console.error('Logout failed:', error);
        alert('Logout failed. Please try again.');
      }
    });
  }

  toggleSettings() {
    this.isSettingsModalActive = !this.isSettingsModalActive;
  }
}
