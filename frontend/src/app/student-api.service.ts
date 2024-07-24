import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentApiService {
  private BASE_URL = 'http://localhost:3003/api/users';

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

  logout(): Observable<any> {
    return this.http.post(`${this.BASE_URL}/logout`, {}, { headers: this.getHeaders() });
  }

  getAllCourses(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/courses/all`, { headers: this.getHeaders() });
  }

  getCourseById(courseId: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/courses/${courseId}`, { headers: this.getHeaders() });
  }

  enrollCourse(courseId: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}/courses/enroll/${courseId}`, {}, { headers: this.getHeaders() });
  }

  unenrollCourse(courseId: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/courses/unenroll/${courseId}`, { headers: this.getHeaders() });
  }

  getEnrolledCourses(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/courses/enroll/all`, { headers: this.getHeaders() });
  }

  updateProfile(profileData: any): Observable<any> {
    return this.http.patch(`${this.BASE_URL}/update`, profileData, { headers: this.getHeaders() });
  }

  getUserInfo(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/user-info`, { headers: this.getHeaders() });
  }

  checkPassword(currentPassword: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}/check-password`, { currentPassword }, { headers: this.getHeaders() });
  }
  getAttendance(courseId: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/attendance/${courseId}`, { headers: this.getHeaders() });
  }
  getQuizScores(courseId: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/quiz-scores/${courseId}`, { headers: this.getHeaders() });
  }

}
