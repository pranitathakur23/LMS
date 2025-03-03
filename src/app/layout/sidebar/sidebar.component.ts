import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(private router: Router) {}
  isOpen = false;

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
    navigateTo(): void {
      this.router.navigate(['layout/Dashboard/Dashboard']);
    }
    navigateToReports(): void {
      this.router.navigate(['layout/Reports/reports']);
    }
    
}
