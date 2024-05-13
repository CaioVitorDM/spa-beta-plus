import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, FormArray, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FormUtilsService } from 'src/app/services/form-utils/form-utils.service';
import { LineLoadingService } from 'src/app/services/line-loading/line-loading.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import {NgIf} from '@angular/common';
import {NgxMaskDirective, provideNgxMask} from 'ngx-mask';
import swal from 'sweetalert2';
@Component({
  selector: 'app-protocols-form',
  templateUrl: './protocols-form.component.html',
  styleUrl: './protocols-form.component.scss'
})
export class ProtocolsFormComponent {

  formUtils: FormUtilsService;

  patients: PatientList[] = [ // Usando a interface para tipar a lista
    { id: 1, name: 'Carla Medeiros', login: 'Carla Medeiros', selected: false },
    { id: 2, name: 'Luísa Almeida', login: 'Carla Medeiros', selected: false },
    { id: 3, name: 'João Silva', login: 'Carla Medeiros', selected: false },
    { id: 4, name: 'Ana Pereira', login: 'Carla Medeiros', selected: false }
  ];
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
    patients: new FormArray(this.patients.map(() => new FormControl(false)))
  });

  private setupIsSpecificListener() {
    this.protocolForm.get('isSpecific')!.valueChanges.subscribe((isSpecific: boolean) => {
      if (!isSpecific) {
        this.clearPatientsSelection();
      }
    });
  }

  private clearPatientsSelection() {
    const patientsArray = this.protocolForm.get('patients') as FormArray;
    patientsArray.controls.forEach(control => control.setValue(false));
    this.patients.forEach(patient => patient.selected = false);  // Sincroniza o modelo de dados externo
  }

  isInputInvalid(field: string): boolean {
    const isInvalid =
      this.protocolForm.get(field)?.invalid && this.protocolForm.get(field)?.touched;
    return !!isInvalid;
  }


}

export interface PatientList {
  id: number;
  name: string;
  login: string;
  selected?: boolean; 
}



  



