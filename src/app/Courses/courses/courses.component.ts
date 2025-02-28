import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http'; 
import { Router } from '@angular/router'; 

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
  standalone: true, 
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent {
  mode: number = 0;
  modalHeader: string = 'Create Course';
  chapters = [];
  isModalOpen = false;
  isChapterModalOpen = false;
  isEditing = false;
  isCreateMode = true;
  departments: Department[] = [];
  newCourse = {
    title: '',
    department: '',
    duration: '',
    questionPaper: '',
    durationTime: '',
    description: '',
    file: null as File | null,
    courseId: null as number | null, 
  };

  newChapter = {
    name: '',
    duration: '',
    description: '',
    file: null,
    contentType: '',
    thumbnail: null
  };

  durationTimes: Duration[] = []; 
  questionPapers = ['MCQ', 'Descriptive', 'Practical'];
  thumbnailPreview: string | null = null;
  courses: any;
  handleFileUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.newCourse.file = file;
    }
  }

  constructor(private http: HttpClient, private router: Router, private location: Location) { }

  mapCourse(courseId: number) {
    this.router.navigate(['/layout/Mapping/course-mapping'], { queryParams: { courseId: courseId } });
  }

  ngOnInit() {
    if (!this.courses) {
      this.courses = [];
    }
    this.fetchCourses();
    this.fetchDepartments();
    this.fetchDurationOptions();
    const employeeCode = sessionStorage.getItem('employeeCode');
    if (employeeCode) {
      console.log('EmployeeCode:', employeeCode);
    } else {
      console.log('EmployeeCode not found in sessionStorage');
    }
  }

  goBack(): void {
    this.location.back();
  }
  fetchCourses() {
    const apiUrl = '/api/api/webCourseMaster/GetCourseDetailsforWEB';
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
        this.courses = [];  // Ensure courses is an empty array on error
      }
    );
  }

  fetchDepartments() {
    const apiUrl = '/api/api/webCourseMaster/GetDepartmentInfo';
    const requestBody = { mode: 1 };

    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status == true) {
          this.departments = response.data.map((dept: { DepartmentID: number, DepartmentName: string }) => ({
            DepartmentID: dept.DepartmentID,
            DepartmentName: dept.DepartmentName
          }));
        } else {
          console.error(response.message);
        }
      },
      error => {
        console.error('Error fetching departments:', error);
      }
    );
  }

  fetchDurationOptions() {
    const apiUrl = '/api/api/webCourseMaster/GetDepartmentInfo';
    const requestBody = {
      mode: 2
    };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status == true) {
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
    this.resetForm();
  }

  validateNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.newCourse.duration = input.value;
  }

  createCourse(mode: number) {
    const employeeCode = sessionStorage.getItem('employeeCode');
    if (!employeeCode) {
      alert('Employee not logged in');
      return;
    }
    const apiUrl = '/api/api/webCourseMaster/SaveandUpdateCourseDetails';
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
        console.error(response.message);
      }
    });
  }

  editCourse(course: any) {
    this.isCreateMode = false;
    const apiUrl = '/api/api/webCourseMaster/GetCourseDetailsforWEB';
    const requestBody = {
      mode: 2,
      courseId: course.courseId
    };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status == true) {
          const courseDetails = response.data[0];
          this.newCourse.title = courseDetails.courseName;
          this.newCourse.description = courseDetails.description;
          this.newCourse.duration = courseDetails.duration;
          this.newCourse.courseId = courseDetails.courseId;
          this.newCourse.department = courseDetails.DepartmentID; 
          this.newCourse.durationTime = courseDetails.DurationID; 
          this.thumbnailPreview = courseDetails.thumbnail || null; 
          this.openModal();
        } else {
          console.error(response.message);
        }
      },
      error => {
        console.error('Error fetching course details:', error);
      }
    );
  }

  updateCourse() {
    const employeeCode = sessionStorage.getItem('employeeCode'); 
    if (!employeeCode) {
      alert('Employee not logged in');
      return;
    }
    const apiUrl = '/api/api/webCourseMaster/SaveandUpdateCourseDetails';
    const formData: FormData = new FormData();
    formData.append('courseName', this.newCourse.title);
    formData.append('description', this.newCourse.description);
    formData.append('duration', this.newCourse.duration);
    formData.append('EmployeeCode', employeeCode); 
    formData.append('departmentId', this.newCourse.department.toString()); 
    formData.append('courseDurationIn', this.newCourse.durationTime); 
    formData.append('mode', '1');

    if (this.newCourse.courseId) {
      formData.append('courseId', this.newCourse.courseId.toString());
    } else {
      alert('Course ID is missing. Cannot update the course.');
      return;
    }

    if (this.newCourse.file) {
      formData.append('Files', this.newCourse.file, this.newCourse.file.name);
    }
    this.http.post<any>(apiUrl, formData).subscribe(
      response => {
        if (response.status == true) {
          this.closeModal();
          this.fetchCourses();
          this.resetForm();
        } else {
          console.error(response.message);
        }
      },
      error => {
        console.error('Error updating course:', error);
      }
    );
  }

  // Function to delete a course
  deleteCourse(course: any) {
    const confirmDelete = window.confirm(`Are you sure you want to delete the course: ${course.name}?`);
    if (confirmDelete) {
      const apiUrl = '/api/api/webCourseMaster/GetCourseDetailsforWEB';
      const requestBody = {
        mode: 3,
        courseId: course.courseId 
      };

      this.http.post<any>(apiUrl, requestBody).subscribe(
        response => {
          if (response.status == true) {
            this.courses = this.courses.filter((c: { courseId: any; }) => c.courseId !== course.courseId);
          } else {
            console.error(response.message);
          }
        },

      );
    }
  }

  resetForm() {
    this.isCreateMode = true;
    this.modalHeader = 'Create Course';
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
    if (!this.newCourse.title) {
      alert('Please enter a course title.');
      document.getElementById('courseTitle')?.focus();
      return;
    }

    if (!this.newCourse.department) {
      alert('Please select a department.');
      document.getElementById('department')?.focus();
      return;
    }

    if (!this.newCourse.durationTime) {
      alert('Please select the duration In.');
      document.getElementById('durationTime')?.focus();
      return;
    }

    if (!this.newCourse.duration || isNaN(Number(this.newCourse.duration))) {
      alert('Please enter a course duration time.');
      document.getElementById('duration')?.focus();
      return;
    }

    if (!this.newCourse.file && this.isCreateMode === true) {
      alert('Please upload a thumbnail image.');
      document.getElementById('fileUpload')?.focus();
      return;
    }

    if (!this.newCourse.description) {
      alert('Please enter a course description.');
      document.getElementById('description')?.focus();
      return;
    }

    if (this.isCreateMode) {
      this.createCourse(0);
    } else {
      this.createCourse(1);
    }
  }

}
