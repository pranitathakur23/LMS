import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-progress-tracker',
  standalone: true,
  imports: [FormsModule,CommonModule], // <-- Add FormsModule here!
  templateUrl: './progress-tracker.component.html',
  styleUrls: ['./progress-tracker.component.css']
})
export class ProgressTrackerComponent {
  selectedBank: string | undefined;
  selectedState: string | undefined;
  selectedArea: string | undefined;
  selectedBranch: string | undefined;
  selectedDesignation: string | undefined;
  selectedEmployee: string | undefined;
  selectedDate: string | undefined;

  banks = ['Bank A', 'Bank B'];
  states = ['Maharashtra', 'Gujarat'];
  areas = ['Area 1', 'Area 2'];
  branches = ['Branch 1', 'Branch 2'];
  designations = ['Manager', 'Executive'];
  employees = ['John', 'Priya'];

  courses = [
    { name: 'Cyber Security Training - English', progress: 70 },
    { name: 'Cyber Security Training - Hindi', progress: 60 },
    { name: 'Induction Training - Hindi', progress: 100 },
    { name: 'Induction Training - Kannada', progress: 40 },
    { name: 'Induction Training - Malayalam', progress: 50 },
    { name: 'Induction Training - Marathi', progress: 30 },
    { name: 'Induction Training - Tamil', progress: 90 },
    { name: 'Induction Training - Telagu', progress: 20 },
    { name: 'Members Training – Hindi', progress: 65 },
    { name: 'Members Training – Marathi', progress: 75 },
    { name: 'Members Training – Gujrati', progress: 80 },
    { name: 'Members Training – Odia', progress: 55 },
    { name: 'Members Training – Assamese', progress: 35 },
    { name: 'Members Training – Kannada', progress: 45 },
    { name: 'Members Training – Tamil', progress: 25 },
    { name: 'Members Training – Malayalam', progress: 95 }
  ];
  
  getProgressBarClass(progress: number): string {
    if (progress >= 80) return 'bg-primary';
    if (progress >= 60) return 'bg-warning';
    if (progress >= 40) return 'bg-success';
    return 'bg-danger';
  }
  getGradient(progress: number): string {
    if (progress < 40) {
      return 'linear-gradient(90deg, #f85032, #e73827)'; // red-orange
    } else if (progress < 70) {
      return 'linear-gradient(90deg, #f7971e, #ffd200)'; // yellow-orange
    } else if (progress < 100) {
      return 'linear-gradient(90deg, #00c6ff, #0072ff)'; // blue
    } else {
      return 'linear-gradient(90deg, #00b09b, #96c93d)'; // green
    }
  }
  
  onSearch() {
    // Your filter logic here
    console.log("Searching with filters");
  }
}
