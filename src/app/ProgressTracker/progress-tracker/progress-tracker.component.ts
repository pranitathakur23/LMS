import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { AppLabels, AppHeader, AppLink , AppButton, AppPlaceHolder,Apptable} from '../../app.constants';
import { NgSelectModule } from '@ng-select/ng-select';
import { forkJoin } from 'rxjs';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-progress-tracker',
  standalone: true,
  imports: [FormsModule,CommonModule,HttpClientModule, NgSelectModule], // <-- Add FormsModule here!
  templateUrl: './progress-tracker.component.html',
  styleUrls: ['./progress-tracker.component.css']
})
export class ProgressTrackerComponent {
  selectedBank: string | null = null;
  selectedState: string | null = null;
  selectedArea: string | null = null;
  selectedBranch: string | null = null;
  selectedDesignation: string | null = null;
  selectedEmployee: string | null = null;
  selectedDate: string | null = null;
  Completed: number | null = null;
  Inprogress: number | null = null;
  Unassigned: number | null = null;
  Notstared: number | null = null;
  isLoading: boolean = false;

  labels = AppLabels;
  Header = AppHeader;
  Link = AppLink;
  Button = AppButton;
  PlaceHolder = AppPlaceHolder;
  table=Apptable;

  constructor(private http: HttpClient) { }

  ngOnInit() { 
     this.fetchCourses();
     this.fetchBankNames();
      this.fetchdesignations();
      this.fetchtracker();
      this.onSearch();
  }
 
  courses: any[] = [];
  banks: any[] = [];
  states : any[] = [];
  areas : any[] = [];
  branches : any[] = [];
  designations : any[] = [];
  employees: any[] = [];


  
  
 
getGradient(progress: number): string {
  if (progress > 0 && progress <= 20) {
    return 'linear-gradient(to right, #F2E8E1, #ED1B0C)'; // 0–20%
  } else if (progress > 20 && progress <= 40) {
    return 'linear-gradient(to right, #F0EEDD, #EDC00C)'; // 20–40%
  } else if (progress > 40 && progress <= 60) {
    return 'linear-gradient(to right, #DDE2F0, #5B0CED)'; // 40–60%
  } else if (progress > 60 && progress <= 80) {
    return 'linear-gradient(to right, #ABE8ED, #0CB1ED)'; // 60–80%
  } else if (progress > 80 && progress <= 100) {
    return 'linear-gradient(to right, #A3E3C0, #3FBA72)'; // 80–100%
  } else {
    return '#dee2e6'; // Fallback light gray
  }
}

