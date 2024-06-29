import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {PatientList} from 'src/app/models/User';
import { ExamsList } from 'src/app/models/Exams';

@Component({
  selector: 'app-exams-table',
  templateUrl: './exams-table.component.html',
  styleUrl: './exams-table.component.scss',
})
export class ExamsTableComponent{
  @Input() dataSource: ExamsList[] = [];
  @Output() deleteExamEvent = new EventEmitter <number>();


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  

  printButton(action: string, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    console.log(action);
  }

  navigateToCreatePage() {}

  editExam(id: number) {
    this.router.navigate([`/patient-panel/exams/edit-exams/${id}`], {relativeTo: this.activatedRoute});
  }

  deleteExam(id: number) {
    console.log("Entrou 1 delete");
    console.log(id)
    this.deleteExamEvent.emit(id);
  }
}
