import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, FormArray, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FormUtilsService } from 'src/app/services/form-utils/form-utils.service';
import { LineLoadingService } from 'src/app/services/line-loading/line-loading.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import {NgxMaskDirective, provideNgxMask} from 'ngx-mask';
import swal from 'sweetalert2';
@Component({
  selector: 'app-protocols-form',
  templateUrl: './protocols-form.component.html',
  styleUrl: './protocols-form.component.scss'
})
export class ProtocolsFormComponent {

  @Output() specificChanged = new EventEmitter<boolean>();

  formUtils: FormUtilsService;

  constructor(
    private formBuilder: FormBuilder,
    private lineLoadingService: LineLoadingService,
    private snackbar: SnackbarService,
    private router: Router,
    private formUtilsService: FormUtilsService
  ) {
    this.formUtils = this.formUtilsService;
    this.setupIsSpecificListener();

  }

  protocolForm: FormGroup = this.formBuilder.group({
    protocolName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    isSpecific: new FormControl(false, [Validators.required]),
    description: new FormControl(''),
  });

  private setupIsSpecificListener() {
    this.protocolForm.get('isSpecific')?.valueChanges.subscribe((isSpecific: boolean) => {
      this.specificChanged.emit(isSpecific);
    });
  }

  isInputInvalid(field: string): boolean {
    const isInvalid =
      this.protocolForm.get(field)?.invalid && this.protocolForm.get(field)?.touched;
    return !!isInvalid;
  }


}




  



