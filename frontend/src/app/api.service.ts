import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private BASE_URL = 'http://localhost:3003/api/admin';

  constructor(private http: HttpClient) { }

  private getToken(): string {
    const token = localStorage.getItem('auth_token');
    return token || '';
  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllStudents(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.BASE_URL}/user/all`, { headers: headers });
  }


  enableStudent(id: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.patch(`${this.BASE_URL}/user/enable/${id}`, {}, { headers: headers });
  }

  disableStudent(id: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.patch(`${this.BASE_URL}/user/disable/${id}`, {}, { headers: headers });
  }

  addStudent(studentData: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.BASE_URL}/user/add`, studentData, { headers: headers });
  }
}
