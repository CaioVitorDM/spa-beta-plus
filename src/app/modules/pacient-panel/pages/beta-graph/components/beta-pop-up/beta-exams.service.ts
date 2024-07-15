import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { FormUtilsService } from 'src/app/services/form-utils/form-utils.service';
import { LineLoadingService } from 'src/app/services/line-loading/line-loading.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class BetaExamsService {

  form!: FormGroup;
  formUtils!: FormUtilsService;
  private betaCreatedSubject = new Subject<void>();

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
      betaDate: new FormControl(''),
      betaValue: new FormControl(''),
      patientId: [null],
      id: [null],
      doctorId: [null],
    });
      return form;
  }

  public resetForm(): void {
    this.form.patchValue({
      id: '',
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
        text: 'Beta cadastrado na base de dados!',
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,
      })
      .then(() => {
        callback(); // Chama o callback passado como parâmetro
        this.betaCreatedSubject.next(); // Emite o evento de beta criado com sucesso
      });
  }

  getBetaCreatedSubject() {
    return this.betaCreatedSubject.asObservable();
  }

  notifyBetaCreated() {
    this.betaCreatedSubject.next();
  }


  isInvalidField(field: string): boolean {
    const isInvalid = this.form.get(field)?.invalid && this.form.get(field)?.touched;
    return !!isInvalid;
  }

}
