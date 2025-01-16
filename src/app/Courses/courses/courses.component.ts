import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';  // Import HttpClientModule and HttpClient

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

// Method to handle file upload
handleFileUpload(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.newCourse.file = file;  // Assign the file to newCourse.file
  }


}

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

  constructor(private http: HttpClient) {}  // Inject HttpClient

  ngOnInit() {
    this.fetchCourses();
    this.fetchDepartments();  // Fetch departments on component initialization
    this.fetchDurationOptions();  // Fetch Course Duration In options

    // Retrieve EmployeeCode from sessionStorage
  const employeeCode = sessionStorage.getItem('employeeCode');
  if (employeeCode) {
    console.log('EmployeeCode:', employeeCode);
  } else {
    console.log('EmployeeCode not found in sessionStorage');
  }
  }

  // Function to fetch courses from the API
  fetchCourses() {
    const apiUrl = '/api/webCourseMaster/GetCourseDetailsforWEB'; // Full URL
    const requestBody = {
      mode: 1
    };

    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        console.log(response);  // Log the response for debugging
        if (response.status) {
          this.courses = response.data.map((course: any) => {
            return {
              SrNo: course.SrNo,
              name: course.courseName,  // Adjusted to match template
              courseId: course.courseId
            };
          });
        } else {
          alert('Failed to load courses');
        }
      },
      error => {
        console.error('Error fetching courses:', error);
        alert('An error occurred while fetching courses');
      }
    );
  }

