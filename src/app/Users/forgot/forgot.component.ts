import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import this
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-forgot',
  standalone: true,
  imports: [ FormsModule,CommonModule],
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.css'
})
export class ForgotComponent {
  showOtp = false;
  otp: string[] = ['', '', '', ''];

  showOtpFields() {
    this.showOtp = true;
  }
}
