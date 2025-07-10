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
import { QuestionsComponent } from './Questions/questions/questions.component';
import { ForgotComponent } from './Users/forgot/forgot.component';
import { ReportsComponent } from './Reports/reports/reports.component';
import { ResetpasswordComponent } from './Users/resetpassword/resetpassword.component';
import { ProgressTrackerComponent } from './ProgressTracker/progress-tracker/progress-tracker.component';
import { AddQuestionComponent } from './question-bank/add-question/add-question.component';
import { FieldTrainingAssignmentComponent } from './AssignFieldTraining/field-training-assignment/field-training-assignment.component';
import { EvidenceCollectionComponent } from './AssignFieldTraining/evidence-collection/evidence-collection.component';
import { MainCourseComponent } from './Courses/main-course/main-course.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'forgot', component: ForgotComponent },
  { path: 'resetpassword', component: ResetpasswordComponent },
  {
    path: 'layout', 
    component: LayoutComponent,
    children: [
      { path: 'Dashboard/Dashboard', component: DashboardComponent },
      { path: 'Reports/reports', component: ReportsComponent },
   { path: 'Courses/courses/:id', component: CoursesComponent }, // ✅ receives CourseID
      { path: 'Courses/main-course', component: MainCourseComponent }, // ✅ no param here
      { path: 'Assessment/assessment', component: AssessmentComponent },
      { path: 'Chapters/chapters', component: ChaptersComponent },
      { path: 'Questions/question-bank', component: QuestionBankComponent },
      { path: 'Questions/add-question', component: AddQuestionComponent },
      { path: 'User/user-creation', component: UserCreationComponent },
      { path: 'Mapping/course-mapping', component: CourseMappingComponent },
      { path: 'Questions/questions', component: QuestionsComponent },
      { path: 'ProgressTracker/progress-tracker', component: ProgressTrackerComponent },
      { path: 'AssignFieldTraining/field-training-assignment', component: FieldTrainingAssignmentComponent },
      { path: 'AssignFieldTraining/evidence-collection', component: EvidenceCollectionComponent }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
