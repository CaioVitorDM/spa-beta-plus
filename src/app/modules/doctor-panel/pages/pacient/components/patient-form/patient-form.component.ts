import {Component, Input} from '@angular/core';
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

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.scss',
  providers: [provideNgxMask()],
})
export class PatientFormComponent {
  createMedicSubscription: Subscription = new Subscription();

  showPassword: boolean = false;
  password = '';
  formUtils: FormUtilsService;
  @Input() onSubmitEvent: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private lineLoadingService: LineLoadingService,
    private registerService: MedicRegisterService,
    private snackbar: SnackbarService,
    private router: Router,
    private registerSubmit: RegisterSubmit,
    private formUtilsService: FormUtilsService
  ) {
    this.formUtils = this.formUtilsService;
    this.registerSubmit.submitObservable.subscribe(() => {
      this.onSubmit();
    });
  }

  registerForm: FormGroup = this.formBuilder.group({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    cpf: new FormControl('', [Validators.required, this.crmValidator()]),
    birthDate: new FormControl('', [Validators.required, this.ageValidator()]),
    login: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  onSubmit() {
    if (this.registerForm.valid) {
      this.lineLoadingService.show();

      const formDataMedic = this.registerForm.value;

      this.createMedicSubscription = this.registerService
        .create(formDataMedic)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.onError(error);
            return EMPTY;
          })
        )
        .subscribe((result: User) => {
          this.onSuccess();
        });
    } else {
      this.formUtils.validateAllFormFields(this.registerForm);
      this.snackbar.open('Atenção! Campos obrigatórios não preenchidos');
    }
  }

  public resetForm(): void {
    this.registerForm.patchValue({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      cpf: '',
      birthDate: '',
      login: '',
      password: '',
    });
  }

  private onError(error: Error) {
    if (error instanceof HttpErrorResponse) {
      this.snackbar.open(error.error.error.message);
    }
    this.lineLoadingService.hide();
  }

  private onSuccess() {
    this.lineLoadingService.hide();
    this.registerForm.markAsPristine();
    swal
      .fire({
        title: 'Sucesso!',
        text: 'Médico cadastrado na base de dados!',
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,
      })
      .then(() => {
        this.router.navigate(['login-page']);
      });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  ngOnDestroy(): void {
    this.resetForm();
  }

  isInputInvalid(field: string): boolean {
    const isInvalid =
      this.registerForm.get(field)?.invalid && this.registerForm.get(field)?.touched;
    return !!isInvalid;
  }

  ageValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        // If the birth date is not set, there is no validation error.
        return null;
      }

      const birthDate = new Date(control.value);
      const today = new Date();
      const thisYearBirthday = new Date(
        today.getFullYear(),
        birthDate.getMonth(),
        birthDate.getDate()
      );

      let age = today.getFullYear() - birthDate.getFullYear();

      // If this year's birthday has not occurred yet, subtract one from the age.
      if (today < thisYearBirthday) {
        age--;
      }

      return age >= 18 ? null : {ageError: true};
    };
  }

  crmValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        // If the birth date is not set, there is no validation error.
        return null;
      }

      const crm = control.value.toUpperCase();

      return crm.startsWith('CRM-') ? null : {crmError: true};
    };
  }
}
