import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { AdminStudentComponent } from './admin-student/admin-student.component';
import { AdminTeacherComponent } from './admin-teacher/admin-teacher.component';
import { AdminCourseComponent } from './admin-course/admin-course.component';

const routes: Routes = [
    {
      path: '',
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
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
