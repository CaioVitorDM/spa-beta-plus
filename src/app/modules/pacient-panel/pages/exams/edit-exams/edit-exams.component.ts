import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EMPTY, Subject, Subscription, catchError, switchMap} from 'rxjs';
import {FileService} from 'src/app/services/file-service/file.service';
import {FormUtilsService} from 'src/app/services/form-utils/form-utils.service';
import {HeaderService} from 'src/app/services/header/header-info.service';
import {LineLoadingService} from 'src/app/services/line-loading/line-loading.service';
import {SnackbarService} from 'src/app/services/snackbar/snackbar.service';
import {AuthService} from 'src/app/services/auth/auth.service';
import {FormsModule} from '@angular/forms';
@Component({
  selector: 'app-edit-exams',
  templateUrl: './edit-exams.component.html',
  styleUrl: './edit-exams.component.scss'
})
export class EditExamsComponent {
  showPatientsSelector = false;

  createProtocolSubscription!: Subscription;
  private destroy$ = new Subject<void>();
  uploadingFile!: File;
  // protocolForm: FormGroup;
  isLoading = false;
  formUtils: FormUtilsService;

  constructor(
    private headerService: HeaderService,
    private fileService: FileService, // Injetando o serviço de arquivo
    // private protocolsFormService: ProtocolsFormService,
    // private protocolService: ProtocolService,
    private lineLoadingService: LineLoadingService,
    private snackbar: SnackbarService,
    private formUtilsService: FormUtilsService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    //To-do, aparecer titulo novo
    this.headerService.setTitulo('Edição de Exame');
    // this.protocolForm = this.protocolsFormService.form;
    this.formUtils = this.formUtilsService;
  }

  handleSelectedFile(file: File): void {
    this.uploadingFile = file;
  }

  // handlePatientsSelected(selectedPatientIds: number[]) {
  //   this.protocolForm.get('patientsIdList')?.setValue(selectedPatientIds);
  // }

  // onSubmit() {
  //   if (this.protocolForm.valid && this.uploadingFile) {
  //     this.lineLoadingService.show();

  //     this.protocolForm.get('doctorId')?.setValue(this.authService.doctorId);
  //     const formDataProtocol = this.protocolForm.value;

  //     this.createProtocolSubscription = this.fileService
  //       .uploadFile(this.uploadingFile)
  //       .pipe(
  //         switchMap((fileResponse) => {
  //           formDataProtocol.fileId = fileResponse.data.id;
  //           return this.protocolService.create(formDataProtocol);
  //         }),
  //         catchError((error: HttpErrorResponse) => {
  //           this.onError(error);
  //           return EMPTY;
  //         })
  //       )
  //       .subscribe((result: Protocol) => {
  //         this.handleSuccess();
  //       });

  //   } else {
  //     this.formUtils.validateAllFormFields(this.protocolForm);
  //     this.snackbar.open('Atenção! Campos obrigatórios não preenchidos');
  //   }
  // }

  // private handleSuccess() {
  //   this.isLoading = false;
  //   this.protocolsFormService.resetForm();
  //   this.protocolsFormService.onSuccess();
  // }

  // private onError(error: Error) {
  //   if (error instanceof HttpErrorResponse) {
  //     this.snackbar.open(error.error.error.message);
  //   }
  //   this.lineLoadingService.hide();
  // }

  // togglePatientsSelector(isSpecific: boolean) {
  //   this.showPatientsSelector = isSpecific;
  // }

  navigateBack() {
    this.router.navigate(['/patient-panel/exams']);
  }
}

