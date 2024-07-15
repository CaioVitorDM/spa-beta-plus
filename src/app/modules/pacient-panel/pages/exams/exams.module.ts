import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {InputSearchComponent} from 'src/app/components/input-search/input-search.component';
import {CustomSelectComponent} from 'src/app/components/custom-select/custom-select.component';
import {UploadFileComponent} from 'src/app/components/upload-file/upload-file.component';

import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import {FormsModule, NgControl, ReactiveFormsModule} from '@angular/forms';
import {GetStartedComponent} from './get-started/get-started.component';
import {UploadExamsComponent} from './upload-exams/upload-exams.component';
import {EditExamsComponent} from './edit-exams/edit-exams.component';
import {ExamsRoutes} from './exams.routes';
import { ExamsTableComponent } from './components/exams-table/exams-table.component';

@NgModule({
  declarations: [
    GetStartedComponent,
    UploadExamsComponent,
    EditExamsComponent,
    ExamsTableComponent,
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    ExamsRoutes,
    InputSearchComponent,
    CustomSelectComponent,
    UploadFileComponent,
    ReactiveFormsModule,
    FormsModule,
    MatMenu,
    MatMenuTrigger,
    UploadFileComponent,
  ],
})
export class ExamsModule {}
