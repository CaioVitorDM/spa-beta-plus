import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentsRoutes } from './appointments.routes';
import { RouterOutlet } from '@angular/router';
import { GetStartedComponent } from './get-started/get-started.component';
import { AppointmentsComponent } from './appointments.component';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { AppointmentsTableComponent } from './components/appointments-table/appointments-table.component';


@NgModule({
  declarations: [AppointmentsComponent, 
                  GetStartedComponent, 
                  AppointmentsTableComponent],
  imports: [
    CommonModule,
    AppointmentsRoutes,
    RouterOutlet
  ]
})
export class AppointmentsModule { }
