import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // <-- Import FormsModule for ngModel

@Component({
  selector: 'app-login',
  imports: [HttpClientModule, FormsModule],  // <-- Include FormsModule here
  templateUrl: './login.component.html',
  standalone: true,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  employeeCode: string = '';
  password: string = '';
  @ViewChild('employeeCodeInput') employeeCodeInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;

  constructor(private http: HttpClient, private router: Router) { }

  // This method is triggered when the login button is clicked
  onLogin(event: Event): void {
    // Prevent form from submitting
    event.preventDefault();

    const x = this.employeeCode;
    if (x === '') {
      alert('Enter Employee Code');
      this.employeeCodeInput.nativeElement.focus();
      return; // Stop further execution
    }

    const y = this.password;
    if (y === '') {
      alert('Enter Password');
      this.passwordInput.nativeElement.focus();
      return; // Stop further execution
    }

    const loginData = {
      EmployeeCode: this.employeeCode,
      Password: this.password
    };
    // Log the login data to the console
    const apiUrl = '/api/webusers/WebLogin';

    this.http.post(apiUrl, loginData).subscribe({
      next: (response: any) => {
        console.log(JSON.stringify(response.data[0]))
        if (response.status==true) {
          sessionStorage.setItem('employeeCode', this.employeeCode); // Store only EmployeeCode
          // Assuming response contains the necessary user info
          localStorage.setItem('user', JSON.stringify(response.data[0])); // Store user info in localStorage
           this.router.navigate(['/layout/Dashboard/Dashboard']);  // Navigate to Dashboard
        } else {
          alert(response.message);
        }
      },
      error: (error) => {
        console.error('Login error', error);
        alert('An error occurred while logging in');
      }
    });
  }
}
