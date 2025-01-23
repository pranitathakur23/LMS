import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule and HttpClient
import { NgxPaginationModule } from 'ngx-pagination';
import { Location } from '@angular/common';

// Interface for Bank object
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
  Dateofjoining: string;  // Add Dateofjoining property
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
  // Define data models for form and allocation
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
  isModalOpen = false;
 searchTerm: string = '';  // For the global search term
  // Declare arrays for dropdowns
  banks: Bank[] = [];
  states: string[] = [];
  areas: string[] = [];
  branches: string[] = [];
  designations: string[] = [];
  employees: Employee[] = [];
  selectAll = false;  // Select All checkbox status
  isLoading: boolean = false; // Loading spinner flag

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
  

  // Select all checkbox status binding

  constructor(private http: HttpClient,private location: Location) {}

  ngOnInit() {
    // Fetch dropdown data for each Mode
    this.fetchBanks();
    this.fetchStates();
    this.fetchAreas();
    this.fetchBranches();
    this.fetchDesignations();
    this.submitForm()
    
  }
  goBack() {
    this.location.back();  // Goes back to the previous page
  }
  // Fetch Banks data
  fetchBanks() {
    const apiUrl = '/api/webCourseMaster/GetDepartmentInfo';
    const requestBody = { mode: 7 }; // Mode 7 for Banks

    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        console.log('API Response:', response);

        if (response.status == true) {
          console.log('Banks Data:', response.data);

          // Extract BankPartners from each object and map to the banks array
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

 // Fetch States data
fetchStates() {
  const apiUrl = '/api/webCourseMaster/GetDepartmentInfo';
  const requestBody = { mode: 8 }; // Mode 8 for States
  this.http.post<any>(apiUrl, requestBody).subscribe(
    (response) => {
      console.log('State Data:', response.data);

      if (response.status == true) {
        // Map the response data to the states array, assuming the response data is an array of objects
        // with the key 'States'
        this.states = response.data.map((item: { States: string }) => item.States);
        console.log('Mapped States:', this.states);
      }
    },
    (error) => {
      console.error('Error fetching states:', error);
    }
  );
}
  // Fetch Areas data
// Fetch Areas data
fetchAreas() {
  const apiUrl = '/api/webCourseMaster/GetDepartmentInfo';
  const requestBody = { mode: 9 }; // Mode 9 for Areas
  this.http.post<any>(apiUrl, requestBody).subscribe(
    (response) => {
      console.log('Area Data:', response.data);

      if (response.status == true) {
        // Map the response data to the areas array, assuming the response data is an array of objects
        // with the key 'Area'
        this.areas = response.data.map((item: { Area: string }) => item.Area);
        console.log('Mapped Areas:', this.areas);
      }
    },
    (error) => {
      console.error('Error fetching areas:', error);
    }
  );
}
  // Fetch Branches data
 // Fetch Branches data
fetchBranches() {
  const apiUrl = '/api/webCourseMaster/GetDepartmentInfo';
  const requestBody = { mode: 10 }; // Mode 10 for Branches
  this.http.post<any>(apiUrl, requestBody).subscribe(
    (response) => {
      console.log('Branch Data:', response.data);

      if (response.status == true) {
        // Map the response data to the branches array, assuming the response data is an array of objects
        // with the key 'Branches'
        this.branches = response.data.map((item: { Branches: string }) => item.Branches);
        console.log('Mapped Branches:', this.branches);
      }
    },
    (error) => {
      console.error('Error fetching branches:', error);
    }
  );
}

  // Fetch Designations data
  // Fetch Designations data
fetchDesignations() {
  const apiUrl = '/api/webCourseMaster/GetDepartmentInfo';
  const requestBody = { mode: 11 }; // Mode 11 for Designations
  this.http.post<any>(apiUrl, requestBody).subscribe(
    (response) => {
      console.log('Designation Data:', response.data);

      if (response.status  == true) {
        // Map the response data to the designations array, assuming the response data contains 'Designation' keys
        this.designations = response.data.map((item: { Designation: string }) => item.Designation);
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

  // Handle form submission for employee data fetch
  submitForm() {
    const params = {
      BankPartners: this.formData.bank || 'AB',
      States: this.formData.state || 'AB',
      Area: this.formData.area || 'AB',
      Branches: this.formData.branch || 'AB',
      Designation: this.formData.designation || 'AB',
      doj: this.formData.date || '',
    };
    console.log('Params:', params); // Make sure parameters are correct
    
    // Pass 'params' in the POST request
    this.isLoading = true;
    this.http.post<any>('/api/webCourseMaster/GetAllUserData', params).subscribe(
      (response) => {
        if (response.status && response.data && response.data.length > 0) {
          this.employees = response.data.map((employee: any) => ({
            ...employee,
            selected: false, // Initialize all employees as unselected
          }));
          this.filteredEmployees = [...this.employees]; // Initially display all employees
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
  // Open Modal
  openModal() {
    this.isModalOpen = true;
  }

  // Close Modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Submit the form
  onSubmit() {
    console.log('Form data:', this.formData);
  }

  // Handle Allocation Save
  saveAllocation() {
    console.log('Allocate From:', this.allocateFormData.allocateFrom);
    console.log('Allocate To:', this.allocateFormData.allocateTo);
    console.log('From Bank:', this.allocateFormData.fromBank);
    console.log('From State:', this.allocateFormData.fromState);
    console.log('From Area:', this.allocateFormData.fromArea);
    console.log('From Branch:', this.allocateFormData.fromBranch);
    this.closeModal(); // Close modal after saving
  }
}
