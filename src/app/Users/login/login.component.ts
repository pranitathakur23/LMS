import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // <-- Import FormsModule for ngModel
import { AppLabels, AppHeader, AppLink , AppButton, AppPlaceHolder} from '../../app.constants';


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
  private captchaCode: string = '';
  labels = AppLabels;
  Header = AppHeader;
  Link = AppLink;
  Button = AppButton;
  PlaceHolder = AppPlaceHolder;

  constructor(private http: HttpClient, private router: Router) { }
  ngOnInit(): void {
    this.createCaptcha();
  }
  createCaptcha(): void {
    // Clear the contents of the captcha div first
    document.getElementById('captcha')!.innerHTML = '';

    const charsArray = '23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ@@#$';
    const lengthOtp = 5; // Ensuring CAPTCHA length is 5
    const captcha = [];

    while (captcha.length < lengthOtp) {
      const index = Math.floor(Math.random() * charsArray.length); // Get the next character from the array
      if (captcha.indexOf(charsArray[index]) === -1) {
        captcha.push(charsArray[index]);
      }
    }

    const canv = document.createElement('canvas');
    canv.id = 'captcha';
    canv.width = 100;
    canv.height = 50;
    const ctx = canv.getContext('2d');
    if (ctx) {
      ctx.font = '25px Georgia';
      ctx.strokeText(captcha.join(''), 0, 30);
    }
    this.captchaCode = captcha.join('');
    document.getElementById('captcha')!.appendChild(canv);
  }

  validateCaptcha(): boolean {
    const enteredCaptcha = (document.getElementById('cpatchaTextBox') as HTMLInputElement).value;
    return enteredCaptcha === this.captchaCode;
  }
  @ViewChild('employeeCodeInput') employeeCodeInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;
  @ViewChild('captchaCodeInput') captchaCodeInput!: ElementRef;


  // This method is triggered when the login button is clicked
  onLogin(event: Event): void {
    event.preventDefault();

    if (this.employeeCode === '') {
      alert('Enter Employee Code');
      this.employeeCodeInput.nativeElement.focus();
      return;
    }

    if (this.password === '') {
      alert('Enter Password');
      this.passwordInput.nativeElement.focus();
      return;
    }

    const enteredCaptcha = (document.getElementById('cpatchaTextBox') as HTMLInputElement).value;
    if (enteredCaptcha == '') {
      alert('Please enter CAPTCHA');
      this.captchaCodeInput.nativeElement.focus();
      return;
    }

    if (!this.validateCaptcha()) {
      alert('Invalid CAPTCHA. Please try again.');
      (document.getElementById('cpatchaTextBox') as HTMLInputElement).value = "";
      this.captchaCodeInput.nativeElement.focus();
      this.createCaptcha();
      return;
    }

    const loginData = {
      EmployeeCode: this.employeeCode,
      Password: this.password
    };

    const apiUrl = '/api/api/webusers/WebLogin';

    this.http.post(apiUrl, loginData).subscribe({
      next: (response: any) => {
        console.log('API Response:', response); // Log entire response
        if (response.status == true) {
          const userData = response.data[0];
          if (userData.Password === "VGVzdEAxMjM=") {
            this.router.navigate(['/forgot']);

          } else {
            sessionStorage.setItem('EmployeeName', userData.EmployeeName);
            sessionStorage.setItem('employeeCode', userData.EmployeeCode);
            sessionStorage.setItem('Email', userData.Email);
            sessionStorage.setItem('PageRole', userData.PageRole);
            console.log("Redirecting to Dashboard"); // Log before redirection
            this.router.navigate(['/layout/Dashboard/Dashboard']);
          } 
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
