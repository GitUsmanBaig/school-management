import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminNavbarComponent } from './components/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { AdminStudentComponent } from './admin-student/admin-student.component';
import { AdminTeacherComponent } from './admin-teacher/admin-teacher.component';
import { AdminCourseComponent } from './admin-course/admin-course.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminAddStudentComponent } from './admin-add-student/admin-add-student.component';
import { AdminAddTeacherComponent } from './admin-add-teacher/admin-add-teacher.component';
import { AdminAddCourseComponent } from './admin-add-course/admin-add-course.component';
import { AdminAssignCourseComponent } from './admin-assign-course/admin-assign-course.component';


import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LandingComponent } from './landing/landing.component';
import { StudentLoginComponent } from './student-login/student-login.component';
import { StudentHomeComponent } from './student-home/student-home.component';
import { StudentSidebarComponent } from './components/student-sidebar/student-sidebar.component';
import { StudentNavbarComponent } from './components/student-navbar/student-navbar.component';
import { RegisterCourseComponent } from './register-course/register-course.component';
import { StudentMyCoursesComponent } from './student-my-courses/student-my-courses.component';
import { StudentSettingsModalComponent } from './student-settings-modal/student-settings-modal.component';
import { TeacherLoginComponent } from './teacher-login/teacher-login.component';
import { TeacherHomeComponent } from './teacher-home/teacher-home.component';
import { TeacherNavbarComponent } from './components/teacher-navbar/teacher-navbar.component';
import { TeacherSidebarComponent } from './components/teacher-sidebar/teacher-sidebar.component';
import { TeacherAssignedCourseComponent } from './teacher-assigned-course/teacher-assigned-course.component';
import { TeacherAssignedStudentsComponent } from './teacher-assigned-students/teacher-assigned-students.component';
import { AdminRequestsComponent } from './admin-requests/admin-requests.component';
import { TeacherAttendanceComponent } from './teacher-attendance/teacher-attendance.component';
import { StudentAttendanceComponent } from './student-attendance/student-attendance.component';
import { TeacherMarkingComponent } from './teacher-marking/teacher-marking.component';
import { StudentQuizComponent } from './student-quiz/student-quiz.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AdminNavbarComponent,
    AdminSidebarComponent,
    AdminStudentComponent,
    AdminTeacherComponent,
    AdminCourseComponent,
    AdminAddStudentComponent,
    AdminAddTeacherComponent,
    AdminAddCourseComponent,
    AdminAssignCourseComponent,
    LandingComponent,
    StudentLoginComponent,
    StudentHomeComponent,
    StudentSidebarComponent,
    StudentNavbarComponent,
    RegisterCourseComponent,
    StudentMyCoursesComponent,
    StudentSettingsModalComponent,
    TeacherLoginComponent,
    TeacherHomeComponent,
    TeacherNavbarComponent,
    TeacherSidebarComponent,
    TeacherAssignedCourseComponent,
    TeacherAssignedStudentsComponent,
    AdminRequestsComponent,
    TeacherAttendanceComponent,
    StudentAttendanceComponent,
    TeacherMarkingComponent,
    StudentQuizComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
