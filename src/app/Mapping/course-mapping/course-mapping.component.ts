import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule and HttpClient

// Interface for Bank object
interface Bank {
  BankPartners: string;
}

@Component({
  selector: 'app-course-mapping',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
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

  // Declare arrays for dropdowns
  banks: Bank[] = [];
  states: string[] = [];
  areas: string[] = [];
  branches: string[] = [];
  designations: string[] = [];

  // Static employees data for table
  employees = [
    { code: 'E001', name: 'John Doe', bank: 'Bank 1', state: 'State 1', area: 'Area 1', branch: 'Branch 1', designation: 'Designation 1', selected: false },
    { code: 'E002', name: 'Jane Smith', bank: 'Bank 2', state: 'State 2', area: 'Area 2', branch: 'Branch 2', designation: 'Designation 2', selected: false },
    { code: 'E003', name: 'Robert Brown', bank: 'Bank 3', state: 'State 3', area: 'Area 3', branch: 'Branch 3', designation: 'Designation 3', selected: false },
  ];

  // Select all checkbox status binding
  selectAll = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Fetch dropdown data for each Mode
    this.fetchBanks();
    this.fetchStates();
    this.fetchAreas();
    this.fetchBranches();
    this.fetchDesignations();
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

  // Open Modal
  openModal() {
    this.isModalOpen = true;
  }

  // Close Modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Toggle Select All Checkbox
  toggleSelectAll() {
    this.selectAll = !this.selectAll;
    this.employees.forEach((employee) => {
      employee.selected = this.selectAll;
    });
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
