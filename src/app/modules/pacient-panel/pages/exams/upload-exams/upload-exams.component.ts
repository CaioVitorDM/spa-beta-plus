import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EMPTY, Subject, Subscription, catchError, switchMap} from 'rxjs';
import {FileService} from 'src/app/services/file-service/file.service';
import {FormUtilsService} from 'src/app/services/form-utils/form-utils.service';
import {HeaderService} from 'src/app/services/header/header-info.service';
import {LineLoadingService} from 'src/app/services/line-loading/line-loading.service';
import {SnackbarService} from 'src/app/services/snackbar/snackbar.service';
import {AuthService} from 'src/app/services/auth/auth.service';
import {FormsModule, FormGroup} from '@angular/forms';
import { UploadExamsServiceService } from './service/upload-exams-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Exams } from 'src/app/models/Exams';
import { ExamsService } from 'src/app/services/exams/exams.service';

@Component({
  selector: 'app-upload-exams',
  templateUrl: './upload-exams.component.html',
  styleUrl: './upload-exams.component.scss',
})
export class UploadExamsComponent {
  showPatientsSelector = false;

  createExamsSubscription!: Subscription;
  private destroy$ = new Subject<void>();
  uploadingFile!: File;
  examForm: FormGroup;
  isLoading = false;
  formUtils: FormUtilsService;

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
    this.examForm = this.examsFormService.form;
    this.formUtils = this.formUtilsService;
  }

  handleSelectedFile(file: File): void {
    this.uploadingFile = file;
  }

  handlePatientsSelected(selectedPatientIds: number[]) {
    this.examForm.get('patientsIdList')?.setValue(selectedPatientIds);
  }


  onSubmit() {
    if (this.examForm.valid && this.uploadingFile) {
      this.lineLoadingService.show();

      this.examForm.get('patientId')?.setValue(this.authService.patientId);
      const formDataExam = this.examForm.value;

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
      this.formUtils.validateAllFormFields(this.examForm);
      this.snackbar.open('Atenção! Campos obrigatórios não preenchidos');
    }
  }

  private handleSuccess() {
    this.isLoading = false;
    this.examsFormService.resetForm();
    this.examsFormService.onSuccess();
  }

  private onError(error: Error) {
    if (error instanceof HttpErrorResponse) {
      this.snackbar.open(error.error.error.message);
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
