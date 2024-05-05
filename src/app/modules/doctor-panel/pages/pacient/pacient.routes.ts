import {NgModule} from '@angular/core';
import {GetStartedComponent} from './get-started/get-started.component';
import {RouterModule, Routes} from '@angular/router';
import {CreatePatientComponent} from './create-patient/create-patient.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'get-started',
    pathMatch: 'full',
  },
  {
    path: 'get-started',
    component: GetStartedComponent,
  },
  {
    path: 'create',
    component: CreatePatientComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PacientRoutes {}
