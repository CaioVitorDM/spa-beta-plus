import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GetStartedComponent} from './get-started/get-started.component';
import {RouterOutlet} from '@angular/router';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIconButton} from '@angular/material/button';
import {InputSearchComponent} from 'src/app/components/input-search/input-search.component';
import {CustomSelectComponent} from 'src/app/components/custom-select/custom-select.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ExamsRoutes} from './exams.routes';
import {EditExamsComponent} from './edit-exams/edit-exams.component';
import {CreateExamsComponent} from './create-exams/create-exams.component';
import {ExamsFormComponent} from './components/exams-form/exams-form.component';
import {ExamsTableComponent} from './components/exams-table/exams-table.component';
import {UploadFileComponent} from 'src/app/components/upload-file/upload-file.component';
import {ExamsTableConventionalComponent} from './components/exams-table-conventional/exams-table-conventional.component';

@NgModule({
  declarations: [
    GetStartedComponent,
    EditExamsComponent,
    CreateExamsComponent,
    ExamsFormComponent,
    ExamsTableComponent,
    ExamsTableConventionalComponent,
  ],
  exports: [ExamsTableConventionalComponent],
  imports: [
    CommonModule,
    ExamsRoutes,
    RouterOutlet,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    MatIconButton,
    InputSearchComponent,
    CustomSelectComponent,
    UploadFileComponent,
    ReactiveFormsModule,
  ],
})
export class ExamsModule {}
