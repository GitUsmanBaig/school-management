import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherApiService {
  private BASE_URL = 'http://localhost:3003/api/teachers';

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

  getAssignedCourses(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/courses/assigned/all`, { headers: this.getHeaders() });
  }

  getAllStudents(courseId: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.BASE_URL}/students/all/${courseId}`, { headers: headers });
  }

  getAttendance(courseId: string, date: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/get-attendance`, { headers: this.getHeaders(), params: { courseId, date } });
  }

  markAttendance(courseId: string, date: string, attendance: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/mark-attendance`, { courseId, date, attendance }, { headers: this.getHeaders() });
  }

  getQuizScores(courseId: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/quiz-scores/${courseId}`, { headers: this.getHeaders() });
  }

  markQuiz(courseId: string, studentId: string, quiz1: number, quiz2: number): Observable<any> {
    return this.http.post(`${this.BASE_URL}/mark-quiz`, { courseId, studentId, quiz1, quiz2 }, { headers: this.getHeaders() });
  } 

  addOrUpdateMarks(marksData: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/mark-quiz`, marksData, { headers: this.getHeaders() });
  }

  getStudentMarks(courseId: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/student-marks/${courseId}`, { headers: this.getHeaders() });
  }
}
