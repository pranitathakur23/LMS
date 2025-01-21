import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-assessment',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './assessment.component.html',
  styleUrl: './assessment.component.css'
})

export class AssessmentComponent {
  @ViewChild('assessmentNameInput') assessmentNameInput!: ElementRef;
  @ViewChild('durationInput') durationInput!: ElementRef;
  @ViewChild('questionsCountInput') questionsCountInput!: ElementRef;
  @ViewChild('totalMarksInput') totalMarksInput!: ElementRef;
  @ViewChild('passingMarksInput') passingMarksInput!: ElementRef;
  @ViewChild('noOfAttemptsInput') noOfAttemptsInput!: ElementRef;
  @ViewChild('courseSelect') courseSelect!: ElementRef;
  @ViewChild('durationTimeSelect') durationTimeSelect!: ElementRef;
  selectedAssessmentID: number | null = null;
  currentMode: number = 1; 
  courses: any[] = [];
  selectedCourseId: number | null = null;
  selectedQuestionPaper: string | null = null;
  assessmentName: string | null = null;
  selectedDurationTime: number | null = null;
  durationValue: string | null = null;
  chapters = [];
  isModalOpen: boolean = false;
  isChapterModalOpen = false;
  questionPapers: string[] = [];
  questionsCount: number | null = null;
  totalMarks: number | null = null;
  passingMarks: number | null = null;
  noOfAttempts: number | null = null;
  modalHeaderText: string = 'Create New Assessment';

  newCourse = {
    durationTime: null
  };

