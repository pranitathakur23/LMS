import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css'
})
export class QuestionsComponent {
  constructor( private location: Location) { }
  goBack(): void {
    this.location.back();
  }

}
