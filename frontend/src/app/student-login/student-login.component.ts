import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-login',
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.scss']
})
export class StudentLoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  login() {
    const bodyData = {
      email: this.email,
      password: this.password,
    };

    this.http.post<any>("http://localhost:3003/api/users/login", bodyData).subscribe(
      (resultData) => {
        console.log("Response Data:", resultData);

        if (resultData.token) {
          console.log("Login successful, navigating to home.");
          localStorage.setItem('auth_token', resultData.token); // Store the token in localStorage
          this.router.navigateByUrl('/student-home');
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

}
