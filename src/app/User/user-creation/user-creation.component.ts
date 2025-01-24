import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-creation',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule,NgxPaginationModule],
  templateUrl: './user-creation.component.html',
  styleUrls: ['./user-creation.component.css']
})

export class UserCreationComponent implements OnInit {
  @ViewChild('employeeCodeSelect') employeeCodeSelect!: ElementRef;
  @ViewChild('firstNameSelect') firstNameSelect!: ElementRef;
  @ViewChild('emailSelect') emailSelect!: ElementRef;
  @ViewChild('mobileNoSelect') mobileNoSelect!: ElementRef;
  @ViewChild('employeeStatusSelet') employeeStatusSelet!: ElementRef;
  @ViewChild('bankPartnerSelect') bankPartnerSelect!: ElementRef;
  @ViewChild('departmentSelect') departmentSelect!: ElementRef;
  @ViewChild('designationSelect') designationSelect!: ElementRef;
  @ViewChild('stateSelect') stateSelect!: ElementRef;
  @ViewChild('areaSelect') areaSelect!: ElementRef;
  @ViewChild('branchSelect') branchSelect!: ElementRef;
  @ViewChild('dateOfLeavingSelect') dateOfLeavingSelect!: ElementRef;
  @ViewChild('dateOfJoiningSelect') dateOfJoiningSelect!: ElementRef;
  @ViewChild('roleSelect') roleSelect!: ElementRef;

  users: any[] = [];
  isModalOpen = false;
  isEditMode = false;
  roles: any[] = [];
  CurrentID: number = 0; 
  isLoading: boolean = true;  // Add loading state
  searchText: string = '';
  p: number = 1; // Pagination current page
  entriesPerPage: number = 10; // Number of items per page
  entriesOptions: number[] = [10, 25, 50,100]; // Options for the user to select
  sortKey: string = '';
  sortAsc: boolean = true;
  filteredUsers: any[] = [];

  newUser = {
    employeeCode: '',
    firstName: '',
    email: '',
    mobile: '',
    role: '',
    status: '',
    bankPartner: '',
    department: '',
    designation: '',
    state: '',
    area: '',
    branch: '',
    dateOfJoining: '',
    dateOfLeaving: '',
    isActive: false
  };

  constructor(private http: HttpClient, private location: Location) { }

  ngOnInit() {
    this.fetchUsers();
    this.fetchRoles();
  }

  goBack(): void {
    this.location.back();
  }

  fetchUsers() {
    this.isLoading = true;
    const url = '/api/webCourseMaster/GetUsersDetailsforWEB';
    const body = { mode: 1 };
    this.http.post<any>(url, body).subscribe(
      (response) => {
        if (response.status === true) {
          this.users = response.data.map((user: any) => ({
            employeeCode: user.EmployeeCode || '',
            firstName: user.EmployeeName || '',
            email: user.Email || '',
            mobile: user.MobileNo || '',
            role: user.RoleCode ? '' : '',
            status: user.Employmentstatus || '',
            bankPartner: user.BankPartners || '',
            department: user.Department || '',
            designation: user.Designation || '',
            state: user.States || '',
            area: user.Area || '',
            branch: user.Branches || '',
            dateOfJoining: user.joiningDate || '',
            dateOfLeaving: user.leavingDate || ''
          }));
          this.filteredUsers = [...this.users];
        } else {
          console.error('Failed to fetch users',response.message);
        }
      },
      (error) => {
        console.error('Error fetching users:', error);
      },
      () => {
        this.isLoading = false;
      }
    );
  }
  
  sortData(key: string) {
    this.sortAsc = this.sortKey === key ? !this.sortAsc : true;
    this.sortKey = key;

    this.filteredUsers.sort((a, b) => {
      if (a[key] < b[key]) return this.sortAsc ? -1 : 1;
      if (a[key] > b[key]) return this.sortAsc ? 1 : -1;
      return 0;
    });
  }

  searchUsers() {
    if (!this.searchText) {
      this.filteredUsers = [...this.users];
    } else {
      this.filteredUsers = this.users.filter(user =>
        Object.values(user).some(val =>
          String(val).toLowerCase().includes(this.searchText.toLowerCase())
        )
      );
    }
  }

  changeEntriesPerPage() {
    this.p = 1; // Reset to the first page whenever entries per page is changed
  }
 
  // Calculate the range and total records
  get rangeInfo() {
    const start = (this.p - 1) * this.entriesPerPage + 1;
    const end = Math.min(this.p * this.entriesPerPage, this.filteredUsers.length);
    const total = this.filteredUsers.length;
    return { start, end, total };
  }

  deleteUser(user: any) {
    const isConfirmed = window.confirm('Are you sure you want to delete this user?');
    if (isConfirmed) {
      const url = '/api/webCourseMaster/GetUsersDetailsforWEB';
      const body = {
        mode: 3,
        EMPLOYEECODE: user.employeeCode
      };
      this.http.post<any>(url, body).subscribe(
        (response) => {
          if (response.status == true) {
            this.fetchUsers();
            console.log('User deleted successfully');
          } else {
            console.error('Failed to delete user');
          }
        },
        (error) => {
          console.error('Error deleting user:', error);
        }
      );
    } else {
      console.log('User deletion cancelled');
    }
  }

