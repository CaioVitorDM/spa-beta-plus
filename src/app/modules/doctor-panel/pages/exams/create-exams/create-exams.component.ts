import {Component, EventEmitter, Input, Output, SimpleChanges, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {catchError, EMPTY, mergeMap, Observable, Subject, Subscription, switchMap} from 'rxjs';
import {AuthService} from 'src/app/services/auth/auth.service';
import {ExamsService} from 'src/app/services/exams/exams.service';
import {FileService} from 'src/app/services/file-service/file.service';
import {FormUtilsService} from 'src/app/services/form-utils/form-utils.service';
import {HeaderService} from 'src/app/services/header/header-info.service';
import {LineLoadingService} from 'src/app/services/line-loading/line-loading.service';
import {SnackbarService} from 'src/app/services/snackbar/snackbar.service';
import {UploadExamsService} from './create-service/upload-exams.service';
import {Role} from 'src/app/models/Role';
import Swal from 'sweetalert2';
import {HttpErrorResponse} from '@angular/common/http';
import { apiErrorStatusMessage } from 'src/app/constants/messages';
import { UploadFileComponent } from 'src/app/components/upload-file/upload-file.component';
import { PatientService } from 'src/app/services/patient/patient.service';
import { User } from 'src/app/models/User';
import { Exams } from 'src/app/models/Exams';


@Component({
  selector: 'app-create-exams',
  templateUrl: './create-exams.component.html',
  styleUrl: './create-exams.component.scss',
})
export class CreateExamsComponent {
  showPatientsSelector = false;

  patients: PatientList[] = [];
  loadPatientsSubscription = new Subscription();

  createExamsSubscription!: Subscription;
  private destroy$ = new Subject<void>();
  uploadingFile!: File;
  examsForm: FormGroup;
  name: string | null = '';
  login: string | null = '';
  isLoading: boolean = false;
  isError: boolean = false;

  formUtils: FormUtilsService;

  @Output() formLoaded = new EventEmitter<void>();

  @Input() exam?: number;
  @Input() isReadOnly: boolean = false;

  @Input() onSubmitEvent: boolean = false;

  @ViewChild(UploadFileComponent) uploadFileComponent!: UploadFileComponent;


  constructor(
    private headerService: HeaderService,
    private fileService: FileService,
    private lineLoadingService: LineLoadingService,
    private snackbar: SnackbarService,
    private formUtilsService: FormUtilsService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private examsService: ExamsService,
    private patientService: PatientService,
    private examsFormService: UploadExamsService,
  ) {
    this.headerService.setTitulo('Cadastro de Novo Exame');
    this.examsForm = this.examsFormService.form;
    this.formUtils = this.formUtilsService;
  }

  ngOnInit() {
    this.prepareForm();
    this.loadPatients();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isReadOnly'] || changes['exam']) {
      this.prepareForm();
    }
  }

  prepareForm() {
    if (this.isReadOnly) {
      this.examsForm.disable();
    } else {
      this.examsForm.enable();
    }
    if (this.exam) {
      this.loadExam(this.exam);
    } else {
      this.examsForm.reset();
    }
  }

  loadExam(id: number) {
    this.examsService
      .getOne(id)
      .pipe(
        mergeMap((exam) => {
          if (this.authService.role !== Role.MEDIC) {
            Swal.fire({
              icon: 'error',
              title: 'Unathorized!',
              text: 'Você não tem permissão para acessar essa página',
              timer: 3000,
              showConfirmButton: false,
            }).then(() => this.router.navigate(['/login-page']));
            return EMPTY;
          }

          this.examsForm.patchValue({
            id: exam.id,
            doctorId: exam.doctorId,
            patientId: exam.patientId,
            name: exam.name,
            examDate: exam.examDate,
            examType: exam.examType,
            createdAt: exam.createdAt,
            fileId: exam.fileId,
          });

          this.formLoaded.emit();

          return EMPTY;
        }),
        catchError((error: HttpErrorResponse) => {
          this.onError(error);
          return EMPTY;
        })
      )
      .subscribe(() => {});
  }

  ngOnDestroy(): void {
    this.examsFormService.resetForm();
  }

  isInputInvalid(field: string): boolean {
    return this.examsFormService.isInvalidField(field);
  }

  handleSelectedFile(file: File): void {
    this.uploadingFile = file;
  }


  onSubmit() {

    this.uploadFileComponent.handleUploadAttempt();


    if (this.examsForm.valid && this.uploadingFile) {
      this.lineLoadingService.show();

      this.examsForm.get('doctorId')?.setValue(this.authService.doctorId);
  
      const formDataProtocol = this.examsForm.value;

      this.createExamsSubscription = this.fileService
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
      this.formUtils.validateAllFormFields(this.examsForm);
      this.snackbar.open('Atenção! Campos obrigatórios não preenchidos');
    }
  }

  // onSubmit() {
  //   if (this.examsForm.valid) {
  //     this.lineLoadingService.show();

  //     this.examsForm.get('doctorId')?.setValue(this.authService.doctorId);
  //     const formData = this.examsForm.value;

  //     this.createExamsSubscription = this.examsService.create(formData).subscribe({
  //       next: (result: Exams) => {
  //         this.handleSuccess();
  //       },
  //       error: (error: HttpErrorResponse) => {
  //         this.onError(error);
  //       },
  //     });
      
  //   } else {
  //     this.formUtils.validateAllFormFields(this.examsForm);
  //     this.snackbar.open('Atenção! Campos obrigatórios não preenchidos');
  //   }
  // }

  private handleSuccess() {
    this.isLoading = false;
    this.examsFormService.resetForm();
    this.examsFormService.onSuccess();
  }

  private onError(error: Error) {
    console.error('Erro HTTP:', error); // Log para verificar a estrutura do erro
    if (error instanceof HttpErrorResponse) {
      this.snackbar.open(error.message); // Acesse diretamente a mensagem de erro
    } else {
      this.snackbar.open(apiErrorStatusMessage[0]);
    }
    this.lineLoadingService.hide();
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

  navigateBack() {
    this.router.navigate(['/patient-panel/exams']);
  }
}

export interface PatientList {
  id?: number;
  name: string;
  login: string;
}
