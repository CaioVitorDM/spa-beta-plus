import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PacientPanelComponent} from './pacient-panel.component';
import {PatientDashboardComponent} from './pages/patient-dashboard/patient-dashboard.component';
import {MedicComponent} from './pages/medic/medic.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {AppointmentsComponent} from './pages/appointments/appointments.component';
import {BetaGraphComponent} from './pages/beta-graph/beta-graph.component';
import {ExamsComponent} from './pages/exams/exams.component';

export const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: PatientDashboardComponent},
  {path: 'medic', component: MedicComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'beta-graph', component: BetaGraphComponent},
  {path: 'exams', component: ExamsComponent},
  {
    path: 'protocols',
    loadChildren: () =>
      import('src/app/modules/pacient-panel/pages/protocols/protocols.module').then(
        (m) => m.ProtocolsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PacientPanelRoutes {}
