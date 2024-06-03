import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormUtilsService } from 'src/app/services/form-utils/form-utils.service';
import { LineLoadingService } from 'src/app/services/line-loading/line-loading.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsFormService {

  form!: FormGroup;
  formUtils!: FormUtilsService;
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
      description: new FormControl('', [Validators.required]),
      local: new FormControl('', [Validators.required]),
      appointmentDate: new FormControl('', [Validators.required]),
      patientId: new FormControl('', [Validators.required]),
    });
  }

  public resetForm(): void {
    this.form.patchValue({
      id: '',
      doctorId: '',
      description: '',
      local: '',
      appointmentDate: '',
      patientId: '',
    });
  }

  public onSuccess() {
    this.lineLoadingService.hide();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    swal
      .fire({
        title: 'Sucesso!',
        text: 'Consulta cadastrada na base de dados!',
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,
      })
      .then(() => {
        this.router.navigate(['/doctor-panel/appointments/']);
      });
  }

  isInvalidField(field: string): boolean {
    const isInvalid = this.form.get(field)?.invalid && this.form.get(field)?.touched;
    return !!isInvalid;
  }
}
