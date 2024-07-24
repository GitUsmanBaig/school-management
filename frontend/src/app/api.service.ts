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

  getAllTeachers(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/teacher/all`, { headers: this.getHeaders() });
  }

  addTeacher(teacherData: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/teacher/add`, teacherData, { headers: this.getHeaders() });
  }

  enableTeacher(id: string): Observable<any> {
    return this.http.patch(`${this.BASE_URL}/teacher/enable/${id}`, {}, { headers: this.getHeaders() });
  }

  disableTeacher(id: string): Observable<any> {
    return this.http.patch(`${this.BASE_URL}/teacher/disable/${id}`, {}, { headers: this.getHeaders() });
  }

  logoutUser(): Observable<any> {
    return this.http.post(`${this.BASE_URL}/logout`, {});  
  }


  getAllCourses(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.BASE_URL}/course/all`, { headers: headers });
  }

  addCourse(courseData: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.BASE_URL}/course/add`, courseData, { headers: headers });
  }

  deleteCourse(id: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.BASE_URL}/course/delete/${id}`, {}, { headers: headers });
  }

  assignCourse(courseId: string, teacherIds: string[]): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.BASE_URL}/course/assign/${courseId}`, { teacherIds }, { headers: headers });
  }

  getPendingAdmins(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/pending`, { headers: this.getHeaders() });
  }

  approveAdmin(id: string): Observable<any> {
    return this.http.patch(`${this.BASE_URL}/approve/${id}`, {}, { headers: this.getHeaders() });
  }
}
