import { Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormUtilsService } from 'src/app/services/form-utils/form-utils.service';
import { LineLoadingService } from 'src/app/services/line-loading/line-loading.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ProtocolsFormService {

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
    const form = this.formBuilder.group({
      id: [null],
      doctorId: [null],
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      isSpecific: new FormControl(false, [Validators.required]),
      description: new FormControl(''),
      patientsIdList: [null],
      fileId: [null],
    });
  
    form.setValidators(this.patientsIdListValidator());
    return form;
  }

  public resetForm(): void {
    this.form.patchValue({
      id: '',
      doctorId: '',
      name: '',
      isSpecific: false,
      description: '',
      patientsIdList: '',
      fileId: '',
    });
  }


  public onSuccess() {
    this.lineLoadingService.hide();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    Swal
      .fire({
        title: 'Sucesso!',
        text: 'Protocolo cadastrado na base de dados!',
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,
      })
      .then(() => {
        this.router.navigate(['/doctor-panel/protocols/']);
      });
  }

  patientsIdListValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isSpecific = control.get('isSpecific')?.value;
      const patientsIdList = this.form.get('patientsIdList')?.value;

      if (isSpecific && (!patientsIdList || patientsIdList.length === 0)) {
        // Se 'isSpecific' é true e 'patientsIdList' está vazio ou não definido, retorna erro
        return { requiredPatientsIdList: true };
      }

      return null;  
    };
  }


  isInvalidField(field: string): boolean {
    const isInvalid = this.form.get(field)?.invalid && this.form.get(field)?.touched;
    return !!isInvalid;
  }
}
