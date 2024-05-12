import {Injectable} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {FormUtilsService} from '../../../../../../../services/form-utils/form-utils.service';
import {SnackbarService} from '../../../../../../../services/snackbar/snackbar.service';
import {LineLoadingService} from '../../../../../../../services/line-loading/line-loading.service';
import {Router} from '@angular/router';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class PatientFormService {
  form!: FormGroup;
  formUtils!: FormUtilsService;
  file?: File;
  constructor(
    private formBuilder: FormBuilder,
    private formUtilsService: FormUtilsService,
    private snackbar: SnackbarService,
    private lineLoadingService: LineLoadingService,
    private router: Router
  ) {
    this.formUtils = this.formUtilsService;
    this.form = this.initializeForm();
  }

  private initializeForm(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      doctorId: [null],
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
      cpf: new FormControl('', [Validators.required]),
      birthDate: new FormControl('', [Validators.required, this.ageValidator()]),
      login: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(3)]),
      fileId: [''],
    });
  }

  public resetForm(): void {
    this.form.patchValue({
      id: '',
      doctorId: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      cpf: '',
      birthDate: '',
      login: '',
      password: '',
      fileId: '',
    });
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

  public onSuccess() {
    this.lineLoadingService.hide();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    swal
      .fire({
        title: 'Sucesso!',
        text: 'Paciente cadastrado na base de dados!',
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,
      })
      .then(() => {
        this.router.navigate(['/doctor-panel/patients/']);
      });
  }

  isInvalidField(field: string): boolean {
    const isInvalid = this.form.get(field)?.invalid && this.form.get(field)?.touched;
    return !!isInvalid;
  }
}
