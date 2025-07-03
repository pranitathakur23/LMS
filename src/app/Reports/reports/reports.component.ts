import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppLabels, AppHeader, AppLink, AppButton, AppPlaceHolder, Apptable } from '../../app.constants';


@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, NgxPaginationModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  @ViewChild('courseSelect') courseSelect!: ElementRef;
  @ViewChild('fromDateSelect') fromDateSelect!: ElementRef;
  @ViewChild('toDateSelect') toDateSelect!: ElementRef;
  @ViewChild('bankSelect') bankSelect!: ElementRef;
  @ViewChild('departmentSelect') departmentSelect!: ElementRef;
  @ViewChild('designationSelect') designationSelect!: ElementRef;

  fromDate: string = '';
  toDate: string = '';
  bank: string = '';
  department: string = '';
  designation: string = '';
  banks: any[] = [];
  departments: any[] = [];
  designations: any[] = [];
  reportData: any[] = [];
  Math = Math;
  filteredGroupData: any[] = []; // Data to display after filtering
  searchTerm: string = ''; // Search input binding
  itemsPerPage: number = 10; // Default to 10, or use undefined if you want to trigger the placeholder
  itemsPerPageOptions: number[] = [10, 25, 50, 100]; // Options for items per page
  currentPage: number = 1; // Current page number
  sortOrder: boolean = true; // True for ascending, False for descending
  labels = AppLabels;
  Header = AppHeader;
  Link = AppLink;
  Button = AppButton;
  PlaceHolder = AppPlaceHolder;
  table = Apptable;
  courses: any[] = [];
  selectedCourseId: number | null = null;
  isLoading: boolean = false; // Loading spinner flag
  state: string = '';
  states: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchBanks();
    this.fetchDepartments();
    this.fetchCourses();
    this.fetchDesignation();
    this.fetchStates();
    const employeeCode = sessionStorage.getItem('employeeCode');
    if (employeeCode) {
      console.log('EmployeeCode:', employeeCode);
    } else {
      console.log('EmployeeCode not found in sessionStorage');
    }
  }

  fetchBanks() {
    const apiUrl = '/api/api/webCourseMaster/GetCourseDetailsforWEB';
    const requestBody = { mode: 6 };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status == true) {
          this.banks = response.data;
        } else {
          console.error(response.message);
        }
      },
      error => {
        console.error('Error fetching banks:', error);
      }
    );
  }
  fetchStates() {
    const apiUrl = '/api/api/webCourseMaster/GetCourseDetailsforWEB';
    const requestBody = { mode: 8 };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status == true) {
          this.states = response.data;
        } else {
          console.error(response.message);
        }
      },
      error => {
        console.error('Error fetching banks:', error);
      }
    );
  }

  fetchDepartments() {
    const apiUrl = '/api/api/webCourseMaster/GetCourseDetailsforWEB';
    const requestBody = { mode: 5 };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status == true) {
          this.departments = response.data;
        } else {
          console.error(response.message);
        }
      },
      error => {
        console.error('Error fetching departments:', error);
      }
    );
  }

  fetchCourses() {
    const apiUrl = '/api/api/webCourseMaster/GetDepartmentInfo';
    const requestBody = { mode: 12 };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status === true) {
          this.courses = response.data.map((course: any) => ({
            name: course.courseName,
            courseId: course.courseId
          }));
        } else {
          alert('No courses found.');
        }
      },
      (error) => {
        console.error('Error fetching courses:', error);
        alert('An error occurred while fetching courses.');
      }
    );
  }

  fetchDesignation() {
    const apiUrl = '/api/api/webCourseMaster/GetCourseDetailsforWEB';
    const requestBody = { mode: 4 };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status == true) {
          this.designations = response.data;
        } else {
        }
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }

  GetReportDetails(): void {
    const employeeCode = sessionStorage.getItem('employeeCode');
    if (!employeeCode) {
      alert('Please logged in');
      return;
    }

    if (!this.fromDate) {
      alert('Please select From Date.');
      this.fromDateSelect.nativeElement.focus();
      return;
    }

    if (!this.toDate) {
      alert('Please select To Date.');
      this.toDateSelect.nativeElement.focus();
      return;
    }

    const apiUrl = '/api/api/webCourseMaster/GetReportDetails';
    const requestBody = {
      bank: this.bank || 'All',
      stateName: this.state || 'All',
      department: this.department || 'All',
      courseID: this.selectedCourseId ||0,
      employeeGroup: this.designation || 'All',
      fromDate: this.fromDate,
      toDate: this.toDate
    };
    this.isLoading = true;
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        this.isLoading = false;
        if (response.status == true) {
          this.reportData = response.data;
          this.filteredGroupData = [...this.reportData];
        } else {
          console.error('Failed:', response.message);
        }
      },
      error => {
        this.isLoading = false;
        console.error('Error:', error);
      }
    );
  }

  filterData(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredGroupData = this.reportData.filter((item) =>
      String(item.courseName || '').toLowerCase().includes(term) ||
      String(item.employeeCode || '').toLowerCase().includes(term) ||
      String(item.employeeName || '').toLowerCase().includes(term) ||
      String(item.area || '').toLowerCase().includes(term) ||
      String(item.region || '').toLowerCase().includes(term) ||
      String(item.states || '').toLowerCase().includes(term) ||
      String(item.courseStart || '').toLowerCase().includes(term) ||
      String(item.courseExpiry || '').toLowerCase().includes(term) ||
      String(item.courseCompletedDate || '').toLowerCase().includes(term) ||
      String(item.courseStatus || '').toLowerCase().includes(term) ||
      String(item.courseProgress || '').toLowerCase().includes(term) ||
      String(item.testStatus || '').toLowerCase().includes(term) ||
      String(item.testDate || '').toLowerCase().includes(term) ||
      String(item.testTimeStamp || '').toLowerCase().includes(term) ||
      String(item.totalMarks || '').toLowerCase().includes(term) ||
      String(item.obtainedMarks || '').toLowerCase().includes(term) ||
      String(item.passingMarks || '').toLowerCase().includes(term)
    );
  }


  onPageChange(page: number): void {
    console.log("Page changed to:", page);
    this.currentPage = page;
  }
  sortData(column: string): void {
    this.sortOrder = !this.sortOrder;
    const direction = this.sortOrder ? 1 : -1;
    this.filteredGroupData.sort((a, b) => {


      return 0;
    });
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
  }

  downloadExcel(): void {
    if (this.reportData.length === 0) {
      alert('No data present in the table.');
      return;
    }

    // Convert data to worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.reportData);

    // Create a workbook and append worksheet
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Report Data': worksheet },
      SheetNames: ['Report Data']
    };

    // Convert workbook to Excel buffer
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    // Create a Blob and save the file
    const fileName = `Report_${new Date().toISOString().slice(0, 10)}.xlsx`;
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    saveAs(data, fileName);
  }


}
