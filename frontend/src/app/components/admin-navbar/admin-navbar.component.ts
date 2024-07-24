import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.scss']
})
export class AdminNavbarComponent {

  constructor(private router: Router, private apiService: ApiService) {}

  logout(): void {
    this.apiService.logoutUser().subscribe(() => {
      localStorage.removeItem('auth_token');  
      this.router.navigate(['/']);  
    }, error => {
      console.error('Logout failed:', error);
    });
  }
}
