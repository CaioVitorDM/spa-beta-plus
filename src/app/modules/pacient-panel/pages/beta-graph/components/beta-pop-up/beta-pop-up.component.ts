import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {EMPTY, Observable, Subject, Subscription, catchError, map, mergeMap, switchMap} from 'rxjs';
import {BetaService} from 'src/app/services/beta/beta.service';
import {FormUtilsService} from 'src/app/services/form-utils/form-utils.service';
import {BetaExamsService} from './beta-exams.service';
import {PatientService} from 'src/app/services/patient/patient.service';
import {AuthService} from 'src/app/services/auth/auth.service';
import {SnackbarService} from 'src/app/services/snackbar/snackbar.service';
import {LineLoadingService} from 'src/app/services/line-loading/line-loading.service';
import {FileService} from 'src/app/services/file-service/file.service';
import {HeaderService} from 'src/app/services/header/header-info.service';
import {Role} from 'src/app/models/Role';
import Swal from 'sweetalert2';
import {HttpErrorResponse} from '@angular/common/http';
import {apiErrorStatusMessage} from 'src/app/constants/messages';
import {Beta} from 'src/app/models/Beta';

@Component({
  selector: 'app-beta-pop-up',

  templateUrl: './beta-pop-up.component.html',
  styleUrls: ['./beta-pop-up.component.scss'],
})
export class BetaPopUpComponent implements OnInit {
  private destroy$ = new Subject<void>();
  uploadingFile!: File;
  isLoading = false;
  betaForm: FormGroup;
  formUtils: FormUtilsService;

  @Output() formLoaded = new EventEmitter<void>();

  @Input() beta?: number;
  @Input() isReadOnly: boolean = false;

  @Input() onSubmitEvent: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<BetaPopUpComponent>,
    private fb: FormBuilder,
    private betaService: BetaService,
    private headerService: HeaderService,
    private fileService: FileService,
    private lineLoadingService: LineLoadingService,
    private snackbar: SnackbarService,
    private formUtilsService: FormUtilsService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private betaFormService: BetaExamsService,
    private patientService: PatientService
  ) {
    this.betaForm = this.betaFormService.form;
    this.formUtils = this.formUtilsService;
  }

  ngOnInit() {
    this.prepareForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isReadOnly'] || changes['beta']) {
      this.prepareForm();
    }
  }

  prepareForm() {
    if (this.isReadOnly) {
      this.betaForm.disable();
    } else {
      this.betaForm.enable();
    }
    if (this.beta) {
      this.loadBeta(this.beta);
    } else {
      this.betaForm.reset();
    }
  }

  loadBeta(id: number) {
    this.betaService
      .getOne(id)
      .pipe(
        mergeMap((beta) => {
          if (this.authService.role !== Role.PATIENT) {
            Swal.fire({
              icon: 'error',
              title: 'Unathorized!',
              text: 'Você não tem permissão para acessar essa página',
              timer: 3000,
              showConfirmButton: false,
            }).then(() => this.router.navigate(['/login-page']));
            return EMPTY;
          }

          this.betaForm.patchValue({
            id: beta.id,
            doctorId: beta.doctorId,
            patientId: beta.patientId,
            betaDate: beta.betaDate,
            betaValue: beta.betaValue,
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

  ngOnDestroy(): void {
    this.betaFormService.resetForm();
  }

  isInputInvalid(field: string): boolean {
    return this.betaFormService.isInvalidField(field);
  }


  loadDoctor(patientId: number): Observable<number> {
    return this.patientService
      .getPatientDetails(patientId)
      .pipe(map((response) => response.data.doctorId));
  }

  onSubmit() {
    if (this.betaForm.valid) {
      this.lineLoadingService.show();

      const patientId = this.authService.patientId;

      if (typeof patientId === 'number') {
        this.betaForm.get('patientId')?.setValue(patientId);

        this.loadDoctor(patientId)
          .pipe(
            switchMap((doctorId) => {
              const formDataBeta = this.betaForm.value;
              formDataBeta.doctorId = doctorId;
              return this.betaService.create(formDataBeta);
            }),
            catchError((error: HttpErrorResponse) => {
              this.onError(error);
              return EMPTY;
            })
          )
          .subscribe((result: Beta) => {
            this.handleSuccess(result);
          });
      } else {
        this.lineLoadingService.hide();
        this.snackbar.open('Erro: ID do paciente não encontrado');
      }
    } else {
      this.formUtils.validateAllFormFields(this.betaForm);
      this.snackbar.open('Atenção! Campos obrigatórios não preenchidos');
    }
  }

  private handleSuccess(result : Beta) {
    this.isLoading = false;
    this.betaFormService.resetForm();
    this.betaFormService.onSuccess(() => this.dialogRef.close(result)); // Passa o callback para fechar o pop-up
  }

  private onError(error: Error) {
    console.error('Erro HTTP:', error); // Log para verificar a estrutura do erro
    if (error instanceof HttpErrorResponse) {
      this.snackbar.open(error.message); // Acesse diretamente a mensagem de erro
    } else {
      this.snackbar.open(apiErrorStatusMessage[0]);
    }
    this.lineLoadingService.hide();
  }

  navigateBack() {
    this.router.navigate(['/patient-panel/beta']);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
