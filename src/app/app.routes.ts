import { Routes } from '@angular/router';
import { LoginComponent } from './Users/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './Dashboard/dashboard/dashboard.component';
import { CoursesComponent } from './Courses/courses/courses.component';
import { AssessmentComponent } from './Assessment/assessment/assessment.component';
import { ChaptersComponent } from './Chapters/chapters/chapters.component';
import { QuestionBankComponent } from './Questions/question-bank/question-bank.component';
import { UserCreationComponent } from './User/user-creation/user-creation.component'; 
import { CourseMappingComponent } from './Mapping/course-mapping/course-mapping.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: 'layout',
    component: LayoutComponent,
    children: [
      { path: 'Dashboard/Dashboard', component: DashboardComponent },  // Modified this path
      { path: 'Courses/courses', component: CoursesComponent },  // Modified this path
      { path: 'Assessment/assessment', component: AssessmentComponent },
      { path: 'Chapters/chapters', component: ChaptersComponent },  // Modified this path
      { path: 'Questions/question-bank', component: QuestionBankComponent } , // Modified this path
      { path: 'User/user-creation', component: UserCreationComponent } ,
      { path: 'Mapping/course-mapping', component: CourseMappingComponent }  // Modified this path
      // Modified this path

      // Modified this path
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
