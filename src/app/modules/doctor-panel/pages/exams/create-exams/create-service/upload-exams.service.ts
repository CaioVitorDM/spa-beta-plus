import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormUtilsService } from 'src/app/services/form-utils/form-utils.service';
import { LineLoadingService } from 'src/app/services/line-loading/line-loading.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UploadExamsService {

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
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      examDate: new FormControl(''),
      examType: new FormControl('',[Validators.required, Validators.minLength(3)]),
      patientId: [null],
      fileId: [null],
      id: [null],
      doctorId: [null],
    });
  
    // form.setValidators(this.patientsIdListValidator());
    return form;
  }

  public resetForm(): void {
    this.form.patchValue({
      id: '',
      doctorId: '',
      name: '',
      examDate: '',
      examType: '',
      patientId: '',
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
        text: 'Exame cadastrado na base de dados!',
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,
      })
      .then(() => {
        this.router.navigate(['/patient-panel/exams/']);
      });
  }


  isInvalidField(field: string): boolean {
    const isInvalid = this.form.get(field)?.invalid && this.form.get(field)?.touched;
    return !!isInvalid;
  }
}