// Fetch departments (adjust this method as per your requirements)
fetchDepartments() {
  const apiUrl = '/api/webCourseMaster/GetDepartmentInfo';
  const requestBody = { mode: 1 };

  this.http.post<any>(apiUrl, requestBody).subscribe(
    response => {
      if (response.status) {
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
        if (response.status) {
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
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openChapterModal() {
    this.isChapterModalOpen = true;
  }

  closeChapterModal() {
    this.isChapterModalOpen = false;
  }

  
  
 
  
  submitForm() {
    if (this.isCreateMode==true) {
      var mode=0;
      this.createCourse(mode);
    } else {
      var mode=1;
      this.createCourse(mode);
    }


  }

  // Example method to create a course
 createCourse(mode: number) {
  debugger;
  const employeeCode = sessionStorage.getItem('employeeCode');
  if (!employeeCode) {
    alert('Employee not logged in');
    return;
  }

  const apiUrl = '/api/webCourseMaster/SaveandUpdateCourseDetails';
  const formData: FormData = new FormData();

  // Append form data for creating a new course
  formData.append('courseName', this.newCourse.title);
  formData.append('description', this.newCourse.description);
  formData.append('duration', this.newCourse.duration);
  formData.append('EmployeeCode', employeeCode);

  const departmentId = this.newCourse.department;  // This can be a string or number
  if (typeof departmentId === 'string') {
    // Find the corresponding department object based on the department name
    const department = this.departments.find(dept => dept.DepartmentName === departmentId);
    if (department) {
      formData.append('departmentId', department.DepartmentID.toString());  // Append department ID as string
    } else {
      alert('Invalid department selected');
      return;
    }
  } else if (typeof departmentId === 'number') {
    // If department is already an ID, use it directly
    // formData.append('departmentId', departmentId.toString());
  } else {
    alert('Invalid department format');
    return;
  }

  formData.append('courseDurationIn', this.newCourse.durationTime);
  formData.append('mode', mode.toString()); // Use the passed mode parameter here
// Log the mode value before appending it
console.log('Mode value:', mode);
  // Handle file upload if there is a file
  if (this.newCourse.file) {
    formData.append('Files', this.newCourse.file, this.newCourse.file.name);  // Append file if provided
  }

  // Make the HTTP request to create the course
  this.http.post<any>(apiUrl, formData).subscribe(
    response => {
      if (response.status) {
        alert('Course created successfully!');

        // Reset the modal and form after successful creation
        this.closeModal();  // Close modal after success
        this.fetchCourses();  // Refresh courses list
        this.resetForm();  // Reset the form

        // Optional: If you want to reset modal visibility to false and reset the file input
        this.isModalOpen = false;  // Close modal after creating the course
      } else {
        alert('Failed to create course: ' + (response.message || 'Unknown error'));
      }
    },
    error => {
      console.error('Error creating course:', error);
      alert('An error occurred while creating the course');
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
  
    // If there's a file, append it to the form data
    if (this.newCourse.file) {
      formData.append('Files', this.newCourse.file, this.newCourse.file.name);  // Use 'Files' for the file field
    }
  
    // Send the HTTP request to update the course
    this.http.post<any>(apiUrl, formData).subscribe(
      response => {
        if (response.status) {
          alert('Course updated successfully!');
               
        // Close the modal
        this.closeModal();
        
        // Fetch updated courses
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
  
  submitChapterForm() {
    // Handle chapter form submission if needed
  }

    // Reset form before creating a new course
    resetForm() {
      this.isCreateMode = true;  // Switch back to create mode
      this.newCourse = {
        title: '',
        department: '',
        duration: '',
        questionPaper: '',
        durationTime: '',
        description: '',
        file: null as File | null,
        courseId: null as number | null  // Add courseId to the newCourse object
      };
      this.thumbnailPreview = null;
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
          if (response.status) {
            // Remove the deleted course from the courses array
            this.courses = this.courses.filter((c: { courseId: any; }) => c.courseId !== course.courseId);

          } else {
            alert('Failed to delete course');
          }
        },

      );
    }
  }

  deleteChapter(chapter: any) {
    const confirmDelete = confirm(`Are you sure you want to delete ${chapter.name}?`);
    if (confirmDelete) {
      this.chapters = this.chapters.filter((c) => c !== chapter);
    }
  }

  editCourse(course: any) {
      // Populate the form with the existing course data
  this.isCreateMode = false;  // Switch to edit mode
  this.newCourse.title = course.name;
  this.newCourse.description = course.description;
  this.newCourse.duration = course.duration;
  this.newCourse.courseId = course.courseId;  // Save courseId to the form
  this.newCourse.department = course.department;  // Add department if needed
  this.newCourse.durationTime = course.courseDurationIn;  // Course duration type (e.g., Days, Weeks)

    this.isCreateMode = false;  // Set to edit mode
    const apiUrl = '/api/webCourseMaster/GetCourseDetailsforWEB';
    const requestBody = {
      mode: 2,
      courseId: course.courseId
    };

    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status) {
          const courseDetails = response.data[0];
          this.newCourse.title = courseDetails.courseName;
          this.newCourse.description = courseDetails.description;
          this.newCourse.duration = courseDetails.duration;
          this.thumbnailPreview = courseDetails.thumbnail;
          this.isEditing = true;  // Set to editing mode
          this.isModalOpen = true;  // Open the modal
        } else {
          alert('Failed to load course details');
        }
      },
      error => {
        console.error('Error fetching course details:', error);
        alert('An error occurred while fetching course details');
      }
    );
  }

  SaveCourseDetails(mobileNo: number): void {

    // const fileExtension = this.selectedFile.name.split('.').pop();
    // const newFileName = `${mobileNo}.${fileExtension}`;
    // const renamedFile = new File([this.selectedFile], newFileName, { type: this.selectedFile.type });

    const apiUrl = '/api/api/webCourseMaster/SaveandUpdateCourseDetails';
    const formData: FormData = new FormData();

    formData.append('courseName', mobileNo.toString());
    formData.append('description', mobileNo.toString());
    formData.append('duration', mobileNo.toString());
    formData.append('EmployeeCode', mobileNo.toString());
    formData.append('departmentId', mobileNo.toString());
    formData.append('courseDurationIn', mobileNo.toString());
    formData.append('mode', '0');
    // formData.append('FilePath', renamedFile);

    this.http.post<any>(apiUrl, formData).subscribe(
      response => {
        if (response.status == true) {
          alert('Welcome image uploaded');
        } else {
          alert('Unexpected response format or empty data');
        }
      },
      error => {
        console.log('Error uploading Welcome image:', error);
      }
    );
  }

}
