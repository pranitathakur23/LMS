import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [CommonModule]
})
export class SidebarComponent {
  @Input() isOpen = true; // Only one declaration
  @Output() sidebarToggle = new EventEmitter<boolean>();

  isMasterOpen = false;
  hoveringSidebar = false;
  hoverTimeout: any = null;

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
    this.sidebarToggle.emit(this.isOpen);
  }

  closeSidebar(): void {
    this.isOpen = false;
    this.isMasterOpen = false;
    this.sidebarToggle.emit(this.isOpen);
  }

  toggleMasterDropdown(): void {
    this.isMasterOpen = !this.isMasterOpen;
  }

  navigateTo(path?: string): void {
    if (path) {
      this.router.navigate([`layout/${path}/${path.toLowerCase()}`]);
    } else {
      this.router.navigate(['layout/Dashboard/Dashboard']);
    }
  }

  navigateToReports(): void {
    this.router.navigate(['layout/Reports/reports']);
  }
  navigateToCourses(path: string): void {
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
