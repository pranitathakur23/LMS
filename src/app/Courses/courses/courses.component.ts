import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';  // Import HttpClientModule and HttpClient
import { Router } from '@angular/router';  // Import Router service
interface Department {
  DepartmentID: number;
  DepartmentName: string;
}

interface Duration {
  DurationID: number;
  DurationName: string;
}

@Component({
  selector: 'app-courses',
  standalone: true,  // Declare this as a standalone component
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule  // Add HttpClientModule in imports array for standalone component
  ],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent {
  mode: number = 0;
  modalHeader: string = 'Create Course';  // Variable to hold modal header text
  chapters = [];
  isModalOpen = false;
  isChapterModalOpen = false;  // Controls chapter modal visibility
  isEditing = false;  // Flag to determine if we are editing a course
  // Flag to distinguish between creating and editing
  isCreateMode = true;  // By default, it will be create mode
 // Correctly type the 'file' as 'File | null' in the `newCourse` object
 departments: Department[] = [];  
 newCourse = { 
  title: '',
  department: '',
  duration: '',
  questionPaper: '',
  durationTime: '',
  description: '',
  file: null as File | null,
  courseId: null as number | null,  // Add courseId to the newCourse object
};

  newChapter = {
    name: '',
    duration: '',
    description: '',
    file: null,
    contentType: '',
    thumbnail: null
  };

  durationTimes: Duration[] = [];  // New array to hold Course Duration In options
  questionPapers = ['MCQ', 'Descriptive', 'Practical'];

  thumbnailPreview: string | null = null;
  courses: any;
// Method to handle file upload
handleFileUpload(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.newCourse.file = file;  // Assign the file to newCourse.file
  }
}
  constructor(private http: HttpClient, private router: Router) {}  // Inject HttpClient
  
  mapCourse(courseId: number) {
    this.router.navigate(['/layout/Mapping/course-mapping'], { queryParams: { courseId: courseId } });
  }
  
  ngOnInit() {
    if (!this.courses) {
      this.courses = [];  // Initialize courses if it's undefined
    }
    this.fetchCourses();
    this.fetchDepartments();
    this.fetchDurationOptions();
    // Retrieve EmployeeCode from sessionStorage
  const employeeCode = sessionStorage.getItem('employeeCode');
  if (employeeCode) {
    console.log('EmployeeCode:', employeeCode);
  } else {
    console.log('EmployeeCode not found in sessionStorage');
  }
  }

  fetchCourses() {
    const apiUrl = '/api/webCourseMaster/GetCourseDetailsforWEB';
    const requestBody = { mode: 1 };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status == true) {
          this.courses = response.data.map((course: any) => ({
            SrNo: course.SrNo,
            name: course.courseName,
            courseId: course.courseId,
          }));
        } else {
          this.courses = [];  // Ensure courses is an empty array if no data
        }
      },
      (error) => {
        console.error('Error fetching courses:', error);
        alert('An error occurred while fetching courses');
        this.courses = [];  // Ensure courses is an empty array on error
      }
    );
  }

