import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormUtilsService } from 'src/app/services/form-utils/form-utils.service';
import { LineLoadingService } from 'src/app/services/line-loading/line-loading.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import Swal from 'sweetalert2';
import { BetaGeneralComponent } from '../../beta-general/beta-general.component';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BetaEditService {
  form!: FormGroup;
  formUtils!: FormUtilsService;
  private betaEditedSubject = new Subject<void>();


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
      betaDate: new FormControl(''),
      betaValue: new FormControl(''),
      patientId: [null],
      id: [null], // Inicializa com null
      doctorId: [null],
    });
    return form;
  }

  public resetForm(): void {
    this.form.patchValue({
      id: null, // Reseta para null
      doctorId: '',
      betaDate: '',
      betaValue: '',
      patientId: '',
    });
  }

  public onSuccess(callback: () => void) {
    this.lineLoadingService.hide();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    Swal
      .fire({
        title: 'Sucesso!',
        text: 'Beta editado na base de dados!',
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,
      })
      .then(() => {
        callback(); // Chama o callback passado como parâmetro
        this.betaEditedSubject.next(); // Emite o evento de beta editado com sucesso
      });
  }

  isInvalidField(field: string): boolean {
    const isInvalid = this.form.get(field)?.invalid && this.form.get(field)?.touched;
    return !!isInvalid;
  }
}
