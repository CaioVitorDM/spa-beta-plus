import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Subject, Subscription, catchError, switchMap } from 'rxjs';
import { Exams } from 'src/app/models/Exams';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ExamsService } from 'src/app/services/exams/exams.service';
import { FileService } from 'src/app/services/file-service/file.service';
import { FormUtilsService } from 'src/app/services/form-utils/form-utils.service';
import { HeaderService } from 'src/app/services/header/header-info.service';
import { LineLoadingService } from 'src/app/services/line-loading/line-loading.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { PatientList } from '../../create-exams/create-exams.component';
import { PatientService } from 'src/app/services/patient/patient.service';
import { apiErrorStatusMessage } from 'src/app/constants/messages';
import { User } from 'src/app/models/User';
import { UploadExamsService } from '../../create-exams/create-service/upload-exams.service';
import { UploadFileComponent } from 'src/app/components/upload-file/upload-file.component';

@Component({
  selector: 'app-exams-form',
  templateUrl: './exams-form.component.html',
  styleUrl: './exams-form.component.scss'
})
export class ExamsFormComponent implements OnInit, AfterViewInit, OnDestroy {

  patients: PatientList[] = [];
  loadPatientsSubscription = new Subscription();

  private destroy$ = new Subject<void>();
  private examId!: number;
  examForm!: FormGroup;
  uploadingFile!: File;
  name: string | null = '';
  login: string | null = '';
  isLoading: boolean = false;
  isError: boolean = false;
  fileName!: string;

  editExamSubscription!: Subscription;
  formUtils: FormUtilsService;

  @ViewChild(UploadFileComponent) uploadFileComponent!: UploadFileComponent;


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
    private patientService: PatientService,
    private fb: FormBuilder,
    private examsFormService: UploadExamsService,
  ) {
    this.headerService.setTitulo('Edição de Exame');
    this.formUtils = this.formUtilsService;

  }

  ngOnInit() {
    this.examId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.initializeForm();
    this.loadPatients();
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

    this.uploadFileComponent.handleUploadAttempt();


    if (this.examForm.valid && this.uploadingFile) {
      this.lineLoadingService.show();

      this.examForm.get('doctorId')?.setValue(this.authService.doctorId);
  
      const formDataProtocol = this.examForm.value;

      this.editExamSubscription = this.fileService
        .uploadFile(this.uploadingFile)
        .pipe(
          switchMap((fileResponse) => {
            formDataProtocol.fileId = fileResponse.data.id;
            return this.examsService.create(formDataProtocol);
          }),
          catchError((error: HttpErrorResponse) => {
            this.onError(error);
            return EMPTY;
          })
        )
        .subscribe((result: Exams) => {
          this.handleSuccess();
        });
    
    } else {
      this.formUtils.validateAllFormFields(this.examForm);
      this.snackbar.open('Atenção! Campos obrigatórios não preenchidos');
    }
  }

  isInputInvalid(field: string): boolean {
    return this.examsFormService.isInvalidField(field);
  }
  
  loadPatients() {
    this.loadPatientsSubscription = this.patientService
      .getPatientsByDoctor({
        name: this.name!,
        login: this.login!,
        doctorId: this.authService.doctorId!,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.isLoading = false;
          this.isError = true;
          this.snackbar.open(apiErrorStatusMessage[error.status]);
          this.lineLoadingService.hide();
          return EMPTY;
        })
      )
      .subscribe({
        next: (patients) => {
          console.log("aqui" + patients);
          this.onSuccess(patients);
        },
        error: (_error) => {
          this.lineLoadingService.hide();
        },
      });
  }

  onSuccess(patients: User[]) {
    this.isLoading = false;
    this.isError = false;
    this.patients = patients.map((user): PatientList => {
      return {
        id: user.patient?.id,
        name: user.patient?.name || '',
        login: user.login || ''
      };
    });
    this.lineLoadingService.hide();
  }

  handleSuccess() {
    this.snackbar.open('Exame atualizado com sucesso');
    this.router.navigate(['/patient-panel/exams']);
    this.lineLoadingService.hide();
  }

  onError(error: HttpErrorResponse) {
    this.snackbar.open('Erro ao atualizar exame');
    this.lineLoadingService.hide();
  }


}
