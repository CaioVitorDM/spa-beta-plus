import {Component} from '@angular/core';
import {HeaderService} from '../../../../../services/header/header-info.service';
import {FileService} from '../../../../../services/file-service/file.service';
import {catchError, EMPTY, Subject, Subscription, switchMap, takeUntil} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {PatientFormService} from '../components/patient-form/service/patient-form.service';
import {PatientSpecificService} from '../services/patient.service';
import {HttpErrorResponse} from '@angular/common/http';
import {User} from '../../../../../models/User';
import {LineLoadingService} from '../../../../../services/line-loading/line-loading.service';
import {SnackbarService} from '../../../../../services/snackbar/snackbar.service';
import {RegisterSubmit} from '../../../../../pages/register-page/service/register-submit';
import {FormUtilsService} from '../../../../../services/form-utils/form-utils.service';
import {AuthService} from '../../../../../services/auth/auth.service';

@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrl: './create-patient.component.scss',
})
export class CreatePatientComponent {
  createPatientSubscription!: Subscription;
  private destroy$ = new Subject<void>();
  uploadingFile!: File;
  patientForm: FormGroup;
  isLoading = false;
  formUtils: FormUtilsService;

  constructor(
    private headerService: HeaderService,
    private fileService: FileService, // Injetando o serviço de arquivo
    private patientFormService: PatientFormService,
    private patientService: PatientSpecificService,
    private lineLoadingService: LineLoadingService,
    private snackbar: SnackbarService,
    private formUtilsService: FormUtilsService,
    private authService: AuthService
  ) {
    this.headerService.setTitulo('Cadastro de Pacientes');
    this.patientForm = this.patientFormService.form;
    this.formUtils = this.formUtilsService;
  }

  handleSelectedFile(file: File): void {
    this.uploadingFile = file;
  }

  submitImage(): void {
    const file = this.uploadingFile;
    console.log(file.name);
    console.log(file.type);
    this.fileService.uploadFile(file).subscribe({
      next: (response) => {
        console.log('Imagem enviada com sucesso!', response);
        // Lógica adicional após o upload com sucesso
      },
      error: (error) => {
        console.error('Erro ao enviar imagem', error);
      },
    });
  }

  onSubmit() {
    if (this.patientForm.valid) {
      this.lineLoadingService.show();

      this.patientForm.get('doctorId')?.setValue(this.authService.doctorId);
      const formDataPatient = this.patientForm.value;

      if (this.uploadingFile) {
        this.createPatientSubscription = this.fileService
          .uploadFile(this.uploadingFile)
          .pipe(
            switchMap((fileResponse) => {
              formDataPatient.fileId = fileResponse.data.id;
              return this.patientService.create(formDataPatient);
            }),
            catchError((error: HttpErrorResponse) => {
              this.onError(error);
              return EMPTY;
            })
          )
          .subscribe((result: User) => {
            this.handleSuccess();
          });
      } else {
        this.createPatientSubscription = this.patientService.create(formDataPatient).subscribe({
          next: (result: User) => {
            this.handleSuccess();
          },
          error: (error: HttpErrorResponse) => {
            this.onError(error);
          },
        });
      }
    } else {
      this.formUtils.validateAllFormFields(this.patientForm);
      this.snackbar.open('Atenção! Campos obrigatórios não preenchidos');
    }
  }

  private handleSuccess() {
    this.isLoading = false;
    this.patientFormService.resetForm();
    this.patientFormService.onSuccess(false);
  }

  private onError(error: Error) {
    if (error instanceof HttpErrorResponse) {
      this.snackbar.open(error.error.error.message);
    }
    this.lineLoadingService.hide();
  }
}
