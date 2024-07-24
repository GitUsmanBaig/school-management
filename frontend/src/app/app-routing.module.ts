import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { AdminStudentComponent } from './admin-student/admin-student.component';
import { AdminTeacherComponent } from './admin-teacher/admin-teacher.component';
import { AdminCourseComponent } from './admin-course/admin-course.component';
import { LandingComponent } from './landing/landing.component';
import { StudentLoginComponent } from './student-login/student-login.component';
import { StudentHomeComponent } from './student-home/student-home.component';
import { RegisterCourseComponent } from './register-course/register-course.component';
import { StudentMyCoursesComponent } from './student-my-courses/student-my-courses.component';
import { TeacherLoginComponent } from './teacher-login/teacher-login.component';
import { TeacherHomeComponent } from './teacher-home/teacher-home.component';
import { TeacherAssignedCourseComponent } from './teacher-assigned-course/teacher-assigned-course.component';
import { AdminRequestsComponent } from './admin-requests/admin-requests.component';
import { TeacherAttendanceComponent } from './teacher-attendance/teacher-attendance.component';
import { StudentAttendanceComponent } from './student-attendance/student-attendance.component';
import { TeacherMarkingComponent } from './teacher-marking/teacher-marking.component';
import { StudentQuizComponent } from './student-quiz/student-quiz.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent

  },
  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'home',
    component: HomeComponent,

  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'admin-student',
    component: AdminStudentComponent,
  },
  {
    path: 'admin-teacher',
    component: AdminTeacherComponent,
  },
  {
    path: 'admin-course',
    component: AdminCourseComponent,
  },
  {
    path: 'student-login',
    component:StudentLoginComponent,
  },
  {
    path:'student-home',
    component:StudentHomeComponent,
  },
  {
    path:'register-course',
    component:RegisterCourseComponent,
  },
  {
    path:'my-courses',
    component:StudentMyCoursesComponent,
  },
  {
    path:'teacher-login',
    component:TeacherLoginComponent,
  },
  {
    path: 'teacher-home',
    component: TeacherHomeComponent,
  },
  {
    path: 'teacher-assigned-course',
    component: TeacherAssignedCourseComponent,
  },
  {
    path: 'admin-requests',
    component: AdminRequestsComponent,
  },
  {
    path:'teacher-attendance',
    component:TeacherAttendanceComponent,
  },
  {
    path: 'student-attendance',
    component: StudentAttendanceComponent,
  },
  {
    path: 'teacher-marking',
    component: TeacherMarkingComponent,
  },
  {
    path: 'student-quiz',
    component: StudentQuizComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
