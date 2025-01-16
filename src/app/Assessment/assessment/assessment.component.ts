import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assessment',
standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assessment.component.html',
  styleUrl: './assessment.component.css'
})
export class AssessmentComponent {
  courses = [
    { name: 'Angular Basics', languages: 'TypeScript, HTML, CSS' },
    { name: 'React Fundamentals', languages: 'JavaScript, JSX' },
    { name: 'Vue Introduction', languages: 'JavaScript, HTML, CSS' },
  ];

  chapters = [];

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

  departments = ['Computer Science', 'Information Technology', 'Electrical Engineering'];
  questionPapers = ['MCQ', 'Descriptive', 'Practical'];
  durationTimes = ['1 Hour', '2 Hours', '3 Hours'];

  thumbnailPreview: string | null = null;

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
      this.courses.push({
        name: this.newCourse.title,
        languages: `${this.newCourse.department}, ${this.newCourse.duration}`
      });
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
    if (confirmDelete) {
      this.courses = this.courses.filter((c) => c !== course);
    }
  }

  deleteChapter(chapter: any) {
    const confirmDelete = confirm(`Are you sure you want to delete ${chapter.name}?`);
    if (confirmDelete) {
      this.chapters = this.chapters.filter((c) => c !== chapter);
    }
  }

  editCourse(course: any) {
    alert(`Editing course: ${course.name}`);
  }
}
