import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PacientPanelComponent} from './pacient-panel.component';
import {PatientDashboardComponent} from './pages/patient-dashboard/patient-dashboard.component';

export const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: PatientDashboardComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PacientPanelRoutes {}
