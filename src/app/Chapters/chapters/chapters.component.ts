import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

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
  @ViewChild('courseSelect') courseSelect!: ElementRef;
  @ViewChild('chapterNameInput') chapterNameInput!: ElementRef;
  @ViewChild('durationTimeSelect') durationTimeSelect!: ElementRef;
  @ViewChild('durationInput') durationInput!: ElementRef;
  @ViewChild('contentTypeSelect') contentTypeSelect!: ElementRef;

  chapters: any;
  courses: any[] = [];
  contentTypes: ContentType[] = [];
  currentMode: number = 1;
  modalHeaderText: string = 'Create New Chapter';
  isModalOpen = false;
  isChapterModalOpen = false;
  selectedContent: string = '';
  durationTimes: Duration[] = [];
  selectedCourseId: number | null = null;
  chapterName: string | null = null;
  durationInId: number | null = null;
  duration: string | null = null;
  contentType: number | null = null;
  thumbnailPreview: string | null = null;
  contentOptions: any;
  selectedChapterID: number | null = null;
  fileAcceptType: string = '';

  constructor(private http: HttpClient, private location: Location) { }

  ngOnInit() {
    this.fetchChapters();
    this.fetchCourses();
    this.fetchDurationOptions();
    this.fetchContentTypes();
  }

  goBack(): void {
    this.location.back();
  }

  validateNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.duration = input.value;
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

  fetchCourses() {
    const apiUrl = '/api/webCourseMaster/GetDepartmentInfo';
    const requestBody = { mode: 4 };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status === true) {
          this.courses = response.data.map((course: any) => ({
            name: course.courseName,
            courseId: course.courseId
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

  fetchDurationOptions() {
    const apiUrl = '/api/webCourseMaster/GetDepartmentInfo';
    const requestBody = {
      mode: 2
    };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status == true) {
          this.durationTimes = response.data.map((duration: any) => {
            return {
              DurationID: duration.DurationID,
              DurationName: duration.DurationName
            };
          });
        }
      },
    );
  }

  fetchContentTypes() {
    const apiUrl = '/api/webCourseMaster/GetDepartmentInfo';
    const requestBody = { mode: 5 };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status == true) {
          this.contentTypes = response.data.map((contentType: any) => ({
            ContentID: contentType.ContentID,
            ContentName: contentType.ContentName
          }));
          console.log('Content Types:', this.contentTypes);
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
    this.modalHeaderText = 'Create New Chapter'
    this.currentMode = 0;
    this.isModalOpen = true;
    this.selectedCourseId = null;
    this.chapterName = '';
    this.durationInId = null;
    this.duration = null;
    this.contentType = null;
    this.fileAcceptType = 'file/*';
  }

  closeModal() {
    this.isModalOpen = false;
  }

  updateFileAcceptType(contentId: number | null) {
    console.log('Received contentId:', contentId);
    console.log('Content Types:', this.contentTypes);
    const numericContentId = Number(contentId);
    const selectedContentType = this.contentTypes.find(
      (type) => type.ContentID === numericContentId
    );
    const fileInput = document.getElementById('fileUploadChapter') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }

    if (selectedContentType) {
      switch (selectedContentType.ContentName) {
        case "Video":
          this.fileAcceptType = 'video/*';
          break;
        case "PDF":
          this.fileAcceptType = 'application/pdf';
          break;
        case "PPT":
          this.fileAcceptType =
            '.ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation';
          break;
        default:
          this.fileAcceptType = 'file/*';
      }
    } else {
      this.fileAcceptType = 'file/*';
    }
  }

  SaveandUpdateChapterDetails(): void {
    const employeeCode = sessionStorage.getItem('employeeCode');
    if (!employeeCode) {
      alert('Employee not logged in');
      return;
    }

    if (!this.selectedCourseId) {
      alert('Please select Course.');
      this.courseSelect.nativeElement.focus();
      return;
    }
    if (!this.chapterName || this.chapterName.trim() == '') {
      alert('Please enter ChapterName.');
      this.chapterNameInput.nativeElement.focus();
      return;
    }
    if (!this.durationInId) {
      alert('Please select Duration In.');
      this.durationTimeSelect.nativeElement.focus();
      return;
    }
    if (!this.duration || this.duration.trim() == '') {
      alert('Please enter Chapter duration.');
      this.durationInput.nativeElement.focus();
      return;
    }
    if (!this.contentType) {
      alert('Please select Content Type.');
      this.contentTypeSelect.nativeElement.focus();
      return;
    }

    const fileUploadChapter = (document.getElementById('fileUploadChapter') as HTMLInputElement).files?.[0];
    const chapterThumbnail = (document.getElementById('chapterThumbnail') as HTMLInputElement).files?.[0];

    const apiUrl = '/api/webCourseMaster/SaveandUpdateChapterDetails';
    const formData: FormData = new FormData();
    formData.append('mode', this.currentMode.toString());

    if (this.currentMode == 0 && !fileUploadChapter) {
      alert('Please upload a file for the chapter.');
      return;
    }
    else if (fileUploadChapter != null) {
      formData.append('contentLink', fileUploadChapter, fileUploadChapter.name);
    }

    if (chapterThumbnail != null) {
      formData.append('thumbnail', chapterThumbnail, chapterThumbnail.name);
    }

    if (this.selectedChapterID != null) {
      formData.append('chapterId', this.selectedChapterID.toString());
    }
    formData.append('courseId', this.selectedCourseId.toString());
    formData.append('chapterName', this.chapterName);
    formData.append('courseDurationIn', this.durationInId.toString());
    formData.append('duration', this.duration);
    formData.append('contentID', this.contentType.toString());
    formData.append('EmployeeCode', employeeCode);
    this.http.post<any>(apiUrl, formData).subscribe(
      response => {
        if (response.status === true) {
          this.fetchChapters();
          this.closeModal();
        } else {
          alert('Failed to save/update chapter details.');
        }
      },
      error => {
        console.error('Error saving/updating chapter details:', error);
        alert('An error occurred while saving/updating chapter details.');
      }
    );
  }

  editChapter(chapter: any): void {
    this.modalHeaderText = 'Update Chapter Details';
    const apiUrl = '/api/webCourseMaster/GetChapterDetailsforWEB';
    const requestBody = {
      mode: 2, chapterId: chapter.chapterId
    };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status == true) {
          const chapterDetails = response.data[0];
          this.selectedCourseId = chapterDetails.courseId;
          this.chapterName = chapterDetails.chapterName;
          this.durationInId = chapterDetails.durationIn;
          this.duration = chapterDetails.duration;
          this.contentType = chapterDetails.contentType;
          this.isModalOpen = true;
          this.currentMode = 1;
          this.selectedChapterID = chapterDetails.chapterId;
        } else {
          alert('Failed to load Chapter details');
        }
      },
      error => {
        console.error('Error fetching Chapter details:', error);
        alert('An error occurred while fetching Chapter details');
      }
    );
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

}
