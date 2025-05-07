import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-add-question',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgxPaginationModule],
  templateUrl: './add-question.component.html',
  styleUrl: './add-question.component.css'
})
export class AddQuestionComponent {
  @ViewChild('questionTitleSelect') questionTitleSelect!: ElementRef;
  totalPages: number = 0;

  questions: any[] = [];
  filteredUsers: any[] = [];

  isModalOpen = false;
  modalHeaderText: string = 'Create New Question';
  selectedQuestionCategory: string | null = null;
  currentMode: number = 1;
  isLoading: boolean = false;
  editMode: boolean = false;
  editingQuestionId: number | null = null;
  searchText: string = '';
  filteredQuestions: any[] = [];
  entriesPerPage = 10;
  p = 1;
  // Question fields
  questionName: string = '';
  categoryName: string = '';
  responseType: string = '';
  ansCount: number = 0;
  ansCorrect: string = '';
  ansA: string = '';
  ansB: string = '';
  ansC: string = '';
  ansD: string = '';
  ansE: string = '';
  ansF: string = '';
  questionTags: string = '';
  difficulty: string = '';
  explanation: string = '';
  createdBy: string = '';

  originalQuestions: any[] = [];

  entriesOptions: number[] = [10, 25, 50, 100];
  sortKey: string = '';
  sortAsc: boolean = true;

  constructor(private http: HttpClient, private location: Location, private router: Router) {
    const state = history.state;
    if (state && state.questionTitle) {
      this.selectedQuestionCategory = state.questionTitle;
    }
  }

  ngOnInit() {
    this.fetchQuestionscategorywise();
  }
 
  fetchQuestionscategorywise() {
    const apiUrl = '/api/api/webCourseMaster/GetQuestionsforWEB';
    const requestBody = {
      mode: 1,
      categoryName: this.selectedQuestionCategory,
      questionID: 0
    };
  
    this.isLoading = true;
    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        this.isLoading = false;
        if (response.status === true && response.data) {
          this.originalQuestions = response.data;
          this.applyFilters();
        } else {
          this.originalQuestions = [];
          this.questions = [];
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Error fetching questions:', error);
        this.originalQuestions = [];
        this.questions = [];
      }
    );
  }

  
get rangeInfo() {
  const start = (this.p - 1) * this.entriesPerPage + 1;
  const end = Math.min(this.p * this.entriesPerPage, this.filteredQuestions.length);
  const total = this.filteredQuestions.length;
  return { start, end, total };
}

onPageChange(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.p = page;
    this.applyFilters(); // Apply filters and update the page data accordingly
  }
}

// Update pagination when the number of entries per page changes
changeEntriesPerPage() {
  this.p = 1; // Reset to the first page whenever entries per page is changed
  this.totalPages = Math.ceil(this.filteredQuestions.length / this.entriesPerPage);
}

