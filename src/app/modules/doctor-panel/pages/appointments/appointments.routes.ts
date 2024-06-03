import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GetStartedComponent } from './get-started/get-started.component';
import { CreateAppointmentComponent } from './create-appointment/create-appointment.component';

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
    path: 'create',
    component: CreateAppointmentComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsRoutes { }
