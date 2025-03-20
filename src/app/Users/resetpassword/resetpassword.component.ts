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
  showNewPasswordTooltip: boolean = false;
  showConfirmPasswordTooltip: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  responseMessage: string = '';
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

  constructor(private http: HttpClient,private router: Router) 
  { 
    const storedEmployeeCode = sessionStorage.getItem('employeeCode');
    if (storedEmployeeCode) {
      this.employeeCode = storedEmployeeCode;
    } 
  }

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

  toggleTooltip(field: string, show: boolean) {
    if (field === 'new') {
      this.showNewPasswordTooltip = show;
    } else if (field === 'confirm') {
      this.showConfirmPasswordTooltip = show;
    }
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  // Toggle Confirm Password Visibility
  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
   togglePasswordVisibility(field: string) {
    if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
  resetPassword() {
    // Step 1: Check if a new password is entered
    if (!this.newPassword) {
      alert('Please enter a new password.');
      setTimeout(() => this.newPasswordInput?.nativeElement.focus(), 0);
      return;
    }
  
    // Step 2: Check if confirm password is entered
    if (!this.confirmPassword) {
      alert('Please enter confirm password.');
      setTimeout(() => this.confirmPasswordInput?.nativeElement.focus(), 0);
      return;
    }
  
    // Step 3: Check if passwords match
    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match.');
      setTimeout(() => this.confirmPasswordInput?.nativeElement.focus(), 0);
      return;
    }
  
    // Step 4: Validate password policy
    this.validatePassword(); // Update the validation status
  
    if (!this.isPasswordValid()) {
      alert('Password does not meet the required policy.')
            
      setTimeout(() => this.newPasswordInput?.nativeElement.focus(), 0);
      return;
    }
  
    const empCode = sessionStorage.getItem('empCode');
    // Step 5: Send the password reset request
    const apiUrl = "/api/api/users/ChangePassword";
    const requestBody = {
      EmployeeCode: empCode, // Pass EmployeeCode from sessionStorage
      Password: this.newPassword
    };
    this.http.post<{ status: boolean; message: string }>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status) {
          this.router.navigate(['/login']);
        } else {
          this.responseMessage = response.message;
          alert(this.responseMessage);
        }
      },
      (error) => {
        console.error('Error resetting password:', error);
        alert('An error occurred while resetting the password.');
      }
    );
  }
  
  navigateToForgotPassword() {
    this.router.navigate(['/forgot']); // Adjust the path as per your routing
  }
}
