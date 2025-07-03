import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main-course',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './main-course.component.html',
  styleUrl: './main-course.component.css'
})
export class MainCourseComponent implements OnInit {
  Maincourses: any[] = [];
  newCourse: any = {
  MainCourse: '',
  MainCourseID: null
};

isEditMode: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchMainCourses();
  }

navigateToCourse(courseId: number) {
  console.log('Navigating to CourseID:', courseId);
  this.router.navigate(['layout/Courses/courses', courseId]);
}
  fetchMainCourses() {
    const apiUrl = '/api/api/webCourseMaster/GetCourseDetailsforWEB';
    const requestBody = { mode: 7 };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        console.log('Received response:', response);
        if (response.status == true) {
          this.Maincourses = response.data.map((course: any, index: number) => ({
            SrNo: index + 1,
            CourseID: course.MainCourseID,
            CourseName: course.MainCourseName
          }));
        } else {
          this.Maincourses = [];
        }
      },
      (error) => {
        console.error('Error fetching courses:', error);
        this.Maincourses = [];
      }
    );
  }
deleteCourse(course: any) {
  const confirmDelete = confirm(`Are you sure you want to delete "${course.CourseName}"?`);

  if (confirmDelete) {
    const requestBody = {
      mode: 10,
      courseId: course.CourseID
    };

    this.http.post('/api/api/webCourseMaster/GetCourseDetailsforWEB', requestBody)
      .subscribe({
        next: (response: any) => {
          console.log('Delete response:', response);
          alert('Course deleted successfully ✅');
          this.fetchMainCourses(); // Refresh the list
        },
        error: (err) => {
          console.error('Error deleting course:', err);
          alert('Something went wrong ❌. Please try again.');
        }
      });
  }
}

  createMainCourse() {
    if (!this.newCourse.MainCourse) {
      alert('Please enter a Main Course Name.');
      document.getElementById('mainCourseInput')?.focus();
      return;
    }

    const apiUrl = '/api/api/webCourseMaster/SaveMainCourseData';
    const requestBody = { maincoursename: this.newCourse.MainCourse };

    this.http.post<any>(apiUrl, requestBody).subscribe((response) => {
      if (response.status == true) {
        alert('Course saved successfully..!');
        this.fetchMainCourses();
        this.newCourse.MainCourse = '';
      } else {
        console.error(response.message);
      }
    });
  }

editCourse(course: any) {
  this.newCourse = {
    MainCourse: course.CourseName,     // sets input value
    MainCourseID: course.CourseID      // needed for update
  };
  this.isEditMode = true;
}
saveMainCourse() {
  if (!this.newCourse.MainCourse) {
    alert('Please enter a Main Course Name.');
    document.getElementById('mainCourseInput')?.focus();
    return;
  }

  const apiUrl = '/api/api/webCourseMaster/SaveMainCourseData';

  const requestBody: any = {
    maincoursename: this.newCourse.MainCourse
  };

  if (this.newCourse.MainCourseID) {
    requestBody.MainCourseId = this.newCourse.MainCourseID; // ✅ Correct key name!
  }

  console.log('Sending to API:', requestBody); // ✅ Debug print

  this.http.post(apiUrl, requestBody).subscribe({
    next: (response: any) => {
      const message = this.newCourse.MainCourseID
        ? 'Main Course updated successfully ✅'
        : 'Main Course added successfully ✅';

      alert(message);
      this.fetchMainCourses();
      this.resetForm();
    },
    error: (err) => {
      console.error('Error saving course:', err);
      alert('Something went wrong ❌');
    }
  });
}



resetForm() {
  this.newCourse = {
    MainCourse: '',
    MainCourseID: null
  };
  this.isEditMode = false;
}
  onRowClick(event: MouseEvent, courseID: number) {
  const target = event.target as HTMLElement;

  // If the click originated from a button or icon, don't navigate
  if (target.closest('button') || target.tagName === 'I') {
    return;
  }

  this.navigateToCourse(courseID);
}
}
