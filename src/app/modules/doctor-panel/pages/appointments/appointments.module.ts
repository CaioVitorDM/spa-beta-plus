import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentsRoutes } from './appointments.routes';
import { RouterOutlet } from '@angular/router';
import { GetStartedComponent } from './get-started/get-started.component';
import { AppointmentsComponent } from './appointments.component';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { AppointmentsTableComponent } from './components/appointments-table/appointments-table.component';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIconButton } from '@angular/material/button';
import { InputSearchComponent } from 'src/app/components/input-search/input-search.component';
import { CustomSelectComponent } from 'src/app/components/custom-select/custom-select.component';
import { CreateAppointmentComponent } from './create-appointment/create-appointment.component';
import { AppointmentsFormComponent } from './components/appointments-form/appointments-form.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [AppointmentsComponent, 
                  GetStartedComponent, 
                  AppointmentsTableComponent,
                  CreateAppointmentComponent,
                  AppointmentsFormComponent],
  imports: [
    CommonModule,
    AppointmentsRoutes,
    RouterOutlet,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    MatIconButton,
    InputSearchComponent,
    CustomSelectComponent,
    ReactiveFormsModule,
  ]
})
export class AppointmentsModule { }
