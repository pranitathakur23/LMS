import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router'; // ✅ Make sure Router is imported
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [CommonModule]
})
export class SidebarComponent implements OnInit {
  pageRoles: string[] = [];
  showDashboard = false;
  showReports = false;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) {}

  isOpen = false;
  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const roleString = sessionStorage.getItem('PageRole');
      if (roleString) {
        this.pageRoles = roleString.split(',').map(role => role.trim());     
        this.showDashboard = this.pageRoles.includes('1');
        this.showReports = this.pageRoles.includes('2');
        this.cdr.detectChanges();
      } 
    }
  }
  navigateTo(): void {
    this.router.navigate(['layout/Dashboard/Dashboard']);
  }
  navigateToReports(): void {
    this.router.navigate(['layout/Reports/reports']);
  }
}
