import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { Location } from '@angular/common';
import { AppLabels, AppHeader, AppLink , AppButton, AppPlaceHolder,Apptable} from '../../app.constants';

@Component({
  selector: 'app-user-creation',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgxPaginationModule],
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
  @ViewChild('passwordSelect') passwordSelect!: ElementRef;

  users: any[] = [];
  isModalOpen = false;
  isEditMode = false;
  roles: any[] = [];
  CurrentID: number = 0;
  isLoading: boolean = true;  // Add loading state
  searchText: string = '';
  p: number = 1; // Pagination current page
  entriesPerPage: number = 10; // Number of items per page
  entriesOptions: number[] = [10, 25, 50, 100]; // Options for the user to select
  sortKey: string = '';
  sortAsc: boolean = true;
  filteredUsers: any[] = [];
  isDropdownOpen = false;
  labels = AppLabels;
  Header = AppHeader;
  Link = AppLink;
  Button = AppButton;
  PlaceHolder = AppPlaceHolder;
  table=Apptable;
  selectedFiles: File[] = [];
    tableColumns = [
    { key: 'employeeCode', label: 'Employee Code', isVisible: true },
    { key: 'firstName', label: 'First Name', isVisible: true },
    { key: 'email', label: 'Email', isVisible: true },
    { key: 'mobile', label: 'Mobile', isVisible: true },
    { key: 'status', label: 'Status', isVisible: true },
    { key: 'bankPartner', label: 'Bank Partner', isVisible: false },
    { key: 'department', label: 'Department', isVisible: false },
    { key: 'designation', label: 'Designation', isVisible: false },    { key: 'state', label: 'State', isVisible: false },
    { key: 'area', label: 'Area', isVisible: false },
    { key: 'branch', label: 'Branch', isVisible: false },
    { key: 'dateOfJoining', label: 'Date of Joining', isVisible: false },
    { key: 'dateOfLeaving', label: 'Date of Leaving', isVisible: false },
    { key: 'password', label: 'Password', isVisible: false },

  ];

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
    isActive: false,
    decryptedPassword: ''
  };

  constructor(private http: HttpClient, private location: Location) { }

  ngOnInit() {
    this.fetchUsers();
    this.fetchRoles();
  }


  fetchUsers() {
    this.isLoading = true;
    const url = '/api/api/webCourseMaster/GetUsersDetailsforWEB';
    const body = { mode: 1 };
    this.http.post<any>(url, body).subscribe(
      (response) => {
        if (response.status === true) {
          console.log('User Response',response)
          this.users = response.data.map((user: any) => ({
            employeeCode: user.EmployeeCode || '',
            firstName: user.EmployeeName || '',
            email: user.Email || '',
            mobile: user.MobileNo || '',
            role: user.Designation ? '' : '',
            status: user.Employmentstatus || '',
            bankPartner: user.BankPartners || '',
            department: user.Department || '',
            designation: user.Designation || '',
            state: user.States || '',
            area: user.Area || '',
            branch: user.Branches || '',
            dateOfJoining: user.joiningDate || '',
            dateOfLeaving: user.leavingDate || '',
            decryptedPassword: user.decryptedPassword || '',
          }));
          this.filteredUsers = [...this.users];
        } else {
          console.error('Failed to fetch users', response.message);
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

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleColumnVisibility() {
    this.filteredUsers = this.users.map(user => {
      let newUser: { [key: string]: any } = {};
      this.tableColumns.forEach(column => {
        if (column.isVisible==true) {
          newUser[column.key] = user[column.key];
        }
      });
      return newUser;
    });
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInsideDropdown = target.closest('.dropdown-menu') !== null;
    if (!clickedInsideDropdown && !target.closest('.dropdown-toggle')) {
      this.isDropdownOpen = false;
    }
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
  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const files = Array.from(target.files);
  
      // Append files without removing previous ones
      files.forEach(file => {
        if (!this.selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
          this.selectedFiles.push(file);
        }
      });
  
      // Reset input so user can re-select same file again if needed
      target.value = '';
    }
  }
  uploadFile(file: File): void {
    // Handle file upload logic here
    console.log('Uploading file:', file.name);
  
    // Example: You can use FormData to send this to a backend API
    const formData = new FormData();
    formData.append('file', file);
  
    // Send this formData using your service (if any)
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
      const url = '/api/api/webCourseMaster/GetUsersDetailsforWEB';
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
    const apiUrl = '/api/api/webCourseMaster/GetDepartmentInfo';
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
        isActive: false,
        decryptedPassword: ''
      };
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  fetchUserDetails(employeeCode: string) {
    const apiUrl = '/api/api/webCourseMaster/GetUsersDetailsforWEB';
    const requestBody = {
      mode: 2,
      EMPLOYEECODE: employeeCode
    };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status == true) {
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
            isActive: userData.IsActive || false,
            decryptedPassword: userData.decryptedPassword || '',

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
  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!(this.newUser.email.endsWith('.com') || this.newUser.email.endsWith('.in')) || !emailRegex.test(this.newUser.email)) {
    alert('Enter valid Email.');
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

    // if (!this.newUser.dateOfLeaving) {
    //   alert('Please select dateOfLeaving.');
    //   this.dateOfLeavingSelect.nativeElement.focus();
    //   return;
    // }

    if (!this.newUser.decryptedPassword) {
      alert('Please enter Password.');
      this.passwordSelect.nativeElement.focus();
      return;
    }

    const apiUrl = '/api/api/webCourseMaster/SaveUserData';
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
      IsActive: this.newUser.isActive,
      password: this.newUser.decryptedPassword
    };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status == true) {
          this.fetchUsers();
          this.closeModal();
        } else {
          console.error('Failed to save/update user details.', response.message);
        }
      },
      error => {
        console.error('Error saving/updating user details:', error);
      }
    );
  }
}