  assessment: any[] = [];
  durationTimes: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.GetAssessmentdetails();
    this.fetchDurationOptions();
    this.fetchCourses();
    this.fetchQuestionsType();
  }

  openModal() {
    this.modalHeaderText = 'Create New Assessment'
    this.currentMode = 1;
    this.isModalOpen = true;
    this.selectedCourseId = null; 
    this.selectedQuestionPaper = null;
    this.assessmentName = null; 
    this.durationValue = '';
    this.questionsCount = null; 
    this.totalMarks = null; 
    this.passingMarks = null; 
    this.noOfAttempts = null; 
    this.newCourse = {
      durationTime: null,
    };
  }
  
  closeModal() {
    this.isModalOpen = false;
  }

  GetAssessmentdetails() {
    const apiUrl = '/api/webCourseMaster/GetAssessmentDetailsforWEB';
    const requestBody = { mode: 1 };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status === true) {
          this.assessment = response.data.map((course: any) => {
            return {
              SrNo: course.SrNo,
              CourseName: course.courseName,
              name: course.assessmentName,
              assessmentID: course.assessmentId,
              duration: course.duration,
            };
          });
        } else {
          alert('Failed to load Assessment');
        }
      },
      error => {
        console.error('Error fetching Assessment:', error);
        alert('An error occurred while fetching Assessment');
      }
    );
  }

  fetchCourses() {
    const apiUrl = '/api/webCourseMaster/GetCourseDetailsforWEB';
    const requestBody = { mode: 1 };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status == true) {
          this.courses = response.data.map((course: any) => {
            return {
              name: course.courseName,
              courseId: course.courseId
            };
          });
        } else {
          alert('No Courses available');
        }
      },
      error => {
        console.error('Error fetching courses:', error);
        alert('An error occurred while fetching courses');
      }
    );
  }

  fetchQuestionsType(): void {
    const apiUrl = '/api/webCourseMaster/GetDepartmentInfo';
    const requestBody = { mode: 3 };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status === true) {
          this.questionPapers = response.data.map((item: any) => item.Category);
        } else {
          alert('Failed to load question papers.');
        }
      },
      error => {
        console.error('Error fetching question papers:', error);
        alert('An error occurred while fetching question papers.');
      }
    );
  }

  fetchDurationOptions() {
    const apiUrl = '/api/webCourseMaster/GetDepartmentInfo';
    const requestBody = { mode: 2 };
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

  SaveandUpdateAssessmentDetails(): void {
    const employeeCode = sessionStorage.getItem('employeeCode');
    if (!this.selectedCourseId) {
      alert('Please select Course.');
      this.courseSelect.nativeElement.focus(); // Set focus to course field
      return;
    }
    if (!this.assessmentName || this.assessmentName.trim() == '') {
      alert('Assessment Name is required.');
      this.assessmentNameInput.nativeElement.focus(); // Set focus to assessment name field
      return;
    }
    if (!this.newCourse.durationTime) {
      alert('Course Duration Time is required.');
      this.durationTimeSelect.nativeElement.focus(); // Set focus to course duration field
      return;
    }
    if (!this.durationValue || this.durationValue.trim() == '') {
      alert('Duration is required.');
      this.durationInput.nativeElement.focus(); // Set focus to duration field
      return;
    }
   
    if (!this.questionsCount || this.questionsCount <= 0) {
      alert('Please enter number of Questions');
      this.questionsCountInput.nativeElement.focus(); // Set focus to questions count field
      return;
    }
    if (!this.totalMarks || this.totalMarks <= 0) {
      alert('Please enter Total Marks');
      this.totalMarksInput.nativeElement.focus(); // Set focus to total marks field
      return;
    }
    if (!this.passingMarks || this.passingMarks <= 0) {
      alert('Please enter Passing Marks');
      this.passingMarksInput.nativeElement.focus(); // Set focus to passing marks field
      return;
    }
    if (!this.noOfAttempts || this.noOfAttempts <= 0) {
      alert('Please enter Number of Attempts');
      this.noOfAttemptsInput.nativeElement.focus(); // Set focus to number of attempts field
      return;
    }
    const apiUrl = '/api/webCourseMaster/SaveandUpdateAssessmentDetails';
    const requestBody = {
      mode: this.currentMode,
      assessmentID: this.selectedAssessmentID,
      courseId: this.selectedCourseId,
      assessmentName: this.assessmentName,
      questionPaperSetName: this.selectedQuestionPaper,
      duration: this.durationValue,
      courseDurationIn: this.newCourse.durationTime,
      questionsCount: this.questionsCount,
      totalMarks: this.totalMarks,
      passingMarks: this.passingMarks,
      noOfAttempts: this.noOfAttempts,
      EmployeeCode: employeeCode
    };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status === true) {
          this.GetAssessmentdetails();
          this.closeModal();
        } else {
          alert('Failed to save/update assessment details.');
        }
      },
      error => {
        console.error('Error saving/updating assessment details:', error);
        alert('An error occurred while saving/updating assessment details.');
      }
    );
  }
  
  editAssessment(assessmentID: number): void {
    this.modalHeaderText = 'Update Assessment Details';
    const apiUrl = '/api/webCourseMaster/GetAssessmentDetailsforWEB';
    const requestBody = {
      mode: 2,
      assessmentID: assessmentID
    };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status == true) {
          const assessmentDetails = response.data[0];
          this.selectedCourseId = assessmentDetails.courseId;
          this.assessmentName = assessmentDetails.assessmentName;
          this.selectedQuestionPaper = assessmentDetails.questionPaperSetName;
          this.durationValue = assessmentDetails.Duration;
          this.questionsCount = assessmentDetails.questionsCount;
          this.totalMarks= assessmentDetails.totalMarks,
          this.passingMarks= assessmentDetails.passingMarks,
          this.noOfAttempts= assessmentDetails.noOfAttempts
          this.newCourse.durationTime = assessmentDetails.DurationID;
          this.isModalOpen = true;
          this.currentMode = 2;
          this.selectedAssessmentID = assessmentID;
        } else {
          alert('Failed to load assessment details');
        }
      },
      error => {
        console.error('Error fetching assessment details:', error);
        alert('An error occurred while fetching assessment details');
      }
    );
  }

  deleteAssessment(assessmentID: number) {
    const confirmDelete = window.confirm(`Are you sure you want to delete the Assessment: ${assessmentID}?`);
    if (confirmDelete == true) {
      const apiUrl = '/api/webCourseMaster/GetAssessmentDetailsforWEB';
      const requestBody = {
        mode: 3,
        assessmentID: assessmentID
      };
      this.http.post<any>(apiUrl, requestBody).subscribe(
        response => {
          if (response.status == true) {
            this.GetAssessmentdetails();
          } else {
            alert('Failed to delete assessment');
          }
        },

      );
    }
  }

}
