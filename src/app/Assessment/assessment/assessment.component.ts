import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Location } from '@angular/common';

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
  selectedType: string = 'course';
  isCourseDisabled: boolean = false;
  newCourse = {
    durationTime: null
  };

  assessment: any[] = [];
  durationTimes: any[] = [];

  constructor(private http: HttpClient,private location: Location) { }

  ngOnInit() {
    this.GetAssessmentdetails();
    this.fetchDurationOptions();
    this.fetchCourses();
    this.fetchQuestionsType();
  }

   // Method to set the selected type based on radio button change
   setSelection(type: string) {
    this.selectedType = type;
    if (this.selectedType === 'general') {
      this.selectedCourseId = 0;
      this.isCourseDisabled = true;
    } else if (this.selectedType === 'course') {
      this.selectedCourseId = null;
      this.isCourseDisabled = false;
    }
  }

  openModal() {
    this.modalHeaderText = 'Create New Assessment'
    this.currentMode = 1;
    this.selectedType = 'course';
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

  goBack(): void {
    this.location.back();
  }

  closeModal() {
    this.isModalOpen = false;
  }

  GetAssessmentdetails() {
    const apiUrl = '/api/api/webCourseMaster/GetAssessmentDetailsforWEB';
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
              CourseID: course.courseId,
            };
          });
        } else {
          console.error('Error fetching Assessment:', response.message);
          this.assessment = [];
        }
      },
      error => {
        console.error('Error fetching Assessment:', error);
        this.assessment = [];
      }
    );
  }

  SaveAssessmentAllocation(courseId: number, assessmentId: number) {
    const apiUrl = '/api/api/webCourseMaster/SaveAssessmentAllocationForWEB';
    const requestBody = { mode: 1, courseId: courseId, assessmentID: assessmentId };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status === true) {
          alert('Assessment allocated successfully');
        } else {
          console.error(response.message);
        }
      },
      error => {
        console.error('Error while allocating Assessment:', error);
      }
    );
  }
  
  fetchCourses() {
    const apiUrl = '/api/api/webCourseMaster/GetCourseDetailsforWEB';
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
          console.error('Error fetching course details:', response.message);
        }
      },
      error => {
        console.error('Error fetching courses:', error);
      }
    );
  }

  fetchQuestionsType(): void {
    const apiUrl = '/api/api/webCourseMaster/GetDepartmentInfo';
    const requestBody = { mode: 3 };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status === true) {
          this.questionPapers = response.data.map((item: any) => item.Category);
        } else {
          console.error('Error fetching question papers:', response.message);
        }
      },
      error => {
        console.error('Error fetching question papers:', error);
      }
    );
  }

  fetchDurationOptions() {
    const apiUrl = '/api/api/webCourseMaster/GetDepartmentInfo';
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

  validateNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    if (input.id === 'chapterDuration') {
      this.durationValue = input.value;
    } else if (input.id === 'questionsCount') {
      this.questionsCount = input.value ? Number(input.value) : null;
    } else if (input.id === 'totalMarks') {
      this.totalMarks = input.value ? Number(input.value) : null;
    } else if (input.id === 'passingMarks') {
      this.passingMarks = input.value ? Number(input.value) : null;
    } else if (input.id === 'noOfAttempts') {
      this.noOfAttempts = input.value ? Number(input.value) : null;
    }
  }
  
  SaveandUpdateAssessmentDetails(): void {
    const employeeCode = sessionStorage.getItem('employeeCode');
  
    // Validation: Check if 'course' is selected and a course is chosen
    if (this.selectedType === 'course' && !this.selectedCourseId) {
      alert('Please select a Course.');
      return; // Prevent form submission if no course is selected
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
    const apiUrl = '/api/api/webCourseMaster/SaveandUpdateAssessmentDetails';
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
    console.log('Body', requestBody)
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status === true) {
          this.GetAssessmentdetails();
          this.closeModal();
        } else {
          console.error('Failed to save/update assessment details.',response.message);
        }
      },
      error => {
        console.error('Error saving/updating assessment details:', error);
      }
    );
  }
  
  editAssessment(assessmentID: number): void {
    this.modalHeaderText = 'Update Assessment Details';
    const apiUrl = '/api/api/webCourseMaster/GetAssessmentDetailsforWEB';
    const requestBody = {
      mode: 2,
      assessmentID: assessmentID
    };
  
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status === true) {
          const assessmentDetails = response.data[0];
          this.selectedCourseId = assessmentDetails.courseId;
          this.assessmentName = assessmentDetails.assessmentName;
          this.selectedQuestionPaper = assessmentDetails.questionPaperSetName;
          this.durationValue = assessmentDetails.Duration;
          this.questionsCount = assessmentDetails.questionsCount;
          this.totalMarks = assessmentDetails.totalMarks;
          this.passingMarks = assessmentDetails.passingMarks;
          this.noOfAttempts = assessmentDetails.noOfAttempts;
          this.newCourse.durationTime = assessmentDetails.DurationID;
  
          if (this.selectedCourseId === 0) {
            this.selectedType = 'general'; 
            this.isCourseDisabled = true; 
          } else {
            this.selectedType = 'course';
            this.isCourseDisabled = false; 
          }
  
          this.isModalOpen = true;
          this.currentMode = 2;
          this.selectedAssessmentID = assessmentID;
        } else {
          console.error(response.message);
        }
      },
      error => {
        console.error('Error fetching assessment details:', error);
      }
    );
  }
  
  deleteAssessment(assessmentID: number,assessmentName:any) {
    const confirmDelete = window.confirm(`Are you sure you want to delete the Assessment: ${assessmentName}?`);
    if (confirmDelete == true) {
      const apiUrl = '/api/api/webCourseMaster/GetAssessmentDetailsforWEB';
      const requestBody = {
        mode: 3,
        assessmentID: assessmentID
      };
      this.http.post<any>(apiUrl, requestBody).subscribe(
        response => {
          if (response.status == true) {
            this.GetAssessmentdetails();
          } else {
            console.error(response.message);
          }
        },

      );
    }
  }

}
