import { trigger, transition, animate, style } from '@angular/animations';
import { Router } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppLabels, AppHeader, AppLink, AppButton, AppPlaceHolder } from '../../app.constants';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  greetingMessage: string = '';
  selectedFilter: string = 'bank';  // Default to "bank"
  labels = AppLabels;
  Header = AppHeader;
  Link = AppLink;
  Button = AppButton;
  PlaceHolder = AppPlaceHolder;
  dashboardData: any = {};
  employeeName: string = '';
  constructor(private http: HttpClient) {
    this.employeeName = sessionStorage.getItem('EmployeeName') || '';  // Default to 'Guest' if not found
  }

  ngOnInit(): void {
    this.setGreeting();
    Chart.register(...registerables);
    this.getDashboardCount();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.renderCharts();
    }, 0);
  }

  setGreeting(): void {
    const hour = new Date().getHours();
    const name = this.employeeName || 'Guest';
    if (hour >= 5 && hour < 12) {
      this.greetingMessage = `Good Morning, ${name}!`;
    } else if (hour >= 12 && hour < 17) {
      this.greetingMessage = `Good Afternoon, ${name}!`;
    } else if (hour >= 17 && hour < 21) {
      this.greetingMessage = `Good Evening, ${name}!`;
    } else {
      this.greetingMessage = `Good Night, ${name}!`;
    }
  }

  private dummyData(labels: string[], multiplier: number): number[] {
    return labels.map(() => Math.floor(Math.random() * 1000 * multiplier));
  }

  renderCharts(): void {
    if (this.selectedFilter === 'bank') {
      this.getCompletedChartData();
      this.getInProgressChartData();
      this.notStartedChart();
    } else if (this.selectedFilter === 'state') {
      this.getCompletedStateChartData();
      this.getInProgressStateChartData();
      this.notstarted();
    }
  }
  getCompletedChartData(): void {
    const body = { mode: 1, status: 'Completed' };
    this.http.post<any>('/api/api/webCourseMaster/GetChartDashboardData', body).subscribe({
      next: (response) => {
        if (response?.status && Array.isArray(response.data)) {
          const labels = response.data.map((item: any) => item.BankPartners);
          const data = response.data.map((item: any) => item.chartcount);
          this.renderCompletedChart(labels, data);
        }
      },
      error: (err) => {
        console.error('Error fetching completed chart data', err);
      }
    });
  }
  getInProgressChartData(): void {
    const body = { mode: 1, status: 'inProgress' };
    this.http.post<any>('/api/api/webCourseMaster/GetChartDashboardData', body).subscribe({
      next: (response) => {
        if (response?.status && Array.isArray(response.data)) {
          const labels = response.data.map((item: any) => item.BankPartners);
          const data = response.data.map((item: any) => item.chartcount);
          this.renderInProgressChart(labels, data);
        }
      },
      error: (err) => {
        console.error('Error fetching inProgress chart data', err);
      }
    });
  }
  notStartedChart(): void {
    const body = { mode: 1, status: 'Pending' };
    this.http.post<any>('/api/api/webCourseMaster/GetChartDashboardData', body).subscribe({
      next: (response) => {
        if (response?.status && Array.isArray(response.data)) {
          const labels = response.data.map((item: any) => item.BankPartners);
          const data = response.data.map((item: any) => item.chartcount);
          this.renderNotStartedChart(labels, data);
        }
      },
      error: (err) => {
        console.error('Error fetching Pending chart data', err);
      }
    });
  }

  renderCompletedChart(labels: string[], data: number[]): void {
    const ctx = (document.getElementById('completedChart') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Completed Courses',
          data: data,
          backgroundColor: 'rgba(18, 190, 190, 0.7)'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: false }
        }
      }
    });
  }
  renderInProgressChart(labels: string[], data: number[]): void {
    const ctx = (document.getElementById('inProgressChart') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'In-Progress Courses',
          data: data,
          backgroundColor: 'rgba(255, 193, 7, 0.7)' // Yellow-ish
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: false }
        }
      }
    });
  }
  renderNotStartedChart(labels: string[], data: number[]): void {
    const ctx = (document.getElementById('notStartedChart') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Pending Courses',
          data: data,
          backgroundColor: 'rgba(255, 99, 132, 0.7)' // red shade
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: false }
        }
      }
    });
  }
  getCompletedStateChartData(): void {
    const body = { mode: 2, status: 'Completed' };
    this.http.post<any>('/api/api/webCourseMaster/GetChartDashboardData', body).subscribe({
      next: (response) => {
        if (response?.status && Array.isArray(response.data)) {
          const labels = response.data.map((item: any) => item.States); // ✅ Use States
          const data = response.data.map((item: any) => item.chartcount);
          this.renderCompletedStateChart(labels, data);
        }
      },
      error: (err) => {
        console.error('Error fetching Completed State chart data', err);
      }
    });
  }
  getInProgressStateChartData(): void {
    const body = { mode: 2, status: 'inProgress' };
    this.http.post<any>('/api/api/webCourseMaster/GetChartDashboardData', body).subscribe({
      next: (response) => {
        if (response?.status && Array.isArray(response.data)) {
          const labels = response.data.map((item: any) => item.States); // Extract state names
          const data = response.data.map((item: any) => item.chartcount); // Extract chart count
          this.renderInProgressStateChart(labels, data);
        }
      },
      error: (err) => {
        console.error('Error fetching In Progress State chart data', err);
      }
    });
  }
  notstarted(): void {
    const body = { mode: 2, status: 'Pending' };
    this.http.post<any>('/api/api/webCourseMaster/GetChartDashboardData', body).subscribe({
      next: (response) => {
        if (response?.status && Array.isArray(response.data)) {
          const labels = response.data.map((item: any) => item.States); // State names
          const data = response.data.map((item: any) => item.chartcount); // Chart counts
          this.renderNotStartedStateChart(labels, data);
        }
      },
      error: (err) => {
        console.error('Error fetching Pending State chart data', err);
      }
    });
  }

  renderCompletedStateChart(labels: string[], data: number[]): void {
    const ctx = (document.getElementById('completedStateChart') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Completed Courses (State)',
          data: data,
          backgroundColor: 'rgba(60, 25, 165, 0.7)' // Teal color
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: false }
        }
      }
    });
  }
  renderInProgressStateChart(labels: string[], data: number[]): void {
    const ctx = (document.getElementById('inProgressStateChart') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'In Progress Courses (State)',
          data: data,
          backgroundColor: 'rgba(210, 9, 9, 0.7)' // Orange color
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: false }
        }
      }
    });
  }
  renderNotStartedStateChart(labels: string[], data: number[]): void {
    const ctx = (document.getElementById('notStartedStateChart') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Pending Courses (State)',
          data: data,
          backgroundColor: 'rgba(2, 97, 21, 0.7)' // Purple shade
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: false }
        }
      }
    });
  }

  onSearch(): void {
    console.log("Selected Filter:", this.selectedFilter);  // Debugging line
    this.renderCharts();
  }
  getDashboardCount(): void {
    this.http.get<any>('/api/api/webCourseMaster/GetDashboardCount').subscribe({
      next: (response) => {
        console.log('Dashboard API Response:', response); // ✅ Log the full response

        if (response?.status && response?.data?.length) {
          this.dashboardData = response.data[0];
        }
      },
      error: (err) => {
        console.error('Error fetching dashboard data', err);
      },
    });
  }


}

