import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  login() {
    const bodyData = {
      email: this.email,
      password: this.password,
    };

    // Change responseType to 'json' since you expect a JSON response that includes a token
    this.http.post<any>("http://localhost:3003/api/admin/login", bodyData).subscribe(
      (resultData) => {
        console.log("Response Data:", resultData);

        if (resultData.message && resultData.token) {
          console.log("Login successful, navigating to home.");
          localStorage.setItem('auth_token', resultData.token); // Store the token in localStorage
          this.router.navigateByUrl('/home');
        } else {
          console.log("Login failed with message: ", resultData.message);
          alert("Incorrect Email or Password");
        }
      },
      (error) => {
        console.error("Error during login", error);
        alert("Login failed due to an error");
      }
    );
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }
}
