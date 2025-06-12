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
  selector: 'app-field-training-assignment',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule,NgxPaginationModule],
  templateUrl: './field-training-assignment.component.html',
  styleUrl: './field-training-assignment.component.css'
})
export class FieldTrainingAssignmentComponent implements OnInit {
 @ViewChild('allocateFromSelect') allocateFromSelect!: ElementRef;
  @ViewChild('allocateToSelect') allocateToSelect!: ElementRef;
  courseId: number | null = null;
selectedTrainer: string = '';
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
    selectedTrainerCode: string = '';
traineeCodeFromAPI: string = '';
 searchTerm: string = '';  // For the global search term
  banks: Bank[] = [];
  states: string[] = [];
  areas: string[] = [];
  branches: string[] = [];
  designations: string[] = [];
  employees: Employee[] = [];
  selectAll = false;  // Select All checkbox status
  isLoading: boolean = false; // Loading spinner flag
  courseName: string = '';
trainerList: any[] = [];
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
      Designation: this.formData.designation || 'AB',
      doj: this.formData.date || '',
      todate: this.formData.todate || '',
    };
    this.isLoading = true;
    this.http.post<any>('/api/api/webCourseMaster/GetNewJoinersData', params).subscribe(
      (response) => {
        if (response.status && response.data && response.data.length > 0) {
          this.employees = response.data.map((employee: any) => ({
            ...employee,
            selected: false,
          }));
          this.filteredEmployees = [...this.employees];
            //  Store the first employee's EmployeeCode
        this.traineeCodeFromAPI = response.data[0].EmployeeCode;
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

  
 isModalOpen: boolean = false;
selectedEmployee: any = null;

openModal(employee: any) {
  this.isModalOpen = true;
  const branchName = employee.Branches;
  const payload = { Branches: branchName };
  this.http.post<any>('/api/api/webCourseMaster/GetTrainersListBranchWise', payload).subscribe(
    response => {
      if (response.status && response.data) {
        this.trainerList = response.data;
      } else {
        this.trainerList = [];
        console.warn('No trainer data found.');
      }
    },
    error => {
      console.error('API Error:', error);
      this.trainerList = [];
    }
  );
}


closeModal() {
  this.isModalOpen = false;
  this.selectedTrainerCode = ''; // This resets the dropdown
  this.trainerList = [];
}
SaveandUpdateUserDetails() {
  if (!this.selectedTrainerCode) {
    alert('Please select a trainer.');
    return;
  }
  const payload = {
    TraineeCode: this.traineeCodeFromAPI,
    TrainerCode: this.selectedTrainerCode
  };
  this.http.post<any>('/api/api/webCourseMaster/TrainingMappingInsert', payload).subscribe(
    (response) => {
      alert('Trainer assigned successfully!');
      this.closeModal();
      this.submitForm();       // Refresh the table
    },
    (error) => {
      console.error('Error assigning trainer:', error);
      alert('Error assigning trainer. Please try again.');
    }
  );
}


}
