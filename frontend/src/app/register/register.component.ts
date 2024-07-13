import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  name: string = '';
  email: string = '';
  password: string = '';
  CNIC: string = '';
  contact: string = '';

  constructor(private http: HttpClient, private router: Router) { }  // Added Router here

  register() {
    let bodyData = {
      "name": this.name,
      "email": this.email,
      "password": this.password,
      "CNIC": this.CNIC,
      "contact": this.contact
    };

    this.http.post("http://localhost:3003/api/admin/signup", bodyData).subscribe(
      (resultData: any) => {
        console.log(resultData);
        alert("Admin registered successfully");
        this.router.navigate(['/']);  // Redirect after successful registration
      },
      (error) => {
        console.error("There was an error!", error);
        alert("Failed to register");
      }
    );
  }

  save() {
    this.register();
  }

  goToLogin() {
    this.router.navigate(['/']);
  }
}
