import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FileService} from '../../../../../services/file-service/file.service';
import {PatientFormService} from '../components/patient-form/service/patient-form.service';
import {PatientService} from '../services/patient.service';
import {FormUtilsService} from '../../../../../services/form-utils/form-utils.service';
import {FormGroup} from '@angular/forms';
import {PatientFormComponent} from '../components/patient-form/patient-form.component';
import {catchError, EMPTY, Subscription, switchMap} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {User} from '../../../../../models/User';
import {LineLoadingService} from '../../../../../services/line-loading/line-loading.service';
import {SnackbarService} from '../../../../../services/snackbar/snackbar.service';
import {AuthService} from '../../../../../services/auth/auth.service';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrl: './edit-patient.component.scss',
})
export class EditPatientComponent implements OnInit, AfterViewInit {
  @ViewChild(PatientFormComponent) patientFormComponent!: PatientFormComponent;
  patient?: number;
  uploadingFile!: File;
  imageSrc!: string;
  formUtils: FormUtilsService;
  patientForm: FormGroup;
  editPatientSubscription!: Subscription;

  isLoading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fileService: FileService,
    private patientFormService: PatientFormService,
    private patientService: PatientService,
    private formUtilsService: FormUtilsService,
    private lineLoadingService: LineLoadingService,
    private snackbar: SnackbarService,
    private authService: AuthService
  ) {
    this.patientForm = this.patientFormService.form;
    this.formUtils = this.formUtilsService;
  }
  ngOnInit() {
    const {id} = this.activatedRoute.snapshot.params;

    if (id) {
      this.patient = id;
    }
  }

  ngAfterViewInit() {
    this.patientFormComponent.formLoaded.subscribe(() => {
      const fileId = this.patientFormComponent.patientForm.get('fileId')?.value;
      this.fetchImage(fileId);
    });
  }

  onSubmit() {
    if (this.patientForm.valid) {
      this.lineLoadingService.show();

      this.patientForm.get('doctorId')?.setValue(this.authService.doctorId);
      const formDataPatient = this.patientForm.value;

      if (this.uploadingFile) {
        this.editPatientSubscription = this.fileService
          .uploadFile(this.uploadingFile)
          .pipe(
            switchMap((fileResponse) => {
              formDataPatient.fileId = fileResponse.data.id;
              return this.patientService.edit(formDataPatient);
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
        this.editPatientSubscription = this.patientService.edit(formDataPatient).subscribe({
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
    this.patientFormService.onSuccess(true);
  }

  private onError(error: Error) {
    if (error instanceof HttpErrorResponse) {
      this.snackbar.open(error.error.error.message);
    }
    this.lineLoadingService.hide();
  }

  handleSelectedFile(file: File): void {
    this.uploadingFile = file;
  }

  fetchImage(imgId: number) {
    if (imgId != null) {
      this.fileService.getInlineImage(imgId).subscribe({
        next: (blob) => {
          this.imageSrc = URL.createObjectURL(blob);
        },
        error: (err) => {
          console.error('Erro ao carregar imagem:', err);
        },
      });
    }
  }
}
