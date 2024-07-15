import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GetStartedComponent } from './get-started/get-started.component';
import { EditExamsComponent } from './edit-exams/edit-exams.component';
import { CreateExamsComponent } from './create-exams/create-exams.component';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'get-started',
    pathMatch: 'full',
  },
  {
    path: 'get-started',
    component: GetStartedComponent
  },
  {
    path: 'upload-exams',
    component: CreateExamsComponent
  },
  {
    path: 'edit-exams/:id',
    component: EditExamsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamsRoutes { }
