import {Component, Input, OnInit} from '@angular/core';
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

  //To-do
  editUser() {
    this.router.navigate([`/patient-panel/exams/edit-exams`], {relativeTo: this.activatedRoute});
  }

  deleteUser() {
    console.log('delete ');
  }
}
