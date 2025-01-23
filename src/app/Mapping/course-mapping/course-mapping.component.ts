import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

interface Bank {
  BankPartners: string;
}
interface Employee {
  EmployeeCode: string;
  EmployeeName: string;
  BankPartners: string;
  States: string;
  Area: string;
  Branches: string;
  Designation: string;
  Dateofjoining: string;
  selected: boolean;
}
@Component({
  selector: 'app-course-mapping',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './course-mapping.component.html',
  styleUrls: ['./course-mapping.component.css'],
})
export class CourseMappingComponent implements OnInit {
  @ViewChild('allocateFromSelect') allocateFromSelect!: ElementRef;
  @ViewChild('allocateToSelect') allocateToSelect!: ElementRef;
  courseId: number | null = null;

  formData = {
    bank: '',
    state: '',
    area: '',
    branch: '',
    designation: '',
    date: '',
  };

  allocateFormData = {
    allocateFrom: '',
    allocateTo: '',
    fromBank: '',
    fromState: '',
    fromArea: '',
    fromBranch: '',
  };

  isModalOpen: boolean = false;
  banks: Bank[] = [];
  states: string[] = [];
  areas: string[] = [];
  branches: string[] = [];
  designations: string[] = [];
  employees: Employee[] = [];
  selectAll = false;
  constructor(private http: HttpClient,private route: ActivatedRoute,) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.courseId = +params['courseId'];
      if (!this.courseId) {
        alert('No courseId provided.');
      }
    });
    this.fetchBanks();
    this.fetchStates();
    this.fetchAreas();
    this.fetchBranches();
    this.fetchDesignations();
    this.submitForm();
  }

  fetchBanks() {
    const apiUrl = '/api/webCourseMaster/GetDepartmentInfo';
    const requestBody = { mode: 7 };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status == true) {
          this.banks = response.data.map((item: { BankPartners: string }) => item.BankPartners);
          console.log('Mapped Banks:', this.banks);
        } else {
          console.log('Failed to fetch banks, response status is not true');
        }
      },
      (error) => {
        console.error('Error fetching banks:', error);
      }
    );
  }

  fetchStates() {
    const apiUrl = '/api/webCourseMaster/GetDepartmentInfo';
    const requestBody = { mode: 8 };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status == true) {
          this.states = response.data.map((item: { States: string }) => item.States);
          console.log('Mapped States:', this.states);
        }
      },
      (error) => {
        console.error('Error fetching states:', error);
      }
    );
  }

  fetchAreas() {
    const apiUrl = '/api/webCourseMaster/GetDepartmentInfo';
    const requestBody = { mode: 9 };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status == true) {
          this.areas = response.data.map((item: { Area: string }) => item.Area);
          console.log('Mapped Areas:', this.areas);
        }
      },
      (error) => {
        console.error('Error fetching areas:', error);
      }
    );
  }

  fetchBranches() {
    const apiUrl = '/api/webCourseMaster/GetDepartmentInfo';
    const requestBody = { mode: 10 };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status == true) {
          this.branches = response.data.map((item: { Branches: string }) => item.Branches);
          console.log('Mapped Branches:', this.branches);
        }
      },
      (error) => {
        console.error('Error fetching branches:', error);
      }
    );
  }

  fetchDesignations() {
    const apiUrl = '/api/webCourseMaster/GetDepartmentInfo';
    const requestBody = { mode: 11 };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status == true) {
          this.designations = response.data.map((item: { Designation: string }) => item.Designation);
          console.log('Mapped Designations:', this.designations);
        }
      },
      (error) => {
        console.error('Error fetching designations:', error);
      }
    );
  }

  submitForm() {
    const params = {
      BankPartners: this.formData.bank || 'AB',
      States: this.formData.state || 'AB',
      Area: this.formData.area || 'AB',
      Branches: this.formData.branch || 'AB',
      Designation: this.formData.designation || 'AB',
      doj: this.formData.date || '',
    };
    this.http.post<any>('/api/webCourseMaster/GetAllUserData', params).subscribe(
      (response) => {
        if (response.status && response.data.length > 0) {
          this.employees = response.data.map((employee: any) => ({
            ...employee,
            selected: false,
          }));
        } else {
          console.log('No employees found');
          this.employees = [];
        }
      },
      (error) => {
        console.error('API error:', error);
        this.employees = [];
      }
    );
  }

  toggleSelectAll() {
    this.selectAll = !this.selectAll;
    this.employees.forEach((employee) => {
      employee.selected = this.selectAll;
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  SaveandUpdateUserDetails(): void {
    if (!this.courseId) {
      alert('Course ID is not available.');
      return;
    }

    if (!this.allocateFormData.allocateFrom) {
      alert('Please enter allocateFrom.');
      this.allocateFromSelect.nativeElement.focus();
      return;
    }

    if (!this.allocateFormData.allocateTo) {
      alert('Please enter allocateTo.');
      this.allocateToSelect.nativeElement.focus();
      return;
    }

    const checkedEmployees = this.employees
      .filter(employee => employee.selected)
      .map(employee => employee.EmployeeCode);

    if (checkedEmployees.length == 0) {
      alert('Please select at least one employee.');
      return;
    }
    const apiUrl = '/api/webCourseMaster/SaveCourseAllocationData';
    const requestBody = {
      courseId: this.courseId,
      allocateFrom: this.allocateFormData.allocateFrom,
      allocateTo: this.allocateFormData.allocateTo,
      EmployeeCodes: checkedEmployees,
    };

    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status === true) {
          this.submitForm();
          alert('Course allocated successfully.');
          this.closeModal();
        } else {
          alert('Failed to allocate course details.');
        }
      },
      error => {
        console.error('Error allocating course details:', error);
        alert('An error occurred while allocating course.');
      }
    );
  }

}
