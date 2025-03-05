import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [FormsModule, CommonModule,HttpClientModule],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.css'
})
export class ResetpasswordComponent {
  employeeCode: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showTooltip: boolean = false;
  showOtp: boolean = false;
  responseMessage: string = ''; // Add this at the top of your class
  @ViewChild('employeeCodeInput') employeeCodeInput!: ElementRef;
  @ViewChild('newPasswordInput') newPasswordInput!: ElementRef;
  @ViewChild('confirmPasswordInput') confirmPasswordInput!: ElementRef;
  passwordValidations = {
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false
  };

  constructor(private http: HttpClient,private router: Router) {}

  validatePassword() {
    this.passwordValidations.length = this.newPassword.length >= 8;
    this.passwordValidations.uppercase = /[A-Z]/.test(this.newPassword);
    this.passwordValidations.lowercase = /[a-z]/.test(this.newPassword);
    this.passwordValidations.number = /[0-9]/.test(this.newPassword);
    this.passwordValidations.specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(this.newPassword);
  }
  isPasswordValid(): boolean {
    return Object.values(this.passwordValidations).every(value => value);
  }

  toggleTooltip(show: boolean) {
    this.showTooltip = show;
  }

  resetPassword() {
    if (!this.employeeCode) {
      alert('Please enter employeeCode');
      setTimeout(() => this.employeeCodeInput?.nativeElement.focus(), 0);
      return;
    }
    if (!this.newPassword) {
      alert('Please enter new password.');
      setTimeout(() => this.newPasswordInput?.nativeElement.focus(), 0);
      return;
    }
    if (!this.confirmPassword) {
      alert('Please enter confirm password.');
      setTimeout(() => this.confirmPasswordInput?.nativeElement.focus(), 0);
      return;
    }
    if (!this.isPasswordValid()) {
      alert('Password Policy Does Not Match');
      setTimeout(() => this.newPasswordInput?.nativeElement.focus(), 0);
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match.');
      setTimeout(() => this.confirmPasswordInput?.nativeElement.focus(), 0);
      return;
    }

   
    const apiUrl = "/api/api/users/ChangePassword";
    const requestBody = {
      EmployeeCode: this.employeeCode,
      Password: this.newPassword
    };
  
    this.http.post<{ status: boolean; message: string }>(apiUrl, requestBody).subscribe(
      (response) => {

        if (response.status == true) {
          this.router.navigate(['/login']);
        }
        else {
          this.responseMessage = response.message;
          alert(this.responseMessage); 
        }
      }
    );
  }
  navigateToForgotPassword() {
    this.router.navigate(['/forgot']); // Adjust the path as per your routing
  }
}
