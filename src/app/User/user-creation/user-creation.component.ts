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
  Designations: any[] = [];
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
  CertSelected: boolean = false;
  CertUploaded: boolean = false;
  selectedCertificateType:  string | null = null;
  CertificateType:  string | null = null;
  uploadedCerts: {  SerialNo: number | null,File: File| null, Type: string | null,Name: string | null , ID: number | null,FilePath: string | null}[] = [];
  isReadOnly: boolean = false; 
  isEditCert : boolean = false;
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
    DesignationId:'',
    designation: '',
    state: '',
    area: '',
    branch: '',
    dateOfJoining: '',
    dateOfLeaving: '',
    isActive: false,
    decryptedPassword: '',
    CertificateFiles: [] as { file: File| null; type: string }[]
  };

  constructor(private http: HttpClient, private location: Location) { }

  ngOnInit() {
    this.fetchUsers();
    this.fetchRoles();
    this.fetchDesignation()
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
            CertificateFile:user.FilePath
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

  
  fetchDesignation() {
    const apiUrl = '/api/api/webCourseMaster/GetEmployeeHierarchyData';
    const requestBody = { mode: 7 };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status) {
          this.Designations = response.data.map((Designation: { DesignationID: any; Designation: any; }) => ({
            DesignationID: Designation.DesignationID,
            Designation: Designation.Designation
          }));
          this.removeItemById(0)
         }
      },
      (error) => {
        console.error('Error fetching roles:', error);
      }
    );
  }
