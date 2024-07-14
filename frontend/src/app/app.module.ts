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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
