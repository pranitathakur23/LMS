import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject, OnInit, ChangeDetectorRef } from '@angular/core';

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
  pageRoles: string[] = [];
  showDashboard = false;
  showReports = false;
  Master= false;
  Courses= false;
  Chapters= false;
  Manage_Users= false;
  Assessment= false;
  Question_Bank= false;
  Progress_Tracker= false;
isTrainingMenuOpen: boolean = false;
  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const roleString = sessionStorage.getItem('PageRole');
      if (roleString) {
        this.pageRoles = roleString.split(',').map(role => role.trim());     
        this.showDashboard = this.pageRoles.includes('1');
        this.showReports = this.pageRoles.includes('2');

        this.Master = this.pageRoles.includes('3');
        this.Courses = this.pageRoles.includes('4'); 
        this.Chapters = this.pageRoles.includes('5');
        this.Manage_Users = this.pageRoles.includes('6');
        this.Assessment = this.pageRoles.includes('7');
        this.Question_Bank = this.pageRoles.includes('8');
        this.Progress_Tracker = this.pageRoles.includes('9');


        this.cdr.detectChanges();
      } 
    }
  }
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
  navigateToprogress(): void {
    this.router.navigate(['layout/ProgressTracker/progress-tracker']);
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

toggleTrainingMenu() {
  this.isTrainingMenuOpen = !this.isTrainingMenuOpen;
}

navigateToTraineeEvidenceCollection() {
  this.router.navigate(['field-training/trainee-evidence']);
}

navigateToFieldTrainingAssignment(): void {
  this.router.navigate(['layout/AssignFieldTraining/field-training-assignment']);
}
}