applyFilters() {
  let filtered = this.originalQuestions;

  if (this.searchText.trim() !== '') {
    const search = this.searchText.toLowerCase();
    filtered = filtered.filter((q, index) => {
      return (index + 1).toString().includes(search) ||
        Object.values(q).some(val =>
          val && val.toString().toLowerCase().includes(search)
        );
    });
  }

  this.filteredQuestions = filtered;
  this.totalPages = Math.ceil(filtered.length / this.entriesPerPage); // Update total pages

  // Apply pagination after filtering
  this.questions = filtered.slice(
    (this.p - 1) * this.entriesPerPage,
    this.p * this.entriesPerPage
  );
}
  
  goBack(): void {
    this.location.back();
  }

  openModal() {
    this.resetForm(); // Clear any previous data
    this.modalHeaderText = 'Create New Question';
    this.isModalOpen = true;
    this.currentMode = 0;
  }

  closeModal() {
    this.resetForm(); // Clear form on close
    this.isModalOpen = false;
  }

  questionpage() {
    this.router.navigate(['/layout/Questions/questions']);
  }

  deleteQuestions(question: any) {
    if (confirm(`Are you sure you want to delete the question "${question.QuestionName}"?`)) {
      const apiUrl = '/api/api/webCourseMaster/GetQuestionsforWEB';
      const requestBody = {
        mode: 3,
        questionID: question.QuestionID
      };

      this.http.post<any>(apiUrl, requestBody).subscribe(
        (response) => {
          if (response.status === true) {
            this.fetchQuestionscategorywise();
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

  editQuestion(question: any) {
    this.modalHeaderText = 'Edit Question';
    this.isModalOpen = true;
    this.editMode = true;
    this.editingQuestionId = question.QuestionID;

    this.questionName = question.QuestionName || '';
    this.categoryName = question.Category || '';
    this.responseType = question.response_type || '';
    this.ansCount = question.ans_count || 0;
    this.ansCorrect = question.ans_correct || '';
    this.ansA = question.ans_a || '';
    this.ansB = question.ans_b || '';
    this.ansC = question.ans_c || '';
    this.ansD = question.ans_d || '';
    this.ansE = question.ans_e || '';
    this.ansF = question.ans_f || '';
    this.questionTags = question.question_tags || '';
    this.difficulty = question.difficulty || '';
    this.explanation = question.explanation || '';
  }

  saveQuestionDetails(): void {
    if (!this.questionName) {
      alert('Please enter Question Name.');
      document.getElementById('questionName')?.focus();
      return;
    }
  
    if (!this.categoryName) {
      alert('Please enter Category.');
      document.getElementById('categoryName')?.focus();
      return;
    }
  
    if (!this.responseType) {
      alert('Please enter Response Type.');
      document.getElementById('responseType')?.focus();
      return;
    }
  
    if (!this.ansCount) {
      alert('Please enter Answer Count.');
      document.getElementById('ansCount')?.focus();
      return;
    }
  
    if (!this.ansCorrect) {
      alert('Please enter Correct Answer.');
      document.getElementById('ansCorrect')?.focus();
      return;
    }
  
    if (!this.ansA) {
      alert('Please enter Answer A.');
      document.getElementById('ansA')?.focus();
      return;
    }
  
    if (!this.ansB) {
      alert('Please enter Answer B.');
      document.getElementById('ansB')?.focus();
      return;
    }
  
    if (!this.ansC) {
      alert('Please enter Answer C.');
      document.getElementById('ansC')?.focus();
      return;
    }
  
    if (!this.ansD) {
      alert('Please enter Answer D.');
      document.getElementById('ansD')?.focus();
      return;
    }
  
    if (!this.ansE) {
      alert('Please enter Answer E.');
      document.getElementById('ansE')?.focus();
      return;
    }
  
    if (!this.ansF) {
      alert('Please enter Answer F.');
      document.getElementById('ansF')?.focus();
      return;
    }
  
    if (!this.questionTags) {
      alert('Please enter Question Tags.');
      document.getElementById('questionTags')?.focus();
      return;
    }
  
    if (!this.difficulty) {
      alert('Please enter Difficulty.');
      document.getElementById('difficulty')?.focus();
      return;
    }
  
    if (!this.explanation) {
      alert('Please enter Explanation.');
      document.getElementById('explanation')?.focus();
      return;
    }
  
    const apiUrl = '/api/api/webCourseMaster/saveQuestionsforWEB';
    const requestBody = {
      questionName: this.questionName,
      categoryName: this.categoryName,
      response_type: this.responseType,
      ans_count: this.ansCount,
      ans_correct: this.ansCorrect,
      ans_a: this.ansA,
      ans_b: this.ansB,
      ans_c: this.ansC,
      ans_d: this.ansD,
      ans_e: this.ansE,
      ans_f: this.ansF,
      question_tags: this.questionTags,
      difficulty: this.difficulty,
      explanation: this.explanation,
      createdBy: this.createdBy,
      questionid: this.editMode && this.editingQuestionId ? this.editingQuestionId : 0
    };

    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.status === true) {
          this.fetchQuestionscategorywise();
          this.router.navigate(['/layout/Questions/question-bank']);
          this.resetForm();     
          this.closeModal();   
        } else {
          console.error('Failed to save question:', response.message);
        }
      },
      (error) => {
        console.error('Error saving question:', error);
      }
    );
  }
  
 
  resetForm() {
    this.questionName = '';
    this.categoryName = '';
    this.responseType = '';
    this.ansCount = 0;
    this.ansCorrect = '';
    this.ansA = '';
    this.ansB = '';
    this.ansC = '';
    this.ansD = '';
    this.ansE = '';
    this.ansF = '';
    this.questionTags = '';
    this.difficulty = '';
    this.explanation = '';
    this.createdBy = '';
    this.editMode = false;
    this.editingQuestionId = null;
  }
  
}
