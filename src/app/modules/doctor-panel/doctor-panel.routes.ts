import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DoctorDashboardComponent} from './pages/doctor-dashboard/doctor-dashboard.component';

export const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DoctorDashboardComponent},
  {
    path: 'patients',
    loadChildren: () =>
      import('src/app/modules/doctor-panel/pages/pacient/pacient.module').then(
        (m) => m.PacientModule
      ),
  },
  { path: 'protocols', loadChildren: () => import('./pages/protocols/protocols.module').then(m => m.ProtocolsModule) },
  {
    path: 'appointments',
    loadChildren: () =>
      import('src/app/modules/doctor-panel/pages/appointments/appointments.module').then(
        (m) => m.AppointmentsModule
      ),
  },
  {
    path: 'exams',
    loadChildren: () =>
      import('src/app/modules/doctor-panel/pages/exams/exams.module').then(
        (m) => m.ExamsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoctorPanelRoutes {}
