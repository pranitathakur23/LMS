import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppLabels, AppHeader, AppLink , AppButton, AppPlaceHolder,Apptable} from '../../app.constants';
import { NgSelectModule } from '@ng-select/ng-select';
import { forkJoin } from 'rxjs';

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
  }
 
  courses: any[] = [];
  banks: any[] = [];
  states : any[] = [];
  areas : any[] = [];
  branches : any[] = [];
  designations : any[] = [];
  employees: any[] = [];


  
  getProgressBarClass(progress: number): string {
    if (progress >= 80) return 'bg-primary';
    if (progress >= 60) return 'bg-warning';
    if (progress >= 40) return 'bg-success';
    return 'bg-danger';
  }
  getGradient(progress: number): string {
    if (progress < 40) {
      return 'linear-gradient(90deg, #f85032, #e73827)'; // red-orange
    } else if (progress < 70) {
      return 'linear-gradient(90deg, #f7971e, #ffd200)'; // yellow-orange
    } else if (progress < 100) {
      return 'linear-gradient(90deg, #00c6ff, #0072ff)'; // blue
    } else {
      return 'linear-gradient(90deg, #00b09b, #96c93d)'; // green
    }
  }
 
  fetchCourses() {
    console.log(this.selectedArea)
    const apiUrl = '/api/api/webCourseMaster/GetAllCourseData';
    const requestBody = { Bank:'AB',State:'AB',Area:'AB',Branch:'AB',Designation:'AB',EmployeeCode:'AB'};
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
    const requestBody = { Bank:'AB',State:'AB',Area:'AB',Branch:'AB',Designation:'AB',EmployeeCode:'AB'};
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
    const requestBody = { mode: 1 ,Bank:'AB',State:'AB',Area:'AB',Branch:'AB',Designation:'AB'};
    this.http.post<any>(apiUrl,requestBody).subscribe(
      response => {
        console.log(response)
         if (response.status == true) {
           this.banks = response.data.map((bank: any) => {
            return {
             name: bank.BankName
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

  fetchstates() {
    const apiUrl = '/api/api/webCourseMaster/GetEmployeeHierarchyData';
    const requestBody = { mode: 2 ,Bank:this.selectedBank,State:'AB',Area:'AB',Branch:'AB',Designation:'AB'};
    this.http.post<any>(apiUrl,requestBody).subscribe(
      response => {
        console.log(response)
         if (response.status == true) {
           this.states = response.data.map((State: any) => {
            return {
             name: State.StateName
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

  fetchareas() {
    const apiUrl = '/api/api/webCourseMaster/GetEmployeeHierarchyData';
    const requestBody = { mode: 3 ,Bank:this.selectedBank,State:this.selectedState,Area:'AB',Branch:'AB',Designation:'AB'};
    this.http.post<any>(apiUrl,requestBody).subscribe(
      response => {
        console.log(response)
         if (response.status == true) {
           this.areas = response.data.map((Area: any) => {
            return {
             name: Area.AreaName
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

  fetchbranches() {
    const apiUrl = '/api/api/webCourseMaster/GetEmployeeHierarchyData';
    const requestBody = { mode: 4 ,Bank:this.selectedBank,State:this.selectedState,Area:this.selectedArea
      ,Branch:'AB',Designation:'AB'};
    this.http.post<any>(apiUrl,requestBody).subscribe(
      response => {
        console.log(response)
         if (response.status == true) {
           this.branches = response.data.map((Branch: any) => {
            return {
             name: Branch.BranchName
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

  fetchdesignations() {
    const apiUrl = '/api/api/webCourseMaster/GetEmployeeHierarchyData';
    const requestBody = { mode: 6 ,Bank:this.selectedBank,State:this.selectedState,Area:this.selectedArea
      ,Branch:this.selectedBranch,Designation:'AB'};
    this.http.post<any>(apiUrl,requestBody).subscribe(
      response => {
        console.log(response)
         if (response.status == true) {
           this.designations = response.data.map((designation: any) => {
            return {
             name: designation.Designation
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

  fetchemployees() {
   const apiUrl = '/api/api/webCourseMaster/GetEmployeeHierarchyData';
    const requestBody = { mode: 5 ,Bank:this.selectedBank,State:this.selectedState,Area:this.selectedArea
      ,Branch:this.selectedBranch,Designation:this.selectedDesignation};
    this.http.post<any>(apiUrl,requestBody).subscribe(
      response => {
        console.log(response)
         if (response.status == true) {
           this.employees = response.data.map((emp: any) => {
            return {
             name: emp.Designation
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


onSearch() {
  this.isLoading = true;
  const requestBody = {
    Bank: (this.selectedBank === 'All' || !this.selectedBank) ? 'AB' : this.selectedBank,
    State: (this.selectedState === 'All' || !this.selectedState) ? 'AB' : this.selectedState,
    Area: (this.selectedArea === 'All' || !this.selectedArea) ? 'AB' : this.selectedArea,
    Branch: (this.selectedBranch === 'All' || !this.selectedBranch) ? 'AB' : this.selectedBranch,
    Designation: (this.selectedDesignation === 'All' || !this.selectedDesignation) ? 'AB' : this.selectedDesignation,
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
        this.courses = courseRes.data.map((course: any) => ({
          name: course.courseName,
          progress: course.courseCompletionPercent
        }));
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

