import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule and HttpClient
import { NgxPaginationModule } from 'ngx-pagination';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AppLabels, AppHeader, AppLink, AppButton, AppPlaceHolder, Apptable } from '../../app.constants';

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
  selector: 'app-evidence-collection',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, NgxPaginationModule],
  templateUrl: './evidence-collection.component.html',
  styleUrl: './evidence-collection.component.css'
})
export class EvidenceCollectionComponent {
  @ViewChild('allocateFromSelect') allocateFromSelect!: ElementRef;
  @ViewChild('allocateToSelect') allocateToSelect!: ElementRef;
  courseId: number | null = null;
  TraineeImage: string = '';
  TrainerImage: string = '';
  isLoadingFace = false;
  isFaceApiAlertVisible: boolean = true;
  errorMessageFaceapi: string = '';
  simalarPer1: string = '';

  labels = AppLabels;
  Header = AppHeader;
  Link = AppLink;
  Button = AppButton;
  PlaceHolder = AppPlaceHolder;
  table = Apptable;

  statusfaceapi: 'Success' | 'error' | 'Face Not Match' | null = null;
  formData = {
    bank: '',
    state: '',
    area: '',
    branch: '',
    designation: '',
    date: '',
    todate: ''
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
  designations: { DesignationId: number; Designation: string }[] = [];
  employees: Employee[] = [];
  selectAll = false;  // Select All checkbox status
  isLoading: boolean = false; // Loading spinner flag

  // Pagination and Data
  p: number = 1;  // Current page
  entriesPerPage: number = 10;
  entriesOptions = [10, 15];
  filteredEmployees: any[] = []; // Filtered employees for search
  EmployeeData: any[] = [];
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
    this.FetchEDData()
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
          this.designations = response.data.map(
            (item: { Id: number; Designation: string }) =>
            ({
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
    console.log(this.searchText, this.employees,);  // Log the search term to check if it's updating
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

  FetchEDData() {
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
    this.http.post<any>('/api/api/webCourseMaster/GetAllUserForED', params).subscribe(
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

  openModal(employeeCode: string, ID: number): void {
    this.isModalOpen = true;
    const params = {
      ID: ID,
      employeeCode: employeeCode || 'AB'
    };
    this.isLoading = true;
    this.http.post<any>('/api/api/webCourseMaster/GetUserWiseData', params).subscribe(
      (response) => {
        console.log('Map response', response);
        if (response.status && response.data && response.data.length > 0) {
          console.log('Madhuraaaaaaaaaaa', response.data)
          console.log('IsMatched:', response.data[0].IsMatched);
          console.log('IsMatched:', response.data[0].IsMatched, typeof response.data[0].IsMatched);

          this.employees = response.data.map((employee: any) => ({
            ...employee
          }));
          this.EmployeeData = [...this.employees];
          this.isLoading = false
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.isLoading = false;
      }
    );
  }

  closeModal() {
    this.isModalOpen = false;
  }


  verifyFaceapiDetails(item: any): void {
    if (!item.TraineeImage || !item.TrainerImage) {
      alert('Both the images should be present to perform face match.');
      return;
    }
    this.isLoading = true;
    this.isFaceApiAlertVisible = true;

    const apiUrl = 'https://employeeface.nocpl.in/compareImages';
    const requestData = {
      img1: item.TraineeImage,
      img2: item.TrainerImage
    };

    this.http.post<any>(apiUrl, requestData).subscribe(
      response => {
        this.isLoading = false;  // Stop the loader
        item.SimilarityPer = response[0].similarityPercentage; // Ensures it's a number like 100.0
        item.IsMatched = response[0].match;
        this.Savematchdata(item.ID, item.Typeid, item.IsMatched, item.SimilarityPer)

      },
      error => {
        this.isLoadingFace = false;  // Stop the loader
        this.statusfaceapi = 'error';
        console.error('Error updating member status:', error);
        this.errorMessageFaceapi = 'Something Went Wrong';
        setTimeout(() => {
          this.closeFaceApiAlert();
        }, 5000); // 5000 milliseconds = 5 seconds
      }
    );
  }

  closeFaceApiAlert(): void {
    this.isFaceApiAlertVisible = false;
  }

  Savematchdata(ID: number, Type: string, match: string, similarity: string): void {
    const params = {
      ID: ID,
      Type: Type,
      Match: match,
      similarity: similarity
    }
    console.log(params)
    this.http.post<any>('/api/api/webCourseMaster/Savematchdata', params).subscribe(
      (response) => {
        console.log(response.data)
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.isLoading = false;
      }
    );
  }

  isNonEmpty(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return !isNaN(value);
    if (typeof value == 'object') return Object.keys(value).length > 0;
    return true;
  }
}