  fetchCourses() {
    console.log(this.selectedArea)
    const apiUrl = '/api/api/webCourseMaster/GetAllCourseData';
   const requestBody = { Bank:'AB',State:'AB',Area:'AB',Branch:'AB',DesignationID:0,EmployeeCode:'AB'};
    this.http.post<any>(apiUrl,requestBody).subscribe(
      response => {
        console.log(response)
         if (response.status == true) {
           this.courses = response.data.map((course: any) => {
            return {
             name: course.courseName,
             progress: course.courseCompletionPercent
            };
           });
         } else {
           console.error('Error fetching course details:', response.message);
        }
      },
      error => {
        console.error('Error fetching courses:', error);
      }
    );
  }

  
  fetchtracker() {
    const apiUrl = '/api/api/webCourseMaster/GetProgressTrackerData';
    const requestBody = { Bank:'AB',State:'AB',Area:'AB',Branch:'AB',DesignationID:0,EmployeeCode:'AB'};
    this.http.post<any>(apiUrl,requestBody).subscribe(
      response => {
        console.log(response)
         if (response.status == true) {
          this.Completed= response.data[0].Completed;
          this.Notstared= response.data[0].NotStarted;
          this.Inprogress= response.data[0].InProgress;
          this.Unassigned= response.data[0].Unassigned;
         } else {
           console.error('Error fetching course details:', response.message);
        }
      },
      error => {
        console.error('Error fetching courses:', error);
      }
    );
  }
  fetchBankNames() {
    const apiUrl = '/api/api/webCourseMaster/GetEmployeeHierarchyData';
    const requestBody = { mode: 1, Bank: 'AB', State: 'AB', Area: 'AB', Branch: 'AB', DesignationID: 0  };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status) {
          this.banks = response.data.map((bank: any) => {
            return {
              name: bank.BankName
            };
          });
          this.selectedBank = this.banks[0]?.name; // Set default value
          this.fetchstates(); // Fetch states once banks are loaded
        } else {
          console.error('Error fetching bank details:', response.message);
        }
      },
      error => {
        console.error('Error fetching banks:', error);
      }
    );
  }
  
  fetchstates() {
    const apiUrl = '/api/api/webCourseMaster/GetEmployeeHierarchyData';
    const requestBody = { mode: 2, Bank: this.selectedBank, State: 'AB', Area: 'AB', Branch: 'AB', DesignationID: 0  };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status) {
          this.states = response.data.map((State: any) => {
            return {
              name: State.StateName
            };
          });
          this.selectedState = this.states[0]?.name; // Set default value
          this.fetchareas(); // Fetch areas once states are loaded
        } else {
          console.error('Error fetching state details:', response.message);
        }
      },
      error => {
        console.error('Error fetching states:', error);
      }
    );
  }
  
  fetchareas() {
    const apiUrl = '/api/api/webCourseMaster/GetEmployeeHierarchyData';
    const requestBody = { mode: 3, Bank: this.selectedBank, State: this.selectedState, Area: 'AB', Branch: 'AB',DesignationID: 0  };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status) {
          this.areas = response.data.map((Area: any) => {
            return {
              name: Area.AreaName
            };
          });
          this.selectedArea = this.areas[0]?.name; // Set default value
          this.fetchbranches(); // Fetch branches once areas are loaded
        } else {
          console.error('Error fetching area details:', response.message);
        }
      },
      error => {
        console.error('Error fetching areas:', error);
      }
    );
  }
  
  fetchbranches() {
    const apiUrl = '/api/api/webCourseMaster/GetEmployeeHierarchyData';
    const requestBody = { mode: 4, Bank: this.selectedBank, State: this.selectedState, Area: this.selectedArea, Branch: 'AB', DesignationID: 0  };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status) {
          this.branches = response.data.map((Branch: any) => {
            return {
              name: Branch.BranchName
            };
          });
          this.selectedBranch = this.branches[0]?.name; // Set default value
          this.fetchdesignations(); // Fetch designations once branches are loaded
        } else {
          console.error('Error fetching branch details:', response.message);
        }
      },
      error => {
        console.error('Error fetching branches:', error);
      }
    );
  }
  
  fetchdesignations() {
    const apiUrl = '/api/api/webCourseMaster/GetEmployeeHierarchyData';
    const requestBody = { mode: 6, Bank: this.selectedBank, State: this.selectedState, Area: this.selectedArea, Branch: this.selectedBranch, DesignationID: 0 };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status) {
          this.designations = response.data.map((designation: any) => {
            return {
                DesignationID:designation.DesignationID,
              name: designation.Designation
            };
          });
           this.selectedDesignation = this.designations[0]?.DesignationID;
          this.fetchemployees(); // Fetch employees once designations are loaded
        } else {
          console.error('Error fetching designation details:', response.message);
        }
      },
      error => {
        console.error('Error fetching designations:', error);
      }
    );
  }
  
  fetchemployees() {
    const apiUrl = '/api/api/webCourseMaster/GetEmployeeHierarchyData';
    const requestBody = {
      mode: 5,
      Bank: this.selectedBank,
      State: this.selectedState,
      Area: this.selectedArea,
      Branch: this.selectedBranch,
     DesignationID: this.selectedDesignation
    };
  
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status) {
          this.employees = response.data.map((emp: any) => {
            return {
               EmpCode : emp.EmployeeCode,
              name: emp.EmployeeName
            };
          });
         this.selectedEmployee = this.employees[0]?.EmpCode;
        } else {
          console.error('Error fetching employee details:', response.message);
        }
      },
      error => {
        console.error('Error fetching employees:', error);
      }
    );
  }


