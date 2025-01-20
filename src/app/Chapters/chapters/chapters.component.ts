import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

interface Duration {
  DurationID: number;
  DurationName: string;
}

interface ContentType {
  ContentID: number;
  ContentName: string;
}

@Component({
  selector: 'app-chapters',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './chapters.component.html',
  styleUrls: ['./chapters.component.css']
})
export class ChaptersComponent {
  chapters: any;
  courses: any[] = [];  // New array to hold course data
  contentTypes: ContentType[] = [];  // New array to hold content type data

  isModalOpen = false;
  isChapterModalOpen = false;  
  selectedContent: string = '';  // This stores the selected content ID
  durationTimes: Duration[] = [];  // New array to hold Course Duration In options

  newCourse = {
    title: '',
    department: '',
    duration: '',
    questionPaper: '',
    durationTime: '',
    description: '',
    file: null
  };

  newChapter = {
    name: '',
    duration: '',
    description: '',
    file: null,
    contentType: '',
    thumbnail: null
  };

  departments = ['Computer Science', 'Information Technology', 'Electrical Engineering'];
  questionPapers = ['MCQ', 'Descriptive', 'Practical'];
  thumbnailPreview: string | null = null;
contentOptions: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchChapters();
    this.fetchDurationOptions();
    this.fetchCourses();  // Fetch the courses
    this.fetchContentTypes();  // Fetch the content types
  }

  fetchChapters() {
    const apiUrl = '/api/webCourseMaster/GetChapterDetailsforWEB';
    const requestBody = { mode: 1 };

    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status === true) {
          this.chapters = response.data.map((chapter: any) => ({
            chapterId: chapter.chapterId,
            name: chapter.chapterName
          }));
        } else {
          this.chapters = [];
        }
      },
      (error) => {
        console.error('Error fetching chapters:', error);
        alert('An error occurred while fetching chapters');
        this.chapters = [];
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


  fetchCourses() {
    const apiUrl = '/api/webCourseMaster/GetDepartmentInfo';  // The same URL as per your request
    const requestBody = { mode: 4 };  // Mode: 4 for fetching courses

    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status === true) {
          // Populate the courses array with fetched data
          this.courses = response.data.map((course: any) => ({
            id: course.courseId,
            name: course.courseName
          }));
        } else {
          alert('No courses found.');
        }
      },
      (error) => {
        console.error('Error fetching courses:', error);
        alert('An error occurred while fetching courses.');
      }
    );
  }

  // New method to fetch content types (PPT, PDF, Video)
  fetchContentTypes() {
    const apiUrl = '/api/webCourseMaster/GetDepartmentInfo';
    const requestBody = { mode: 5 };  // Mode 5 for content types (PPT, PDF, Video)

    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status === true) {
          this.contentTypes = response.data.map((contentType: any) => ({
            ContentID: contentType.ContentID,
            ContentName: contentType.ContentName
          }));
        } else {
          alert('No content types found.');
        }
      },
      (error) => {
        console.error('Error fetching content types:', error);
        alert('An error occurred while fetching content types.');
      }
    );
  }

  openModal() {
    console.log('Modal is opening...');
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  handleFileUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.newCourse.file = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.thumbnailPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  submitForm() {
    if (this.newCourse.title && this.newCourse.department && this.newCourse.duration && this.newCourse.questionPaper && this.newCourse.durationTime && this.newCourse.description) {
      alert('New course created successfully!');
      this.resetForm();
      this.closeModal();
    } else {
      alert('Please fill out all fields');
    }
  }

  resetForm() {
    this.newCourse = {
      title: '',
      department: '',
      duration: '',
      questionPaper: '',
      durationTime: '',
      description: '',
      file: null
    };
    this.thumbnailPreview = null;
  }

  resetChapterForm() {
    this.newChapter = {
      name: '',
      duration: '',
      description: '',
      file: null,
      contentType: '',
      thumbnail: null
    };
  }

  deleteChapter(chapter: any) {
    const confirmDelete = confirm(`Are you sure you want to delete the chapter "${chapter.name}"?`);
    if (confirmDelete) {
      const apiUrl = '/api/webCourseMaster/GetChapterDetailsforWEB';
      const requestBody = { mode: 3, chapterId: chapter.chapterId };

      this.http.post<any>(apiUrl, requestBody).subscribe(
        (response) => {
          if (response.status === true) {
            this.chapters = this.chapters.filter((c: { chapterId: any; }) => c.chapterId !== chapter.chapterId);
          } else {
            alert('Error: ' + response.message);
          }
        },
        (error) => {
          console.error('Error deleting chapter:', error);
          alert('An error occurred while deleting the chapter');
        }
      );
    }
  }

  editCourse(course: any) {
    alert(`Editing course: ${course.name}`);
  }
}
