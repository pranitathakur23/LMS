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

  constructor(private router: Router) {}

  // Logout method to navigate to login page
  logout() {
    // Optional: Add any logic to clear session or user data if needed
    this.router.navigate(['/login']);  // Navigate to the login page
  }
}
