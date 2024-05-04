import {Component, EventEmitter, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {NgxMaskDirective} from 'ngx-mask';
import {LineLoadingService} from '../../../services/line-loading/line-loading.service';
import {catchError, EMPTY, Subscription} from 'rxjs';
import {MedicRegisterService} from '../service/medic-register.service';
import {HttpErrorResponse} from '@angular/common/http';
import {SnackbarService} from '../../../services/snackbar/snackbar.service';
import {User} from '../../../models/User';
import {Router} from '@angular/router';
import {RegisterSubmit} from '../service/register-submit';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [FormsModule, NgxMaskDirective, ReactiveFormsModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
  providers: [MedicRegisterService],
})
export class RegisterFormComponent implements OnDestroy {
  createMedicSubscription: Subscription = new Subscription();

  showPassword: boolean = false;
  password = '';
  @Input() onSubmitEvent: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private lineLoadingService: LineLoadingService,
    private registerService: MedicRegisterService,
    private snackbar: SnackbarService,
    private router: Router,
    private registerSubmit: RegisterSubmit
  ) {
    this.registerSubmit.submitObservable.subscribe(() => {
      this.onSubmit();
    });
  }

  registerForm: FormGroup = this.formBuilder.group({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    crm: new FormControl('', [Validators.required]),
    birthDate: new FormControl('', [Validators.required]),
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
    }
  }

  public resetForm(): void {
    this.registerForm.patchValue({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      crm: '',
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
    this.snackbar.open('Médico cadastrado com sucesso');
    this.router.navigate(['login-page']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  ngOnDestroy(): void {
    this.resetForm();
  }
}
