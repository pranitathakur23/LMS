import { Component } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('fadeIn', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate('0.5s', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class DashboardComponent {
  constructor(private router: Router) {}

  navigateTo(path: string): void {
    this.router.navigate(['layout/Courses/courses']);
  }

  assessmentNavigate(path: string): void {
    this.router.navigate(['layout/Assessment/assessment']);
  }
  chapterNavigate(path: string): void {
    this.router.navigate(['layout/Chapters/chapters']);
  }
  questionpaperNavigate(path: string): void {
    this.router.navigate(['layout/Questions/question-bank']);
  }
  userNavigate(path: string): void {
    this.router.navigate(['layout/User/user-creation']);
  }
}

