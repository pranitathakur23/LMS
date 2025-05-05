import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-question',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './add-question.component.html',
  styleUrl: './add-question.component.css'
})
export class AddQuestionComponent {
  @ViewChild('questionTitleSelect') questionTitleSelect!: ElementRef;

  questions: any;
  isModalOpen = false;
  isChapterModalOpen = false;
  modalHeaderText: string = 'Create New Question';
  selectedQuestionCategory: string | null = null;
  currentMode: number = 1;
  isLoading: boolean = false;


  constructor(private http: HttpClient, private location: Location, private router: Router) { 
    const state = history.state;
    if (state && state.questionTitle) {
      this.selectedQuestionCategory = state.questionTitle;
      console.log('Received questionTitle:', this.selectedQuestionCategory);
    }
  }

  ngOnInit() {
    this.fetchQuestionscategorywise();
  }
  goBack(): void {
    this.location.back();
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

  fetchQuestionscategorywise() {
    const apiUrl = '/api/api/webCourseMaster/GetQuestionsforWEB';
    const requestBody = {
      mode: 1,
      categoryName: this.selectedQuestionCategory, // should be set before calling this method
      questionID: 0
    };
  
    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status === true && response.data) {
          console.log('Fetched questions successfully:', response.data);
          this.questions = response.data; // assign the fetched questions
        } else {
          console.warn('No questions found for this category.');
          this.questions = []; // clear existing data if response is false or empty
        }
      },
      (error) => {
        console.error('Error fetching questions:', error);
        this.questions = []; // clear data on error
      }
    );
  }
  
  // editQuestions(question: any): void {
  //   this.modalHeaderText = 'Update Questions';
  //   const apiUrl = '/api/api/webCourseMaster/GetQuestionsDetailsforWEB';
  //   const requestBody = {
  //     mode: 2, categoryName: question.questionTitle
  //   };
  //   this.http.post<any>(apiUrl, requestBody).subscribe(
  //     response => {
  //       if (response.status == true) {
  //         const questionDetails = response.data[0];
  //         this.selectedQuestionCategory = questionDetails.Category;
  //         this.isModalOpen = true;
  //         this.currentMode = 1;
  //       } else {
  //         console.error(response.message);
  //       }
  //     },
  //     error => {
  //       console.error('Error fetching Questions details:', error);
  //     }
  //   );
  // }
  questionpage()
  {
     this.router.navigate(['/layout/Questions/questions']); 
    }

    deleteQuestions(question: any) {
      const confirmDelete = confirm(`Are you sure you want to delete the question "${question.QuestionName}"?`);
      if (confirmDelete) {
        const apiUrl = '/api/api/webCourseMaster/GetQuestionsforWEB'; // ✅ Use the same endpoint as fetch
        const requestBody = {
          mode: 3, // ✅ Deletion mode
          questionID: question.QuestionID // ✅ Use the actual QuestionID from the row
        };
        console.log('Request Body for Deletion:', requestBody); // Log the request body to the console

        this.http.post<any>(apiUrl, requestBody).subscribe(
          (response) => {
            if (response.status === true) {
              this.fetchQuestionscategorywise(); // ✅ Refresh list after delete
            } else {
              console.error(response.message);
            }
          },
          (error) => {
            console.error('Error deleting question:', error);
          }
        );
      }
    }
    

    // SaveandUpdateQuestionDetails(): void {
    //   const apiUrl = '/api/api/webCourseMaster/saveQuestionsforWEB';  // Your API URL
    
    //   // Construct the request body as a simple object (key-value pairs)
    //   const requestBody = {
    //     questionName: this.questionName,  // Example: Use actual form field values
    //     categoryName: this.categoryName,
    //     response_type: this.responseType,
    //     ans_count: this.ansCount,
    //     ans_correct: this.ansCorrect,
    //     ans_a: this.ansA,
    //     ans_b: this.ansB,
    //     ans_c: this.ansC,
    //     ans_d: this.ansD,
    //     ans_e: this.ansE,
    //     ans_f: this.ansF,
    //     question_tags: this.questionTags,
    //     difficulty: this.difficulty,
    //     explanation: this.explanation,
    //     createdBy: this.createdBy,
    //     questionid: this.questionID
    //   };
    
    //   // Log the request body
    //   console.log('Request Body:', requestBody);  // Print request body to console
    
    //   // Make the HTTP POST request
    //   this.http.post<any>(apiUrl, requestBody).subscribe(
    //     (response) => {
    //       console.log('API Response:', response);  // Log the response from the API
    //       if (response.status === true) {
    //         console.log('Success:', response.Message);
    //         // Handle success response, maybe navigate or update UI
    //       } else {
    //         console.error('Error:', response.Message);
    //       }
    //     },
    //     (error) => {
    //       console.error('Error in saving question details:', error);
    //     }
    //   );
    // }
    
 
}
