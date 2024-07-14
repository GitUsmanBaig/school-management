// src/app/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private BASE_URL = 'http://localhost:3003/api/admin';

  constructor(private http: HttpClient) { }


  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}/login`, {email, password}).pipe(
      tap((res: any) => {
        localStorage.setItem('auth_token', res.token);  
        console.log('Token saved to localStorage:', res.token);
      })
    );
  }
  

  getAllStudents(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.get(`${this.BASE_URL}/user/all`, { headers: headers });
  }

  private getToken(): string {
    const token = localStorage.getItem('auth_token');
    console.log("Token from localStorage:", token); 
    return token || '';
  }
}
