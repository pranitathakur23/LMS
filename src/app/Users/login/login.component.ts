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
    const apiUrl = '/api/api/webusers/WebLogin';

    this.http.post(apiUrl, loginData).subscribe({
      next: (response: any) => {
        console.log('API Response:', response); // Log entire response
    
        if (response.status == true) {
    const userData = response.data[0];
          sessionStorage.setItem('EmployeeName', userData.EmployeeName);
          sessionStorage.setItem('EmployeeCode', userData.EmployeeCode);
          sessionStorage.setItem('Email', userData.Email);
          this.router.navigate(['/layout/Dashboard/Dashboard']);
        } else {
          alert(response.message || 'Invalid Employee Code or Password');
        }
      },
      error: (error) => {
        console.error('Login error', error);
        alert('An error occurred while logging in');
      }
    });
  }

  onForgot(event: Event): void {
    
    this.router.navigate(['/forgot']); // Navigate to Forgot Password page

    
  }
}
