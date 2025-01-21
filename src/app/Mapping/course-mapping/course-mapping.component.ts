import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-mapping',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './course-mapping.component.html',
  styleUrls: ['./course-mapping.component.css']
})
export class CourseMappingComponent {

  formData = {
    bank: '',
    state: '',
    area: '',
    branch: '',
    designation: '',
    date: ''
  };
 // Declare allocateFormData to hold the data for the modal
 allocateFormData = {
  allocateFrom: '',
  allocateTo: '',
  fromBank: '',
  fromState: '',
  fromArea: '',
  fromBranch: ''
};
isModalOpen = false; // Modal open/close flag

  banks = ['Bank 1', 'Bank 2', 'Bank 3'];
  states = ['State 1', 'State 2', 'State 3'];
  areas = ['Area 1', 'Area 2', 'Area 3'];
  branches = ['Branch 1', 'Branch 2', 'Branch 3'];
  designations = ['Designation 1', 'Designation 2', 'Designation 3'];

  employees = [
    { code: 'E001', name: 'John Doe', bank: 'Bank 1', state: 'State 1', area: 'Area 1', branch: 'Branch 1', designation: 'Designation 1', selected: false },
    { code: 'E002', name: 'Jane Smith', bank: 'Bank 2', state: 'State 2', area: 'Area 2', branch: 'Branch 2', designation: 'Designation 2', selected: false },
    { code: 'E003', name: 'Robert Brown', bank: 'Bank 3', state: 'State 3', area: 'Area 3', branch: 'Branch 3', designation: 'Designation 3', selected: false }
  ];
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
    this.selectAll = !this.selectAll; // Toggle the 'selectAll' flag
    this.employees.forEach(employee => {
      employee.selected = this.selectAll; // Set all employees' selected property
    });
  }

  // Select all checkbox status binding
  selectAll = false;

  onSubmit() {
    console.log('Form data:', this.formData);
  }
  // Handle Allocate Save
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
