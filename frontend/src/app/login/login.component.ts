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

    this.http.post("http://localhost:3003/api/admin/login", bodyData, { responseType: 'text' }).subscribe(
      (resultData: string) => {
        console.log("Response Data:", resultData);

        if (resultData.includes("Login successful")) {
          console.log("Login successful, navigating to home.");
          this.router.navigateByUrl('/home');
        } else {
          console.log("Login failed with message: ", resultData);
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
