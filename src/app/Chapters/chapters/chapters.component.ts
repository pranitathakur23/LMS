import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';  // Import HttpClientModule and HttpClient
@Component({
  selector: 'app-chapters',
  standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule ],
  templateUrl: './chapters.component.html',
  styleUrl: './chapters.component.css'
})
export class ChaptersComponent {
  // courses = [
  //   { name: 'Angular Basics', languages: 'TypeScript, HTML, CSS' },
  //   { name: 'React Fundamentals', languages: 'JavaScript, JSX' },
  //   { name: 'Vue Introduction', languages: 'JavaScript, HTML, CSS' },
  // ];

  chapters: any;

  isModalOpen = false;
  isChapterModalOpen = false;  // Controls chapter modal visibility

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
  constructor(private http: HttpClient) {}  // Inject HttpClient

  ngOnInit() {
    if (!this.chapters) {
      this.chapters = [];  // Initialize courses if it's undefined
    }
    this.fetchChapters();
    
  }
  fetchChapters() {
    const apiUrl = '/api/webCourseMaster/GetChapterDetailsforWEB';
    const requestBody = { mode: 1 };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status == true) {
          this.chapters = response.data.map((chapters: any) => ({
            // SrNo: chapters.SrNo,
             name: chapters.chapterName,
            // courseId: course.courseId,
          }));
        } else {
          this.chapters = [];  // Ensure courses is an empty array if no data
        }
      },
      (error) => {
        console.error('Error fetching courses:', error);
        alert('An error occurred while fetching courses');
        this.chapters = [];  // Ensure courses is an empty array on error
      }
    );
  }


  departments = ['Computer Science', 'Information Technology', 'Electrical Engineering'];
  questionPapers = ['MCQ', 'Descriptive', 'Practical'];
  durationTimes = ['1 Hour', '2 Hours', '3 Hours'];

  thumbnailPreview: string | null = null;


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
      // this.courses.push({
      //   name: this.newCourse.title,
      //   languages: `${this.newCourse.department}, ${this.newCourse.duration}`
      // });
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

  submitChapterForm() {
    // if (this.newChapter.name && this.newChapter.duration && this.newChapter.description && this.newChapter.contentType) {
    //   this.chapters.push(this.newChapter);
    //   alert('New chapter added!');
    //   this.resetChapterForm();
    //   this.closeChapterModal();
    // } else {
    //   alert('Please fill out all fields');
    // }
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

  deleteCourse(course: any) {
    const confirmDelete = confirm(`Are you sure you want to delete ${course.name}?`);
    // if (confirmDelete) {
    //   this.courses = this.courses.filter((c) => c !== course);
    // }
  }

  // deleteChapter(chapter: any) {
  //   const confirmDelete = confirm(`Are you sure you want to delete ${chapter.name}?`);
  //   if (confirmDelete) {
  //     this.chapters = this.chapters.filter((c) => c !== chapter);
  //   }
  // }

  editCourse(course: any) {
    alert(`Editing course: ${course.name}`);
  }
}
