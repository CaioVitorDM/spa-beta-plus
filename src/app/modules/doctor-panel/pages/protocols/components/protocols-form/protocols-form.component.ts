import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, FormArray, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FormUtilsService } from 'src/app/services/form-utils/form-utils.service';
import { LineLoadingService } from 'src/app/services/line-loading/line-loading.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import {NgxMaskDirective, provideNgxMask} from 'ngx-mask';
import swal from 'sweetalert2';
import { ProtocolsFormService } from './service/protocols-form.service';
@Component({
  selector: 'app-protocols-form',
  templateUrl: './protocols-form.component.html',
  styleUrls: ['./protocols-form.component.scss','../../../../../../../assets/css/checkbox.scss']
})
export class ProtocolsFormComponent {

  @Output() specificChanged = new EventEmitter<boolean>();

  formUtils: FormUtilsService;
  @Input() onSubmitEvent: boolean = false;
  protocolForm: FormGroup;

  constructor(
    private lineLoadingService: LineLoadingService,
    private snackbar: SnackbarService,
    private formUtilsService: FormUtilsService,
    private protocolFormService: ProtocolsFormService
  ) {
    this.protocolForm = this.protocolFormService.form;
    this.formUtils = this.formUtilsService;
    this.setupIsSpecificListener();
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




  



