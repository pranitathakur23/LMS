import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule and HttpClient
import { NgxPaginationModule } from 'ngx-pagination';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

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
  imports: [FormsModule, CommonModule, HttpClientModule,NgxPaginationModule],
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
    todate:''
  };

  allocateFormData = {
    allocateFrom: '',
    allocateTo: '',
    fromBank: '',
    fromState: '',
    fromArea: '',
    fromBranch: '',
  };

 searchTerm: string = '';  // For the global search term
  isModalOpen: boolean = false;
  banks: Bank[] = [];
  states: string[] = [];
  areas: string[] = [];
  branches: string[] = [];
  designations : any[] = [];
  employees: Employee[] = [];
  selectAll = false;  // Select All checkbox status
  isLoading: boolean = false; // Loading spinner flag
  courseName: string = '';

  // Pagination and Data
  p: number = 1;  // Current page
  entriesPerPage: number = 10;
  entriesOptions = [10, 15, 15, 15];
  filteredEmployees: any[] = []; // Filtered employees for search
  searchText: string = '';
  rangeInfo = {
    start: 1,
    end: 10,
    total: 0,
  };

  constructor(private http: HttpClient, private location: Location, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log('Query Params:', params); // Debugging log
      this.courseId = params['courseId'] ? +params['courseId'] : null;
      this.courseName = params['courseName'] ? decodeURIComponent(params['courseName']) : 'Unknown Course';
  
      console.log('Course ID:', this.courseId);
      console.log('Course Name:', this.courseName);
  
      if (!this.courseId) {
        console.error('Course ID not provided');
      }
    });
  
  
    this.fetchBanks();
    this.fetchStates();
    this.fetchAreas();
    this.fetchBranches();
    this.fetchDesignations();
    this.submitForm()
    
  }
  goBack() {
    this.location.back();
  }

  // Fetch Banks data
  fetchBanks() {
    const apiUrl = '/api/api/webCourseMaster/GetDepartmentInfo';
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
    const apiUrl = '/api/api/webCourseMaster/GetDepartmentInfo';
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
    const apiUrl = '/api/api/webCourseMaster/GetDepartmentInfo';
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
    const apiUrl = '/api/api/webCourseMaster/GetDepartmentInfo';
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
    const apiUrl = '/api/api/webCourseMaster/GetDepartmentInfo';
    const requestBody = { mode: 11 };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status == true) {
          this.designations = response.data.map((item: { Designation: string }) => item.Designation);
        this.designations = response.data.map((item: { Id: number; Designation: string }) => ({
  DesignationId: item.Id,
  Designation: item.Designation
}));
          console.log('Mapped Designations:', this.designations);
        }
      },
      (error) => {
        console.error('Error fetching designations:', error);
      }
   
  );
}

  // Method to change entries per page
  changeEntriesPerPage() {
    this.p = 1; // Reset to first page when entries per page changes
    this.searchEmployees(); // Reapply filtering when entries per page change
  }

  // Handle Search functionality
  searchEmployees() {
    console.log(this.searchText);  // Log the search term to check if it's updating
    if (this.searchText) {
      // Filter employees based on searchText
      this.filteredEmployees = this.employees.filter(employee => 
        Object.values(employee).some(val =>
          val.toString().toLowerCase().includes(this.searchText.toLowerCase())
        )
      );
    } else {
      // Reset to show all employees if the search term is empty
      this.filteredEmployees = [...this.employees];
    }
  }

  // Update range information for pagination
  updateRangeInfo() {
    const totalEmployees = this.filteredEmployees.length;
    const start = (this.p - 1) * this.entriesPerPage + 1;
    const end = Math.min(this.p * this.entriesPerPage, totalEmployees);
    this.rangeInfo = {
      start: start,
      end: end,
      total: totalEmployees,
    };
  }

  submitForm() {
    const params = {
      BankPartners: this.formData.bank || 'AB',
      States: this.formData.state || 'AB',
      Area: this.formData.area || 'AB',
      Branches: this.formData.branch || 'AB',
      DesignationID: this.formData.designation || 0,
      doj: this.formData.date || '',
      todate: this.formData.todate || '',
    };
    this.isLoading = true;
    this.http.post<any>('/api/api/webCourseMaster/GetAllUserData', params).subscribe(
      (response) => {
        console.log('Map response', response);
        if (response.status && response.data && response.data.length > 0) {
          this.employees = response.data.map((employee: any) => ({
            ...employee,
            selected: false,
          }));
          this.filteredEmployees = [...this.employees];
          this.updateRangeInfo();
        } else {
          this.filteredEmployees = [];
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.isLoading = false;
      }
    );
  }

  toggleSelectAll() {
    this.selectAll = !this.selectAll;
    this.employees.forEach((employee) => {
      employee.selected = this.selectAll;
    });
  }
  getSelectedCount(): number {
    return this.employees.filter(emp => emp.selected).length;
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
    const apiUrl = '/api/api/webCourseMaster/SaveCourseAllocationData';
    const requestBody = {
      courseId: this.courseId,
      allocateFrom: this.allocateFormData.allocateFrom,
      allocateTo: this.allocateFormData.allocateTo,
      EmployeeCodes: checkedEmployees,
    };

    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status === true) {
          alert('Course allocated successfully!');

          this.submitForm();
          this.closeModal();
          this.router.navigate(['/layout/Courses/courses']);
          
        } else {
          console.error(response.message);
        }
      },
      error => {
        console.error('Error allocating course details:', error);
      }
    );
  }

}
