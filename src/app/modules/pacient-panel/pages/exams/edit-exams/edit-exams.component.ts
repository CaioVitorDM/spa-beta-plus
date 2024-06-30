import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EMPTY, Observable, Subject, Subscription, catchError, switchMap} from 'rxjs';
import {FileService} from 'src/app/services/file-service/file.service';
import {FormUtilsService} from 'src/app/services/form-utils/form-utils.service';
import {HeaderService} from 'src/app/services/header/header-info.service';
import {LineLoadingService} from 'src/app/services/line-loading/line-loading.service';
import {SnackbarService} from 'src/app/services/snackbar/snackbar.service';
import {AuthService} from 'src/app/services/auth/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ExamsService} from 'src/app/services/exams/exams.service';
import {Exams} from 'src/app/models/Exams';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-edit-exams',
  templateUrl: './edit-exams.component.html',
  styleUrls: ['./edit-exams.component.scss'],
})
export class EditExamsComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private examId!: number;
  examForm!: FormGroup;
  uploadingFile!: File;
  isLoading = false;
  fileName!: string;

  editExamSubscription!: Subscription;

  constructor(
    private headerService: HeaderService,
    private fileService: FileService,
    private snackbar: SnackbarService,
    private formUtilsService: FormUtilsService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private lineLoadingService: LineLoadingService,
    private examsService: ExamsService,
    private fb: FormBuilder
  ) {
    this.headerService.setTitulo('Edição de Exame');
  }

  ngOnInit() {
    this.examId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.initializeForm();
  }

  ngAfterViewInit() {
    this.loadExam();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeForm() {
    this.examForm = this.fb.group({
      id: [null], // Campo adicional
      examType: ['', Validators.required],
      name: ['', Validators.required],
      examDate: ['', Validators.required],
      fileId: [null],
      doctorId: [null], // Campo adicional
      patientId: [null], // Campo adicional
      createdAt: [null], // Campo adicional
    });
  }

  fetchFile(fileId: number) {
    this.fileService.downloadImage(fileId).subscribe({
      next: (file) => {
        this.fileName = file.name;
        this.uploadingFile = file;
      },
      error: (err) => {
        console.error('Erro ao carregar arquivo:', err);
      },
    });
  }

  loadExam() {
    this.examsService.getOne(this.examId).subscribe((exam: Exams) => {
      this.examForm.patchValue({
        id: exam.id,
        examType: exam.examType,
        name: exam.name,
        examDate: exam.examDate,
        fileId: exam.fileId,
        doctorId: exam.doctorId,
        patientId: exam.patientId,
        createdAt: exam.createdAt,
      });
      if (exam.fileId) {
        this.fetchFile(exam.fileId);
      }
    });
  }

  handleSelectedFile(file: File): void {
    this.uploadingFile = file;
  }


  onSubmit() {
    if (this.examForm.valid && this.uploadingFile) {
      this.lineLoadingService.show();
  
      const patientId = this.authService.patientId;
      this.examForm.get('patientId')?.setValue(patientId);
  
      const formDataExam = this.examForm.value;
      
      // Log the form data for debugging
      console.log("Form data before submission:", formDataExam);
  
      if (patientId === undefined) {
        this.snackbar.open('Atenção! O paciente não está autenticado.');
        this.lineLoadingService.hide();
        return;
      }
  
      if (this.uploadingFile) {
        const existingFileId = formDataExam.fileId;
        const id = formDataExam.id;
  
        this.editExamSubscription = this.fileService
          .uploadFile(this.uploadingFile, existingFileId)
          .pipe(
            switchMap((fileResponse) => {
              formDataExam.fileId = fileResponse.data.id;
              console.log("Form data on submission:", formDataExam);
              return this.examsService.update(id, formDataExam);
            }),
            catchError((error: HttpErrorResponse) => {
              this.onError(error);
              return EMPTY;
            })
          )
          .subscribe({
            next: (result: Exams) => {
              this.handleSuccess();
            },
            error: (error) => this.onError(error),
          });
      } else {
        this.formUtilsService.validateAllFormFields(this.examForm);
        this.snackbar.open('Atenção! Campos obrigatórios não preenchidos');
      }
    }
  }
  
  
  // onSubmit() {
  //   if (this.examForm.valid && this.uploadingFile) {
  //     this.lineLoadingService.show();

  //     const patientId = this.authService.patientId;
  //     this.examForm.get('patientId')?.setValue(patientId);

  //     const formDataExam = this.examForm.value;
  //     if (patientId === undefined) {
  //       this.snackbar.open('Atenção! O paciente não está autenticado.');
  //       this.lineLoadingService.hide();
  //       return;
  //     }

  //     if (this.uploadingFile) {
  //       const existingFileId = formDataExam.fileId;
  //       const id = formDataExam.id;


  //       this.editExamSubscription = this.fileService
  //         .uploadFile(this.uploadingFile, existingFileId)
  //         .pipe(
  //           switchMap((fileResponse) => {
  //             formDataExam.fileId = fileResponse.data.id;
  //             return this.examsService.update(id,formDataExam);
  //           }),
  //           catchError((error: HttpErrorResponse) => {
  //             this.onError(error);
  //             return EMPTY;
  //           })
  //         )
  //         .subscribe({
  //           next: (result: Exams) => {
  //             this.handleSuccess();
  //           },
  //           error: (error) => this.onError(error),
  //         });
  //     } else {
  //       this.formUtilsService.validateAllFormFields(this.examForm);
  //       this.snackbar.open('Atenção! Campos obrigatórios não preenchidos');
  //     }
  //   }
  // }


  // updateExam(formDataExam: any): Observable<Exams> {
  //   return this.examsService.update(formDataExam);
  // }

  handleSuccess() {
    this.snackbar.open('Exame atualizado com sucesso');
    this.router.navigate(['/patient-panel/exams']);
    this.lineLoadingService.hide();
  }

  onError(error: HttpErrorResponse) {
    this.snackbar.open('Erro ao atualizar exame');
    this.lineLoadingService.hide();
  }

  navigateBack() {
    this.router.navigate(['/patient-panel/exams']);
  }
}