  fetchRoles() {
    const apiUrl = '/api/webCourseMaster/GetDepartmentInfo';
    const requestBody = { mode: 6 };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status) {
          this.roles = response.data.map((role: { RoleCode: any; RoleName: any; }) => ({
            id: role.RoleCode,
            name: role.RoleName
          }));
        }
      },
      (error) => {
        console.error('Error fetching roles:', error);
      }
    );
  }


  openModal(isEditMode: boolean, user?: any) {
    this.isModalOpen = true;
    this.CurrentID = 0;
    this.isEditMode = isEditMode;
    if (isEditMode && user) {
      this.fetchUserDetails(user.employeeCode);
    } else {
      this.newUser = {
        employeeCode: '',
        firstName: '',
        email: '',
        mobile: '',
        role: '',
        status: '',
        bankPartner: '',
        department: '',
        designation: '',
        state: '',
        area: '',
        branch: '',
        dateOfJoining: '',
        dateOfLeaving: '',
        isActive: false
      };
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  fetchUserDetails(employeeCode: string) {
    const apiUrl = '/api/webCourseMaster/GetUsersDetailsforWEB';
    const requestBody = {
      mode: 2,
      EMPLOYEECODE: employeeCode
    };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status== true) {
          const userData = response.data[0];
          console.log('API Response:', response);
          this.CurrentID = userData.ID;
          this.newUser = {
            employeeCode: userData.EmployeeCode || '',
            firstName: userData.EmployeeName || '',
            email: userData.Email || '',
            mobile: userData.MobileNo || '',
            role: userData.RoleCode,
            status: userData.Employmentstatus || '',
            bankPartner: userData.BankPartners || '',
            department: userData.Department || '',
            designation: userData.Designation || '',
            state: userData.States || '',
            area: userData.Area || '',
            branch: userData.Branches || '',
            dateOfJoining: userData.joiningDate || '',
            dateOfLeaving: userData.leavingDate || '',
            isActive: userData.IsActive || false
          };
        } else {
          console.error('Error fetching user details:', response.message);
        }
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
  }

  editUser(user: any) {
    this.openModal(true, user);
    this.fetchUserDetails(user.employeeCode);
  }

  SaveandUpdateUserDetails(): void {
    const employeeCode = sessionStorage.getItem('employeeCode');
    if (!employeeCode) {
      alert('Employee not logged in');
      return;
    }

    if (!this.newUser.employeeCode) {
      alert('Please enter EmployeeCode.');
      this.employeeCodeSelect.nativeElement.focus();
      return;
    }

    if (!this.newUser.firstName || this.newUser.firstName.trim() == '') {
      alert('Please enter First Name.');
      this.firstNameSelect.nativeElement.focus();
      return;
    }

    if (!this.newUser.email) {
      alert('Please enter Email.');
      this.emailSelect.nativeElement.focus();
      return;
    }

    if (!this.newUser.mobile) {
      alert('Please enter Mobile No.');
      this.mobileNoSelect.nativeElement.focus();
      return;
    }

    if (!this.newUser.status) {
      alert('Please enter Employment Status.');
      this.employeeStatusSelet.nativeElement.focus();
      return;
    }

    if (!this.newUser.bankPartner) {
      alert('Please enter bank partner.');
      this.bankPartnerSelect.nativeElement.focus();
      return;
    }

    if (!this.newUser.department) {
      alert('Please enter department.');
      this.departmentSelect.nativeElement.focus();
      return;
    }

    if (!this.newUser.designation) {
      alert('Please enter designation.');
      this.designationSelect.nativeElement.focus();
      return;
    }

    if (!this.newUser.state) {
      alert('Please enter State.');
      this.stateSelect.nativeElement.focus();
      return;
    }

    if (!this.newUser.area) {
      alert('Please enter Area.');
      this.areaSelect.nativeElement.focus();
      return;
    }

    if (!this.newUser.branch) {
      alert('Please enter Branch.');
      this.branchSelect.nativeElement.focus();
      return;
    }

    if (!this.newUser.role) {
      alert('Please select Role.');
      this.roleSelect.nativeElement.focus();
      return;
    }

    if (!this.newUser.dateOfLeaving) {
      alert('Please select dateOfLeaving.');
      this.dateOfLeavingSelect.nativeElement.focus();
      return;
    }

    if (!this.newUser.dateOfJoining) {
      alert('Please select dateOfJoining.');
      this.dateOfJoiningSelect.nativeElement.focus();
      return;
    }

    const apiUrl = '/api/webCourseMaster/SaveUserData';
    const requestBody = {
      id: this.CurrentID,
      employeeCode: this.newUser.employeeCode,
      EmployeeName: this.newUser.firstName,
      email: this.newUser.email,
      MobileNo: this.newUser.mobile,
      Employmentstatus: this.newUser.status,
      BankPartners: this.newUser.bankPartner,
      Department: this.newUser.department,
      Designation: this.newUser.designation,
      States: this.newUser.state,
      Area: this.newUser.area,
      Branches: this.newUser.branch,
      Dateofjoining: this.newUser.dateOfJoining,
      DateofLeaving: this.newUser.dateOfLeaving,
      RoleCode: this.newUser.role,
      CreatedBy: employeeCode,
      IsActive: this.newUser.isActive
    };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status == true) {
          this.fetchUsers();
          this.closeModal();
        } else {
          console.error('Failed to save/update user details.',response.message);
        }
      },
      error => {
        console.error('Error saving/updating user details:', error);
      }
    );
  }
}
