import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, FormArray, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FormUtilsService } from 'src/app/services/form-utils/form-utils.service';
import { LineLoadingService } from 'src/app/services/line-loading/line-loading.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import {NgxMaskDirective, provideNgxMask} from 'ngx-mask';
import swal from 'sweetalert2';
import { ProtocolsFormService } from './service/protocols-form.service';
import { EMPTY, catchError, mergeMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Role } from 'src/app/models/Role';
import { HttpErrorResponse } from '@angular/common/http';
import { apiErrorStatusMessage } from 'src/app/constants/messages';
import { ProtocolService } from 'src/app/services/protocol/protocol.service';
@Component({
  selector: 'app-protocols-form',
  templateUrl: './protocols-form.component.html',
  styleUrls: ['./protocols-form.component.scss','../../../../../../../assets/css/checkbox.scss']
})
export class ProtocolsFormComponent implements OnInit{

  @Output() specificChanged = new EventEmitter<boolean>();
  @Output() formLoaded = new EventEmitter<void>();

  @Input() protocol?: number;
  @Input() isReadOnly: boolean = false;

  formUtils: FormUtilsService;
  @Input() onSubmitEvent: boolean = false;
  protocolForm: FormGroup;

  constructor(
    private lineLoadingService: LineLoadingService,
    private snackbar: SnackbarService,
    private formUtilsService: FormUtilsService,
    private protocolFormService: ProtocolsFormService,
    private protocolService: ProtocolService,
    private authService: AuthService,
    private router: Router

  ) {
    this.protocolForm = this.protocolFormService.form;
    this.formUtils = this.formUtilsService;
    this.setupIsSpecificListener();
  }

  ngOnInit() {
    this.prepareForm();

    this.protocolForm.patchValue({
      isSpecific: false
    });
    
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['isReadOnly'] || changes['protocol']) {
      this.prepareForm();
    }
  }
  
  prepareForm() {
    if (this.isReadOnly) {
      this.protocolForm.disable();
    } else {
      this.protocolForm.enable();
    }
    if (this.protocol) {
      this.loadProtocol(this.protocol);
    } else {
      this.protocolForm.reset();
    }
  }

  loadProtocol(id: number) {
    this.protocolService
      .getOne(id)
      .pipe(
        mergeMap((protocol) => {
          if (
            this.authService.role !== Role.MEDIC 
            // &&
            // protocol.id !== this.authService.getUserLogged?.id
          ) {
            swal
              .fire({
                icon: 'error',
                title: 'Unathorized!',
                text: 'Você não tem permissão para acessar essa página',
                timer: 3000,
                showConfirmButton: false,
              })
              .then(() => this.router.navigate(['/login-page']));
            return EMPTY;
          }

          this.protocolForm.patchValue({
            id: protocol.id,
            doctorId: protocol.doctorId,
            name: protocol.name,
            description: protocol.description,
            isSpecific: protocol.isSpecific,
            createdAt: protocol.createdAt,
            patientsIdList: protocol.patientsIdList,
            fileId: protocol.fileId,
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

  private onError(error: Error) {
    if (error instanceof HttpErrorResponse) {
      this.snackbar.open(error.error.error.message);
    } else {
      this.snackbar.open(apiErrorStatusMessage[0]);
    }
    this.lineLoadingService.hide();
  }

  

  ngOnDestroy(): void {
    this.protocolFormService.resetForm();
  }

  isInputInvalid(field: string): boolean {
    return this.protocolFormService.isInvalidField(field);
  }

  private setupIsSpecificListener() {
    this.protocolForm.get('isSpecific')?.valueChanges.subscribe((isSpecific: boolean) => {
      this.specificChanged.emit(isSpecific);
    });
  }


}





  



