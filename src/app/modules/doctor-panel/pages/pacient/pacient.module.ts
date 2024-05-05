import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PacientComponent} from './pacient.component';
import {GetStartedComponent} from './get-started/get-started.component';
import {RouterOutlet} from '@angular/router';
import {PacientRoutes} from './pacient.routes';
import {UploadComponentComponent} from '../../../../components/upload-component/upload-component.component';
import {PatientsTableComponent} from './components/patients-table/patients-table.component';
import {InputSearchComponent} from '../../../../components/input-search/input-search.component';
import {CreatePatientComponent} from './create-patient/create-patient.component';
import {CustomSelectComponent} from '../../../../components/custom-select/custom-select.component';
import {PatientFormComponent} from './components/patient-form/patient-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxMaskDirective} from 'ngx-mask';

@NgModule({
  declarations: [
    PacientComponent,
    GetStartedComponent,
    PatientsTableComponent,
    CreatePatientComponent,
    PatientFormComponent,
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    PacientRoutes,
    UploadComponentComponent,
    InputSearchComponent,
    CustomSelectComponent,
    ReactiveFormsModule,
    NgxMaskDirective,
  ],
})
export class PacientModule {}
