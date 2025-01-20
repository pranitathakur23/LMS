import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http'; // Import HttpClient and HttpClientModule

@Component({
  selector: 'app-user-creation',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],  // Add HttpClientModule here
  templateUrl: './user-creation.component.html',
  styleUrls: ['./user-creation.component.css']
})
export class UserCreationComponent implements OnInit {

  // User list which will be populated from API
  users: any[] = [];

  // Modal flag
  isModalOpen = false;
  isEditMode = false;  // Flag to differentiate between Add and Edit

  // New user object for binding form values
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
    isActive: false  // Default to false, as isActive is a boolean
  };
  roles: any[] = [];  // This will hold the roles fetched from the API

  constructor(private http: HttpClient) {}

  // On component initialization, fetch users
  ngOnInit() {
    this.fetchUsers();
    this.fetchRoles();  // Fetch roles when the component initializes
  }

  // Method to fetch users from the API
fetchUsers() {
  const url = '/api/webCourseMaster/GetUsersDetailsforWEB';
  const body = {
    mode: 1
  };

  this.http.post<any>(url, body).subscribe(
    (response) => {
      if (response.status) {
        this.users = response.data.map((user: any) => ({
          employeeCode: user.EmployeeCode || '',
          firstName: user.EmployeeName || '',
          email: user.Email || '',
          mobile: user.MobileNo || '',
          role: user.RoleCode  ? '' : '',  // Adjust role mapping as needed
          status: user.Employmentstatus || '',  // Directly assign Employmentstatus if it's a string
          bankPartner: user.BankPartners || '',  // Directly assign BankPartners if it's a string
          department: user.Department || '',  // Directly assign Department if it's a string
          designation: user.Designation || '',  // Directly assign Designation if it's a string
          state: user.States || '',  // Directly assign States if it's a string
          area: user.Area || '',  // Directly assign Area if it's a string
          branch: user.Branches || '',  // Directly assign Branches if it's a string
          dateOfJoining: user.Dateofjoining || '',
          dateOfLeaving: user.DateofLeaving || ''
        }));
      } else {
        console.error('Failed to fetch users');
      }
    },
    (error) => {
      console.error('Error fetching users:', error);
    }
  );
}

  deleteUser(user: any) {
    // Display a confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to delete this user?');
  
    if (isConfirmed) {
      const url = '/api/webCourseMaster/GetUsersDetailsforWEB';
      const body = {
        mode: 3,  // Mode for delete
        EMPLOYEECODE: user.employeeCode  // Pass the employee code of the user to delete
      };
  
      // Perform the delete request
      this.http.post<any>(url, body).subscribe(
        (response) => {
          if (response.status) {
            // Successfully deleted, so remove the user from the list
            this.users = this.users.filter((u) => u.employeeCode !== user.employeeCode);
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
  
  // Fetch roles from the API
  fetchRoles() {
    const apiUrl = '/api/webCourseMaster/GetDepartmentInfo';
    const requestBody = { mode: 6 };

    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status) {
          this.roles = response.data.map((role: { RoleCode: any; RoleName: any; }) => ({
            id: role.RoleCode,  // Assuming RoleCode is returned by the API
            name: role.RoleName // Assuming RoleName is returned by the API
          }));
        }
      },
      (error) => {
        console.error('Error fetching roles:', error);
      }
    );
  }

  // Open the modal for Add/Edit user
  openModal(isEditMode: boolean, user?: any) {
    this.isModalOpen = true;
    this.isEditMode = isEditMode;

    if (isEditMode && user) {
      // If in edit mode, pre-fill the modal with user data
      this.fetchUserDetails(user.employeeCode);  // Fetch the user details based on employee code
    } else {
      // Reset form for adding new user
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
        isActive: false  // Default to false
      };
    }
  }

  // Close the modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Save new user after form submission
  saveUser() {
    if (this.isEditMode) {
      // Update existing user
      const index = this.users.findIndex(user => user.employeeCode === this.newUser.employeeCode);
      if (index !== -1) {
        this.users[index] = { ...this.newUser };  // Replace old user with updated data
      }
    } else {
      // Add new user to the list
      this.users.push({ ...this.newUser });
    }

    this.closeModal(); // Close modal after saving
  }

  // Method to fetch detailed user information based on EmployeeCode
// Method to fetch detailed user information based on EmployeeCode
fetchUserDetails(employeeCode: string) {
  const apiUrl = '/api/webCourseMaster/GetUsersDetailsforWEB';
  const requestBody = {
    mode: 2,
    EMPLOYEECODE: employeeCode // Pass the employee code to the API
  };

  this.http.post<any>(apiUrl, requestBody).subscribe(
    (response) => {
      if (response.status) {
        const userData = response.data[0];  // Assuming response.data is an array
        console.log('API Response:', response);

        // Map the response data to the newUser object
        this.newUser = {
          employeeCode: userData.EmployeeCode || '',
          firstName: userData.EmployeeName || '',
          email: userData.Email || '',
          mobile: userData.MobileNo || '',
          role: this.getRoleByCode(userData.RoleCode),  // Map the role code to the role name
          status: userData.Employmentstatus || '',  // Directly assign Employmentstatus
          bankPartner: userData.BankPartners || '',
          department: userData.Department || '',
          designation: userData.Designation || '',
          state: userData.States || '',
          area: userData.Area || '',
          branch: userData.Branches || '',
          dateOfJoining: userData.Dateofjoining || '',
          dateOfLeaving: userData.DateofLeaving || '',
          isActive: userData.IsActive || false  // Ensure it's a boolean value (true/false)
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

  // Method to get the role name based on RoleCode (you can adjust this logic as needed)
  getRoleByCode(roleCode: number): string {
    switch (roleCode) {
      case 1:
        return 'Teacher';
      case 2:
        return 'Admin';
      default:
        return 'Unknown';
    }
  }

  // Edit user
  editUser(user: any) {
    this.openModal(true, user);  // Open the modal in edit mode and pass the user data

    // Fetch the detailed user data by EmployeeCode
    this.fetchUserDetails(user.employeeCode);
  }
}