exportExcelReport(mode: number) {
  const requestBody = {
    mode,
    Bank: this.selectedBank === 'All' || !this.selectedBank ? 'AB' : this.selectedBank,
    State: this.selectedState === 'All' || !this.selectedState ? 'AB' : this.selectedState,
    Area: this.selectedArea === 'All' || !this.selectedArea ? 'AB' : this.selectedArea,
    Branch: this.selectedBranch === 'All' || !this.selectedBranch ? 'AB' : this.selectedBranch,
    DesignationID: this.selectedDesignation === 'All' || !this.selectedDesignation ? 0 : this.selectedDesignation,
    EmployeeCode: this.selectedEmployee === 'All' || !this.selectedEmployee ? 'AB' : this.selectedEmployee
  };

  // File names for each mode
  const fileNameMap: { [key: number]: string } = {
    1: 'Completed_Courses.xlsx',
    2: 'InProgress_Courses.xlsx',
    3: 'NotStarted_Courses.xlsx',
    4: 'Unassigned_Courses.xlsx'
  };

  // API call
  this.http.post<any>('/api/api/webCourseMaster/GetProgressTrackerExcelReport', requestBody)
    .subscribe(
      (response) => {
        // If data exists
        if (response?.status == true) {
          // Convert to Excel
          const worksheet = XLSX.utils.json_to_sheet(response.data);
          const workbook = { Sheets: { 'Sheet1': worksheet }, SheetNames: ['Sheet1'] };
          const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          const blob = new Blob([buffer], { type: 'application/octet-stream' });
          
          // Download file
          saveAs(blob, fileNameMap[mode] || 'Progress_Report.xlsx');
        } else {
          alert('No data available for this report.');
        }
      },
      (error) => {
        // Handle error
        console.error('API Error:', error);
        alert('Failed to export report.');
      }
    );
}



onSearch() {
  this.isLoading = true;
  const requestBody = {
    Bank: (this.selectedBank === 'All' || !this.selectedBank) ? 'AB' : this.selectedBank,
    State: (this.selectedState === 'All' || !this.selectedState) ? 'AB' : this.selectedState,
    Area: (this.selectedArea === 'All' || !this.selectedArea) ? 'AB' : this.selectedArea,
    Branch: (this.selectedBranch === 'All' || !this.selectedBranch) ? 'AB' : this.selectedBranch,
    DesignationID: (this.selectedDesignation === 'All' || !this.selectedDesignation) ? 0 : this.selectedDesignation,
    EmployeeCode: (this.selectedEmployee === 'All' || !this.selectedEmployee) ? 'AB' : this.selectedEmployee
  };

  const trackerApi$ = this.http.post<any>('/api/api/webCourseMaster/GetProgressTrackerData', requestBody);
  const courseApi$ = this.http.post<any>('/api/api/webCourseMaster/GetAllCourseData', requestBody);

  forkJoin([trackerApi$, courseApi$]).subscribe(
    ([trackerRes, courseRes]) => {
      if (trackerRes.status === true) {
        if (trackerRes.status === true && trackerRes.data && trackerRes.data.length > 0) {
          const trackerData = trackerRes.data[0];
          this.Completed = (trackerData.Completed && typeof trackerData.Completed !== 'object') ? trackerData.Completed : 0;
          this.Notstared = (trackerData.NotStarted && typeof trackerData.NotStarted !== 'object') ? trackerData.NotStarted : 0;
          this.Inprogress = (trackerData.InProgress && typeof trackerData.InProgress !== 'object') ? trackerData.InProgress : 0;
          this.Unassigned = (trackerData.Unassigned && typeof trackerData.Unassigned !== 'object') ? trackerData.Unassigned : 0;
       
        } else {
          this.Completed = 0;
          this.Notstared = 0;
          this.Inprogress = 0;
          this.Unassigned = 0;
        }
      } else {
        console.error('Error fetching tracker data:', trackerRes.message);
      }

     if (courseRes.status === true) {
  this.courses = courseRes.data.map((course: any) => {
    const progressStr = course.courseCompletionPercent.trim();  // e.g. "3.20%"
    const progressValue = parseFloat(progressStr.replace('%', '')) || 0;  // numeric 3.20

    return {
      name: course.courseName,
      progress: progressStr,      // Keep "3.20%" for display
      progressValue: progressValue // Numeric for styling
    };
  });
} else {
  console.error('Error fetching course data:', courseRes.message);
}


      this.isLoading = false; 
    },
    error => {
      console.error('Error during API calls:', error);
      this.isLoading = false; 
    }
  );
}

  
}

