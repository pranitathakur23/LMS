import { Component } from '@angular/core';
import { Router } from '@angular/router';  // Import Router

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']  // Corrected typo: should be styleUrls not styleUrl
})
export class HeaderComponent {
  employeeName: string = '';  // Variable to hold EmployeeName

  constructor(private router: Router) {
    this.employeeName = sessionStorage.getItem('EmployeeName') || '';  // Default to 'Guest' if not found

  }

  // Logout method to navigate to login page
  logout() {
    // Optional: Add any logic to clear session or user data if needed
    this.router.navigate(['/login']);  // Navigate to the login page
  }
}
