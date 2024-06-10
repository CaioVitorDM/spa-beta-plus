import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {provideNgxMask} from 'ngx-mask';
import {catchError, EMPTY, mergeMap} from 'rxjs';
import {FormUtilsService} from '../../../../../../services/form-utils/form-utils.service';
import {LineLoadingService} from '../../../../../../services/line-loading/line-loading.service';
import {SnackbarService} from '../../../../../../services/snackbar/snackbar.service';
import {PatientFormService} from './service/patient-form.service';
import {PatientService} from '../../services/patient.service';
import {AuthService} from '../../../../../../services/auth/auth.service';
import {Role} from '../../../../../../models/Role';
import swal from 'sweetalert2';
import {HttpErrorResponse} from '@angular/common/http';
import {apiErrorStatusMessage} from '../../../../../../constants/messages';
import {Router} from '@angular/router';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.scss',
  providers: [provideNgxMask()],
})
export class PatientFormComponent implements OnDestroy, OnInit {
  @Output() formLoaded = new EventEmitter<void>();
  showPassword: boolean = false;
  password = '';
  formUtils: FormUtilsService;
  patientForm: FormGroup;
  @Input() patient?: number;
  @Input() isEditing: boolean = false;

  constructor(
    private lineLoadingService: LineLoadingService,
    private snackbar: SnackbarService,
    private formUtilsService: FormUtilsService,
    private patientFormService: PatientFormService,
    private patientService: PatientService,
    private authService: AuthService,
    private router: Router
  ) {
    this.patientForm = this.patientFormService.form;
    this.formUtils = this.formUtilsService;
  }

  ngOnInit() {
    if (this.patient && this.isEditing) {
      this.loadPatient(this.patient);
      this.patientForm.get('password')?.disable();
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  ngOnDestroy(): void {
    this.patientFormService.resetForm();
  }

  isInputInvalid(field: string): boolean {
    return this.patientFormService.isInvalidField(field);
  }

  loadPatient(id: number) {
    this.patientService
      .getOne(id)
      .pipe(
        mergeMap((user) => {
          if (
            this.authService.role !== Role.MEDIC &&
            user.id !== this.authService.getUserLogged?.id
          ) {
            swal
              .fire({
                icon: 'error',
                title: 'Unathorized!',
                text: 'Você não tem permissão para acessar essa página',
                timer: 3000,
                showConfirmButton: false,
              })
              .then(() => this.router.navigate(['/login-page']));
            return EMPTY;
          }

          this.patientForm.patchValue({
            id: user.id,
            doctorId: user.patient?.doctorId,
            patientId: user.patient?.id,
            firstName: user.patient?.name.split(' ')[0].trim(),
            lastName: user.patient?.name.split(' ')[1].trim(),
            email: user.email,
            phoneNumber: user.phoneNumber,
            cpf: user.patient?.cpf,
            birthDate: user.patient?.birthDate,
            login: user.login,
            password: user.password,
            fileId: user.imgId,
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

  private onError(error: Error) {
    if (error instanceof HttpErrorResponse) {
      this.snackbar.open(error.error.error.message);
    } else {
      this.snackbar.open(apiErrorStatusMessage[0]);
    }
    this.lineLoadingService.hide();
  }
}
