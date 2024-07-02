import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ProtocolsFormComponent } from '../components/protocols-form/protocols-form.component';
import { Protocol } from 'src/app/models/Protocol';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from 'src/app/services/file-service/file.service';
import { FormUtilsService } from 'src/app/services/form-utils/form-utils.service';
import { LineLoadingService } from 'src/app/services/line-loading/line-loading.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { ProtocolsFormService } from '../components/protocols-form/service/protocols-form.service';
import { HeaderService } from 'src/app/services/header/header-info.service';
import { ProtocolService } from 'src/app/services/protocol/protocol.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EMPTY, Subscription, catchError, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-protocol',
  templateUrl: './edit-protocol.component.html',
  styleUrl: './edit-protocol.component.scss'
})
export class EditProtocolComponent implements OnInit, AfterViewInit {

  @ViewChild(ProtocolsFormComponent) protocolsFormComponent!: ProtocolsFormComponent;
  protocol?: number;
  uploadingFile!: File;
  fileName!: string;
  fileId!: number;
  formUtils: FormUtilsService;
  protocolForm: FormGroup;

  selectedPatients: number[] = [];
  showPatientsSelector = false;

  editProtocolSubscription!: Subscription;

  isLoading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fileService: FileService,
    private protocolFormService: ProtocolsFormService,
    private protocolService: ProtocolService,
    private lineLoadingService: LineLoadingService,
    private snackbar: SnackbarService,
    private authService: AuthService,
    private formUtilsService: FormUtilsService,
    private router: Router,
    private headerService: HeaderService
  ) {
    this.protocolForm = this.protocolFormService.form;
    this.formUtils = this.formUtilsService;
    this.headerService.setTitulo('Edição de Protocolos');
  }
  ngOnInit() {
    const {id} = this.activatedRoute.snapshot.params;

    if (id) {
      this.protocol = id;
    }
  }

  ngAfterViewInit() {
    this.protocolsFormComponent.formLoaded.subscribe(() => {
      this.fileId = this.protocolsFormComponent.protocolForm.get('fileId')?.value;
      this.selectedPatients =  this.protocolsFormComponent.protocolForm.get('patientsIdList')?.value;
      this.fetchFile(this.fileId);
    });
  }

  fetchFile(fileId: number) {
    this.fileService.downloadImage(fileId).subscribe({
      next: (file) => {
       this.fileName = file.name;
       this.uploadingFile = file;

      },
      error: (err) => {
        console.error('Erro ao carregar arquivo:', err);
      },
    });
  }

  handleSelectedFile(file: File): void {
    this.uploadingFile = file;
  }

  handlePatientsSelected(selectedPatientIds: number[]) {
    this.protocolForm.get('patientsIdList')?.setValue(selectedPatientIds);
  }

  onSubmit() {
    if (this.protocolForm.valid && this.uploadingFile) {
      this.lineLoadingService.show();
  
      this.protocolForm.get('doctorId')?.setValue(this.authService.doctorId);
    
      if (!this.showPatientsSelector) {
        this.protocolForm.get('patientsIdList')?.setValue([]);
      }
  
      const formDataProtocol = this.protocolForm.value;
      if (this.uploadingFile) {
        console.log(" entrou");
        const existingFileId = formDataProtocol.fileId; 
        this.editProtocolSubscription = this.fileService.uploadFile(this.uploadingFile, existingFileId)
          .pipe(
            switchMap((fileResponse) => {
              formDataProtocol.fileId = fileResponse.data.id;
              return this.protocolService.edit(formDataProtocol);
            }),
            catchError((error: HttpErrorResponse) => {
              this.onError(error);
              return EMPTY;
            })
          )
          .subscribe({
            next: (result: Protocol) => {
              this.handleSuccess();
            },
            error: (error) => this.onError(error)
          });
      } else {
        this.protocolService.edit(formDataProtocol)
          .subscribe({
            next: (result: Protocol) => {
              this.handleSuccess();
            },
            error: (error) => this.onError(error)
          });
      }
  
    } else {
      this.formUtils.validateAllFormFields(this.protocolForm);
      this.snackbar.open('Atenção! Campos obrigatórios não preenchidos');
    }
  }
  

  private handleSuccess() {
    this.isLoading = false;
    this.protocolFormService.resetForm();
    this.protocolFormService.onSuccess(true);
  }

  private onError(error: Error) {
    if (error instanceof HttpErrorResponse) {
      this.snackbar.open(error.error.error.message);
    }
    this.lineLoadingService.hide();
  }



  togglePatientsSelector(isSpecific: boolean) {
    this.showPatientsSelector = isSpecific;
  }

  navigateBack() {
    this.router.navigate(['/doctor-panel/protocols'], {relativeTo: this.activatedRoute});
  }
}
