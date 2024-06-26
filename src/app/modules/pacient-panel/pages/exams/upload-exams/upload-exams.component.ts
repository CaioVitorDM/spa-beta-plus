import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EMPTY, Subject, Subscription, catchError, mergeMap, switchMap} from 'rxjs';
import {FileService} from 'src/app/services/file-service/file.service';
import {FormUtilsService} from 'src/app/services/form-utils/form-utils.service';
import {HeaderService} from 'src/app/services/header/header-info.service';
import {LineLoadingService} from 'src/app/services/line-loading/line-loading.service';
import {SnackbarService} from 'src/app/services/snackbar/snackbar.service';
import {AuthService} from 'src/app/services/auth/auth.service';
import {FormsModule, FormGroup} from '@angular/forms';
import {UploadExamsServiceService} from './service/upload-exams-service.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Exams} from 'src/app/models/Exams';
import {ExamsService} from 'src/app/services/exams/exams.service';
import {Role} from 'src/app/models/Role';
import Swal from 'sweetalert2';
import {apiErrorStatusMessage} from 'src/app/constants/messages';

@Component({
  selector: 'app-upload-exams',
  templateUrl: './upload-exams.component.html',
  styleUrl: './upload-exams.component.scss',
})
export class UploadExamsComponent implements OnInit {
  showPatientsSelector = false;

  createExamsSubscription!: Subscription;
  private destroy$ = new Subject<void>();
  uploadingFile!: File;
  examsForm: FormGroup;
  isLoading = false;
  formUtils: FormUtilsService;

  @Output() formLoaded = new EventEmitter<void>();

  @Input() exam?: number;
  @Input() isReadOnly: boolean = false;

  @Input() onSubmitEvent: boolean = false;

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
    private examsFormService: UploadExamsServiceService
  ) {
    this.headerService.setTitulo('Cadastro de Novo Exame');
    this.examsForm = this.examsFormService.form;
    this.formUtils = this.formUtilsService;
  }

  ngOnInit() {
    this.prepareForm();
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
          if (this.authService.role !== Role.PATIENT) {
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

  handlePatientsSelected(selectedPatientIds: number[]) {
    this.examsForm.get('patientsIdList')?.setValue(selectedPatientIds);
  }

  onSubmit() {
    if (this.examsForm.valid && this.uploadingFile) {
      this.lineLoadingService.show();

      this.examsForm.get('patientId')?.setValue(this.authService.patientId);

      //Adicionei esse DoctorId, mas ele não busca doctor
      // const doctorId = this.authService.doctorId;
      // if (doctorId) {
      //   this.examsForm.get('doctorId')?.setValue(doctorId);
      // } else {
      //   this.snackbar.open('Erro: Doctor ID não está disponível.');
      //   this.lineLoadingService.hide();
      //   return;
      // }

      const formDataExam = this.examsForm.value;

      this.createExamsSubscription = this.fileService
        .uploadFile(this.uploadingFile)
        .pipe(
          switchMap((fileResponse) => {
            formDataExam.fileId = fileResponse.data.id;
            return this.examsService.create(formDataExam);
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

  // togglePatientsSelector(isSpecific: boolean) {
  //   this.showPatientsSelector = isSpecific;
  // }

  navigateBack() {
    this.router.navigate(['/patient-panel/exams']);
  }
}
