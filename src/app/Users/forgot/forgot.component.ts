import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot',
  standalone: true,
  imports: [ FormsModule, CommonModule, HttpClientModule ],
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.css'
})
export class ForgotComponent {
  showOtp = false;
  otp: string[] = ['', '', '', ''];
  employeeCode: string = '';
  responseMessage: string = '';
  @ViewChild('employeeCodeInput') employeeCodeInput!: ElementRef;
  constructor(private http: HttpClient,private router: Router) {}
  sendOtp(): any {
    const empcode = this.employeeCode;
    if (!empcode) { 
      alert('Please enter Employee ID');
            if (this.employeeCodeInput) {
        setTimeout(() => {
          this.employeeCodeInput.nativeElement.focus();
        });
      }
      return;
    }
    const apiUrl = '/api/api/users/ForgotPassword';
    const requestBody = { EmployeeCode: empcode };
    this.http.post<{ status: boolean; message: string }>(apiUrl, requestBody).subscribe(
      (response) => {        
        if (response.status == true) {
          this.showOtp = true;
        } else {
          this.responseMessage = response.message;
          alert(this.responseMessage);
        }
      }
    );
  }
  
  verifyOtp() {
    if (this.otp.some(digit => digit === '')) {
      this.responseMessage = 'Please enter complete OTP';
      alert(this.responseMessage);
      return;
    }
    const apiUrl = '/api/api/users/VerifyOTP';
    const requestBody = {
      EmployeeCode: this.employeeCode,
      otp: this.otp.join('')
    };
    this.http.post<{ status: boolean; message: string }>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status == true) {
          this.router.navigate(['/resetpassword']); 
        }
      }
    );
  }
  navigateToLogin() {
    this.router.navigate(['/login']); 
  }
}
