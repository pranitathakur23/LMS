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
  trainingMappingID: number = 0;


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
  courses: any[] = [];
  banks: any[] = [];
  states: any[] = [];
  areas: any[] = [];
  branches: any[] = [];
  designations: any[] = [];
  employees: Employee[] = [];
  selectAll = false;  // Select All checkbox status
  isLoading: boolean = false; // Loading spinner flag
isImageModalOpen: boolean = false;
selectedImageUrl: string = '';
isTrainerModalOpen: boolean = false;
selectedTrainerCode: string = '';
selectedTrainee: string = '';
trainerList: any[] = [];

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
    const apiUrl = '/api/api/webCourseMaster/GetEmployeeHierarchyData';
    const requestBody = { mode: 1, Bank: 'AB', State: 'AB', Area: 'AB', Branch: 'AB', DesignationID: 0 };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status) {
          this.banks = response.data.map((bank: any) => {
            return {
              bank: bank.BankName
            };
          });       
          this.fetchStates(); // Fetch states once banks are loaded
        } else {
          console.error('Error fetching bank details:', response.message);
        }
      },
      error => {
        console.error('Error fetching banks:', error);
      }
    );
  }

  fetchStates() {
    this.formData.state = '';
    const apiUrl = '/api/api/webCourseMaster/GetEmployeeHierarchyData';
    const requestBody = { mode: 2, Bank: this.formData.bank || 'All', State: 'AB', Area: 'AB', Branch: 'AB', DesignationID: 0 };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status == true) {
          this.states = response.data.map((item: any) => {
            return { state: item.StateName }; // ✅ this makes each item like { state: 'Maharashtra' }
          });
          this.fetchAreas(); // Fetch states once banks are loaded
        }
      },
      (error) => {
        console.error('Error fetching states:', error);
      }
    );
  }

  fetchAreas() {
    this.formData.area = '';
    const apiUrl = '/api/api/webCourseMaster/GetEmployeeHierarchyData';
    const requestBody = {
      mode: 3, Bank: this.formData.bank || 'All', State: this.formData.state || 'All'
      , Area: 'AB', Branch: 'AB', DesignationID: 0
    };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status == true) {
          this.areas = response.data.map((item: any) => {
            return { areas: item.AreaName };
          });
          this.fetchBranches();
        }
      },
      (error) => {
        console.error('Error fetching areas:', error);
      }
    );
  }

  fetchBranches() {
      this.formData.branch = '';
    const apiUrl = '/api/api/webCourseMaster/GetEmployeeHierarchyData';
    const requestBody = {
      mode: 4,
      Bank: this.formData.bank || 'All',
      State: this.formData.state || 'All'
      , Area: this.formData.area || 'All',
      Branch: 'AB', DesignationID: 0
    };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status == true) {
          this.branches = response.data.map((item: { Branches: string }) => item.Branches);
          this.branches = response.data.map((item: any) => {
            return { Branch: item.BranchName };
          });
          this.fetchDesignations();
        }
      },
      (error) => {
        console.error('Error fetching branches:', error);
      }
    );
  }

  fetchDesignations() {
     this.formData.designation = '';
    const apiUrl = '/api/api/webCourseMaster/GetEmployeeHierarchyData';
    const requestBody = {
      mode: 6,
      Bank: this.formData.bank || 'All',
      State: this.formData.state || 'All',
      Area: this.formData.area || 'All',
      Branch: this.formData.branch || 'All',
      DesignationID: 0
    };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status == true) {
          this.designations = response.data.map((item: { DesignationID: number; Designation: string }) => ({
            DesignationId: item.DesignationID,
            Designation: item.Designation
          }));
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
        if (response.status && response.data && response.data.length > 0) {
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
openImageModal(imageUrl: string): void {
  this.selectedImageUrl = imageUrl;
  this.isImageModalOpen = true;
}

closeImageModal(): void {
  this.isImageModalOpen = false;
  this.selectedImageUrl = '';
}
  closeModal() {
    this.isModalOpen = false;
  }

  handleRowClick(employee: any): void {
    this.trainingMappingID=employee.ID;
    if (employee.trainingStatus === 'Completed') {
      this.openModal(employee.TraineeCode, employee.ID);
    } else if (employee.trainingStatus === 'Pending') {
      this.openTrainerModal(employee);
    }
  }

  openTrainerModal(employee: any): void {
    this.isTrainerModalOpen = true;
    this.selectedTrainee = employee.TraineeCode;
    const branchName = employee.Branches;
    const payload = { 
      Branches: branchName,
      employeeCode: this.selectedTrainee 
    };
    this.http.post<any>('/api/api/webCourseMaster/GetTrainersListBranchWise', payload).subscribe(
      response => {
        if (response.status == true) {
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

  closeTrainerModal(): void {
    this.isTrainerModalOpen = false;
    this.selectedTrainerCode = '';
    this.selectedTrainee = '';
    this.trainerList = [];
  }

  assignTrainer(): void {
    if (!this.selectedTrainerCode) {
      alert('Please select a trainer.');
      return;
    }
    const payload = {
      TraineeCode: this.selectedTrainee,
      TrainerCode: this.selectedTrainerCode,
      id: this.trainingMappingID,

    };
    this.http.post<any>('/api/api/webCourseMaster/TrainingMappingInsert', payload).subscribe(
      (response) => {
        alert('Trainer assigned successfully!');
        this.closeTrainerModal();
        this.FetchEDData();
      },
      (error) => {
        console.error('Error assigning trainer:', error);
        alert('Error assigning trainer. Please try again.');
      }
    );
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
       const rawSimilarity = response[0].similarityPercentage;
item.SimilarityPer = parseInt(rawSimilarity.toString().slice(0, 2));
console.log('Formatted Similarity Percentage:', item.SimilarityPer);

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