removeItemById(idToRemove: number): void {
  this.Designations = this.Designations.filter(item => item.DesignationID !== 0);
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
          DesignationId: '',
        designation: '',
        state: '',
        area: '',
        branch: '',
        dateOfJoining: '',
        dateOfLeaving: '',
        isActive: false,
        decryptedPassword: '',
        CertificateFiles: [] as { file: File| null; type: string }[]
      };
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.CertSelected = false;
    this.CertUploaded = false;
    this.selectedCertificateType = null;
    this.uploadedCerts = []; 
      this.isReadOnly=false;
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
           this.isReadOnly=true;
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
             DesignationId: userData.DesignationId || '',
            designation: userData.Designation || '',
            state: userData.States || '',
            area: userData.Area || '',
            branch: userData.Branches || '',
            dateOfJoining: userData.joiningDate || '',
            dateOfLeaving: userData.leavingDate || '',
            isActive: userData.IsActive || false,
            decryptedPassword: userData.decryptedPassword || '',
            CertificateFiles: userData.FilePath || ''
          };
          this.newUser.designation = userData.DesignationId;
        this.FetchCertificate()
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
    const reader = new FileReader();
    if (this.uploadedCerts.length > 0) {
      const cert = this.uploadedCerts[0]; 
    this.newUser.CertificateFiles = this.uploadedCerts.map(cert => ({
      file: cert.File,
      type: cert.Type ?? ''
    }));
    }
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
    if (!this.newUser.dateOfJoining) {
      alert('Please select Date of Joining.');
      this.dateOfLeavingSelect.nativeElement.focus();
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
    if (this.uploadedCerts.length==0 && this.CertSelected) {
      alert('Please Upload Certificate.');
      this.employeeCodeSelect.nativeElement.focus();
      return;
    }
   const apiUrl = '/api/api/webCourseMaster/SaveUserData';
    const formData = new FormData();

formData.append('id', this.CurrentID.toString());
formData.append('employeeCode', this.newUser.employeeCode);
formData.append('EmployeeName', this.newUser.firstName);
formData.append('email', this.newUser.email);
formData.append('MobileNo', this.newUser.mobile);
formData.append('Employmentstatus', this.newUser.status);
formData.append('BankPartners', this.newUser.bankPartner);
formData.append('Department', this.newUser.department);
formData.append('DesignationID', this.newUser.designation);
formData.append('States', this.newUser.state);
formData.append('Area', this.newUser.area);
formData.append('Branches', this.newUser.branch);
formData.append('Dateofjoining', this.newUser.dateOfJoining);
formData.append('DateofLeaving', this.newUser.dateOfLeaving);
formData.append('RoleCode', this.newUser.role.toString());
formData.append('CreatedBy', employeeCode);
formData.append('IsActive', this.newUser.isActive.toString()); // Boolean must be string
formData.append('password', this.newUser.decryptedPassword);
if (this.newUser.CertificateFiles && this.newUser.CertificateFiles.length > 0) {
this.newUser.CertificateFiles.forEach((cert, index) => {
  formData.append(`CertificateFiles[${index}].File`, cert.file?? '');
  formData.append(`CertificateFiles[${index}].Type`, cert.type ?? '');
});
}
this.http.post<any>(apiUrl, formData).subscribe(
  res => console.log('Success', res),
  err => console.error('Error', err)
);
    this.http.post<any>(apiUrl, formData).subscribe(
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

  
onCertTypeChange(event: any) {
  const value = event.target.value;
  this.CertSelected = (value !== 'null' && value !== '');
}

onCertFileUpload(event: any): void {
  const file: File = event.target.files[0];
  if (file) {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only PDF, JPG, or JPEG files are allowed.');
      return;
    }
     const serialNo = this.uploadedCerts.length + 1;
    this.uploadedCerts.push({
        SerialNo: serialNo,
        File: file,
        Type: this.selectedCertificateType ?? '',
        Name: file.name,
        ID:0,
        FilePath:null
    });
    this.CertUploaded = true;
  }
}

downloadFile(item: { File: File| null; Type: string | null ;Name: string | null; ID: number | null;FilePath: string | null}) {
   if (!item.File && !item.Name) {
    console.warn('No file available for download.');
    return;
  }
   if (item.File) {
    const url = URL.createObjectURL(item.File);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.File.name;
    a.click();
    URL.revokeObjectURL(url);
  } else if (item.Name) { 
    const fullUrl = item.FilePath ?? '';
    const a = document.createElement('a');
    a.href = fullUrl;
    a.download = item.Name;
    a.target = '_blank';
    a.click();
  }
}

deleteFile(item: { SerialNo: number | null, File: File | null; Type: string | null; Name: string | null ; ID: number | null;FilePath: string | null}) {
  if (!item.File && !item.Name) {
    console.warn('No file available for deletion.');
    return;
  }
  const fileName = item.File?.name || item.Name;
  const confirmed = confirm(`Are you sure you want to delete "${fileName}"?`);
  if (!confirmed) return;
  if (item.File) {
    const index = this.uploadedCerts.indexOf(item);
    if (index > -1) {
      this.uploadedCerts.splice(index, 1);
    }
    if (this.uploadedCerts.length === 0) {
      this.CertSelected = false;
      this.CertUploaded = false;
    }
    this.selectedCertificateType = null;
  } else if (item.Name) {
    const apiUrl = '/api/api/webCourseMaster/DeleteCertificateforWEB';
    const requestBody = {
      CertificateId : item.ID
    };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status === true) {
          const index = this.uploadedCerts.indexOf(item);
          if (index > -1) {
            this.uploadedCerts.splice(index, 1);
          }
          if (this.uploadedCerts.length === 0) {
            this.CertSelected = false;
            this.CertUploaded = false;
          }
          this.selectedCertificateType = null;
        } else {
          alert('Failed to delete file from server.');
        }
      },
      (error) => {
        console.error('Error deleting file:', error);
        alert('Error occurred while deleting file.');
      }
    );
  }
}

 FetchCertificate() {
   const employeeCode = this.newUser.employeeCode;
   const apiUrl = '/api/api/webCourseMaster/GetUsersDetailsforWEB';
    const requestBody = {
       mode: 4,
      EMPLOYEECODE: employeeCode
    };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status === true && Array.isArray(response.data) && response.data.length > 0) {
           this.CertUploaded = true;
           this.uploadedCerts = [];          
         response.data.forEach((item: { FilePath: string; Type: string,ID:number }) => {
          let filePath = item.FilePath || '';
          const cleanedFilePath = filePath.replace(/\\/g, '/');
          const fileName = cleanedFilePath.substring(cleanedFilePath.lastIndexOf('/') + 1);
            const serialNo = this.uploadedCerts.length+1 ; 
          this.uploadedCerts.push({
             SerialNo: serialNo,
            File: null,
            Type: item.Type,
            Name: fileName,
            ID: item.ID,
            FilePath: item.FilePath
          });
        });

        console.log('Uploaded Certs:', this.uploadedCerts);
        }},
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
  }
}
