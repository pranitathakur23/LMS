import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-question-bank',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './question-bank.component.html',
  styleUrl: './question-bank.component.css'
})
export class QuestionBankComponent {
  @ViewChild('questionTitleSelect') questionTitleSelect!: ElementRef;

  questions: any;
  isModalOpen = false;
  isChapterModalOpen = false; 
  modalHeaderText: string = 'Create New Question';
  selectedQuestionCategory: string | null = null;
  currentMode: number = 1;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchQuestionsList();
  }

  openModal() {
    this.modalHeaderText = 'Create New Question'
    this.isModalOpen = true;
    this.selectedQuestionCategory = '';
    this.currentMode = 0;
  }

  closeModal() {
    this.isModalOpen = false;
  }
  
  fetchQuestionsList() {
    const apiUrl = '/api/webCourseMaster/GetQuestionsDetailsforWEB';
    const requestBody = { mode: 1 };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status === true) {
          this.questions = response.data.map((question: any) => ({
            questionTitle: question.Category
                    }));
        } else {
          this.questions = [];
        }
      },
      (error) => {
        console.error('Error fetching questions:', error);
        alert('An error occurred while fetching questions');
        this.questions = [];
      }
    );
  }

  editQuestions(question: any): void {
    this.modalHeaderText = 'Update Questions';
    const apiUrl = '/api/webCourseMaster/GetQuestionsDetailsforWEB';
    const requestBody = {
      mode: 2, categoryName: question.questionTitle
    };
    this.http.post<any>(apiUrl, requestBody).subscribe(
      response => {
        if (response.status == true) {
          const questionDetails = response.data[0];
          this.selectedQuestionCategory = questionDetails.Category;
          this.isModalOpen = true;
          this.currentMode = 1;
        } else {
          alert('Failed to load Questions details');
        }
      },
      error => {
        console.error('Error fetching Questions details:', error);
        alert('An error occurred while fetching Questions details');
      }
    );
  }

  deleteQuestions(question: any) {
    const confirmDelete = confirm(`Are you sure you want to delete the question "${question.questionTitle}"?`);
    if (confirmDelete) {
      const apiUrl = '/api/webCourseMaster/GetQuestionsDetailsforWEB';
      const requestBody = { mode: 3, categoryName: question.questionTitle };

      this.http.post<any>(apiUrl, requestBody).subscribe(
        (response) => {
          if (response.status === true) {
            this.fetchQuestionsList();
            alert('Question deleted successfully');
          } else {
            alert('Error: ' + response.message);
          }
        },
        (error) => {
          console.error('Error deleting question:', error);
          alert('An error occurred while deleting the question');
        }
      );
    }
  }

  SaveandUpdateQuestionDetails(): void {
    const employeeCode = sessionStorage.getItem('employeeCode');
    if (!employeeCode) {
      alert('Employee not logged in');
      return;
    }

    if (!this.selectedQuestionCategory) {
      alert('Please enter Question Title.');
      this.questionTitleSelect.nativeElement.focus();
      return;
    }

    const fileUploadQuestion = (document.getElementById('uploadExcel') as HTMLInputElement).files?.[0];

    if (!fileUploadQuestion) {
      alert('Please select excel file to upload.');
      return;
    }
  
    const apiUrl = '/api/webCourseMaster/SaveQuestionPaperExcelsheet';
    const formData: FormData = new FormData();
    formData.append('questionPaperTitle', this.selectedQuestionCategory.toString());
    formData.append('employeeCode', employeeCode);
    formData.append('contentLink', fileUploadQuestion, fileUploadQuestion.name);
    this.http.post<any>(apiUrl, formData).subscribe(
      response => {
        if (response.message == 'success') {
          alert('Question details saved/updated successfully.');
          this.fetchQuestionsList();
          this.closeModal();
        } else {
          alert('Failed to save/update Question details.');
        }
      },
      error => {
        console.error('Error saving/updating Question details:', error);
        alert('An error occurred while saving/updating Question details.');
      }
    );
  }

}
