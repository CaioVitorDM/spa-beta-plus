import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {PatientList} from 'src/app/models/User';
import { ExamsList } from 'src/app/models/Exams';
import { FileService } from 'src/app/services/file-service/file.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';

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
    private router: Router,
    private fileService: FileService,
    private snackbar: SnackbarService
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

  downloadFile(fileId: number, event: MouseEvent): void {
    event.stopPropagation(); 
    if (fileId) {
      this.fileService.getInlineImage(fileId).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
          window.URL.revokeObjectURL(url); 
        },
        error: (error) => {
          if (error instanceof HttpErrorResponse) {
            this.snackbar.open(error.error.message);
          } 
        },
      });
    } else {
      this.snackbar.open('Nenhum arquivo disponível para download.');
    }
  }
}
