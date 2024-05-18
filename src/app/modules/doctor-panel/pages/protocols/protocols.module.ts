import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetStartedComponent } from './get-started/get-started.component';
import { InputSearchComponent } from '../../../../components/input-search/input-search.component';

import { RouterOutlet } from '@angular/router';
import { ProtocolsRoutes } from './protocols.routes'
import { ProtocolsComponent } from './protocols.component';
import { CreateProtocolComponent } from './create-protocol/create-protocol.component';

import { NgxMaskDirective } from 'ngx-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProtocolsTableComponent } from './components/protocols-table/protocols-table.component';
import { CustomSelectComponent } from 'src/app/components/custom-select/custom-select.component';
import { ProtocolsFormComponent } from './components/protocols-form/protocols-form.component';
import { UploadFileComponent } from 'src/app/components/upload-file/upload-file.component';
import { PatientsSelectorComponent } from './components/patients-selector/patients-selector.component';


@NgModule({
  declarations: [
    ProtocolsComponent,
    GetStartedComponent,
    CreateProtocolComponent,
    ProtocolsTableComponent,
    ProtocolsFormComponent,
    PatientsSelectorComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    ProtocolsRoutes,
    InputSearchComponent,
    NgxMaskDirective,
    ReactiveFormsModule,
    CustomSelectComponent,
    UploadFileComponent,
    FormsModule
  ]
})
export class ProtocolsModule { }
