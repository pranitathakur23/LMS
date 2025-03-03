import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, HttpClientModule,FormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
    @ViewChild('fromDateSelect') fromDateSelect!: ElementRef;
    @ViewChild('toDateSelect') toDateSelect!: ElementRef;
    @ViewChild('departmentSelect') departmentSelect!: ElementRef;
    @ViewChild('designationSelect') designationSelect!: ElementRef;

  fromDate: string = '';
  toDate: string = '';
  department: string = '';
  designation: string = '';
  departments: any[] = [];
  designations: any[] = []; 
  reportData: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchDepartments();
    this.fetchDesignation();
    const employeeCode = sessionStorage.getItem('employeeCode');
    if (employeeCode) {
      console.log('EmployeeCode:', employeeCode);
    } else {
      console.log('EmployeeCode not found in sessionStorage');
    }
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

    if (!this.department) {
      alert('Please select Department.');
      this.departmentSelect.nativeElement.focus();
      return;
    }

    if (!this.designation) {
      alert('Please select Employee Group.');
      this.designationSelect.nativeElement.focus();
      return;
    }

    const apiUrl = '/api/api/webCourseMaster/GetReportDetails';
    const requestBody = {
      department: this.department,
      employeeGroup: this.designation,
      fromDate: this.fromDate,
      toDate: this.toDate
    };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status == true) {
          this.reportData = response.data;
        } else {
          console.error('Failed:', response.message);
        }
      },
      error => {
        console.error('Error:', error);
      }
    );
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
