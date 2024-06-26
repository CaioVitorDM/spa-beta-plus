import {NgModule} from '@angular/core';
import {GetStartedComponent} from './get-started/get-started.component';
import {RouterModule, Routes} from '@angular/router';
import {CreatePatientComponent} from './create-patient/create-patient.component';
import {EditPatientComponent} from './edit-patient/edit-patient.component';
import {DetailsPatientComponent} from './details-patient/details-patient.component';

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
  {
    path: 'edit/:id',
    component: EditPatientComponent,
  },
  {
    path: 'details/:id',
    component: DetailsPatientComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PacientRoutes {}
