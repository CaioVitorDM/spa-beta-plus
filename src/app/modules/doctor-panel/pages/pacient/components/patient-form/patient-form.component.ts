import {Component, Input, OnDestroy} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {NgIf} from '@angular/common';
import {NgxMaskDirective, provideNgxMask} from 'ngx-mask';
import {catchError, EMPTY, Subscription} from 'rxjs';
import {FormUtilsService} from '../../../../../../services/form-utils/form-utils.service';
import {LineLoadingService} from '../../../../../../services/line-loading/line-loading.service';
import {MedicRegisterService} from '../../../../../../pages/register-page/service/medic-register.service';
import {SnackbarService} from '../../../../../../services/snackbar/snackbar.service';
import {Router} from '@angular/router';
import {RegisterSubmit} from '../../../../../../pages/register-page/service/register-submit';
import {HttpErrorResponse} from '@angular/common/http';
import {User} from '../../../../../../models/User';
import swal from 'sweetalert2';
import {PatientFormService} from './service/patient-form.service';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.scss',
  providers: [provideNgxMask()],
})
export class PatientFormComponent implements OnDestroy {
  showPassword: boolean = false;
  password = '';
  formUtils: FormUtilsService;
  @Input() onSubmitEvent: boolean = false;
  patientForm: FormGroup;

  constructor(
    private lineLoadingService: LineLoadingService,
    private snackbar: SnackbarService,
    private formUtilsService: FormUtilsService,
    private patientFormService: PatientFormService
  ) {
    this.patientForm = this.patientFormService.form;
    this.formUtils = this.formUtilsService;
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
}
