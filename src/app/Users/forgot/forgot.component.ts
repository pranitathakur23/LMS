import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
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
  maskedEmail: string = '';
  @ViewChild('employeeCodeInput') employeeCodeInput!: ElementRef;
  constructor(private http: HttpClient,private router: Router,    @Inject(PLATFORM_ID) private platformId: object // Inject PLATFORM_ID
) {}

ngOnInit() {
}

  sendOtp(): any {
    if (!this.employeeCode) {
      alert('Please enter Employee ID');
      this.employeeCodeInput.nativeElement.focus();
      return;
    }
    const apiUrl = '/api/api/users/ForgotPassword';
    const requestBody = { EmployeeCode: this.employeeCode };
    this.http.post<{ status: boolean; message: string, data: any }>(apiUrl, requestBody).subscribe(
      (response) => {        
        if (response.status === true) {
          this.showOtp = true;
          const userEmail = response.data;
          this.maskedEmail = this.maskEmail(userEmail);
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
          sessionStorage.removeItem('empCode');
          sessionStorage.setItem('empCode', this.employeeCode);
          this.router.navigate(['/resetpassword']); 
        }
        else {
          this.responseMessage = response.message;
          alert(this.responseMessage);
        this.otp = ['', '', '', ''];
        setTimeout(() => {
          const otpInputs = document.querySelectorAll('.otp-field') as NodeListOf<HTMLInputElement>;
          if (otpInputs.length > 0) {
            otpInputs[0].focus();
          }
        }, 100);
        }
      }
    );
  }
  navigateToLogin() {
    this.router.navigate(['/login']); 
  }
   private maskEmail(email: string): string {
    const [name, domain] = email.split('@');
    return name.length > 1 ? name[0] + '****' + '@' + domain : email;
  }

  moveToNext(currentInput: HTMLInputElement, nextInput?: HTMLInputElement) {
    if (currentInput.value.length === 1 && nextInput) {
      nextInput.focus();
    }
  }

  moveToPrev(currentInput: HTMLInputElement, prevInput?: HTMLInputElement) {
    if (currentInput.value.length === 0 && prevInput) {
      prevInput.focus();
    }
  }
}
