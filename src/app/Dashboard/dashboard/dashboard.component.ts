import { trigger, transition, animate, style } from '@angular/animations';
import { Router } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
  export class DashboardComponent implements OnInit, AfterViewInit {
    greetingMessage: string = '';
    selectedFilter: string = 'bank';  // Default to "bank"
    
    bankLabels: string[] = [
      "Axis", "Andhra Pradesh", "DCB", "Assam", "ESFB", "Bihar", "FSFB", "Chhattisgarh",
      "IDBI", "Gujarat", "IDFC", "Haryana", "Kotak", "Karnataka", "KVB", "Kerala", "Management",
      "Madhya Pradesh", "Northern Arc", "Maharashtra", "PCH", "Odisha", "RBL", "Rajasthan",
      "Samunnati", "Tamil Nadu", "SIB", "Telangana", "SSFB", "Tripura", "USFB", "Uttar Pradesh",
      "Vivriti", "Uttarakhand", "YBL"
    ];
  
    stateLabels: string[] = [
      "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Gujarat", "Haryana",
      "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Rajasthan",
      "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand"
    ];
  
    ngOnInit(): void {
      this.setGreeting();
      Chart.register(...registerables);
    }
  
    ngAfterViewInit(): void {
      setTimeout(() => {
        this.renderCharts();
      }, 0);
    }
  
    setGreeting(): void {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        this.greetingMessage = 'Good Morning, Priti!';
      } else if (hour >= 12 && hour < 17) {
        this.greetingMessage = 'Good Afternoon, Priti!';
      } else if (hour >= 17 && hour < 21) {
        this.greetingMessage = 'Good Evening, Priti!';
      } else {
        this.greetingMessage = 'Good Night, Priti!';
      }
    }
  
    private dummyData(labels: string[], multiplier: number): number[] {
      return labels.map(() => Math.floor(Math.random() * 1000 * multiplier));
    }
  
    renderCharts(): void {
      // Depending on the selected filter, render either bank or state charts
      if (this.selectedFilter === 'bank') {
        this.renderBankCharts();
      } else if (this.selectedFilter === 'state') {
        this.renderStateCharts();
      }
    }
  
    renderBankCharts(): void {
      const chartOptions: any = {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: false }
        }
      };
  
      new Chart((document.getElementById('completedChart') as HTMLCanvasElement).getContext('2d')!, {
        type: 'bar',
        data: {
          labels: this.bankLabels,
          datasets: [{
            label: 'Completed Courses',
            data: this.dummyData(this.bankLabels, 1.5),
            backgroundColor: 'rgba(18, 190, 190, 0.7)'
          }]
        },
        options: chartOptions
      });
  
      new Chart((document.getElementById('inProgressChart') as HTMLCanvasElement).getContext('2d')!, {
        type: 'bar',
        data: {
          labels: this.bankLabels,
          datasets: [{
            label: 'In Progress Courses',
            data: this.dummyData(this.bankLabels, 1),
            backgroundColor: 'rgba(233, 173, 35, 0.7)'
          }]
        },
        options: chartOptions
      });
  
      new Chart((document.getElementById('notStartedChart') as HTMLCanvasElement).getContext('2d')!, {
        type: 'bar',
        data: {
          labels: this.bankLabels,
          datasets: [{
            label: 'Not Started Courses',
            data: this.dummyData(this.bankLabels, 0.7),
            backgroundColor: 'rgba(147, 14, 43, 0.7)'
          }]
        },
        options: chartOptions
      });
    }
  
    renderStateCharts(): void {
      const chartOptions: any = {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: false }
        }
      };
  
      new Chart((document.getElementById('completedStateChart') as HTMLCanvasElement).getContext('2d')!, {
        type: 'bar',
        data: {
          labels: this.stateLabels,
          datasets: [{
            label: 'Completed Courses (State)',
            data: this.dummyData(this.stateLabels, 1.4),
            backgroundColor: 'rgba(75, 28, 168, 0.7)'
          }]
        },
        options: chartOptions
      });
  
      new Chart((document.getElementById('inProgressStateChart') as HTMLCanvasElement).getContext('2d')!, {
        type: 'bar',
        data: {
          labels: this.stateLabels,
          datasets: [{
            label: 'In Progress Courses (State)',
            data: this.dummyData(this.stateLabels, 1),
            backgroundColor: 'rgba(162, 88, 13, 0.7)'
          }]
        },
        options: chartOptions
      });
  
      new Chart((document.getElementById('notStartedStateChart') as HTMLCanvasElement).getContext('2d')!, {
        type: 'bar',
        data: {
          labels: this.stateLabels,
          datasets: [{
            label: 'Not Started Courses (State)',
            data: this.dummyData(this.stateLabels, 0.8),
            backgroundColor: 'rgba(22, 71, 169, 0.7)'
          }]
        },
        options: chartOptions
      });
    }
  
    onSearch(): void {
      console.log("Selected Filter:", this.selectedFilter);  // Debugging line
      this.renderCharts();
    }
  
  
}