// Fetch departments (adjust this method as per your requirements)
fetchDepartments() {
  const apiUrl = '/api/webCourseMaster/GetDepartmentInfo';
  const requestBody = { mode: 1 };

  this.http.post<any>(apiUrl, requestBody).subscribe(
    response => {
      if (response.status == true) {
        this.departments = response.data.map((dept: { DepartmentID: number, DepartmentName: string }) => ({
          DepartmentID: dept.DepartmentID,
          DepartmentName: dept.DepartmentName
        }));
      } else {
        alert('Failed to load departments');
      }
    },
    error => {
      console.error('Error fetching departments:', error);
      alert('An error occurred while fetching departments');
    }
  );
}

  fetchDurationOptions() {
    const apiUrl = '/api/webCourseMaster/GetDepartmentInfo'; // Full URL
    const requestBody = {
      mode: 2  // Pass mode: 2 to fetch Course Duration In options
    };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status == true) {
          // Map the response data to 'durationTimes'
          this.durationTimes = response.data.map((duration: any) => {
            return {
              DurationID: duration.DurationID,   // Use DurationID directly
              DurationName: duration.DurationName // Use DurationName directly
            };
          });
        }
      },
    );
  }

    openModal() {
    if (this.isCreateMode) {
      this.modalHeader = 'Create New Course';
    } else {
      this.modalHeader = 'Edit Course';
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();  // Reset form when closing the modal
  }

  createCourse(mode: number) {
    const employeeCode = sessionStorage.getItem('employeeCode');
    if (!employeeCode) {
      alert('Employee not logged in');
      return;
    }
    const apiUrl = '/api/webCourseMaster/SaveandUpdateCourseDetails';
    const formData: FormData = new FormData();
    formData.append('courseName', this.newCourse.title);
    formData.append('description', this.newCourse.description);
    formData.append('duration', this.newCourse.duration);
    formData.append('EmployeeCode', employeeCode);
    formData.append('departmentId', this.newCourse.department.toString());
    formData.append('courseDurationIn', this.newCourse.durationTime.toString());
    formData.append('mode', mode.toString());
    if (mode === 1 && this.newCourse.courseId) {
      formData.append('courseId', this.newCourse.courseId.toString());
    }
    if (this.newCourse.file) {
      formData.append('Files', this.newCourse.file, this.newCourse.file.name);
    }
    this.http.post<any>(apiUrl, formData).subscribe(response => {
      if (response.status == true) {
        this.closeModal();
        this.fetchCourses();
      } else {
        alert('Failed to process course');
      }
    });
  }

  editCourse(course: any) {
    this.isCreateMode = false; // Switch to edit mode
    // Fetch course details by calling the API with courseId and mode
    const apiUrl = '/api/webCourseMaster/GetCourseDetailsforWEB'; // API endpoint for getting course details
    const requestBody = {
      mode: 2, // Specify the mode as 2 to get the course details
      courseId: course.courseId // Pass the courseId to get the details of the selected course
    };
    // Make the HTTP request to get the course details
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status == true) {
          // If the API returns success, bind the response data to the form fields
          const courseDetails = response.data[0]; // Assuming the response contains an array of course details
          // Now populate the modal form with the course details
          this.newCourse.title = courseDetails.courseName;  // Set course title
          this.newCourse.description = courseDetails.description;  // Set course description
          this.newCourse.duration = courseDetails.duration;  // Set course duration
          this.newCourse.courseId = courseDetails.courseId;  // Set courseId for updating
          this.newCourse.department = courseDetails.DepartmentID;  // Set Department ID
          this.newCourse.durationTime = courseDetails.DurationID;  // Set Duration ID (Course Duration In)
          this.thumbnailPreview = courseDetails.thumbnail || null;  // Handle thumbnail preview (if exists)
          // Open the modal with pre-filled data for editing
          this.openModal();  
        } else {
          alert('Failed to fetch course details');
        }
      },
      error => {
        console.error('Error fetching course details:', error);
        alert('An error occurred while fetching the course details');
      }
    );
  }

  updateCourse() {
    const employeeCode = sessionStorage.getItem('employeeCode');  // Retrieve employee code from sessionStorage
    if (!employeeCode) {
      alert('Employee not logged in');
      return;
    }
    const apiUrl = '/api/webCourseMaster/SaveandUpdateCourseDetails';  // API endpoint for saving/updating courses
    const formData: FormData = new FormData();
    // Append the form data for updating the course
    formData.append('courseName', this.newCourse.title);  // Course name
    formData.append('description', this.newCourse.description);  // Course description
    formData.append('duration', this.newCourse.duration);  // Course duration
    formData.append('EmployeeCode', employeeCode);  // Employee code (from session storage)
    formData.append('departmentId', this.newCourse.department.toString());  // Department ID or name
    formData.append('courseDurationIn', this.newCourse.durationTime);  // Duration unit (e.g., 'Days')
    formData.append('mode', '1');  // Mode 1 for updating an existing course
  
    // Append courseId for updating the existing course
    if (this.newCourse.courseId) {
      formData.append('courseId', this.newCourse.courseId.toString());  // Include courseId to update
    } else {
      alert('Course ID is missing. Cannot update the course.');
      return;
    }
  
    // Append the file if present (for thumbnail or other files)
    if (this.newCourse.file) {
      formData.append('Files', this.newCourse.file, this.newCourse.file.name);  // Use 'Files' for the file field
    }
  
    // Make the HTTP request to update the course
    this.http.post<any>(apiUrl, formData).subscribe(
      response => {
        if (response.status == true) {
          alert('Course updated successfully!');
          
          // Close the modal after successful update
          this.closeModal();
          
          // Fetch the updated courses list
          this.fetchCourses();
          
          // Reset the form to its initial state
          this.resetForm();
        } else {
          alert('Failed to update course: ' + (response.message || 'Unknown error'));
        }
      },
      error => {
        console.error('Error updating course:', error);
        alert('An error occurred while updating the course');
      }
    );
  }
  
  // Function to delete a course
  deleteCourse(course: any) {
    const confirmDelete = window.confirm(`Are you sure you want to delete the course: ${course.name}?`);
    if (confirmDelete) {
      const apiUrl = '/api/webCourseMaster/GetCourseDetailsforWEB'; // API URL for delete
      const requestBody = {
        mode: 3,  // Mode for delete operation
        courseId: course.courseId  // Pass the courseId of the course to be deleted
      };

      this.http.post<any>(apiUrl, requestBody).subscribe(
        response => {
          if (response.status == true) {
            // Remove the deleted course from the courses array
            this.courses = this.courses.filter((c: { courseId: any; }) => c.courseId !== course.courseId);

          } else {
            alert('Failed to delete course');
          }
        },

      );
    }
  }

  resetForm() {
    this.isCreateMode = true;
    this.modalHeader = 'Create Course';  // Reset modal header to 'Create Course'
    this.newCourse = {
      title: '',
      department: '',
      duration: '',
      questionPaper: '',
      durationTime: '',
      description: '',
      file: null as File | null,
      courseId: null as number | null
    };
    this.thumbnailPreview = null;
  }

  submitForm() {
    // Validate Course Title
    if (!this.newCourse.title) {
      alert('Please enter a course title.');
      // Focus on the Course Title input field
      document.getElementById('courseTitle')?.focus();
      return; // Stop further execution
    }
  
    // Validate Department
    if (!this.newCourse.department) {
      alert('Please select a department.');
      // Focus on the Department select field
      document.getElementById('department')?.focus();
      return; // Stop further execution
    }
  
   
  
    // Validate Course Duration In
    if (!this.newCourse.durationTime) {
      alert('Please select the duration In.');
      // Focus on the Duration Time select field
      document.getElementById('durationTime')?.focus();
      return; // Stop further execution
    }
   // Validate Course Duration
   if (!this.newCourse.duration || isNaN(Number(this.newCourse.duration))) {
    alert('Please enter a course duration time.');
    // Focus on the Course Duration input field
    document.getElementById('duration')?.focus();
    return; // Stop further execution
  }
    // Validate Thumbnail
    if (!this.newCourse.file && this.isCreateMode === true) {
      alert('Please upload a thumbnail image.');
      // Focus on the File Upload input field
      document.getElementById('fileUpload')?.focus();
      return; // Stop further execution
    }
  
    // Validate Description
    if (!this.newCourse.description) {
      alert('Please enter a course description.');
      // Focus on the Description textarea field
      document.getElementById('description')?.focus();
      return; // Stop further execution
    }
  
    if (this.isCreateMode) {
      this.createCourse(0);  // Create mode
    } else {
      this.createCourse(1);  // Update mode
    }
  }
  
}
